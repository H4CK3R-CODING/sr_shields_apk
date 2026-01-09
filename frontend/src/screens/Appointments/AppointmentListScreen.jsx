import AppointmentCard from "@/src/components/Cards/AppointmentCard";
import NavLayout from "@/src/components/Navbar/NavLayout";
import React from "react";
import { ScrollView } from "react-native";

export default function AppointmentListScreen() {
  const appointments = [
    { patient: "John Doe", date: "2025-09-20", type: "Video" },
    { patient: "Jane Smith", date: "2025-09-18", type: "Voice" },
    { patient: "Alex Brown", date: "2025-09-15", type: "In-Person" },
  ];

  return (
    <NavLayout title="Appointments" showAiChat={false}>
      <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        {appointments.map((a, index) => (
          <AppointmentCard
            key={index}
            patient={a.patient}
            date={a.date}
            type={a.type}
            onPress={() => console.log("Go to details for", a.patient)}
          />
        ))}
      </ScrollView>
    </NavLayout>
  );
}
