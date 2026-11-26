package net.litynski.jabuto.session;

import android.app.AutomaticZenRule;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.service.notification.Condition;
import androidx.annotation.Nullable;
import net.litynski.jabuto.MainActivity;

/**
 * Do Not Disturb through an app-owned automatic rule ("Jabuto session") that lets
 * alarms and media through, so the bells are still heard. The user's own DND is
 * never touched, so whatever they had before is still there afterwards.
 */
final class Dnd {

    private static final Uri CONDITION = Uri.parse("jabuto://session");
    private static final String PREFS = "jabuto-dnd";
    private static final String RULE_ID = "ruleId";
    private static final String ACTIVE = "active";

    private Dnd() {}

    private static NotificationManager manager(Context context) {
        return context.getSystemService(NotificationManager.class);
    }

    static boolean hasAccess(Context context) {
        return manager(context).isNotificationPolicyAccessGranted();
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    @Nullable
    private static String ruleId(Context context) {
        NotificationManager nm = manager(context);
        String id = prefs(context).getString(RULE_ID, null);
        if (id != null && nm.getAutomaticZenRule(id) != null) return id;
        AutomaticZenRule rule = new AutomaticZenRule(
            "Jabuto session",
            null,
            new ComponentName(context, MainActivity.class),
            CONDITION,
            null,
            NotificationManager.INTERRUPTION_FILTER_ALARMS,
            true
        );
        id = nm.addAutomaticZenRule(rule);
        prefs(context).edit().putString(RULE_ID, id).apply();
        return id;
    }

    static void activate(Context context) {
        if (!hasAccess(context)) return;
        try {
            String id = ruleId(context);
            if (id == null) return;
            manager(context).setAutomaticZenRuleState(id, new Condition(CONDITION, "Meditation session", Condition.STATE_TRUE));
            prefs(context).edit().putBoolean(ACTIVE, true).apply();
        } catch (RuntimeException e) {
            android.util.Log.w("Jabuto", "Could not turn on DND", e);
        }
    }

    /** Safe to call any time, also after a crash: only our own rule is switched off. */
    static void release(Context context) {
        if (!prefs(context).getBoolean(ACTIVE, false) || !hasAccess(context)) return;
        try {
            String id = prefs(context).getString(RULE_ID, null);
            if (id != null) {
                manager(context).setAutomaticZenRuleState(id, new Condition(CONDITION, "Meditation session", Condition.STATE_FALSE));
            }
        } catch (RuntimeException e) {
            android.util.Log.w("Jabuto", "Could not turn off DND", e);
        }
        prefs(context).edit().putBoolean(ACTIVE, false).apply();
    }

    /** True if the current DND state (the user's own, typically) silences media. */
    static boolean mutesMedia(Context context) {
        NotificationManager nm = manager(context);
        int filter = nm.getCurrentInterruptionFilter();
        if (filter == NotificationManager.INTERRUPTION_FILTER_NONE) return true;
        if (filter == NotificationManager.INTERRUPTION_FILTER_PRIORITY && hasAccess(context)) {
            NotificationManager.Policy policy = nm.getNotificationPolicy();
            return (policy.priorityCategories & NotificationManager.Policy.PRIORITY_CATEGORY_MEDIA) == 0;
        }
        return false;
    }
}
