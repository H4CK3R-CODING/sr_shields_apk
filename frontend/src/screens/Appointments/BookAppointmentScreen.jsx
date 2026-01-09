// src/screens/Appointments/BookAppointmentScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function BookAppointmentScreen() {
  return (
    <NavLayout title="Book Appointment" showAiChat={false}>
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <Text className="text-gray-900 dark:text-white text-lg mb-4">
          Book Appointment Screen
        </Text>

        {/* Example buttons to book different appointment types */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-3 w-full items-center">
          <Text className="text-white font-semibold">Book Video Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-500 p-4 rounded-lg mb-3 w-full items-center">
          <Text className="text-white font-semibold">Book Voice Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-purple-500 p-4 rounded-lg w-full items-center">
          <Text className="text-white font-semibold">Book In-Person Appointment</Text>
        </TouchableOpacity>
      </View>
    </NavLayout>
  );
}
