import AppointmentCard from "@/src/components/Cards/AppointmentCard";
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { ScrollView } from "react-native";

export default function AppointmentHistoryScreen() {
  const history = [
    { patient: "John Doe", date: "2025-08-10", type: "Video" },
    { patient: "Jane Smith", date: "2025-08-05", type: "Voice" },
  ];

  return (
    <NavLayout title="Appointment History" showAiChat={false}>
      <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        {history.map((item, index) => (
          <AppointmentCard
            key={index}
            patient={item.patient}
            date={item.date}
            type={item.type}
            onPress={() => console.log("View history details for", item.patient)}
          />
        ))}
      </ScrollView>
    </NavLayout>
  );
}
