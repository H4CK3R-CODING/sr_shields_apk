// src/screens/HealthRecords/MedicalRecordsScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { View, Text } from "react-native";
// import NavLayout from "../../components/NavLayout";

export default function MedicalRecordsScreen() {
  return (
    <NavLayout title="Medical Records" showAiChat={false}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          Medical Records Screen
        </Text>
      </View>
    </NavLayout>
  );
}
