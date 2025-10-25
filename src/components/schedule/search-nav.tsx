import { useScheduleStore } from "@/stores/schedule";
import { TScheduleSelect } from "@/types";
import { findEntity, SCHEDULE_SELECT_TP } from "@/types/tp";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  query: string;
  contentLength: {
    all: number;
    stream: number;
    video: number;
  };
  openSearchModal: () => void;
};

export default function SearchNav({
  query,
  contentLength,
  openSearchModal,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const select = useScheduleStore((state) => state.select);

  return (
    <View style={styles.container}>
      <View style={styles.countBox}>
        <Text style={[styles.countBoxText, { marginRight: 5 }]}>
          {findEntity(SCHEDULE_SELECT_TP, select)?.value}
        </Text>
        <Text style={styles.countBoxText}>
          {contentLength[select] ?? "N/A"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={openSearchModal}
        hitSlop={10}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.searchButtonText}
        >
          {query}
        </Text>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  countBox: {
    flexDirection: "row",
    padding: 5,
  },
  countBoxText: {
    fontSize: 18,
  },
  searchButton: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  searchButtonText: {
    width: 100,
  },
});
