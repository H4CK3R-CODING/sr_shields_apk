// src/screens/Admin/UserManagementScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";

export default function UserManagementScreen() {
  const [search, setSearch] = useState("");

  const users = [
    { name: "Dr. Smith", email: "dr.smith@example.com", role: "Doctor" },
    { name: "John Doe", email: "john.doe@example.com", role: "Patient" },
    { name: "Admin User", email: "admin@example.com", role: "Admin" },
    { name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "Doctor" },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <NavLayout title="User Management" showAIChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* Search */}
        <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-2 mb-4 shadow">
          <TextInput
            placeholder="Search users..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 flex-1 text-gray-900 dark:text-white"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView>
          {filteredUsers.map((user, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <View>
                <Text className="text-gray-900 dark:text-white font-semibold">{user.name}</Text>
                <Text className="text-gray-500 dark:text-gray-300 text-sm">{user.email}</Text>
              </View>
              <Text className="text-blue-500 font-semibold">{user.role}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </NavLayout>
  );
}
