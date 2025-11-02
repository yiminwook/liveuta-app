import { TNotificationData } from "@/types";
import { create } from "zustand";
import * as Notifications from "expo-notifications";
import dayjs from "@/libraries/dayjs";

export type TLocalNotificationState = {
  notifications: Notifications.NotificationRequest[];
  lastSyncedAt: number;
};

export type TLocalNotificationAction = {
  addNotification: (
    title: string,
    body: string,
    data: TNotificationData
  ) => Promise<string>;
  cancelNotification: (identifier: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  syncNotifications: () => Promise<void>;
};

export type TLocalNotificationStore = TLocalNotificationState & {
  actions: TLocalNotificationAction;
};

export const useLocalNotification = create<TLocalNotificationStore>()(
  (set, get) => ({
    lastSyncedAt: 0,
    notifications: [],
    actions: {
      addNotification: async (title, body, data) => {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: dayjs().diff(dayjs(data.estimatedAt), "second"),
            repeats: false,
          },
        });

        await get().actions.syncNotifications();
        return notificationId;
      },
      cancelNotification: async (identifier) => {
        await Notifications.cancelScheduledNotificationAsync(identifier);
        await get().actions.syncNotifications(); // 동기화
      },
      cancelAllNotifications: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await get().actions.syncNotifications(); // 동기화
      },
      syncNotifications: async () => {
        const notifications =
          await Notifications.getAllScheduledNotificationsAsync();
        set({ notifications, lastSyncedAt: dayjs().unix() });
      },
    },
  })
);
