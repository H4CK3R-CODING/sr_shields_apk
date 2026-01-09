// src/navigation/MedicalStaffNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";

// Medical Staff Screens
import RecordsScreen from "../screens/HealthRecords/RecordsScreen";
import AppointmentListScreen from "../screens/Appointments/AppointmentListScreen";

const Drawer = createDrawerNavigator();

export default function MedicalStaffNavigator({ role }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 300 } }}
    >
      <Drawer.Screen name="Records" component={RecordsScreen} />
      <Drawer.Screen name="Appointments" component={AppointmentListScreen} />
    </Drawer.Navigator>
  );
}
