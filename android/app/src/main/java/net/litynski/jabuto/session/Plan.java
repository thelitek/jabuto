package net.litynski.jabuto.session;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** The parts of a session plan the service needs. Times are active session seconds. */
final class Plan {

    static final class Strike {

        final double at;
        final String sound;

        Strike(double at, String sound) {
            this.at = at;
            this.sound = sound;
        }
    }

    final String requestJson;
    final String presetName;
    final double warmupDuration;
    final double endAt;
    final double capAt;
    final double dndUntil;
    final boolean dnd;
    final boolean vibrate;
    final List<Strike> strikes = new ArrayList<>();

    /** @param request the StartRequest exactly as the web layer sent it. */
    Plan(JSONObject request) throws JSONException {
        requestJson = request.toString();
        presetName = request.getJSONObject("preset").getString("name");
        dnd = request.getBoolean("dnd");
        vibrate = request.getBoolean("vibrate");
        JSONObject plan = request.getJSONObject("plan");
        warmupDuration = plan.getDouble("warmupDuration");
        endAt = plan.getDouble("endAt");
        capAt = plan.getDouble("capAt");
        dndUntil = plan.getDouble("dndUntil");
        JSONArray list = plan.getJSONArray("strikes");
        for (int i = 0; i < list.length(); i++) {
            JSONObject s = list.getJSONObject(i);
            strikes.add(new Strike(s.getDouble("at"), s.getString("sound")));
        }
    }
}
