import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../state/authStore";

const CustomDrawerContent = ({ navigation, role }) => {
  const { isLoggedIn, user, login, logout } = useAuthStore();

  // ---------- Drawer Item ----------
  const DrawerItem = ({
    iconName,
    label,
    onPress,
    badge,
    badgeColor = "bg-blue-500",
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-6 border-b border-gray-100 dark:border-gray-700"
      onPress={onPress}
    >
      <Ionicons name={iconName} size={24} color="#6B7280" />
      <Text className="ml-4 flex-1 text-gray-800 dark:text-gray-100 text-base font-medium">
        {label}
      </Text>
      {badge && (
        <View className={`${badgeColor} px-2 py-1 rounded-full`}>
          <Text className="text-white text-xs font-semibold">{badge}</Text>
        </View>
      )}
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#9CA3AF"
        className="ml-2"
      />
    </TouchableOpacity>
  );

  // ---------- Section Header ----------
  const SectionHeader = ({ title }) => (
    <Text className="text-gray-500 dark:text-gray-400 text-sm font-semibold px-6 py-3 mt-4 uppercase tracking-wide">
      {title}
    </Text>
  );

  // ---------- Drawer Items by Role ----------
  const handleLogout = () => {
    console.log("logout");
    logout(); // Update Zustand state
  };

  const drawerItemsByRole = {
    user: [
      {
        section: "GENERAL",
        items: [
          {
            iconName: "home-outline",
            label: "Dashboard",
            screen: "UserDashboard",
          },
          {
            iconName: "notifications-outline",
            label: "Notifications",
            screen: "Notifications",
          },
        ],
      },
      {
        section: "CSC UPDATES",
        items: [
          {
            iconName: "document-text-outline",
            label: "Notices (PDF)",
            screen: "Notices",
          },
          {
            iconName: "briefcase-outline",
            label: "Jobs & Forms",
            screen: "JobsFormsScreen",
          },
        ],
      },
      {
        section: "SUPPORT",
        items: [
          {
            iconName: "help-circle-outline",
            label: "Help & Support",
            screen: "HelpSupport",
          },
          {
            iconName: "person-outline",
            label: "Profile",
            screen: "Profile",
          },
          {
            iconName: "settings-outline",
            label: "Settings",
            screen: "Settings",
          },
          {
            iconName: "log-out-outline",
            label: "Logout",
            action: () => handleLogout(),
          },
        ],
      },
    ],
    admin: [
      {
        section: "MAIN",
        items: [
          { iconName: "home-outline", label: "Dashboard", screen: "Dashboard" },
          {
            iconName: "notifications-outline",
            label: "Manage Notifications",
            screen: "ManageNotifications",
          },
          {
            iconName: "document-text-outline",
            label: "Manage Notices",
            screen: "ManageNotices",
          },
          {
            iconName: "briefcase-outline",
            label: "Manage Jobs / Forms",
            screen: "ManageJobsForms",
          },
          { iconName: "people-outline", label: "Users", screen: "ManageUsersScreen" },
        ],
      },
      {
        section: "SUPPORT",
        items: [
          {
            iconName: "settings-outline",
            label: "Settings",
            screen: "Settings",
          },
          {
            iconName: "log-out-outline",
            label: "Logout",
            action: () => handleLogout(),
          },
        ],
      },
    ],
  };

  // ---------- Public Drawer Items ----------
  const publicDrawerItems = [
    { iconName: "home-outline", label: "Home", screen: "Welcome" },
    { iconName: "information-circle-outline", label: "About", screen: "About" },
    { iconName: "cog", label: "Setting", screen: "Setting" },
    { iconName: "headset", label: "Help", screen: "Help" },
    { iconName: "log-in-outline", label: "Login", screen: "Login" },
    { iconName: "person-add-outline", label: "Register", screen: "Register" },
  ];

  const sections = isLoggedIn
    ? drawerItemsByRole[role] || [] // existing logged-in logic
    : [{ section: "MENU", items: publicDrawerItems }]; // for not logged-in users

  // ---------- Quick Action ----------
  const QuickAction = ({ icon, label, onPress, colorStart, colorEnd }) => (
    <TouchableOpacity className="items-center flex-1" onPress={onPress}>
      <View
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorStart} ${colorEnd} items-center justify-center mb-2 shadow-md bg-black`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text className="text-xs text-gray-700 dark:text-gray-200 text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );

  // ---------- Profile Info ----------
  const profileData = {
    user: { name: "John Doe", email: "john.doe@email.com" },
    admin: { name: "Admin User", email: "admin@system.com" },
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 pt-12 pb-6 px-6 border-b border-gray-200 dark:border-gray-700 relative">
        <TouchableOpacity
          className="absolute top-4 right-4"
          onPress={() => navigation.closeDrawer()}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>


        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {isLoggedIn
            ? profileData[role]?.name || role.toUpperCase()
            : "Welcome!"}
        </Text>
        <Text className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {isLoggedIn
            ? profileData[role]?.email || `Logged in as ${role}`
            : "Please login or register to continue"}
        </Text>


        <View className="flex-row justify-around">
          {role === "user" && (
            <>
              <QuickAction
                icon="person-outline"
                label="Profile"
                onPress={() => navigation.navigate("Profile")}
                colorStart="from-blue-500"
                colorEnd="to-blue-600"
              />
              <QuickAction
                icon="calendar-outline"
                label="Appointments"
                onPress={() => navigation.navigate("Appointments")}
                colorStart="from-green-500"
                colorEnd="to-green-600"
              />
              <QuickAction
                icon="fitness-outline"
                label="Health Metrics"
                onPress={() => navigation.navigate("HealthMetrics")}
                colorStart="from-purple-500"
                colorEnd="to-purple-600"
              />
            </>
          )}
        </View>
      </View>

      {/* Drawer List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false} // hide scroll bar
      >
        {sections.map((section) => (
          <View key={section.section}>
            <SectionHeader title={section.section} />
            {section.items.map((item, idx) => (
              <DrawerItem
                key={idx}
                iconName={item.iconName}
                label={item.label}
                badge={item.badge}
                badgeColor={item.badgeColor}
                onPress={() => {
                  if (item.action) item.action();
                  else navigation.navigate(item.screen);
                }}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomDrawerContent;
