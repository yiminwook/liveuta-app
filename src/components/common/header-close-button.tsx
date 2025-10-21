import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function HeaderCloseButton({ style }: Props) {
  return (
    <TouchableOpacity onPress={router.back} style={style}>
      <Ionicons name="close" size={24} color="#333" />
    </TouchableOpacity>
  );
}
