// src/screens/Consultation/ChatConsultationScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { View, Text } from "react-native";

export default function ChatConsultationScreen() {
  return (
    <NavLayout title="Chat Consultation" showAiChat={false}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          Chat Consultation Screen
        </Text>
      </View>
    </NavLayout>
  );
}
