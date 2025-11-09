import * as Notifications from "expo-notifications";
import { createContext, use, useEffect, useState } from "react";
import {
  handleNotificationResponse,
  registerForPushNotificationsAsync,
} from "@/libraries/notification";
import { useLocalNotification } from "@/stores/notification";

interface TNotificationContext {
  expoPushToken: string | null;
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setExpoPushToken).catch(setError);

    // 수신 리스너, foreground 상태에서 수신된 알림
    const notificationListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        await useLocalNotification.getState().actions.syncNotifications(); // 동기화

        // console.log("addNotificationReceivedListener", notification);
        // setNotification(notification);
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
        handleNotificationResponse(response);
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
        error,
      }}
    >
      {children}
    </NotificationContext>
  );
}
