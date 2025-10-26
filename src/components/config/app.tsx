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
} from "react-native";
import * as Updates from "expo-updates";
import { SHEET_COLOR } from "@/constants/theme";

export default memo(function App() {
  const { expoPushToken } = useNotification();

  const metaData = useMetaData();
  const runtimeVersion =
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!runtimeVersion) {
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
