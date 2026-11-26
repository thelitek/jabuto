package net.litynski.jabuto;

import android.os.Bundle;
import android.os.SystemClock;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import net.litynski.jabuto.session.SessionPlugin;

public class MainActivity extends BridgeActivity {

    /** Never hold the splash longer than this, even if the web layer never reports. */
    private static final long SPLASH_LIMIT_MS = 3000;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        long shown = SystemClock.uptimeMillis();
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        splash.setKeepOnScreenCondition(() -> !SessionPlugin.isReady() && SystemClock.uptimeMillis() - shown < SPLASH_LIMIT_MS);
        registerPlugin(SessionPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
