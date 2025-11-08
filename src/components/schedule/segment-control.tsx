import { useScheduleStore } from "@/stores/schedule";
import { StreamFilter } from "@/types";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLOR } from "@/constants/theme";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const WINDOW = Dimensions.get("window");

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
  movePage: (position: number) => void;
};

export default function SegmentControl({ movePage }: Props) {
  const colorScheme = useColorScheme() || "light";
  const lastTabPage = useScheduleStore((state) => state.lastTabPage);

  const animatedPage = useDerivedValue(() => {
    return withSpring(lastTabPage, {
      damping: 15,
      stiffness: 150,
      mass: 0.5,
    });
  }, [lastTabPage]);

  const indicatorPositionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedPage.value,
            [0, 1, 2, 3],
            [0, WINDOW.width / 4, WINDOW.width / 2, (WINDOW.width / 4) * 3]
          ),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        colorScheme === "light" ? styles.containerLight : styles.containerDark,
      ]}
    >
      <Animated.View style={[styles.activeIndicator, indicatorPositionStyle]}>
        <View style={styles.activeIndicatorBackground} />
      </Animated.View>

      {BUTTON_TEXT.map((item, index) => {
        const isActive = lastTabPage === index;

        return (
          <Pressable
            key={item.value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              movePage(index);
            }}
            style={({ pressed }) => [
              styles.button,
              colorScheme === "light" ? styles.buttonLight : styles.buttonDark,
              isActive && colorScheme === "light" && styles.activeButtonLight,
              isActive && colorScheme === "dark" && styles.activeButtonDark,
              pressed && colorScheme === "light" && styles.buttonPressedLight,
              pressed && colorScheme === "dark" && styles.buttonPressedDark,
            ]}
          >
            <Text
              style={[
                styles.text,
                colorScheme === "light" ? styles.textLight : styles.textDark,
                isActive && colorScheme === "light" && styles.activeTextLight,
                isActive && colorScheme === "dark" && styles.activeTextDark,
              ]}
            >
              {item.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
    borderBottomWidth: 1,
  },
  containerLight: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  containerDark: {
    backgroundColor: "#151718",
    borderColor: "#333",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonLight: {},
  buttonDark: {},
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
    // backgroundColor: "red",
  },
  activeButtonDark: {
    // backgroundColor: "red",
  },
  activeTextLight: {
    color: "#fff",
  },
  activeTextDark: {
    color: "#fff",
  },
  activeIndicator: {
    position: "absolute",
    width: WINDOW.width / 4,
    height: "100%",
    padding: 5,
  },
  activeIndicatorBackground: {
    backgroundColor: BRAND_COLOR,
    flex: 1,
    borderRadius: 10,
  },
});
