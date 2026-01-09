// src/screens/Doctor/DoctorDashboardScreen.jsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DoctorCard from "@/src/components/Cards/DoctorCard";
import NavLayout from "@/src/components/Navbar/NavLayout";

export default function DoctorDashboardScreen() {
  // Dummy stats
  const stats = [
    { label: "Today's Appointments", value: 8, icon: "calendar-outline", bg: "bg-blue-500" },
    { label: "Pending Reports", value: 3, icon: "document-text-outline", bg: "bg-green-500" },
    { label: "New Patients", value: 2, icon: "person-add-outline", bg: "bg-purple-500" },
  ];

  const upcomingPatients = [
    { name: "John Doe", specialty: "Fever", rating: 0, image: null },
    { name: "Jane Smith", specialty: "Diabetes", rating: 0, image: null },
    { name: "Alex Brown", specialty: "General Checkup", rating: 0, image: null },
  ];

  return (
    <NavLayout title="Dashboard" showAIChat={false}>
      <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          {stats.map((stat, index) => (
            <View
              key={index}
              className={`flex-1 m-1 p-4 rounded-lg ${stat.bg} shadow-md`}
            >
              <Ionicons name={stat.icon} size={24} color="white" />
              <Text className="text-white font-bold text-lg mt-2">{stat.value}</Text>
              <Text className="text-white text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Patients */}
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Upcoming Patients
        </Text>
        {upcomingPatients.map((patient, index) => (
          <DoctorCard
            key={index}
            name={patient.name}
            specialty={patient.specialty}
            rating={patient.rating}
            image={patient.image}
            onPress={() => console.log("View patient details")}
          />
        ))}
      </ScrollView>
    </NavLayout>
  );
}
