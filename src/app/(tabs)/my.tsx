import { SHEET_COLOR } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>마이페이지</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Link href="/setting" asChild>
          <TouchableOpacity style={styles.itemButton}>
            <Ionicons name="settings" size={30} color="#333333" />
            <Text style={styles.itemButtonText}>설정</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
  titleBox: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: SHEET_COLOR,
  },
  itemButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
});
