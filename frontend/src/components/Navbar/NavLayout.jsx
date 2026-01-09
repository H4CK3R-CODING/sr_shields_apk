import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";

export default function NavLayout({ children, title, showAiChat = true }) {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar title={title} />

      {/* Screen content */}
      <View className="flex-1">{children}</View>

      {/* Floating AI Chat button */}
      {showAiChat && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AIChat")}
          className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        >
          <Feather name="message-circle" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
