import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const onCopy = async (text: string) => {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
};

// https://tanstack.com/query/latest/docs/framework/react/react-native#refetch-on-app-focus
const useOnlineManager = () => {
  useEffect(() => {
    // React Query already supports on reconnect auto refetch in web browser
    if (Platform.OS !== "web") {
      return NetInfo.addEventListener((state) => {
        onlineManager.setOnline(
          state.isConnected != null &&
            state.isConnected &&
            Boolean(state.isInternetReachable)
        );
      });
    }
  }, []);
};

const useAppState = (onChange: (status: AppStateStatus) => void) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      subscription.remove();
    };
  }, [onChange]);
};

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    async onError(error, query) {
      const querykey = query.queryKey;

      // TODO: 세션 만료 처리
      // console.log("세션 만료", error.message);
      // useSession.getState().actions.resetSession();

      // 에러 모달을 무시하고 싶을 때 queryKey에 ignore를 추가
      if (querykey.includes("ignore")) return;

      Toast.error(error.message);
    },
  }),
  defaultOptions: {
    queries: {
      gcTime: 30 * 1000, // 30초
      staleTime: 10 * 1000, // 10초
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // failureCount 0부터 시작

        //TODO 세션에러일 경우 재시도 하지 않음
        // if (error instanceof Error) {
        //   return false;
        // }

        // 그 외의 경우 재시도 횟수를 3으로 설정
        return failureCount < 2;
      },
      retryDelay: 1000 * 2,
    },
    mutations: {
      gcTime: 0,
      retry: false,
      onError: async (error) => {
        // TODO 세션 만료 처리
        // console.log("세션 만료", error.message);
        // useSession.getState().actions.resetSession();
      },
    },
  },
});

// https://tanstack.com/query/v4/docs/framework/react/examples/react-native
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const inset = useSafeAreaInsets();
  useOnlineManager();
  useAppState(onAppStateChange);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {__DEV__ && (
        <DevToolsBubble
          onCopy={onCopy}
          queryClient={queryClient}
          bubbleStyle={{
            position: "absolute",
            bottom: 70 + inset.bottom,
            right: 10,
          }}
        />
      )}
    </QueryClientProvider>
  );
}
