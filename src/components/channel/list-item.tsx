import {
  generateChannelUrl,
  generateThumbnail,
  generateVideoUrl,
} from "@/libraries/youtube/url";
import { TChannelDocumentWithoutId } from "@/types/api/was";
import {
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
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

type Props = {
  item: TChannelDocumentWithoutId;
};

export default function ChannelListItem({ item }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const profilePictureUrl = item.profile_picture_url;
  const channelUrl = generateChannelUrl(item.channel_id);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "light" ? styles.containerLight : styles.containerDark,
      ]}
    >
      <Pressable onPress={() => Linking.openURL(channelUrl)}>
        <Image
          source={{ uri: profilePictureUrl }}
          style={styles.thumbnail}
          alt="방송 썸네일"
        />
      </Pressable>
      <View style={styles.descriptionBox}>
        <TouchableOpacity onPress={() => Linking.openURL(channelUrl)}>
          <Text style={styles.channelName}>{item?.name_kor ?? "N/A"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL(channelUrl)}>
          <Text style={styles.title} numberOfLines={2}>
            {item.handle_name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={2}>
          등록일: {dayjs(item.createdAt).format(t("time.shortTemplate"))}
        </Text>

        <View style={styles.actionButtonBox}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (Platform.OS === "ios") {
                Share.share({
                  title: item.name_kor,
                  url: channelUrl,
                });
              } else {
                Share.share({
                  title: item.name_kor,
                  message: channelUrl,
                });
              }
            }}
          >
            <Ionicons name="share-social-outline" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
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
    width: Dimensions.get("window").width * 0.25,
    aspectRatio: 1 / 1,
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
  actionButtonBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f2b4bf",
  },
});
