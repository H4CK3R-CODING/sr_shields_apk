// src/screens/Doctor/PatientListScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";
import DoctorCard from "@/src/components/Cards/DoctorCard";

export default function PatientListScreen() {
  const [search, setSearch] = useState("");

  const patients = [
    { name: "John Doe", specialty: "Fever", rating: 0, image: null },
    { name: "Jane Smith", specialty: "Diabetes", rating: 0, image: null },
    { name: "Alex Brown", specialty: "General Checkup", rating: 0, image: null },
    { name: "Mia Wilson", specialty: "Asthma", rating: 0, image: null },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <NavLayout title="Patients" showAIChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        {/* Search */}
        <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-2 mb-4 shadow">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search patients..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 flex-1 text-gray-900 dark:text-white"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView>
          {filteredPatients.map((patient, index) => (
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
      </View>
    </NavLayout>
  );
}
