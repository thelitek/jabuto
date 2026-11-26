import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.litynski.jabuto',
  appName: 'Jabuto',
  webDir: 'dist',
  server: {
    // Never change: IndexedDB belongs to this origin (https://localhost). A new
    // hostname or scheme starts with an empty database on every existing install
    // and breaks device-to-device transfer of the data.
    hostname: 'localhost',
    androidScheme: 'https',
  },
};

export default config;
