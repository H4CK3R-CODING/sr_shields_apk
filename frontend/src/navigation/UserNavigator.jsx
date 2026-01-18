// src/navigation/UserNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";

// User Screens
import UserDashboardScreen from "../screens/User/UserDashboardScreen";
import NotificationsScreen from "../screens/User/NotificationsScreen";
import NoticesScreen from "../screens/User/NoticesScreen";
import JobsScreen from "../screens/User/JobsScreen";
import FormsScreen from "../screens/User/FormsScreen";
// import NoticeDetailScreen from "../screens/User/NoticeDetailScreen";
// import JobDetailScreen from "../screens/User/JobDetailScreen";
// import FormDetailScreen from "../screens/User/FormDetailScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import HelpSupportScreen from "../screens/Support/HelpSupportScreen";
import JobsFormsScreen from "../screens/User/JobsFormsScreen";
import AboutScreen from "../screens/Public/AboutScreen";
import DeveloperPage from "../screens/Public/DeveloperPage";
import UserGuideScreen from "../screens/Support/UserGuideScreen";

const Drawer = createDrawerNavigator();

export default function UserNavigator({ role }) {
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
        name="UserDashboard" 
        component={UserDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Drawer.Screen 
        name="Notices" 
        component={NoticesScreen}
        options={{ title: "Notices" }}
      />
      <Drawer.Screen 
        name="JobsFormsScreen" 
        component={JobsFormsScreen}
        options={{ title: "Jobs & Forms" }}
      />
      <Drawer.Screen name="Developer" component={DeveloperPage} />
      {/* <Drawer.Screen 
        name="Forms" 
        component={FormsScreen}
        options={{ title: "Forms" }}
      /> */}
      {/* <Drawer.Screen 
        name="NoticeDetail" 
        component={NoticeDetailScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      /> */}
      {/* <Drawer.Screen 
        name="JobDetail" 
        component={JobDetailScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      /> */}
      {/* <Drawer.Screen 
        name="FormDetail" 
        component={FormDetailScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      /> */}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Drawer.Screen name="UserGuide" component={UserGuideScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}