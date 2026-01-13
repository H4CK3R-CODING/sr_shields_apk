// src/components/CustomHeader.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import ThemeToggle from "./ThemeToggle";

export default function CustomHeader({ 
  title, 
  showBack = false, 
  showMenu = false,
  rightButton = <ThemeToggle />,
  // navigation,
}) {
  const navigation = useNavigation();
  
  return (
    <View className="bg-white dark:bg-gray-800 px-4 py-4 flex-row items-center justify-between shadow-sm">
      {/* Left Side */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="mr-3 p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            className="mr-3 p-2 -ml-2"
          >
            <Ionicons name="menu" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </Text>
      </View>

      {/* Right Side */}
      {rightButton && (
        <View className="ml-2">
          {rightButton}
        </View>
      )}
    </View>
  );
}