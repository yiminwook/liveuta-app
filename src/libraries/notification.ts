import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    // 안드로이드의 경우 알림을 보내기전 최소한 하나이상의 채널을 설정해야함.
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX, // 중요도가 낮은 경우 기기에서 알림이 표시되지 않는 경우가 있다.
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFC1CC",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error(
        "Permission not granted to get push token for notifications"
      );
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found");
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      console.log(
        "push token >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        pushTokenString
      );
      return pushTokenString;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get push token for notifications");
    }
  } else {
    throw new Error("Must use physical device for Push Notifications");
  }
};
