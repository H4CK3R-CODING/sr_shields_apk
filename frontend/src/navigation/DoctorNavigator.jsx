// src/navigation/DoctorNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";

// Doctor Screens
import DoctorDashboardScreen from "../screens/Doctor/DoctorDashboardScreen";
import PatientListScreen from "../screens/Doctor/PatientListScreen";

const Drawer = createDrawerNavigator();

export default function DoctorNavigator({ role }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 300 } }}
    >
      <Drawer.Screen name="Dashboard" component={DoctorDashboardScreen} />
      <Drawer.Screen name="Patients" component={PatientListScreen} />
    </Drawer.Navigator>
  );
}
