import { ConfigContext, ExpoConfig } from "expo/config";

const PROD_VAL = {
  name: "라이브우타",
  scheme: "com.utawaku.liveuta",
  bundleIdentifier: "com.utawaku.liveuta", // IOS
  package: "com.utawaku.liveuta", // Android
  assets: {
    icon: "./src/assets/images/icon-light.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
    adaptiveIcon: "./src/assets/images/adaptive-icon-light.png",
  },
};

const PREVIEW_VAL = {
  name: "라이브우타 PRE",
  scheme: "com.utawaku.liveuta.preview",
  bundleIdentifier: "com.utawaku.liveuta.preview", // IOS
  package: "com.utawaku.liveuta.preview", // Android
  assets: {
    icon: "./src/assets/images/icon-light.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
    adaptiveIcon: "./src/assets/images/adaptive-icon-light.png",
  },
} satisfies typeof PROD_VAL;

const DEV_VAL = {
  name: "라이브우타 DEV",
  scheme: "com.utawaku.liveuta.development",
  bundleIdentifier: "com.utawaku.liveuta.development", // IOS
  package: "com.utawaku.liveuta.development", // Android
  assets: {
    icon: "./src/assets/images/icon-light.png",
    splash: "./src/assets/images/splash-icon.png",
    splashWidth: 200,
    adaptiveIcon: "./src/assets/images/adaptive-icon-light.png",
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
    owner: "utawaku",
    slug: "liveuta", // EXPO 프로젝트 이름
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    name: val.name,
    scheme: val.scheme,
    icon: val.assets.icon,
    updates: { url: "https://u.expo.dev/549a663a-be2d-4e39-82a9-acb5bcd4495a" },
    runtimeVersion: { policy: "appVersion" },
    ios: {
      supportsTablet: true,
      bundleIdentifier: val.bundleIdentifier,
      infoPlist: {},
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/android-icon-foreground.png",
        backgroundImage: "./src/assets/images/android-icon-background.png",
        monochromeImage: "./src/assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.utawaku.liveuta",
      googleServicesFile: "./google-services.json",
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: val.assets.splash,
          imageWidth: val.assets.splashWidth,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: true,
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
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
