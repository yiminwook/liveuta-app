import { ExpoConfig } from 'expo/config';

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  owner: 'yiminwook',
  name: 'LiveUta',
  slug: 'liveuta-app',
  version: '1.0.0',
  scheme: 'myapp',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './src/assets/images/splash2.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.project.liveuta.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.project.liveuta.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'a48b8f00-b680-46c2-bd69-8cfa7f84fa13',
    },
  },
};

export default config;
