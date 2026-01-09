// src/components/AppointmentCard.jsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

export default function AppointmentCard({ patient, date, type, onPress }) {
  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-3 shadow"
      onPress={onPress}
    >
      <Text className="text-gray-900 dark:text-white font-semibold">{patient}</Text>
      <Text className="text-gray-500 dark:text-gray-300 text-sm">
        Date: {date} | Type: {type}
      </Text>
    </TouchableOpacity>
  );
}
