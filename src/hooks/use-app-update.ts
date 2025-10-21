import { SplashScreen } from "expo-router";
import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";

export interface UpdateStatus {
  isDownloading: boolean;
  isUpdatePending: boolean;
  isUpdateAvailable: boolean;
  isStartupProcedureRunning: boolean;
  currentlyRunning: Updates.CurrentlyRunningInfo;
}

export interface UpdateActions {
  checkForUpdate: () => Promise<boolean>;
  downloadUpdate: () => Promise<void>;
  restartApp: () => Promise<void>;
  showUpdateModal: () => void;
  hideUpdateModal: () => void;
}

export function useAppUpdate() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const {
    isDownloading,
    isUpdatePending,
    isUpdateAvailable,
    isStartupProcedureRunning,
    currentlyRunning,
  } = Updates.useUpdates();

  const checkForUpdate = useCallback(async (): Promise<boolean> => {
    try {
      setIsCheckingUpdate(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setShowUpdateModal(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("업데이트 확인 오류:", error);
      return false;
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  const downloadUpdate = useCallback(async (): Promise<void> => {
    try {
      await Updates.fetchUpdateAsync();
    } catch (error) {
      console.error("업데이트 다운로드 오류:", error);
      throw error;
    }
  }, []);

  const restartApp = useCallback(async (): Promise<void> => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error("앱 재시작 오류:", error);
      throw error;
    }
  }, []);

  const showUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(true);
  }, []);

  const hideUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  // 앱 시작 시 자동 업데이트 확인
  useEffect(() => {
    // 우선 스플레쉬 스크린을 숨긴다 중요!
    SplashScreen.hideAsync().then(() => {
      if (!__DEV__ && !isCheckingUpdate) {
        checkForUpdate();
      }
    });
  }, []);

  // 업데이트 완료 후 자동 재시작
  useEffect(() => {
    if (isUpdatePending && !isDownloading) {
      // 업데이트가 완료되었고 다운로드가 끝났을 때 자동 재시작
      const timer = setTimeout(() => {
        restartApp();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isUpdatePending, isDownloading, restartApp]);

  const actions: UpdateActions = {
    checkForUpdate,
    downloadUpdate,
    restartApp,
    showUpdateModal: showUpdateModalHandler,
    hideUpdateModal: hideUpdateModalHandler,
  };

  const updateStatus: UpdateStatus = {
    isDownloading,
    isUpdatePending,
    isUpdateAvailable,
    isStartupProcedureRunning,
    currentlyRunning,
  };

  return {
    updateStatus,
    actions,
    showUpdateModal,
    isCheckingUpdate,
  };
}
