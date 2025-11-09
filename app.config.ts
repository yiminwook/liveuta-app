import { ConfigContext, ExpoConfig } from "expo/config";
import { withSentry } from "@sentry/react-native/expo";

const PROD_VAL = {
  name: "Live Uta",
  scheme: "com.utawaku.liveuta",
  bundleIdentifier: "com.utawaku.liveuta", // IOS
  package: "com.utawaku.liveuta", // Android
  assets: {
    iosLightIcon: "./src/assets/images/ios-icon-light.png",
    iosDarkIcon: "./src/assets/images/ios-icon-dark.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
  },
};

const PREVIEW_VAL = {
  name: "Live Uta PRE",
  scheme: "com.utawaku.liveuta.preview",
  bundleIdentifier: "com.utawaku.liveuta.preview", // IOS
  package: "com.utawaku.liveuta.preview", // Android
  assets: {
    iosLightIcon: "./src/assets/images/ios-icon-light.png",
    iosDarkIcon: "./src/assets/images/ios-icon-dark.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
  },
} satisfies typeof PROD_VAL;

const DEV_VAL = {
  name: "Live Uta DEV",
  scheme: "com.utawaku.liveuta.development",
  bundleIdentifier: "com.utawaku.liveuta.development", // IOS
  package: "com.utawaku.liveuta.development", // Android
  assets: {
    iosLightIcon: "./src/assets/images/ios-icon-light.png",
    iosDarkIcon: "./src/assets/images/ios-icon-dark.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
  },
} satisfies typeof PROD_VAL;

const getVal = (appEnv: string): typeof PROD_VAL => {
  console.log("BUILD ENV ", appEnv);

  switch (appEnv) {
    case "development":
      return DEV_VAL;
    case "preview":
      return PREVIEW_VAL;
    case "production":
      return PROD_VAL;
    default:
      return PREVIEW_VAL;
  }
};

const config = ({ config }: ConfigContext): ExpoConfig => {
  const val = getVal(process.env.APP_ENV);

  return {
    ...config,
    platforms: ["ios", "android"],
    owner: "utawaku",
    slug: "liveuta", // EXPO 프로젝트 이름
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    name: val.name,
    scheme: val.scheme,
    icon: val.assets.iosLightIcon,
    updates: {
      url: "https://u.expo.dev/549a663a-be2d-4e39-82a9-acb5bcd4495a",
    },
    runtimeVersion: { policy: "appVersion" },
    ios: {
      supportsTablet: true,
      bundleIdentifier: val.bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false, // 미국수출법
      },
      icon: "./src/assets/images/ios.icon",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: val.assets.adaptiveIcon,
        backgroundColor: "#f2b4bf",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: val.package,
      googleServicesFile: "./google-services.json",
      permissions: [
        "SCHEDULE_EXACT_ALARM", // Android 12+ (API 31+)에서 정확한 알림 스케줄링
        // "USE_EXACT_ALARM", // Android 13+에서 필요할 수 있음, 문서 확인필요
        // https://developer.android.com/about/versions/14/changes/schedule-exact-alarms?hl=ko
      ],
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-asset",
      "expo-web-browser",
      [
        "expo-localization",
        {
          supportedLocales: {
            ios: ["ko"],
            android: ["ko"],
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          image: val.assets.splash,
          imageWidth: val.assets.splashWidth,
          resizeMode: "contain",
          backgroundColor: "#f2b4bf",
          dark: {
            backgroundColor: "#6a5f71",
          },
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
        },
      ],
      [
        "expo-notifications",
        {
          enableBackgroundRemoteNotifications: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "549a663a-be2d-4e39-82a9-acb5bcd4495a",
      },
    },
  };
};

export default config;
