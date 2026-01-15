// src/screens/Admin/AdminDashboardScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../../services/api";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { width } = Dimensions.get("window");

// Skeleton Components
const SkeletonBox = ({ width, height, className = "" }) => (
  <View
    style={{ width, height }}
    className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
  />
);

const StatCardSkeleton = () => (
  <View className="w-[48%] mb-4 rounded-2xl overflow-hidden shadow-lg bg-gray-300 dark:bg-gray-700 p-5">
    <SkeletonBox width={56} height={56} className="rounded-2xl mb-3" />
    <SkeletonBox width="60%" height={36} className="mb-1" />
    <SkeletonBox width="80%" height={20} className="mb-2" />
  </View>
);

const QuickActionCardSkeleton = () => (
  <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-md">
    <View className="flex-row items-center">
      <SkeletonBox width={56} height={56} className="rounded-2xl mr-4" />
      <View className="flex-1">
        <SkeletonBox width="70%" height={20} className="mb-2" />
        <SkeletonBox width="90%" height={16} />
      </View>
    </View>
  </View>
);

const ActivityItemSkeleton = () => (
  <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-sm">
    <SkeletonBox width={48} height={48} className="rounded-xl mr-4" />
    <View className="flex-1">
      <SkeletonBox width="70%" height={18} className="mb-2" />
      <SkeletonBox width="90%" height={14} />
    </View>
    <SkeletonBox width={40} height={12} />
  </View>
);

// Stat Card Component
const StatCard = ({ label, value, icon, colors, trend, onPress, isLoading }) => {
  if (isLoading) return <StatCardSkeleton />;

  return (
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
        <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center mb-3">
          <Ionicons name={icon} size={28} color="white" />
        </View>
        <Text className="text-white font-bold text-3xl mb-1">
          {value?.toLocaleString() || 0}
        </Text>
        <Text className="text-white/90 text-sm font-semibold mb-2">{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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

// Recent Activity Item
const ActivityItem = ({ icon, iconColor, title, subtitle, time }) => (
  <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-sm">
    <View
      style={{ backgroundColor: iconColor + "20" }}
      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
    >
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
        {title}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm">
        {subtitle}
      </Text>
    </View>
    <Text className="text-gray-500 dark:text-gray-400 text-xs">{time}</Text>
  </View>
);

export default function AdminDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalReports: 0,
      totalJobs: 0,
      totalForms: 0,
      totalNotifications: 0,
      pendingAppointments: 0,
    },
    recentActivities: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }

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
    setRefreshing(true);
    fetchDashboardData();
  };

  const stats = [
    {
      label: "Total Users",
      value: dashboardData.stats.totalUsers,
      icon: "people",
      colors: ["#3B82F6", "#1D4ED8"],
      onPress: () => navigation.navigate("ManageUsersScreen"),
    },
    {
      label: "Notifications Sent",
      value: dashboardData.stats.totalNotifications,
      icon: "document-text",
      colors: ["#F59E0B", "#D97706"],
      onPress: () => navigation.navigate("ManageNotifications"),
    },
    {
      label: "Jobs Posted",
      value: dashboardData.stats.totalJobs,
      icon: "briefcase",
      colors: ["#EF4444", "#DC2626"],
      onPress: () => navigation.navigate("ManageJobsForms"),
    },
    {
      label: "Forms Available",
      value: dashboardData.stats.totalForms,
      icon: "documents",
      colors: ["#EC4899", "#DB2777"],
      onPress: () => navigation.navigate("ManageJobsForms"),
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: "people",
      colors: ["#3B82F6", "#1D4ED8"],
      onPress: () => navigation.navigate("ManageUsersScreen"),
    },
    {
      title: "Jobs & Forms",
      description: "Manage job postings and forms",
      icon: "briefcase",
      colors: ["#8B5CF6", "#6D28D9"],
      onPress: () => navigation.navigate("ManageJobsForms"),
    },
    {
      title: "Send Notifications",
      description: "Create and send notifications",
      icon: "notifications",
      colors: ["#F59E0B", "#D97706"],
      onPress: () => navigation.navigate("ManageNotifications"),
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: "settings",
      colors: ["#6B7280", "#4B5563"],
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  return (
    <NavLayout title="Admin Dashboard" showAIChat={false}>
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
        <LinearGradient
          colors={["#3B82F6", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
          className="px-6 pt-8 pb-10 rounded-b-3xl shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-white/80 text-sm font-semibold">
                Welcome back,
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                Administrator
              </Text>
            </View>
            <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center">
              <Ionicons name="shield-checkmark" size={28} color="white" />
            </View>
          </View>
          <Text className="text-white/90 text-sm mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </LinearGradient>

        {/* Stats Grid */}
        <View className="px-4 -mt-6">
          <View className="flex-row flex-wrap justify-between">
            {loading
              ? [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
              : stats.map((stat, index) => (
                  <StatCard key={index} {...stat} isLoading={false} />
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

        {/* Recent Activity Section */}
        <View className="px-4 mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 dark:text-white font-bold text-xl">
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            [1, 2, 3].map((i) => <ActivityItemSkeleton key={i} />)
          ) : dashboardData.recentActivities.length > 0 ? (
            dashboardData.recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                iconColor={activity.color}
                title={activity.title}
                subtitle={activity.description}
                time={activity.time}
              />
            ))
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center">
              <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="time-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                No recent activities
              </Text>
            </View>
          )}
        </View>

        {/* System Health Card */}
        <View className="px-4 mb-6">
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 24,
              elevation: 5,
            }}
            className="rounded-2xl p-6 shadow-lg"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-bold text-lg">
                System Health
              </Text>
              <View className="bg-white/20 px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-bold">EXCELLENT</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="server" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Server</Text>
                <Text className="text-white font-bold">99.9%</Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="speedometer" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Performance</Text>
                <Text className="text-white font-bold">Optimal</Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Security</Text>
                <Text className="text-white font-bold">Active</Text>
              </View>

              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="cloud-done" size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Backup</Text>
                <Text className="text-white font-bold">Daily</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="h-6" />
      </ScrollView>
    </NavLayout>
  );
}