import { StreamFilter } from "@/types";
import { StyleSheet, useColorScheme } from "react-native";
import { Pressable, Text, View } from "react-native";

const BUTTON_TEXT = [
  {
    text: "예정",
    value: StreamFilter.scheduled,
  },
  {
    text: "라이브",
    value: StreamFilter.live,
  },
  {
    text: "24시",
    value: StreamFilter.daily,
  },
  {
    text: "전체",
    value: StreamFilter.all,
  },
];

type Props = {
  filter: StreamFilter;
  onChange: (filter: StreamFilter) => void;
};

export default function SegmentControl({ filter, onChange }: Props) {
  const colorScheme = useColorScheme() || "light";

  return (
    <View
      style={[
        styles.container,
        colorScheme === "light" ? styles.containerLight : styles.containerDark,
      ]}
    >
      {BUTTON_TEXT.map((item) => (
        <Pressable
          key={item.value}
          onPress={() => onChange(item.value)}
          style={({ pressed }) => [
            styles.button,
            colorScheme === "light" ? styles.buttonLight : styles.buttonDark,
            filter === item.value && colorScheme === "light"
              ? styles.activeButtonLight
              : styles.activeButtonDark,
            pressed && colorScheme === "light" && styles.buttonPressedLight,
            pressed && colorScheme === "dark" && styles.buttonPressedDark,
          ]}
        >
          <Text
            style={[
              styles.text,
              colorScheme === "light" ? styles.textLight : styles.textDark,
              filter === item.value && colorScheme === "light"
                ? styles.activeTextLight
                : styles.activeTextDark,
            ]}
          >
            {item.text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#151718",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#fafafa",
  },
  buttonLight: {
    backgroundColor: "#fff",
  },
  buttonDark: {
    backgroundColor: "#151718",
  },
  buttonPressedLight: {
    opacity: 0.5,
  },
  buttonPressedDark: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  activeButtonLight: {
    backgroundColor: "#fff",
  },
  activeButtonDark: {
    backgroundColor: "#000",
  },
  activeTextLight: {
    color: "#000",
  },
  activeTextDark: {
    color: "#fff",
  },
});
