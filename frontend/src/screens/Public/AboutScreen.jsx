// src/screens/Public/AboutScreen.jsx
import React from "react";
import { View, Text, Button } from "react-native";

export default function AboutScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900 px-6">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About This App</Text>
      <Text className="text-gray-700 dark:text-gray-300 text-center mb-6">
        This is a demo healthcare app where patients, doctors, and admins can interact seamlessly.
      </Text>
      <Button title="Back to Welcome" onPress={() => navigation.navigate("Welcome")} />
    </View>
  );
}
