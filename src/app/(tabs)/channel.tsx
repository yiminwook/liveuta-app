import { SHEET_COLOR } from "@/constants/theme";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChannelScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text>Channel</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
});
