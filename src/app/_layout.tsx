import App from "@/components/config/app";
import { NotificationProvider } from "@/components/config/notification-provider";
import { OfflineModal } from "@/components/config/offline-modal";
import ReactQueryProvider from "@/components/config/react-query";
import { UpdateProgressModal } from "@/components/config/update-progress-modal";
import { useAppUpdate } from "@/hooks/use-app-update";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNetworkStatus } from "@/hooks/use-network-status";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import "@/libraries/i18n";
import * as Sentry from "@sentry/react-native";
import "dayjs/locale/ko";
import "dayjs/locale/ja";
import "dayjs/locale/en";
import ToastManager from "toastify-react-native/components/ToastManager";

Sentry.init({
  dsn: "https://6ade1cdb94ad639de212e46f99e5ded3@o4508487071563776.ingest.us.sentry.io/4510249992978432",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
  enabled: !__DEV__, // 개발환경에서는 오류 보고 안함
});

export const unstable_settings = {
  anchor: "(tabs)",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true, //ios only
    shouldShowBanner: true, // 포그라운드에서 상단 알림을 표시할지
    shouldShowList: true, // 포그라운드에서 ios 알림센터에 표시할지
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const inset = useSafeAreaInsets();

  // 네트워크 상태 관리
  const { isOffline } = useNetworkStatus();

  // 앱 업데이트 관리
  const { showUpdateModal, actions: updateActions } = useAppUpdate();

  return (
    <NotificationProvider>
      <ReactQueryProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
              <App />

              <StatusBar style="auto" />

              {/* 업데이트 진행도 모달 */}
              <UpdateProgressModal
                visible={showUpdateModal}
                onComplete={updateActions.hideUpdateModal}
              />

              {/* 오프라인 상태 모달 */}
              <OfflineModal
                visible={isOffline}
                onRetry={() => {
                  // 네트워크 재확인을 위한 간단한 재시도 로직
                  console.log("네트워크 재확인 시도");
                  updateActions.restartApp();
                }}
              />

              {/* https://github.com/zahidalidev/toastify-react-native?tab=readme-ov-file#toastmanager-props */}
              <ToastManager
                useModal={true}
                duration={3000}
                topOffset={inset.top}
                animationStyle="fade"
                theme="dark"
                iconFamily="Ionicons"
              />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ReactQueryProvider>
    </NotificationProvider>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again? - GLOBAL</Text>
    </SafeAreaView>
  );
}
