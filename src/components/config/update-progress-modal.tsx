import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Updates from "expo-updates";
import { TINT_COLOR } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface UpdateProgressModalProps {
  visible: boolean;
  onComplete: () => void;
}

export function UpdateProgressModal({
  visible,
  onComplete,
}: UpdateProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("업데이트 확인 중...");

  // Reanimated 애니메이션 값
  const animatedValue = useSharedValue(0);

  const startUpdateProcess = async () => {
    try {
      setStatus("업데이트 확인 중...");
      setProgress(10);

      // 업데이트 확인
      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        setStatus("최신 버전입니다.");
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 1000);
        return;
      }

      setStatus("업데이트 다운로드 중...");
      setProgress(30);

      // 업데이트 다운로드
      await Updates.fetchUpdateAsync();

      setStatus("업데이트 준비 중...");
      setProgress(80);

      // 애니메이션으로 진행도 표시 (Reanimated)
      animatedValue.value = withTiming(1, { duration: 1000 });

      setStatus("업데이트 완료! 앱을 재시작합니다...");
      setProgress(100);

      // 2초 후 자동 재시작
      setTimeout(() => {
        Updates.reloadAsync();
      }, 2000);
    } catch (error) {
      console.error("업데이트 오류:", error);
      setStatus("업데이트 중 오류가 발생했습니다.");
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  // Reanimated 스타일
  const progressAnimatedStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(
      animatedValue.value,
      [0, 1],
      [0, width - 80]
    );

    return { width: progressWidth };
  });

  useEffect(() => {
    if (visible) {
      startUpdateProcess();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={TINT_COLOR}
            style={styles.spinner}
          />

          <Text style={styles.title}>앱 업데이트</Text>
          <Text style={styles.status}>{status}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[styles.progressFill, progressAnimatedStyle]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: width - 40,
    maxWidth: 400,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
