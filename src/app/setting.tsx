import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import dayjs from "@/libraries/dayjs";
import { useNotification } from "@/components/config/notification-provider";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Linking } from "react-native";
import { SHEET_COLOR } from "@/constants/theme";

export default function Setting() {
  const updates = Updates.useUpdates();
  const [checking, setChecking] = useState(false);
  const { expoPushToken, error } = useNotification();

  const onPressCopyToken = async () => {
    if (expoPushToken) {
      await Clipboard.setStringAsync(expoPushToken);
      Alert.alert("복사 완료", "Expo Push Token이 클립보드에 복사되었습니다.");
    }
  };

  const onPressCheckForUpdate = async () => {
    try {
      setChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert(
          "업데이트 가능",
          "새로운 업데이트가 있습니다. 지금 적용할까요?",
          [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "업데이트",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                // 앱 재시작 (새 업데이트 적용)
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        Alert.alert("최신 상태입니다", "앱은 최신 버전입니다.");
      }
    } catch (error) {
      Alert.alert(
        "오류",
        `업데이트 확인 중 문제가 발생했습니다: ${(error as Error).message}`
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollViewInner}>
        <View>
          <Text style={styles.subTitle}>앱정보</Text>
          <Text style={styles.contentText}>채널: {Updates.channel}</Text>
          <Text style={styles.contentText}>
            런타임 버전: {Updates.runtimeVersion}
          </Text>
          <Text style={styles.contentText}>
            업데이트 버전: {Updates.updateId}
          </Text>

          <View>
            <Button
              title={checking ? "확인중..." : "업데이트 확인"}
              onPress={onPressCheckForUpdate}
              disabled={checking}
            />
          </View>

          <View style={{ height: 20 }} />

          <Text style={styles.contentText}>
            checkAutomatically: {Updates.checkAutomatically}
          </Text>
          <Text style={styles.contentText}>
            launchDuration: {Updates.launchDuration}
          </Text>
          <Text style={styles.contentText}>
            createdAt: {dayjs(Updates.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
          <Text style={styles.contentText}>
            emergencyLaunchReason: {Updates.emergencyLaunchReason}
          </Text>
          <Text style={styles.contentText}>
            isEmergencyLaunch: {Updates.isEmergencyLaunch ? "Y" : "N"}
          </Text>
          <Text style={styles.contentText}>
            isEmbeddedLaunch: {Updates.isEmbeddedLaunch ? "Y" : "N"}
          </Text>
          <Text style={styles.contentText}>
            isEnabled: {Updates.isEnabled ? "Y" : "N"}
          </Text>
          <Text style={styles.contentText}>
            isUsingEmbeddedAssets: {Updates.isUsingEmbeddedAssets ? "Y" : "N"}
          </Text>
        </View>

        <View>
          <Text style={styles.subTitle}>EXPO PUSH TOKEN</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {expoPushToken ? (
              <>
                <Text
                  // 텍스트가 넘쳐 버튼이 옆으로 넘어가는 것을 방지
                  style={[styles.contentText, { flex: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {expoPushToken}
                </Text>
                <Pressable style={styles.copyButton} onPress={onPressCopyToken}>
                  <Ionicons name="copy" size={20} color="#007AFF" />
                  <Text style={styles.copyButtonText}>복사</Text>
                </Pressable>
              </>
            ) : (
              <TouchableOpacity onPress={Linking.openSettings}>
                <Text
                  style={{ textDecorationLine: "underline", color: "#007AFF" }}
                >
                  알림권한 설정이 필요합니다.
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 20 }} />

          <Text style={styles.subTitle}>EXPO TOKEN ERROR</Text>
          <Text style={styles.contentText}>{error?.message}</Text>
        </View>

        <View>
          <Text style={styles.subTitle}>latestContext</Text>
          <Text style={styles.contentText}>
            {JSON.stringify(Updates.latestContext, null, 2)}
          </Text>
          {/* <Text style={styles.subTitle}>디버깅</Text> */}
          {/* <Text style={styles.contentText}>
            {JSON.stringify(Updates, null, 2)}
          </Text> */}
        </View>

        {/* <View>
          <Text style={styles.subTitle}>manifest</Text>
          <Text style={styles.contentText}>
            {JSON.stringify(Updates.manifest, null, 2)}
          </Text>
        </View> */}

        <View>
          <Text style={styles.subTitle}>디버깅</Text>
          <Text style={styles.contentText}>
            {JSON.stringify(updates, null, 2)}
          </Text>
        </View>

        {updates.availableUpdate && (
          <View>
            <Text style={styles.subTitle}>업데이트가 가능합니다.</Text>
            <Text style={styles.contentText}>
              타입: {updates.availableUpdate.type}
            </Text>
            <Text style={styles.contentText}>
              업데이트 ID: {updates.availableUpdate.updateId}
            </Text>
            <Text style={styles.contentText}>
              생성일:{" "}
              {dayjs(updates.availableUpdate.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </Text>
            <Text style={styles.contentText}>
              에셋:{" "}
              {JSON.stringify(
                updates.availableUpdate.manifest?.assets,
                null,
                2
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
  scrollViewInner: {
    flexGrow: 1, // flexGlow는 스크롤 차단하지 않음
    gap: 40,
    padding: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    gap: 5,
    marginLeft: 10,
  },
  copyButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
