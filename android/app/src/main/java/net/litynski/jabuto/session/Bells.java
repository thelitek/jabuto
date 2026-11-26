package net.litynski.jabuto.session;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaMetadataRetriever;
import android.media.SoundPool;
import android.os.Handler;
import android.os.Looper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * The bundled bell sounds on the media stream (they follow media volume, not the
 * ringer). Other audio is ducked briefly while a bell rings.
 */
final class Bells {

    static final String[] SOUNDS = { "bowl", "small-bell", "deep-bell", "chime", "wood" };

    private final AudioManager audio;
    private final AudioAttributes attributes = new AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build();
    private final SoundPool pool = new SoundPool.Builder().setMaxStreams(4).setAudioAttributes(attributes).build();
    private final Map<String, Integer> ids = new HashMap<>();
    private final Map<String, Long> durations = new HashMap<>();
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final AudioFocusRequest focus;
    private int ringing = 0;

    Bells(Context context) {
        audio = context.getSystemService(AudioManager.class);
        focus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK).setAudioAttributes(attributes).build();
        for (String sound : SOUNDS) {
            String path = "public/sounds/" + sound + ".ogg";
            try (AssetFileDescriptor afd = context.getAssets().openFd(path)) {
                ids.put(sound, pool.load(afd, 1));
                durations.put(sound, duration(afd));
            } catch (IOException e) {
                android.util.Log.w("Jabuto", "Missing sound " + path, e);
            }
        }
    }

    private static long duration(AssetFileDescriptor afd) {
        MediaMetadataRetriever r = new MediaMetadataRetriever();
        try {
            r.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            String ms = r.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
            return ms == null ? 5000 : Long.parseLong(ms);
        } catch (Exception e) {
            return 5000;
        } finally {
            try {
                r.release();
            } catch (Exception ignored) {
                // nothing to release
            }
        }
    }

    long durationMs(String sound) {
        Long d = durations.get(sound);
        return d == null ? 0 : d;
    }

    /** @return the stream id, or 0 if the sound could not be played. */
    int play(String sound) {
        Integer id = ids.get(sound);
        if (id == null) return 0;
        if (ringing++ == 0) audio.requestAudioFocus(focus);
        int stream = pool.play(id, 1f, 1f, 1, 0, 1f);
        handler.postDelayed(
            () -> {
                if (--ringing == 0) audio.abandonAudioFocusRequest(focus);
            },
            durationMs(sound)
        );
        return stream;
    }

    void stop(int stream) {
        if (stream != 0) pool.stop(stream);
    }

    boolean volumeOff() {
        return audio.getStreamVolume(AudioManager.STREAM_MUSIC) == 0;
    }

    void release() {
        handler.removeCallbacksAndMessages(null);
        if (ringing > 0) audio.abandonAudioFocusRequest(focus);
        ringing = 0;
        pool.release();
    }
}
