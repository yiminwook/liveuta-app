import { HapticTab } from "@/components/haptic-tab";
import { COLORS } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

// popToTopOnBlur true;  탭 이동시 기존 화면이 유지되지 않게함.
// animation none; 탭 이동시 애니메이션 제거
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="schedule"
      backBehavior="history"
      screenOptions={{
        animation: "none", // IOS 26에서 버그있어서 막아둠
        tabBarActiveTintColor: COLORS[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="schedule"
        options={{
          title: "스케쥴",
          popToTopOnBlur: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="channel"
        options={{
          title: "채널",
          popToTopOnBlur: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "tv" : "tv-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: "마이",
          popToTopOnBlur: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
