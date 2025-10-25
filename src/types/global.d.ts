declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FRONT_URL: string;
      APP_ENV: "production" | "development" | "preview";
    }
  }
}

export {};
