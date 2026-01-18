// src/screens/Settings/SettingsScreen.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../../state/authStore";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";
import * as Notifications from "expo-notifications";
import { api } from "../../services/api";
import { Platform } from "react-native";
import { ThemeContext } from "@/src/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen({ navigation }) {
  const { user, role } = useAuthStore();
  const { clearAllData } = useContentStore();
  const context = useContext(ThemeContext);

  if (!context) return null;

  const { theme, toggleTheme, isLoading } = context;

  if (isLoading) return null;

  // Settings State
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: false,
    emailNotifications: true,
    notificationSound: true,
    vibration: true,

    // Appearance
    darkMode: theme === "dark",
    fontSize: "medium", // small, medium, large
    language: "en", // en, hi, etc.

    // Privacy
    showOnlineStatus: true,
    readReceipts: true,

    // Data & Storage
    autoDownload: true,
    downloadOverWifi: true,
    cacheSize: "150 MB",
  });

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  // Toggle setting
  const toggleSetting = async (key) => {
    if (key === "pushNotifications") return;

    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    // Save to AsyncStorage
    await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));

    // Show feedback for certain settings
    if (key === "darkMode") {
      Alert.alert(
        "Dark Mode",
        `Dark mode ${!settings[key] ? "enabled" : "disabled"}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleDarkModeToggle = async (value) => {
    try {
      // 1️⃣ Toggle global theme
      toggleTheme();

      // 2️⃣ Update local settings state
      const newSettings = { ...settings, darkMode: value };
      setSettings(newSettings);

      // 3️⃣ Persist setting
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));

      // Optional UX feedback
      Alert.alert(
        "Appearance Updated",
        `Dark mode ${value ? "enabled" : "disabled"}`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update theme");
    }
  };

  useEffect(() => {
    syncNotificationSettings();
  }, []);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      darkMode: theme === "dark",
    }));
  }, [theme]);

  const syncNotificationSettings = async () => {
    try {
      // 1️⃣ Check OS permission
      const permission = await Notifications.getPermissionsAsync();
      const osEnabled = permission.status === "granted";

      // 2️⃣ Fetch backend preference
      const { data } = await api.get("/user/profile");
      // profile should return notificationEnabled

      setSettings((prev) => ({
        ...prev,
        pushNotifications:
          osEnabled && data.user.notificationPreferences.push.enabled,
        emailNotifications: data.user.notificationPreferences.email.enabled,
      }));
    } catch (error) {
      console.log("Failed to sync notification settings");
    }
  };

  // Settings sections
  const settingsSections = [
    {
      title: "Notifications",
      icon: "notifications",
      items: [
        {
          label: "Push Notifications",
          key: "pushNotifications",
          type: "toggle",
          icon: "notifications-outline",
          description: "Receive push notifications for updates",
        },
        {
          label: "Email Notifications",
          key: "emailNotifications",
          type: "toggle",
          icon: "mail-outline",
          description: "Get notified via email",
        },
        // {
        //   label: "Notification Sound",
        //   key: "notificationSound",
        //   type: "toggle",
        //   icon: "volume-high-outline",
        //   description: "Play sound for notifications",
        // },
        // {
        //   label: "Vibration",
        //   key: "vibration",
        //   type: "toggle",
        //   icon: "phone-portrait-outline",
        //   description: "Vibrate on notifications",
        // },
      ],
    },
    {
      title: "Appearance",
      icon: "color-palette",
      items: [
        {
          label: "Dark Mode",
          key: "darkMode",
          type: "toggle",
          icon: "moon-outline",
          description: "Use dark theme",
        },
        // {
        //   label: "Font Size",
        //   key: "fontSize",
        //   type: "select",
        //   icon: "text-outline",
        //   description: "Adjust text size",
        // },
        // {
        //   label: "Language",
        //   key: "language",
        //   type: "navigation",
        //   icon: "language-outline",
        //   description: "English",
        // },
      ],
    },
    {
      title: "Support & About",
      icon: "help-circle",
      items: [
        {
          label: "Help Center",
          key: "help",
          type: "navigation",
          icon: "help-buoy-outline",
          description: "Get help and support",
          onPress: () => navigation.navigate("HelpSupport"),
        },
        {
          label: "Send Feedback",
          key: "feedback",
          type: "navigation",
          icon: "chatbubble-outline",
          description: "Share your thoughts",
          onPress: () =>
            navigation.navigate("HelpSupport", { initialTab: "query" }),
        },
        {
          label: "Contact Support",
          key: "contact",
          type: "navigation",
          icon: "mail-outline",
          description: "Email or call us",
          onPress: () =>
            navigation.navigate("HelpSupport", { initialTab: "contact" }),
        },
        {
          label: "About CSC",
          key: "about",
          type: "navigation",
          icon: "information-circle-outline",
          description: "Version 1.0.0",
          onPress: () => navigation.navigate("About"),
        },
      ],
    },
  ];

  const handleEmailNotificationToggle = async (value) => {
    try {
      // Update backend preference
      await api.post("/user/notification-preference", {
        email: value,
      });

      // Update UI
      setSettings((prev) => ({
        ...prev,
        emailNotifications: value,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to update email notification setting");
    }
  };

  const handlePushNotificationToggle = async (value) => {
    try {
      // User wants to ENABLE notifications
      if (value) {
        const permission = await Notifications.getPermissionsAsync();

        if (permission.status !== "granted") {
          Alert.alert(
            "Enable Notifications",
            "Please enable notifications from device settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return;
        }
      }

      // Update backend preference
      await api.post("/user/notification-preference", {
        push: value,
      });

      // Update local UI state
      setSettings((prev) => ({
        ...prev,
        pushNotifications: value,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to update notification setting");
    }
  };

  // Render setting item
  const renderSettingItem = (item) => {
    switch (item.type) {
      case "toggle":
        return (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name={item.icon} size={20} color="#3B82F6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {item.label}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={(value) => {
                  if (item.key === "pushNotifications") {
                    handlePushNotificationToggle(value);
                  } else if (item.key === "darkMode") {
                    handleDarkModeToggle(value);
                  } else if (item.key === "emailNotifications") {
                    handleEmailNotificationToggle(value);
                  } else {
                    toggleSetting(item.key);
                  }
                }}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={settings[item.key] ? "#3B82F6" : "#F3F4F6"}
              />
            </View>
          </View>
        );

      case "select":
        if (item.key === "fontSize") {
          return (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name={item.icon} size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {item.label}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                    {item.description}
                  </Text>
                </View>
              </View>
              <View className="flex-row">
                {["small", "medium", "large"].map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => changeFontSize(size)}
                    className={`flex-1 mr-2 py-2 rounded-lg ${
                      settings.fontSize === size
                        ? "bg-blue-500"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold capitalize ${
                        settings.fontSize === size
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }
        break;

      case "info":
        return (
          <TouchableOpacity
            onPress={item.onPress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-orange-100 dark:bg-orange-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name={item.icon} size={20} color="#F59E0B" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {item.label}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                    {item.description}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={item.onPress}
                className="bg-orange-500 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-white text-xs font-semibold">Clear</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );

      case "danger":
        return (
          <TouchableOpacity
            onPress={item.onPress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name={item.icon} size={20} color="#EF4444" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-red-600 dark:text-red-400 font-semibold">
                    {item.label}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </View>
          </TouchableOpacity>
        );

      case "navigation":
      default:
        return (
          <TouchableOpacity
            onPress={item.onPress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name={item.icon} size={20} color="#10B981" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {item.label}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Settings" showBack showMenu />

      <ScrollView className="flex-1 px-4 py-4">
        {/* User Info Card */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16 }}
          className="  p-6 mb-6 shadow-lg"
        >
          <View className="flex-row items-center">
            <View className="bg-white w-16 h-16 rounded-full items-center justify-center">
              <Ionicons name="person" size={32} color="#3B82F6" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white text-xl font-bold">
                {user?.fullName || "User Name"}
              </Text>
              <Text className="text-white/80 text-sm capitalize">
                {role === "admin" ? "Administrator" : "User"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <View className="flex-row items-center mb-3 px-2">
              <Ionicons name={section.icon} size={20} color="#6B7280" />
              <Text className="text-gray-700 dark:text-gray-300 font-bold text-base ml-2">
                {section.title}
              </Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>{renderSettingItem(item)}</View>
            ))}
          </View>
        ))}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
