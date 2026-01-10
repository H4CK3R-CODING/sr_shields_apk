// src/navigation/RoleNavigator.jsx
import React from "react";
import AdminNavigator from "./AdminNavigator";
import UserNavigator from "./UserNavigator";
import useAuthStore from "../state/authStore";

export default function RoleNavigator() {
  const { role } = useAuthStore();

  switch (role) {
    case "admin":
      return <AdminNavigator role={role} />;
    case "user":
      return <UserNavigator role={role} />;
    default:
      return null; // should never happen if logout is handled
  }
}
