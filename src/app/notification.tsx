import { SHEET_COLOR } from "@/constants/theme";
import { useLocalNotification } from "@/stores/notification";
import { TNotificationData } from "@/types";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "@/libraries/dayjs";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Notification() {
  const { notifications } = useLocalNotification();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await useLocalNotification.getState().actions.syncNotifications();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.map((notification) => {
          const data = notification.content.data as TNotificationData;
          return (
            <View key={notification.identifier}>
              <Text>{data.type}</Text>
              <Text>{notification.content.title}</Text>
              <Text>{notification.content.body}</Text>
              <Text>
                예정시간:{" "}
                {dayjs(data.estimatedAt).format(t("dayjsScheduleTemplate"))}
              </Text>
              <Text>
                생성시간:{" "}
                {dayjs(data.createdAt).format(t("dayjsScheduleTemplate"))}
              </Text>
              <Pressable
                onPress={() => {
                  useLocalNotification
                    .getState()
                    .actions.cancelNotification(notification.identifier);
                }}
              >
                <Text>취소</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
});
