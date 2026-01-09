import ColorTestingCard from "@/src/components/Cards/ColorTestingCard";
import DoctorCard from "@/src/components/Cards/DoctorCard";
import MedicineUpdateCard from "@/src/components/Cards/MedicineUpdateCard";
import QuickActionsCard from "@/src/components/Cards/QuickActionsCard";
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { ScrollView, View, Text } from "react-native";

export default function HomeScreen({ navigation }) {
  const doctors = [
    { name: "Dr. Arjun Sharma", specialty: "Cardiologist", rating: 4.9, experience: 12, consultationFee: 800, image: "https://randomuser.me/api/portraits/men/32.jpg", isOnline: true, nextAvailable: "2:30 PM" },
    { name: "Dr. Priya Mehta", specialty: "Dermatologist", rating: 4.8, experience: 8, consultationFee: 650, image: "https://randomuser.me/api/portraits/women/44.jpg", isOnline: false, nextAvailable: "Tomorrow 10 AM" },
    { name: "Dr. Rajesh Kumar", specialty: "General Physician", rating: 4.7, experience: 15, consultationFee: 500, image: "https://randomuser.me/api/portraits/men/56.jpg", isOnline: true, nextAvailable: "Available" }
  ];

  return (
    <NavLayout title="MedCare Pro" showAiChat={true}>
      <ScrollView className="flex-1 p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800" showsVerticalScrollIndicator={false}>
        
        {/* Welcome */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-xl">
          <Text className="text-white text-3xl font-bold mb-2">Welcome to MedCare Pro</Text>
          <Text className="text-blue-100 text-lg">Your health, our priority. Book appointments, consult online, and manage your medical needs.</Text>
        </View>

        {/* Sections */}
        <QuickActionsCard />
        <ColorTestingCard />
        <MedicineUpdateCard />

        {/* Doctors */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">👨‍⚕️ Featured Doctors</Text>
          {doctors.map((d, i) => <DoctorCard key={i} {...d} onPress={() => navigation.navigate("Details")} />)}
        </View>

        <View className="h-20" />
      </ScrollView>
    </NavLayout>
  );
}
