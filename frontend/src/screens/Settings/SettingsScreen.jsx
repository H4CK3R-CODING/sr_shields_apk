// src/screens/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";
// import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  // const { toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoReorder, setAutoReorder] = useState(true);
  const [location, setLocation] = useState(true);
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const handleThemeToggle = () => {
  //   setIsDarkMode(!isDarkMode);
  //   toggleTheme();
  // };

  const settingsData = [
    {
      title: "Account",
      data: [
        {
          id: "profile",
          title: "Profile Information",
          subtitle: "Update your personal details",
          icon: "person-outline",
          onPress: () => navigation.navigate("Profile"),
          showArrow: true,
        },
        {
          id: "addresses",
          title: "Saved Addresses",
          subtitle: "Manage delivery addresses",
          icon: "location-outline",
          onPress: () => console.log("Manage addresses"),
          showArrow: true,
        },
        {
          id: "payment",
          title: "Payment Methods",
          subtitle: "Cards, wallets & bank accounts",
          icon: "card-outline",
          onPress: () => console.log("Payment methods"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Preferences",
      data: [
        // {
        //   id: 'theme',
        //   title: 'Dark Mode',
        //   subtitle: 'Switch between light and dark theme',
        //   icon: isDarkMode ? 'moon' : 'sunny',
        //   type: 'switch',
        //   value: isDarkMode,
        //   onToggle: handleThemeToggle
        // },
        {
          id: "notifications",
          title: "Push Notifications",
          subtitle: "Receive app notifications",
          icon: "notifications-outline",
          type: "switch",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: "orderUpdates",
          title: "Order Updates",
          subtitle: "Get notified about order status",
          icon: "receipt-outline",
          type: "switch",
          value: orderUpdates,
          onToggle: setOrderUpdates,
        },
        {
          id: "promotions",
          title: "Promotions & Offers",
          subtitle: "Receive promotional notifications",
          icon: "gift-outline",
          type: "switch",
          value: promotions,
          onToggle: setPromotions,
        },
      ],
    },
    {
      title: "Security",
      data: [
        {
          id: "biometric",
          title: "Biometric Authentication",
          subtitle: "Use fingerprint or face ID",
          icon: "finger-print",
          type: "switch",
          value: biometricAuth,
          onToggle: setBiometricAuth,
        },
        {
          id: "privacy",
          title: "Privacy Settings",
          subtitle: "Control your data sharing",
          icon: "shield-outline",
          onPress: () => console.log("Privacy settings"),
          showArrow: true,
        },
        {
          id: "changePassword",
          title: "Change Password",
          subtitle: "Update your account password",
          icon: "lock-closed-outline",
          onPress: () => console.log("Change password"),
          showArrow: true,
        },
      ],
    },
    {
      title: "App Preferences",
      data: [
        {
          id: "location",
          title: "Location Services",
          subtitle: "Find nearby pharmacies",
          icon: "location",
          type: "switch",
          value: location,
          onToggle: setLocation,
        },
        {
          id: "autoReorder",
          title: "Auto Reorder",
          subtitle: "Automatically reorder medicines",
          icon: "repeat-outline",
          type: "switch",
          value: autoReorder,
          onToggle: setAutoReorder,
        },
        {
          id: "language",
          title: "Language",
          subtitle: "English",
          icon: "language-outline",
          onPress: () => console.log("Language settings"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Support & Legal",
      data: [
        {
          id: "help",
          title: "Help Center",
          subtitle: "FAQs and support articles",
          icon: "help-circle-outline",
          onPress: () => console.log("Help center"),
          showArrow: true,
        },
        {
          id: "contact",
          title: "Contact Support",
          subtitle: "Get help from our team",
          icon: "chatbubble-outline",
          onPress: () => console.log("Contact support"),
          showArrow: true,
        },
        {
          id: "terms",
          title: "Terms & Conditions",
          subtitle: "App usage terms",
          icon: "document-text-outline",
          onPress: () => console.log("Terms & Conditions"),
          showArrow: true,
        },
        {
          id: "privacy-policy",
          title: "Privacy Policy",
          subtitle: "How we handle your data",
          icon: "shield-checkmark-outline",
          onPress: () => console.log("Privacy Policy"),
          showArrow: true,
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Handle logout logic here
          console.log("User logged out");
          // navigation.navigate('Login');
        },
      },
    ]);
  };

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
      onPress={item.onPress}
      disabled={item.type === "switch"}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full justify-center items-center mr-4 bg-gray-100 dark:bg-gray-700">
        <Ionicons name={item.icon} size={20} color="#059669" />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-gray-900 dark:text-white">
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {item.subtitle}
        </Text>
      </View>

      {item.type === "switch" ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false: "#f3f4f6",
            true: "#059669",
          }}
          thumbColor={item.value ? "#ffffff" : "#ffffff"}
        />
      ) : item.showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
      ) : null}
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} className="mb-6">
      <Text className="text-sm font-semibold mb-3 px-4 text-gray-600 dark:text-gray-400">
        {section.title.toUpperCase()}
      </Text>
      <View className="rounded-lg mx-4 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        {section.data.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <NavLayout title="Settings" showAiChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="py-4">{settingsData.map(renderSection)}</View>

          {/* App Version */}
          <View className="items-center py-4">
            <Text className="text-sm text-gray-400 dark:text-gray-500">
              MediCare v1.0.0
            </Text>
          </View>

          {/* Logout Button */}
          <View className="px-4 pb-6">
            <TouchableOpacity
              className="bg-red-600 dark:bg-red-500 py-4 rounded-lg flex-row justify-center items-center"
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </NavLayout>
  );
};

export default SettingsScreen;
