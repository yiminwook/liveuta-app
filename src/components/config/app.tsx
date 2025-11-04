import AppNavigator from "@/components/config/app-navigator";
import { memo, useEffect } from "react";
import { useNotification } from "./notification-provider";
import { useMetaData } from "@/hooks/api/use-meta-data";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  AppState,
  InteractionManager,
} from "react-native";
import * as Updates from "expo-updates";
import { SHEET_COLOR, TINT_COLOR } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INTERACTED_NOTIFICATION_STORAGE_KEY } from "@/constants/storage-key";
import * as Notifications from "expo-notifications";
import { TNotificationPayload } from "@/types";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { useLocalNotification } from "@/stores/notification";

export default memo(function App() {
  const { expoPushToken } = useNotification();

  const metaData = useMetaData();
  const isSupportedRuntimeVersion =
    typeof metaData.data?.app_runtime_version === "string" &&
    metaData.data.app_runtime_version === Updates.runtimeVersion;

  useEffect(() => {
    if (!expoPushToken) return;

    const controller = new AbortController();

    // send device info to server

    return () => {
      controller.abort();
    };
  }, [expoPushToken]);

  useEffect(() => {
    AsyncStorage.getItem(INTERACTED_NOTIFICATION_STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        type TaskManagerTaskBody =
          TaskManager.TaskManagerTaskBody<Notifications.NotificationTaskPayload>;

        const body: TaskManagerTaskBody = JSON.parse(value);
        const data = body.data;

        const isNotificationResponse = "actionIdentifier" in data;
        if (!isNotificationResponse) return;

        const notification = data.notification;
        // const actionIdentifier = data.actionIdentifier;

        const payload = notification.request.content
          .data as TNotificationPayload;

        if (payload.type === "stream-schedule") {
          Linking.openURL(payload.url); // 유투브앱 오픈
          return;
        }

        if (payload.type === "channel-subscribe") {
          Linking.openURL(payload.url); // 유투브앱 오픈
          return;
        }
      })
      .catch(console.error)
      .then(() => {
        AsyncStorage.removeItem(INTERACTED_NOTIFICATION_STORAGE_KEY);
        SplashScreen.hideAsync(); // TEST: 스플래쉬 효과 이상한지 체크 필요
      });
  }, []);

  useEffect(() => {
    // 앱 시작 시 동기화
    useLocalNotification.getState().actions.syncNotifications();

    setImmediate(() => {
      const lastNotification = Notifications.getLastNotificationResponse();
      console.log("[TEST] lastNotification1", lastNotification);
    });

    // 포그라운드 복귀 시 동기화
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("[TEST] AppState.addEventListener", nextAppState);
      if (nextAppState === "active") {
        const lastNotification = Notifications.getLastNotificationResponse();
        useLocalNotification.getState().actions.syncNotifications();
        console.log("[TEST] lastNotification2", lastNotification);
      }
    });

    return () => subscription.remove();
  }, []);

  if (metaData.isPending) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: SHEET_COLOR,
        }}
      >
        <ActivityIndicator size="large" color={TINT_COLOR} />
      </View>
    );
  }

  if (!isSupportedRuntimeVersion) {
    return <NotCompatibleVersion />;
  }

  return <AppNavigator isLoggedIn={false} />;
});

function NotCompatibleVersion() {
  const navigateToMarket = () => {
    if (Platform.OS === "ios") {
      // iOS: TestFlight로 연결
      // TODO: 실제 TestFlight 코드로 교체 필요
      Linking.openURL("https://testflight.apple.com/v1/app/6754354263");
    } else {
      // Android: Google Play Store로 연결
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.utawaku.liveuta"
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: SHEET_COLOR,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0a0a0a" }}>
        앱 버전이 호환되지 않습니다.
      </Text>

      <TouchableOpacity
        onPress={navigateToMarket}
        style={{
          padding: 10,
          backgroundColor: "#f2b4bf",
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          마켓에서 업데이트
        </Text>
      </TouchableOpacity>
    </View>
  );
}
