import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://6ade1cdb94ad639de212e46f99e5ded3@o4508487071563776.ingest.us.sentry.io/4510249992978432",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,
  integrations: [Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
