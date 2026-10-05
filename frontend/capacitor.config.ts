import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.univault.app',
  appName: 'UniVault',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
