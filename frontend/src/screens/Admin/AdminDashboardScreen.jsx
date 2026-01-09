// src/screens/Admin/AdminDashboardScreen.jsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";

export default function AdminDashboardScreen() {
  const stats = [
    { label: "Total Users", value: 120, icon: "people-outline", bg: "bg-blue-500" },
    { label: "Doctors", value: 25, icon: "medkit-outline", bg: "bg-green-500" },
    { label: "Appointments Today", value: 18, icon: "calendar-outline", bg: "bg-purple-500" },
    { label: "Pending Reports", value: 7, icon: "document-text-outline", bg: "bg-yellow-500" },
  ];

  return (
    <NavLayout title="Admin Dashboard" showAIChat={false}>
      <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        <View className="flex-row flex-wrap justify-between mb-6">
          {stats.map((stat, index) => (
            <View
              key={index}
              className={`w-[48%] mb-4 p-4 rounded-lg ${stat.bg} shadow`}
            >
              <Ionicons name={stat.icon} size={28} color="white" />
              <Text className="text-white font-bold text-xl mt-2">{stat.value}</Text>
              <Text className="text-white text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={() => console.log("Navigate to User Management")}
        >
          <Text className="text-white font-semibold text-lg">Manage Users</Text>
        </TouchableOpacity>
      </ScrollView>
    </NavLayout>
  );
}
