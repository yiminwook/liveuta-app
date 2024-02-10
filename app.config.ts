import 'ts-node/register'; // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  owner: 'yiminwook',
  name: 'LiveUta',
  slug: 'liveuta-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './src/assets/splash2.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './src/assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'a48b8f00-b680-46c2-bd69-8cfa7f84fa13',
    },
  },
  experiments: {
    tsconfigPaths: true,
  },
};

export default config;
