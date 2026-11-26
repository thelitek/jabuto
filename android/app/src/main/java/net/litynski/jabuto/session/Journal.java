package net.litynski.jabuto.session;

import android.content.Context;
import androidx.annotation.Nullable;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * A small file describing the running (or just finished) session. It outlives the
 * process, so a session that died with the app is still logged on the next launch.
 * Excluded from backup and device transfer (data_extraction_rules.xml).
 */
final class Journal {

    private static final String NAME = "session-journal.json";

    private Journal() {}

    private static File file(Context context) {
        return new File(context.getFilesDir(), NAME);
    }

    /**
     * @param ending null while the session runs; "user" or "cap" once it has finished.
     */
    static void write(Context context, String requestJson, double activeSeconds, double pauseSeconds, @Nullable String ending) {
        try {
            JSONObject json = new JSONObject();
            json.put("request", new JSONObject(requestJson));
            json.put("activeSeconds", activeSeconds);
            json.put("pauseDuration", pauseSeconds);
            if (ending != null) json.put("ending", ending);
            File target = file(context);
            File tmp = new File(target.getPath() + ".tmp");
            try (FileOutputStream out = new FileOutputStream(tmp)) {
                out.write(json.toString().getBytes(StandardCharsets.UTF_8));
                out.getFD().sync();
            }
            // Rename is atomic: a reader never sees half a file.
            if (!tmp.renameTo(target)) throw new IOException("rename failed");
        } catch (JSONException | IOException e) {
            android.util.Log.w("Jabuto", "Could not write session journal", e);
        }
    }

    @Nullable
    static JSONObject read(Context context) {
        File f = file(context);
        if (!f.exists()) return null;
        try {
            return new JSONObject(new String(Files.readAllBytes(f.toPath()), StandardCharsets.UTF_8));
        } catch (JSONException | IOException e) {
            return null;
        }
    }

    static void clear(Context context) {
        //noinspection ResultOfMethodCallIgnored
        file(context).delete();
    }
}
