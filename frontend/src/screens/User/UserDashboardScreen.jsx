// src/screens/User/UserDashboardScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../../services/api";
import useAuthStore from "../../state/authStore";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { width } = Dimensions.get("window");

// Enhanced Stat Card Component
const StatCard = ({ label, value, icon, colors, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="w-[48%] mb-4 rounded-2xl overflow-hidden shadow-lg"
  >
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-5"
    >
      {/* Icon Badge */}
      <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center mb-3">
        <Ionicons name={icon} size={28} color="white" />
      </View>

      {/* Value */}
      <Text className="text-white font-bold text-3xl mb-1">
        {value?.toLocaleString() || 0}
      </Text>

      {/* Label */}
      <Text className="text-white/90 text-sm font-semibold mb-2">{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Quick Action Card
const QuickActionCard = ({ title, description, icon, colors, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-md"
  >
    <View className="flex-row items-center">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
      >
        <Ionicons name={icon} size={26} color="white" />
      </LinearGradient>

      <View className="flex-1">
        <Text className="text-gray-900 dark:text-white font-bold text-lg mb-1">
          {title}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

// Content Preview Card
const ContentCard = ({ item, type, onPress, showBadge }) => {
  const iconConfig = {
    notification: { icon: "notifications", color: "#3B82F6" },
    notice: { icon: "newspaper", color: "#10B981" },
    job: { icon: "briefcase", color: "#8B5CF6" },
  };

  const config = iconConfig[type];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <View
          style={{ backgroundColor: config.color + "20" }}
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        >
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-base font-bold text-gray-800 dark:text-white flex-1">
              {item.title}
            </Text>
            {showBadge && (
              <View className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                <Text className="text-red-600 dark:text-red-400 text-xs font-semibold">
                  NEW
                </Text>
              </View>
            )}
          </View>

          <Text
            className="text-gray-600 dark:text-gray-400 text-sm mb-2"
            numberOfLines={2}
          >
            {item.message || item.description || item.organization}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-1">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function UserDashboardScreen({ navigation }) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalJobs: 0,
      totalForms: 0,
      totalNotifications: 0,
      activeJobs: 0,
      activeForms: 0,
      usersThisMonth: 0,
      jobsThisMonth: 0,
    },
    recentActivities: [],
  });

  useEffect(() => {
    const initDashboard = async () => {
      await fetchDashboardData();
      setLoading(false);
    };
    initDashboard();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // Fetch dashboard stats from admin route (works for all users)
      const { data } = await api.get("/admin/dashboard/stats");

      if (data.success) {
        setDashboardData({
          stats: data.stats || {},
          recentActivities: data.recentActivities || [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status !== 401) {
        Alert.alert("Error", "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchDashboardData();
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Format date
  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stats for cards
  const dashboardStats = [
    {
      label: "Notifications",
      value: dashboardData.stats.totalNotifications,
      icon: "notifications",
      colors: ["#3B82F6", "#1D4ED8"],
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      label: "Active Jobs",
      value: dashboardData.stats.activeJobs,
      icon: "briefcase",
      colors: ["#8B5CF6", "#7C3AED"],
      onPress: () => navigation.navigate("JobsFormsScreen"),
    },
    {
      label: "Total Jobs",
      value: dashboardData.stats.totalJobs,
      icon: "briefcase-outline",
      colors: ["#10B981", "#059669"],
      onPress: () => navigation.navigate("JobsFormsScreen"),
    },
    {
      label: "Forms",
      value: dashboardData.stats.totalForms,
      icon: "document-text",
      colors: ["#F59E0B", "#D97706"],
      onPress: () => navigation.navigate("JobsFormsScreen"),
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Download Forms",
      description: "Access all available forms",
      icon: "download",
      colors: ["#F59E0B", "#D97706"],
      onPress: () => navigation.navigate("JobsFormsScreen"),
    },
    {
      title: "Browse Jobs",
      description: "Explore job opportunities",
      icon: "briefcase",
      colors: ["#8B5CF6", "#6D28D9"],
      onPress: () => navigation.navigate("JobsFormsScreen"),
    },
    {
      title: "View Notifications",
      description: "Check important updates",
      icon: "notifications",
      colors: ["#3B82F6", "#1D4ED8"],
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      title: "My Profile",
      description: "Update your information",
      icon: "person",
      colors: ["#10B981", "#059669"],
      onPress: () => navigation.navigate("Profile"),
    },
  ];

  // Recent content from activities
  const latestNotifications = dashboardData.recentActivities
    .filter((activity) => activity.icon === "notifications" || activity.icon === "person-add")
    .slice(0, 3)
    .map((activity, index) => ({
      _id: `activity-${index}`,
      title: activity.title,
      message: activity.description,
      priority: "normal",
      read: false,
      createdAt: new Date(),
    }));

  const featuredJobs = dashboardData.recentActivities
    .filter((activity) => activity.icon === "briefcase")
    .slice(0, 3)
    .map((activity, index) => {
      const parts = activity.description.split(" at ");
      return {
        _id: `job-${index}`,
        title: parts[0] || activity.description,
        organization: parts[1] || "Organization",
        status: "active",
        createdAt: new Date(),
      };
    });

  // Activity stats
  const readNotifications = 0;
  const urgentNotifications = 0;

  if (loading) {
    return (
      <NavLayout title="Dashboard" showAIChat={false}>
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-base">
            Loading dashboard...
          </Text>
        </View>
      </NavLayout>
    );
  }

  return (
    <NavLayout title="CSC Portal" showAIChat={false}>
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
          />
        }
      >
        {/* Welcome Header */}
        <View className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 pt-8 pb-10 rounded-b-3xl shadow-lg">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-white/80 text-sm font-semibold">
                {getGreeting()},
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {user?.fullName || user?.name || "User"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center"
            >
              <Ionicons name="person" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/90 text-sm mt-2">{formatDate()}</Text>
        </View>

        {/* Urgent Alert Banner */}
        {urgentNotifications > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            className="mx-4 -mt-4 mb-4"
          >
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-4 shadow-lg"
            >
              <View className="flex-row items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="alert-circle" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">
                    {urgentNotifications} Urgent Notification
                    {urgentNotifications > 1 ? "s" : ""}
                  </Text>
                  <Text className="text-white/90 text-sm">
                    Requires your attention
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Stats Grid */}
        <View className="px-4 mt-2">
          <View className="flex-row flex-wrap justify-between">
            {dashboardStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View className="px-4 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 dark:text-white font-bold text-xl">
              Quick Actions
            </Text>
            <Ionicons name="apps" size={24} color="#9CA3AF" />
          </View>

          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>

        {/* Latest Unread Notifications */}
        {latestNotifications.length > 0 && (
          <View className="px-4 mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 dark:text-white font-bold text-xl">
                Unread Notifications
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Notifications")}
              >
                <Text className="text-blue-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {latestNotifications.map((notification) => (
              <ContentCard
                key={notification._id}
                item={notification}
                type="notification"
                onPress={() => navigation.navigate("Notifications")}
                showBadge={false}
              />
            ))}
          </View>
        )}

        {/* Featured Jobs Section */}
        {featuredJobs.length > 0 && (
          <View className="px-4 mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 dark:text-white font-bold text-xl">
                Latest Job Openings
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Jobs")}>
                <Text className="text-blue-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {featuredJobs.map((job) => (
              <ContentCard
                key={job._id}
                item={job}
                type="job"
                onPress={() => navigation.navigate("JobDetail", { job })}
                showBadge={dashboardData.stats.jobsThisMonth > 0}
              />
            ))}
          </View>
        )}

        {/* Activity Status Card */}
        <View className="px-4 mt-6 mb-6">
          <View className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">
                Your Activity
              </Text>
              <View className="bg-white/20 px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-bold">ACTIVE</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Read</Text>
                <Text className="text-white font-bold">
                  {readNotifications}
                </Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="notifications" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Total</Text>
                <Text className="text-white font-bold">
                  {dashboardData.stats.totalNotifications}
                </Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="briefcase" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Jobs</Text>
                <Text className="text-white font-bold">
                  {dashboardData.stats.totalJobs}
                </Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="document" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Forms</Text>
                <Text className="text-white font-bold">
                  {dashboardData.stats.totalForms}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Empty State */}
        {dashboardData.stats.totalNotifications === 0 &&
          dashboardData.stats.totalJobs === 0 &&
          dashboardData.stats.totalForms === 0 && (
            <View className="px-4 mb-8">
              <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center shadow-sm">
                <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
                  <Ionicons
                    name="folder-open-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                </View>
                <Text className="text-gray-800 dark:text-white font-bold text-lg mb-2">
                  No Content Yet
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                  Check back later for notifications, jobs, and forms
                </Text>
              </View>
            </View>
          )}

        <View className="h-6" />
      </ScrollView>
    </NavLayout>
  );
}