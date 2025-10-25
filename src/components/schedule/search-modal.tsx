import { SHEET_COLOR } from "@/constants/theme";
import { useScheduleStore } from "@/stores/schedule";
import { TScheduleSelect } from "@/types";
import { SCHEDULE_SELECT_TP } from "@/types/tp";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  query: string;
  contentLength: {
    all: number;
    stream: number;
    video: number;
  };
  closeSearchModal: () => void;
  onChangeQuery: (query: string) => void;
};

export default function SearchModal({
  query,
  contentLength,
  closeSearchModal,
  onChangeQuery,
}: Props) {
  const [inputValue, setInputValue] = useState(query);
  const select = useScheduleStore((state) => state.select);
  const setSelect = useScheduleStore((state) => state.actions.setSelect);

  const onChangeText = (text: string) => setInputValue(() => text);
  const handleSearch = () => {
    onChangeQuery(inputValue);
    closeSearchModal();
  };

  const selectVideoType = (type: TScheduleSelect) => () => setSelect(type);

  return (
    <Modal visible animationType="fade">
      <SafeAreaView style={styles.container}>
        <View style={styles.topBox}>
          <View />
          <TouchableOpacity onPress={closeSearchModal}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.videoTypeBox}>
          <Text style={styles.videoTypeBoxText}>영상 종류를 선택하세요</Text>
          <View style={styles.videoTypeButtonBox}>
            {SCHEDULE_SELECT_TP.map(([value, item]) => (
              <TouchableOpacity
                key={value}
                onPress={selectVideoType(value as TScheduleSelect)}
                style={styles.videoTypeButton}
              >
                <Ionicons
                  name={
                    select === value ? "checkbox-outline" : "square-outline"
                  }
                  style={{ marginRight: 5 }}
                  size={24}
                  color={select === value ? "green" : "black"}
                />

                <Text
                  style={[
                    styles.videoTypeButtonText,
                    { color: select === value ? "green" : "black" },
                  ]}
                >
                  {item} ({contentLength[value as TScheduleSelect] ?? "N/A"})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="채널명으로 검색"
            value={inputValue}
            onChangeText={onChangeText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
  topBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  videoTypeBox: {
    padding: 10,
    marginTop: 20,
  },
  videoTypeBoxText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  videoTypeButtonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  videoTypeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoTypeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  inputBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    height: 42,
    marginRight: 10,
  },
  searchButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: 42,
    height: 42,
    borderRadius: 5,
  },
});
