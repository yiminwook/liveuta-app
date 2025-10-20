declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FRONT_URL: string;
      EXPO_PUBLIC_WAS_HTTP_URL: string;
      APP_ENV: "development" | "preview" | "production";
    }
  }
}

export {};
