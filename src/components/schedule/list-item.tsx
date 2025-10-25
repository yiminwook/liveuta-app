import { generateThumbnail, generateVideoUrl } from "@/libraries/youtube/url";
import { TParsedClientContent } from "@/types/api/was";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { getInterval } from "@/utils/time";

type Props = {
  item: TParsedClientContent;
};

export default function ListItem({ item }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const videoUrl = generateVideoUrl(item.videoId);
  const thumbnailUrl = generateThumbnail(item.videoId, "mqdefault");

  return (
    <View
      style={[
        styles.container,
        colorScheme === "light" ? styles.containerLight : styles.containerDark,
      ]}
    >
      <Pressable onPress={() => Linking.openURL(videoUrl)}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          alt="방송 썸네일"
        />
      </Pressable>
      <View style={styles.descriptionBox}>
        <Text style={styles.channelName}>{item?.name_kor ?? "N/A"}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text>{item.utcTime.format(t("time.longTemplate"))}</Text>
        <Text>{getInterval(item.utcTime, t)}</Text>
        {item.broadcastStatus !== "TRUE" ? (
          <Text>
            {item.broadcastStatus === "NULL" ? "방송예정" : "방송종료"}
          </Text>
        ) : (
          <Text>시청자: {item.viewer} 명</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: Dimensions.get("window").width * 0.4,
    aspectRatio: 16 / 9,
    marginRight: 5,
    borderRadius: 5,
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
  descriptionBox: {
    flex: 1,
  },
  channelName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    marginTop: 5,
  },
});
