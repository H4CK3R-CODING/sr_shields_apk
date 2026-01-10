// src/screens/Settings/SettingsScreen.jsx
import React, { useState } from "react";
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

export default function SettingsScreen({ navigation }) {
  const { user, role } = useAuthStore();
  const { clearAllData } = useContentStore();

  // Settings State
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    notificationSound: true,
    vibration: true,
    
    // Appearance
    darkMode: false,
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
  const [aboutModal, setAboutModal] = useState(false);

  // Toggle setting
  const toggleSetting = async (key) => {
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

  // Change font size
  const changeFontSize = (size) => {
    setSettings({ ...settings, fontSize: size });
    AsyncStorage.setItem("appSettings", JSON.stringify({ ...settings, fontSize: size }));
  };

  // Clear cache
  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data and free up storage. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear cached data
              await AsyncStorage.removeItem("cachedNotices");
              await AsyncStorage.removeItem("cachedJobs");
              
              setSettings({ ...settings, cacheSize: "0 MB" });
              Alert.alert("Success", "Cache cleared successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache");
            }
          },
        },
      ]
    );
  };

  // Clear all data
  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "⚠️ This will delete ALL your data including notices, jobs, and forms. This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data cleared successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }

    try {
      // In production: Send to backend API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFeedbackModal(false);
      setFeedbackText("");
      Alert.alert("Thank You!", "Your feedback has been submitted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback");
    }
  };

  // Contact support
  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Choose a method to contact us",
      [
        {
          text: "Email",
          onPress: () => Linking.openURL("mailto:support@csc.edu"),
        },
        {
          text: "Phone",
          onPress: () => Linking.openURL("tel:+1234567890"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
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
        {
          label: "Notification Sound",
          key: "notificationSound",
          type: "toggle",
          icon: "volume-high-outline",
          description: "Play sound for notifications",
        },
        {
          label: "Vibration",
          key: "vibration",
          type: "toggle",
          icon: "phone-portrait-outline",
          description: "Vibrate on notifications",
        },
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
        {
          label: "Font Size",
          key: "fontSize",
          type: "select",
          icon: "text-outline",
          description: "Adjust text size",
        },
        {
          label: "Language",
          key: "language",
          type: "navigation",
          icon: "language-outline",
          description: "English",
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "shield-checkmark",
      items: [
        {
          label: "Show Online Status",
          key: "showOnlineStatus",
          type: "toggle",
          icon: "radio-button-on-outline",
          description: "Let others see when you're online",
        },
        {
          label: "Read Receipts",
          key: "readReceipts",
          type: "toggle",
          icon: "checkmark-done-outline",
          description: "Send read receipts",
        },
        {
          label: "Change Password",
          key: "changePassword",
          type: "navigation",
          icon: "lock-closed-outline",
          description: "Update your password",
          onPress: () => navigation.navigate("Profile"),
        },
      ],
    },
    {
      title: "Data & Storage",
      icon: "server",
      items: [
        {
          label: "Auto Download",
          key: "autoDownload",
          type: "toggle",
          icon: "download-outline",
          description: "Auto download attachments",
        },
        {
          label: "Download Over WiFi Only",
          key: "downloadOverWifi",
          type: "toggle",
          icon: "wifi-outline",
          description: "Save mobile data",
        },
        {
          label: "Cache Size",
          key: "cacheSize",
          type: "info",
          icon: "albums-outline",
          description: settings.cacheSize,
          onPress: handleClearCache,
        },
        {
          label: "Clear All Data",
          key: "clearData",
          type: "danger",
          icon: "trash-outline",
          description: "Delete all app data",
          onPress: handleClearAllData,
        },
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
          onPress: () => navigation.navigate("Help"),
        },
        {
          label: "Send Feedback",
          key: "feedback",
          type: "navigation",
          icon: "chatbubble-outline",
          description: "Share your thoughts",
          onPress: () => setFeedbackModal(true),
        },
        {
          label: "Contact Support",
          key: "contact",
          type: "navigation",
          icon: "mail-outline",
          description: "Email or call us",
          onPress: handleContactSupport,
        },
        {
          label: "Rate App",
          key: "rate",
          type: "navigation",
          icon: "star-outline",
          description: "Rate us on app store",
          onPress: () => Alert.alert("Rate App", "Thank you for your support!"),
        },
        {
          label: "About CSC",
          key: "about",
          type: "navigation",
          icon: "information-circle-outline",
          description: "Version 1.0.0",
          onPress: () => setAboutModal(true),
        },
      ],
    },
  ];

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
                onValueChange={() => toggleSetting(item.key)}
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
        <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 shadow-lg">
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
        </View>

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

      {/* Feedback Modal */}
      <Modal
        visible={feedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Send Feedback
              </Text>
              <TouchableOpacity onPress={() => setFeedbackModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              We'd love to hear your thoughts on how we can improve!
            </Text>

            <TextInput
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Enter your feedback here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-800 dark:text-white mb-4"
              style={{ textAlignVertical: "top" }}
            />

            <TouchableOpacity
              onPress={handleSubmitFeedback}
              className="bg-blue-500 rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={aboutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setAboutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-6">
              <View className="bg-blue-500 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="school" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                CSC Portal
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">Version 1.0.0</Text>
            </View>

            <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
              <Text className="text-gray-700 dark:text-gray-300 text-center leading-6">
                Your comprehensive platform for managing notices, jobs, forms, and
                staying connected with your organization.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm text-center">
                © 2026 CSC. All rights reserved.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setAboutModal(false)}
              className="bg-blue-500 rounded-xl py-3 items-center"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}