import React, { createContext, useState, useEffect } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load stored theme or system default
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
          setTheme(stored);
          setColorScheme(stored);
        } else {
          const system = colorScheme || "light";
          setTheme(system);
          setColorScheme(system);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
        setTheme("light");
        setColorScheme("light");
      } finally {
        setIsLoading(false); // Set loading to false after theme is loaded
      }
    })();
  }, [setColorScheme, colorScheme]);

  // Toggle theme
  const toggleTheme = async () => {
    try {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      setColorScheme(newTheme);
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  // Always provide a value, even during loading
  const contextValue = {
    theme,
    toggleTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      {children}
    </ThemeContext.Provider>
  );
}