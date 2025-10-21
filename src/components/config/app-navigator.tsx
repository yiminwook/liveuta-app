import { SHEET_COLOR } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

interface AppNavigatorProps {
  isLoggedIn: boolean;
}

export default function AppNavigator({ isLoggedIn }: AppNavigatorProps) {
  return (
    <Stack
      screenOptions={{
        contentStyle: styles.screen,
        headerShown: false,
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" />

      <Stack.Protected guard={!isLoggedIn}></Stack.Protected>

      <Stack.Protected guard={isLoggedIn}></Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SHEET_COLOR,
  },
});
