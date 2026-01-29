import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import ChatbotModal from "../ChatbotModal";
import { LinearGradient } from "expo-linear-gradient";

export default function NavLayout({ children, title, showAiChat = true }) {
  const navigation = useNavigation();
  const [chatbotVisible, setChatbotVisible] = useState(false);

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar title={title} />

      {/* Screen content */}
      <View className="flex-1">{children}</View>

      {/* Floating AI Chat button */}
      {/* {showAiChat && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AIChat")}
          className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        >
          <Feather name="message-circle" size={28} color="white" />
        </TouchableOpacity>
      )} */}

      {/* Floating AI Chat button */}
      {showAiChat && (
        <>
          {/* <LinearGradient
            colors={["#3B82F6", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute bottom-6 right-6 rounded-full p-4 shadow-lg"
          ></LinearGradient> */}
          <TouchableOpacity
            onPress={() => setChatbotVisible(true)}
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={["#2563EB", "#7C3AED"]} // blue-600 → purple-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 16,
                borderRadius: 999,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="message-circle" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Coming Soon Badge */}
          <View className="absolute bottom-20 right-4 bg-yellow-400 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-gray-800">Coming Soon</Text>
          </View>
        </>
      )}

      {/* Chatbot Modal */}
      <ChatbotModal
        visible={chatbotVisible}
        onClose={() => setChatbotVisible(false)}
      />
    </View>
  );
}
