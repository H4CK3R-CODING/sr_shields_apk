// src/navigation/AdminNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";

// Admin Screens
import AdminDashboardScreen from "../screens/Admin/AdminDashboardScreen";
import ManageNotificationsScreen from "../screens/Admin/ManageNotificationsScreen";
// import ManageNoticesScreen from "../screens/Admin/ManageNoticesScreen";
import ManageJobsScreen from "../screens/Admin/ManageJobsScreen";
import ManageFormsScreen from "../screens/Admin/ManageFormsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import HelpSupportScreen from "../screens/Support/HelpSupportScreen";
import ManageUsersScreen from "../screens/Admin/ManageUsersScreen";
import ManageNoticesScreen from "../screens/Admin/ManageNoticesScreen";
import ManageJobsFormsScreen from "../screens/Admin/ManageJobsFormsScreen";

const Drawer = createDrawerNavigator();

export default function AdminNavigator({ role }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 300 },
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Drawer.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen 
        name="ManageNotifications" 
        component={ManageNotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Drawer.Screen 
        name="ManageNotices" 
        component={ManageNoticesScreen}
        options={{ title: "Notices" }}
      />
      <Drawer.Screen 
        name="ManageJobsForms" 
        component={ManageJobsFormsScreen}
        options={{ title: "Manage Jobs & Forms" }}
      />
      <Drawer.Screen 
        name="ManageUsersScreen" 
        component={ManageUsersScreen}
        options={{ title: "Users" }}
      />
      {/* <Drawer.Screen 
        name="ManageForms" 
        component={ManageFormsScreen}
        options={{ title: "Forms" }}
      /> */}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpSupportScreen} />
    </Drawer.Navigator>
  );
}