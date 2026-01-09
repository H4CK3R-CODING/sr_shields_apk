import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "../theme/ThemeProvider";

export default function ThemeToggle() {
  const context = useContext(ThemeContext);

  if (!context) return null;

  const { theme, toggleTheme, isLoading } = context;

  if (isLoading) return null;

  return (
    <TouchableOpacity onPress={toggleTheme} className="p-2">
      {theme === "dark" ? (
        <Feather name="sun" size={24} color="yellow" />
      ) : (
        <Feather name="moon" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
}
