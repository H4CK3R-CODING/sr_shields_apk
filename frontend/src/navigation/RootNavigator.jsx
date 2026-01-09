// src/navigation/RootNavigator.jsx
import React from "react";
import useAuthStore from "../state/authStore";
import PublicNavigator from "./PublicNavigator"; // Screens without login
import RoleNavigator from "./RoleNavigator"; // Screens with login

export default function RootNavigator() {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <RoleNavigator /> : <PublicNavigator />;
}
