// src/navigation/PublicNavigator.jsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Public Screens
import WelcomeScreen from "../screens/Public/WelcomeScreen";
import AboutScreen from "../screens/Public/AboutScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import CustomDrawerContent from "./CustomDrawerContent";
import RegistrationPage from "../screens/Auth/Registeration";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import HelpSupportScreen from "../screens/Support/HelpSupportScreen";
import UserGuideScreen from "../screens/Support/UserGuideScreen";
import DeveloperPage from "../screens/Public/DeveloperPage";
import ForgotPasswordPage from "../screens/Auth/ForgotPasswordPage";

const Drawer = createDrawerNavigator();

export default function PublizcNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 300 },
        gestureEnabled: true, // Enable swipe back gesture
        gestureDirection: "horizontal",
      }}
    >
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Drawer.Screen name="UserGuide" component={UserGuideScreen} />
      <Drawer.Screen name="Setting" component={SettingsScreen} />
      <Drawer.Screen name="Developer" component={DeveloperPage} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegistrationPage} />
      <Drawer.Screen name="ForgotPassword" component={ForgotPasswordPage} />
    </Drawer.Navigator>
  );
}
