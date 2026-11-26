package net.litynski.jabuto.session;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import net.litynski.jabuto.MainActivity;
import net.litynski.jabuto.R;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Runs a session with the screen off: a foreground service (type mediaPlayback)
 * holding a partial wake lock, counting on SystemClock.elapsedRealtime(), playing
 * the bells, owning the DND rule and the ongoing notification.
 */
public class SessionService extends Service {

    static final String EXTRA_REQUEST = "request";
    static final String ACTION_START = "net.litynski.jabuto.START";
    static final String ACTION_PAUSE = "net.litynski.jabuto.PAUSE";
    static final String ACTION_RESUME = "net.litynski.jabuto.RESUME";
    static final String ACTION_END = "net.litynski.jabuto.END";

    private static final String CHANNEL = "session";
    private static final int NOTIFICATION_ID = 1;
    /** The journal is rewritten at least this often, so a crash loses little time. */
    private static final long HEARTBEAT_MS = 15_000;

    /** What the plugin listens to. Called on the main thread. */
    interface Listener {
        void onTick(SessionService service);

        void onFinished(JSONObject record);
    }

    @Nullable
    private static SessionService instance;

    @Nullable
    private static Listener listener;

    @Nullable
    static SessionService running() {
        return instance;
    }

    static void setListener(@Nullable Listener l) {
        listener = l;
    }

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable tick = this::tick;
    private Plan plan;
    private Bells bells;
    private PowerManager.WakeLock wakeLock;
    private long startRealtime;
    private long pausedMs;
    private long pauseStart = -1;
    private int nextStrike;
    private boolean dndOn;
    private long lastJournal;
    private String lastPhase = "";
    private boolean finished;

    @Override
    public void onCreate() {
        super.onCreate();
        bells = new Bells(this);
        NotificationChannel channel = new NotificationChannel(CHANNEL, "Session", NotificationManager.IMPORTANCE_LOW);
        channel.setDescription("Time left and controls while you sit");
        channel.setSound(null, null);
        channel.enableVibration(false);
        getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? null : intent.getAction();
        if (ACTION_START.equals(action)) {
            try {
                start(new Plan(new JSONObject(intent.getStringExtra(EXTRA_REQUEST))));
            } catch (JSONException | NullPointerException e) {
                stopSelf();
            }
        } else if (plan == null) {
            // Restarted by the system without a session, or a stale notification action.
            stopSelf();
        } else if (ACTION_PAUSE.equals(action)) {
            pause();
        } else if (ACTION_RESUME.equals(action)) {
            resume();
        } else if (ACTION_END.equals(action)) {
            JSONObject record = finish("user");
            if (listener != null && record != null) listener.onFinished(record);
        }
        return START_NOT_STICKY;
    }

    private void start(Plan p) {
        plan = p;
        startRealtime = SystemClock.elapsedRealtime();
        pausedMs = 0;
        pauseStart = -1;
        nextStrike = 0;
        finished = false;
        instance = this;

        int type = ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK;
        startForeground(NOTIFICATION_ID, notification(), type);

        PowerManager pm = getSystemService(PowerManager.class);
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Jabuto:session");
        wakeLock.setReferenceCounted(false);
        wakeLock.acquire((long) ((plan.capAt + 60) * 1000));

        if (plan.dnd) {
            Dnd.activate(this);
            dndOn = true;
        }
        writeJournal(null);
        tick();
    }

    /** Active seconds since the start of warmup, pauses excluded. */
    double elapsed() {
        long now = SystemClock.elapsedRealtime();
        long paused = pausedMs + (pauseStart >= 0 ? now - pauseStart : 0);
        return (now - startRealtime - paused) / 1000.0;
    }

    double pauseSeconds() {
        long now = SystemClock.elapsedRealtime();
        return (pausedMs + (pauseStart >= 0 ? now - pauseStart : 0)) / 1000.0;
    }

    boolean isPaused() {
        return pauseStart >= 0;
    }

    String requestJson() {
        return plan.requestJson;
    }

    /** "volumeOff", "dndMuting" or null. Volume wins: it can be fixed right away. */
    @Nullable
    String notice() {
        if (bells.volumeOff()) return "volumeOff";
        if (Dnd.mutesMedia(this)) return "dndMuting";
        return null;
    }

    void pause() {
        if (plan == null || isPaused() || elapsed() >= plan.endAt) return;
        pauseStart = SystemClock.elapsedRealtime();
        handler.removeCallbacks(tick);
        writeJournal(null);
        updateNotification();
        notifyTick();
    }

    void resume() {
        if (plan == null || !isPaused()) return;
        pausedMs += SystemClock.elapsedRealtime() - pauseStart;
        pauseStart = -1;
        // Strikes that fell inside the pause are not rung late.
        double now = elapsed();
        while (nextStrike < plan.strikes.size() && plan.strikes.get(nextStrike).at < now - 0.5) nextStrike++;
        writeJournal(null);
        tick();
    }

    /** Stops the session; the record goes to the caller, and stays in the journal until the web layer has logged it. */
    @Nullable
    JSONObject finish(String ending) {
        if (plan == null || finished) return null;
        finished = true;
        double active = Math.min(elapsed(), plan.capAt);
        double paused = pauseSeconds();
        writeJournal(ending);
        JSONObject record = record(plan.requestJson, active, paused, ending);
        shutdown();
        return record;
    }

    static JSONObject record(String requestJson, double active, double paused, String ending) {
        JSONObject json = new JSONObject();
        try {
            json.put("request", new JSONObject(requestJson));
            json.put("activeSeconds", active);
            json.put("pauseDuration", paused);
            json.put("ending", ending);
        } catch (JSONException e) {
            // Only built from JSON that parsed before.
        }
        return json;
    }

    private void shutdown() {
        handler.removeCallbacks(tick);
        if (dndOn) Dnd.release(this);
        dndOn = false;
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        instance = null;
        notifyTick();
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
    }

    private void tick() {
        if (plan == null || finished || isPaused()) return;
        double now = elapsed();

        while (nextStrike < plan.strikes.size() && plan.strikes.get(nextStrike).at <= now + 0.02) {
            Plan.Strike strike = plan.strikes.get(nextStrike++);
            // A strike more than two seconds late (e.g. after a long stall) stays silent.
            if (now - strike.at < 2) ring(strike.sound);
        }
        if (dndOn && now >= plan.dndUntil) {
            Dnd.release(this);
            dndOn = false;
        }
        if (now >= plan.capAt) {
            JSONObject record = finish("cap");
            if (listener != null && record != null) listener.onFinished(record);
            return;
        }

        String phase = now < plan.warmupDuration ? "warmup" : now < plan.endAt ? "sitting" : "overtime";
        if (!phase.equals(lastPhase)) {
            lastPhase = phase;
            updateNotification();
        }
        long wall = SystemClock.elapsedRealtime();
        if (wall - lastJournal >= HEARTBEAT_MS) writeJournal(null);
        notifyTick();

        // Sleep until the next thing that has to happen, but no longer than a second.
        double next = Math.min(now + 1, plan.capAt);
        if (nextStrike < plan.strikes.size()) next = Math.min(next, plan.strikes.get(nextStrike).at);
        if (dndOn) next = Math.min(next, plan.dndUntil);
        if (now < plan.warmupDuration) next = Math.min(next, plan.warmupDuration);
        if (now < plan.endAt) next = Math.min(next, plan.endAt);
        handler.postDelayed(tick, Math.max(10, (long) ((next - now) * 1000)));
    }

    private void ring(String sound) {
        bells.play(sound);
        if (plan.vibrate) {
            Vibrator vibrator = getSystemService(Vibrator.class);
            if (vibrator != null && vibrator.hasVibrator()) {
                vibrator.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
            }
        }
    }

    private void notifyTick() {
        if (listener != null) listener.onTick(this);
    }

    private void writeJournal(@Nullable String ending) {
        lastJournal = SystemClock.elapsedRealtime();
        Journal.write(this, plan.requestJson, Math.min(elapsed(), plan.capAt), pauseSeconds(), ending);
    }

    private PendingIntent action(String name, int code) {
        Intent intent = new Intent(this, SessionService.class).setAction(name);
        return PendingIntent.getService(this, code, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private Notification notification() {
        Intent open = new Intent(this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent content = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_session)
            .setContentTitle(plan == null ? "Session" : plan.presetName)
            .setContentIntent(content)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setCategory(NotificationCompat.CATEGORY_STOPWATCH)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE);

        if (plan != null) {
            double now = elapsed();
            long wallNow = System.currentTimeMillis();
            if (isPaused()) {
                b.setContentText("Paused").setUsesChronometer(false).setShowWhen(false);
            } else if (now < plan.endAt) {
                double target = now < plan.warmupDuration ? plan.warmupDuration : plan.endAt;
                b
                    .setContentText(now < plan.warmupDuration ? "Warmup" : "Sitting")
                    .setUsesChronometer(true)
                    .setChronometerCountDown(true)
                    .setShowWhen(true)
                    .setWhen(wallNow + (long) ((target - now) * 1000));
            } else {
                b
                    .setContentText("Overtime")
                    .setUsesChronometer(true)
                    .setChronometerCountDown(false)
                    .setShowWhen(true)
                    .setWhen(wallNow - (long) ((now - plan.endAt) * 1000));
            }
            if (now < plan.endAt) {
                b.addAction(0, isPaused() ? "Resume" : "Pause", action(isPaused() ? ACTION_RESUME : ACTION_PAUSE, 1));
            }
            b.addAction(0, "End session", action(ACTION_END, 2));
        }
        return b.build();
    }

    private void updateNotification() {
        if (plan == null || finished) return;
        getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notification());
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacks(tick);
        if (!finished && plan != null) {
            // Killed while running: the journal stays and the next launch logs it as interrupted.
            writeJournal(null);
            if (dndOn) Dnd.release(this);
        }
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        bells.release();
        if (instance == this) instance = null;
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    static void send(Context context, String action) {
        context.startService(new Intent(context, SessionService.class).setAction(action));
    }
}
