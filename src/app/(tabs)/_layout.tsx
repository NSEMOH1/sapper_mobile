// import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: colors.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: colors.tabBarBorder,
            paddingTop: 8,
            paddingBottom: 25,
            height: 85,
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
            shadowColor: colors.tabBarBorder,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 0,
          },
          android: {
            backgroundColor: colors.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: colors.tabBarBorder,
            paddingTop: 8,
            paddingBottom: 8,
            // height: 70,
            elevation: 8,
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
          },
          default: {
            backgroundColor: colors.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: colors.tabBarBorder,
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/images/tabhome.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="loan"
        options={{
          title: "Loans",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/images/tabloan.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/images/tabpiggy.png")} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/images/tabprofile.png")} 
              style={{ width: 20, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
