// src/navigation/PatientNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import HomeStack from "./StackNavigator";

// Consultation Screens
import VideoConsultationScreen from "../screens/Consultation/VideoConsultationScreen";
import VoiceConsultationScreen from "../screens/Consultation/VoiceConsultationScreen";
import ChatConsultationScreen from "../screens/Consultation/ChatConsultationScreen";
import AIHealthAssistantScreen from "../screens/Consultation/AIHealthAssistantScreen";

// Appointment Screens
import AppointmentListScreen from "../screens/Appointments/AppointmentListScreen";
import BookAppointmentScreen from "../screens/Appointments/BookAppointmentScreen";
import AppointmentHistoryScreen from "../screens/Appointments/AppointmentHistoryScreen";

// Health Records
import MedicalRecordsScreen from "../screens/HealthRecords/MedicalRecordsScreen";
import PrescriptionsScreen from "../screens/HealthRecords/PrescriptionsScreen";
import HealthMetricsScreen from "../screens/HealthRecords/HealthMetricsScreen";

// Other Screens
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ScheduleScreen from "../screens/Schedule/ScheduleScreen";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import HelpSupportScreen from "../screens/Support/HelpSupportScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import AvailableDoctorsScreen from "../screens/Patient/AvailableDoctorsScreen";
import MedicineCatalogScreen from "../screens/Patient/MedicineCatalogScreen";

const Drawer = createDrawerNavigator();

export default function PatientNavigator({ role }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 300 },
        gestureEnabled: true, // Enable swipe back gesture
        gestureDirection: "horizontal",
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AvailableDoctors"
        component={AvailableDoctorsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AvailableMedicine"
        component={MedicineCatalogScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="VideoConsultation"
        component={VideoConsultationScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="VoiceConsultation"
        component={VoiceConsultationScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="ChatConsultation"
        component={ChatConsultationScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AIHealthAssistant"
        component={AIHealthAssistantScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Appointments"
        component={AppointmentListScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="MedicalRecords"
        component={MedicalRecordsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Prescriptions"
        component={PrescriptionsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="HealthMetrics"
        component={HealthMetricsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
}
