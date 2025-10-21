import { GRAY_COLOR } from "@/constants/colors";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  badgeStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: string | number;
  Icon?: React.ReactNode;
}

/** 기본색상 Gray */
export function Chip({ children, badgeStyle, textStyle, Icon }: Props) {
  return (
    <View style={[styles.badge, badgeStyle]}>
      {Icon}
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
    backgroundColor: GRAY_COLOR,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
});
