package net.litynski.jabuto.session;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResult;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONException;
import org.json.JSONObject;

/** The bridge between the web layer and everything native: session service, DND, files, back button. */
@CapacitorPlugin(
    name = "Session",
    permissions = { @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }) }
)
public class SessionPlugin extends Plugin implements SessionService.Listener {

    private static volatile boolean ready;

    private final Handler handler = new Handler(Looper.getMainLooper());

    /** Whether the web layer has drawn its first screen; the splash screen waits for it. */
    public static boolean isReady() {
        return ready;
    }
    @Nullable
    private Bells previewBells;
    private int previewStream;
    @Nullable
    private PluginCall previewCall;

    @Override
    public void load() {
        SessionService.setListener(this);
        // Back goes to the web layer, which decides between going back, asking, and leaving the app.
        getActivity()
            .getOnBackPressedDispatcher()
            .addCallback(
                getActivity(),
                new OnBackPressedCallback(true) {
                    @Override
                    public void handleOnBackPressed() {
                        notifyListeners("back", new JSObject());
                    }
                }
            );
    }

    @Override
    protected void handleOnDestroy() {
        SessionService.setListener(null);
        stopPreviewNow();
        if (previewBells != null) previewBells.release();
        previewBells = null;
    }

    // Session

    @PluginMethod
    public void start(PluginCall call) {
        JSObject request = call.getObject("request");
        if (request == null) {
            call.reject("request missing");
            return;
        }
        Intent intent = new Intent(getContext(), SessionService.class)
            .setAction(SessionService.ACTION_START)
            .putExtra(SessionService.EXTRA_REQUEST, request.toString());
        getContext().startForegroundService(intent);
        call.resolve();
    }

    @PluginMethod
    public void pause(PluginCall call) {
        SessionService s = SessionService.running();
        if (s != null) s.pause();
        call.resolve();
    }

    @PluginMethod
    public void resume(PluginCall call) {
        SessionService s = SessionService.running();
        if (s != null) s.resume();
        call.resolve();
    }

    /** Ends the session at the user's request; resolves with its record (or nothing if none ran). */
    @PluginMethod
    public void stop(PluginCall call) {
        SessionService s = SessionService.running();
        JSONObject record = s == null ? null : s.finish("user");
        Journal.clear(getContext());
        JSObject result = new JSObject();
        if (record != null) result.put("record", record);
        call.resolve(result);
    }

    /** The running session, if any: request, elapsed, paused, notice. */
    @PluginMethod
    public void state(PluginCall call) {
        SessionService s = SessionService.running();
        call.resolve(s == null ? new JSObject() : snapshot(s, true));
    }

    /**
     * A session that ended while the web layer was not there to log it: finished from
     * the notification or by the overtime cap, or killed with the app (then "interrupted").
     */
    @PluginMethod
    public void recover(PluginCall call) {
        JSObject result = new JSObject();
        if (SessionService.running() == null) {
            JSONObject journal = Journal.read(getContext());
            if (journal != null) {
                try {
                    String ending = journal.optString("ending", "interrupted");
                    result.put(
                        "record",
                        SessionService.record(
                            journal.getJSONObject("request").toString(),
                            journal.getDouble("activeSeconds"),
                            journal.getDouble("pauseDuration"),
                            ending
                        )
                    );
                } catch (JSONException e) {
                    // An unreadable journal cannot be logged; drop it.
                }
                Journal.clear(getContext());
            }
            Dnd.release(getContext());
        }
        call.resolve(result);
    }

    private JSObject snapshot(SessionService s, boolean withRequest) {
        JSObject json = new JSObject();
        json.put("elapsed", s.elapsed());
        json.put("paused", s.isPaused());
        json.put("notice", s.notice());
        if (withRequest) {
            try {
                json.put("request", new JSONObject(s.requestJson()));
            } catch (JSONException e) {
                // Always valid: it parsed when the session started.
            }
        }
        return json;
    }

    @Override
    public void onTick(SessionService service) {
        if (SessionService.running() == null) {
            notifyListeners("tick", new JSObject());
        } else {
            notifyListeners("tick", snapshot(service, false));
        }
    }

    @Override
    public void onFinished(JSONObject record) {
        JSObject json = new JSObject();
        json.put("record", record);
        // If nobody listens, the journal still holds the record for recover() on the next launch.
        notifyListeners("finished", json);
    }

    @PluginMethod
    public void clearJournal(PluginCall call) {
        if (SessionService.running() == null) Journal.clear(getContext());
        call.resolve();
    }

    // Bell previews

    @PluginMethod
    public void preview(PluginCall call) {
        String sound = call.getString("sound");
        if (sound == null) {
            call.reject("sound missing");
            return;
        }
        stopPreviewNow();
        if (previewBells == null) previewBells = new Bells(getContext());
        Bells bells = previewBells;
        previewCall = call;
        // SoundPool loads asynchronously; give a freshly created pool a moment.
        handler.postDelayed(
            () -> {
                previewStream = bells.play(sound);
                handler.postDelayed(this::finishPreview, bells.durationMs(sound));
            },
            150
        );
    }

    @PluginMethod
    public void stopPreview(PluginCall call) {
        stopPreviewNow();
        call.resolve();
    }

    private void finishPreview() {
        previewStream = 0;
        if (previewCall != null) previewCall.resolve();
        previewCall = null;
    }

    private void stopPreviewNow() {
        handler.removeCallbacksAndMessages(null);
        if (previewBells != null) previewBells.stop(previewStream);
        finishPreview();
    }

    // Permissions

    private JSObject access(boolean granted) {
        JSObject json = new JSObject();
        json.put("access", granted ? "granted" : "denied");
        return json;
    }

    @PluginMethod
    public void dndAccess(PluginCall call) {
        call.resolve(access(Dnd.hasAccess(getContext())));
    }

    @PluginMethod
    public void requestDndAccess(PluginCall call) {
        if (Dnd.hasAccess(getContext())) {
            call.resolve(access(true));
            return;
        }
        startActivityForResult(call, new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS), "dndSettingsClosed");
    }

    @ActivityCallback
    private void dndSettingsClosed(PluginCall call, ActivityResult result) {
        call.resolve(access(Dnd.hasAccess(getContext())));
    }

    @PluginMethod
    public void requestNotifications(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || getPermissionState("notifications") == PermissionState.GRANTED) {
            call.resolve(access(true));
            return;
        }
        requestPermissionForAlias("notifications", call, "notificationsAnswered");
    }

    @PermissionCallback
    private void notificationsAnswered(PluginCall call) {
        call.resolve(access(getPermissionState("notifications") == PermissionState.GRANTED));
    }

    // Files (export / import through the system's save and open dialogs)

    @PluginMethod
    public void saveFile(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
            .addCategory(Intent.CATEGORY_OPENABLE)
            .setType("application/json")
            .putExtra(Intent.EXTRA_TITLE, call.getString("name", "jabuto.json"));
        startActivityForResult(call, intent, "fileSaved");
    }

    @ActivityCallback
    private void fileSaved(PluginCall call, ActivityResult result) {
        Uri uri = result.getData() == null ? null : result.getData().getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            call.resolve(saved(false));
            return;
        }
        try (OutputStream out = getContext().getContentResolver().openOutputStream(uri, "wt")) {
            if (out == null) throw new java.io.IOException("no stream");
            out.write(call.getString("text", "").getBytes(StandardCharsets.UTF_8));
            call.resolve(saved(true));
        } catch (Exception e) {
            call.reject("Could not write the file", e);
        }
    }

    private JSObject saved(boolean saved) {
        JSObject json = new JSObject();
        json.put("saved", saved);
        return json;
    }

    @PluginMethod
    public void openFile(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT)
            .addCategory(Intent.CATEGORY_OPENABLE)
            .setType("*/*")
            .putExtra(Intent.EXTRA_MIME_TYPES, new String[] { "application/json", "application/octet-stream", "text/plain" });
        startActivityForResult(call, intent, "fileOpened");
    }

    @ActivityCallback
    private void fileOpened(PluginCall call, ActivityResult result) {
        Uri uri = result.getData() == null ? null : result.getData().getData();
        JSObject json = new JSObject();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            call.resolve(json);
            return;
        }
        try (InputStream in = getContext().getContentResolver().openInputStream(uri)) {
            if (in == null) throw new java.io.IOException("no stream");
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            byte[] buffer = new byte[16 * 1024];
            int total = 0;
            for (int n; (n = in.read(buffer)) > 0; ) {
                total += n;
                // An export is a few MB at most; anything far larger is not one.
                if (total > 64 * 1024 * 1024) throw new java.io.IOException("file too large");
                bytes.write(buffer, 0, n);
            }
            json.put("text", bytes.toString(StandardCharsets.UTF_8.name()));
            call.resolve(json);
        } catch (Exception e) {
            call.reject("Could not read the file", e);
        }
    }

    // App

    @PluginMethod
    public void ready(PluginCall call) {
        ready = true;
        call.resolve();
    }

    /** Leaves the app the way Back on the first screen normally does. */
    @PluginMethod
    public void exit(PluginCall call) {
        call.resolve();
        getActivity().moveTaskToBack(true);
    }
}
