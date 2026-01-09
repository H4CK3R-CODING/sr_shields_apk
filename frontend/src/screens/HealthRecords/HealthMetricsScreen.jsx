// src/screens/HealthRecords/HealthMetricsScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { View, Text } from "react-native";
// import NavLayout from "../../components/NavLayout";

export default function HealthMetricsScreen() {
  return (
    <NavLayout title="Health Metrics" showAiChat={false}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          Health Metrics Screen
        </Text>
      </View>
    </NavLayout>
  );
}
