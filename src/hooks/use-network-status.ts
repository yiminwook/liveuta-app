import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isOffline: boolean;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
    isOffline: false,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = state.isInternetReachable === false;
      // console.log("netInfo-event-isConntected", state.isConnected);
      // console.log(
      //   "netInfo-event-isInternetReachable",
      //   state.isInternetReachable
      // );
      // console.log("netInfo-event-isOffline", isOffline);
      // console.log("type", state.type);

      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOffline,
      });
    });

    // 초기 상태 확인
    NetInfo.fetch().then((state) => {
      const isOffline = state.isInternetReachable === false;
      // console.log("netInfo-fetch-isConntected", state.isConnected);
      // console.log(
      //   "netInfo-fetch-isInternetReachable",
      //   state.isInternetReachable
      // );
      // console.log("netInfo-fetch-isOffline", isOffline);

      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOffline,
      });
    });

    return () => unsubscribe();
  }, []);

  return networkStatus;
}
