import AppNavigator from "@/components/config/app-navigator";
import { memo, useEffect } from "react";
import { useNotification } from "./notification-provider";

export default memo(function App() {
  const { expoPushToken } = useNotification();

  useEffect(() => {
    if (!expoPushToken) return;

    const controller = new AbortController();

    // send device info to server

    return () => {
      controller.abort();
    };
  }, [expoPushToken]);

  return <AppNavigator isLoggedIn={false} />;
});
