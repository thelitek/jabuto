package net.litynski.jabuto;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import net.litynski.jabuto.session.SessionPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SessionPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
