import { SHEET_COLOR } from "@/constants/theme";
import { useScheduleStore } from "@/stores/schedule";
import { TScheduleSelect } from "@/types";
import { SCHEDULE_SELECT_TP } from "@/types/tp";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  query: string;
  closeSearchModal: () => void;
  onChangeQuery: (query: string) => void;
};

export default function ChannelSearchModal({
  query,
  closeSearchModal,
  onChangeQuery,
}: Props) {
  const [inputValue, setInputValue] = useState(query);

  const insets = useSafeAreaInsets();

  const onChangeText = (text: string) => setInputValue(() => text);
  const handleSearch = () => {
    onChangeQuery(inputValue);
    closeSearchModal();
  };

  return (
    <Modal visible presentationStyle="pageSheet" animationType="slide">
      <View
        style={[
          styles.container,
          {
            // safe area view edges 버그때문에 적용안됨
            paddingTop: Platform.OS === "ios" ? 20 : insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View style={styles.topBox}>
          <View />
          <TouchableOpacity onPress={closeSearchModal}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
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
      </View>
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
