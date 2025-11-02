import { SHEET_COLOR, BRAND_COLOR } from "@/constants/theme";
import { useLocalNotification } from "@/stores/notification";
import { TNotificationData } from "@/types";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "@/libraries/dayjs";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Toast } from "toastify-react-native";
import { Ionicons } from "@expo/vector-icons";

const getNotificationIcon = (type: TNotificationData["type"]) => {
  switch (type) {
    case "stream-schedule":
      return "tv-outline";
    case "channel-subscribe":
      return "person-add-outline";
    default:
      return "notifications-outline";
  }
};

const getNotificationTypeLabel = (type: TNotificationData["type"]) => {
  switch (type) {
    case "stream-schedule":
      return "방송 일정";
    case "channel-subscribe":
      return "채널 구독";
    default:
      return "알림";
  }
};

export default function Notification() {
  const { notifications } = useLocalNotification();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  const [refreshing, setRefreshing] = useState(false);

  const { actions } = useLocalNotification();

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.syncNotifications();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={colorScheme === "light" ? "#ccc" : "#666"}
            />
            <Text
              style={[
                styles.emptyText,
                colorScheme === "light"
                  ? styles.emptyTextLight
                  : styles.emptyTextDark,
              ]}
            >
              등록된 알림이 없습니다
            </Text>
          </View>
        ) : (
          notifications.map((notification) => {
            const data = notification.content.data as TNotificationData;
            return (
              <View
                key={notification.identifier}
                style={[
                  styles.notificationCard,
                  colorScheme === "light" ? styles.cardLight : styles.cardDark,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeContainer}>
                    <Ionicons
                      name={getNotificationIcon(data.type)}
                      size={20}
                      color={BRAND_COLOR}
                    />
                    <Text style={styles.typeLabel}>
                      {getNotificationTypeLabel(data.type)}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.title,
                    colorScheme === "light"
                      ? styles.titleLight
                      : styles.titleDark,
                  ]}
                >
                  {notification.content.title}
                </Text>
                {notification.content.body && (
                  <Text
                    style={[
                      styles.body,
                      colorScheme === "light"
                        ? styles.bodyLight
                        : styles.bodyDark,
                    ]}
                  >
                    {notification.content.body}
                  </Text>
                )}

                <View style={styles.timeContainer}>
                  <View style={styles.timeRow}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={colorScheme === "light" ? "#666" : "#999"}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        colorScheme === "light"
                          ? styles.timeTextLight
                          : styles.timeTextDark,
                      ]}
                    >
                      예정:{" "}
                      {dayjs
                        .unix(data.estimatedAt)
                        .format(t("dayjsScheduleTemplate"))}
                    </Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Ionicons
                      name="create-outline"
                      size={14}
                      color={colorScheme === "light" ? "#666" : "#999"}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        colorScheme === "light"
                          ? styles.timeTextLight
                          : styles.timeTextDark,
                      ]}
                    >
                      생성:{" "}
                      {dayjs
                        .unix(data.createdAt)
                        .format(t("dayjsScheduleTemplate"))}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={async () => {
                    await actions.cancelNotification(notification.identifier);
                    Toast.success("알림이 취소되었습니다.");
                  }}
                >
                  <Ionicons name="close-outline" size={16} color="#fff" />
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            );
          })
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: "#fff",
  },
  cardDark: {
    backgroundColor: "#1a1a1a",
    borderColor: "#333",
  },
  cardHeader: {
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_COLOR,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleLight: {
    color: "#111",
  },
  titleDark: {
    color: "#fff",
  },
  body: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  bodyLight: {
    color: "#666",
  },
  bodyDark: {
    color: "#aaa",
  },
  timeContainer: {
    marginTop: 4,
    marginBottom: 12,
    gap: 6,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 12,
  },
  timeTextLight: {
    color: "#666",
  },
  timeTextDark: {
    color: "#999",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  emptyTextLight: {
    color: "#999",
  },
  emptyTextDark: {
    color: "#666",
  },
});
