import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import ThemeToggle from "../ThemeToggle";
import { ThemeContext } from "@/src/theme/ThemeProvider";

export default function Navbar({ title }) {
  const navigation = useNavigation();
  const context = useContext(ThemeContext);
  const { theme, toggleTheme, isLoading } = context;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-md">
      {/* Hamburger */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="p-2"
      >
        <Feather
          name="menu"
          size={28}
          // className="text-blue-700 dark:text-white"
          color={theme === "dark" ? "#FFFFFF" : "#000000"} 
        />
      </TouchableOpacity>

      {/* Title (only render if passed) */}
      {title ? (
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </Text>
      ) : (
        <View /> // empty view to keep spacing consistent
      )}

      {/* Theme Toggle */}
      <ThemeToggle />
    </View>
  );
}
