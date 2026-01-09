// src/screens/HealthRecords/RecordsScreen.jsx
import NavLayout from "@/src/components/Navbar/NavLayout";
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";

export default function RecordsScreen() {
  const [search, setSearch] = useState("");

  const records = [
    { title: "Blood Test", date: "2025-09-20", doctor: "Dr. Smith" },
    { title: "X-Ray", date: "2025-09-18", doctor: "Dr. Jane" },
    { title: "MRI Scan", date: "2025-09-15", doctor: "Dr. Alex" },
  ];

  const filteredRecords = records.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <NavLayout title="Medical Records" showAIChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* Search */}
        <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-2 mb-4 shadow">
          <TextInput
            placeholder="Search records..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 flex-1 text-gray-900 dark:text-white"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView>
          {filteredRecords.map((record, index) => (
            <TouchableOpacity
              key={index}
              className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow"
              onPress={() => console.log("View record details")}
            >
              <Text className="text-gray-900 dark:text-white font-semibold">{record.title}</Text>
              <Text className="text-gray-500 dark:text-gray-300 text-sm">
                Doctor: {record.doctor} | Date: {record.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </NavLayout>
  );
}
