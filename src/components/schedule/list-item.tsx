import {
  generateChannelUrl,
  generateThumbnail,
  generateVideoUrl,
} from "@/libraries/youtube/url";
import { TParsedClientContent } from "@/types/api/was";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { getInterval } from "@/utils/time";
import { Ionicons } from "@expo/vector-icons";
import { useLocalNotification } from "@/stores/notification";
import dayjs from "@/libraries/dayjs";
import { Toast } from "toastify-react-native";
import { STREAM_STATUS_MAPPER } from "@/types";
import { LIGHT_CLOSED_COLOR, LIGHT_STREAM_COLOR } from "@/constants/theme";

type Props = {
  item: TParsedClientContent;
};

export default function ScheduleListItem({ item }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const videoUrl = generateVideoUrl(item.videoId);
  const thumbnailUrl = generateThumbnail(item.videoId, "mqdefault");
  const channelUrl = generateChannelUrl(item.channelId);

  const { notifications, actions } = useLocalNotification();

  const addStreamModifier = STREAM_STATUS_MAPPER[item.broadcastStatus];

  const interval = getInterval(item.utcTime, t);

  const onPressShare = () => {
    if (Platform.OS === "ios") {
      Share.share({
        title: item.title,
        url: videoUrl,
      });
    } else {
      Share.share({
        title: item.title,
        message: videoUrl,
      });
    }
  };

  const onPressNotification = async () => {
    if (item.broadcastStatus !== "NULL") {
      Alert.alert("안내", "방송이 이미 시작되었거나 종료되었습니다.");
      return;
    }

    const index = notifications.findIndex(
      (notification) =>
        notification.content.data.type === "stream-schedule" &&
        notification.content.data.videoId === item.videoId
    );

    if (index > -1) {
      Alert.alert(
        "알림 설정",
        "이미 알림 설정되었습니다. 확인을 누르면 알림이 취소됩니다.",
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "확인",
            onPress: async () => {
              await actions.cancelNotification(notifications[index].identifier);
              Toast.info("알림이 취소되었습니다.");
            },
          },
        ]
      );
      return;
    }

    const channelName = item.name_kor ?? item.names?.[0] ?? "N/A";
    await actions.addNotification(
      `${channelName}의 방송이 곧 시작됩니다.`,
      item.title,
      {
        type: "stream-schedule",
        videoId: item.videoId,
        url: videoUrl,
        estimatedAt: dayjs(item.utcTime),
        createdAt: dayjs(),
      }
    );

    Toast.success("알림이 설정되었습니다.");
  };

  return (
    <View
      style={[
        styles.container,
        colorScheme === "light" ? styles.containerLight : styles.containerDark,
        styles[addStreamModifier],
      ]}
    >
      <View style={styles.cardTopBox}>
        <View style={styles.statusBox}>
          {!!interval && (
            <Text style={styles.statusText}>
              {getInterval(item.utcTime, t)}
            </Text>
          )}
          {item.broadcastStatus !== "TRUE" ? (
            <Text style={styles.statusText}>
              {item.broadcastStatus === "NULL" ? "방송예정" : "방송종료"}
            </Text>
          ) : (
            <Text style={styles.statusText}>시청자: {item.viewer} 명</Text>
          )}
        </View>

        <View>
          <Text style={styles.timeText}>
            {item.utcTime.format(t("time.longTemplate"))}
          </Text>
        </View>
      </View>

      <View style={styles.cardMidBox}>
        <Pressable onPress={() => Linking.openURL(videoUrl)}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            alt="방송 썸네일"
          />
        </Pressable>

        <View style={styles.descriptionBox}>
          <TouchableOpacity onPress={() => Linking.openURL(channelUrl)}>
            <Text style={styles.channelName}>{item?.name_kor ?? "N/A"}</Text>
          </TouchableOpacity>

          <View style={styles.actionButtonBox}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onPressShare}
            >
              <Ionicons name="share-social-outline" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                item.broadcastStatus !== "NULL" && styles.actionButtonDisabled,
              ]}
              onPress={onPressNotification}
              disabled={item.broadcastStatus !== "NULL"}
            >
              <Ionicons name="notifications-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.cardBottomBox}>
        <TouchableOpacity onPress={() => Linking.openURL(videoUrl)}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#fff",
  },
  stream: {
    backgroundColor: LIGHT_STREAM_COLOR,
  },
  closed: {
    backgroundColor: LIGHT_CLOSED_COLOR,
  },
  scheduled: {},

  cardTopBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMidBox: {
    flexDirection: "row",
  },
  cardBottomBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },

  thumbnail: {
    width: Dimensions.get("window").width * 0.4,
    aspectRatio: 16 / 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  descriptionBox: {
    flex: 1,
    paddingHorizontal: 10,
  },
  channelName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {},

  actionButtonBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  actionButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f2b4bf",
  },
  actionButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
