import { generateThumbnail, generateVideoUrl } from "@/libraries/youtube/url";
import { TParsedClientContent } from "@/types/mongodb";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

type Props = {
  item: TParsedClientContent;
};

export default function ListItem({ item }: Props) {
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
      <View>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          alt="방송 썸네일"
        />
      </View>
      <View>
        <Text>{item.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#151718",
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
});
