import * as Notifications from "expo-notifications";
import { createContext, use, useEffect, useState } from "react";
import { registerForPushNotificationsAsync } from "@/libraries/notification";
import { Href, router } from "expo-router";
import { Alert } from "react-native";

interface TNotificationContext {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<TNotificationContext | null>(null);

export const useNotification = () => {
  const context = use(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setExpoPushToken).catch(setError);

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as Href | undefined;
      console.log("url", url);
      if (url) {
        Alert.alert("redirect to url", url.toString());
        router.push(url); // threadc://@zerocho -> /@zerocho
        // Linking.openURL(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      console.log("getLastNotificationResponseAsync", response);
    });

    // 수신 리스너, foreground 상태에서 수신된 알림
    const notificationListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log("addNotificationReceivedListener", notification);
        setNotification(notification);

        // if (Platform.OS === "android" && AppState.currentState === "active") {
        //   // 포그라운드 상태에서 배너 노출
        //   await Notifications.scheduleNotificationAsync({
        //     content: {
        //       title: notification.request.content.title,
        //       body: notification.request.content.body,
        //       data: notification.request.content.data,
        //     },
        //     trigger: null, // 즉시 실행
        //   });
        // }
      }
    );

    // 응답 리스너, 사용자와 상호작용하는경우
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "addNotificationResponseReceivedListener",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );

        console.log("action tp", response.actionIdentifier);
        console.log("user text", response.userText);

        // handle the notification response here
        redirect(response.notification);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NotificationContext
      value={{
        expoPushToken,
        notification,
        error,
      }}
    >
      {children}
    </NotificationContext>
  );
}
