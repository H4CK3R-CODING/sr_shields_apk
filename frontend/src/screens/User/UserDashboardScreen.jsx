// src/screens/User/UserDashboardScreen.jsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function UserDashboardScreen({ navigation }) {
  const { notifications, notices, jobs, forms, loadAllData } = useContentStore();

  useEffect(() => {
    loadAllData();
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const cards = [
    {
      title: "Notifications",
      count: notifications.length,
      unread: unreadNotifications,
      icon: "notifications",
      color: "bg-blue-500",
      screen: "Notifications",
    },
    {
      title: "Notices",
      count: notices.length,
      icon: "newspaper",
      color: "bg-green-500",
      screen: "Notices",
    },
    {
      title: "Jobs",
      count: jobs.length,
      icon: "briefcase",
      color: "bg-purple-500",
      screen: "Jobs",
    },
    {
      title: "Forms",
      count: forms.length,
      icon: "document-text",
      color: "bg-orange-500",
      screen: "Forms",
    },
  ];

  // Recent notices (latest 3)
  const recentNotices = notices.slice(0, 3);

  // Recent jobs (latest 3)
  const recentJobs = jobs.slice(0, 3);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="CSC Dashboard" showMenu />

      <ScrollView className="flex-1 px-4 py-6">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome Back!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with the latest information
          </Text>
        </View>

        {/* Quick Access Cards */}
        <View className="mb-6">
          <View className="flex-row flex-wrap -mx-2">
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(card.screen)}
                className="w-1/2 px-2 mb-4"
              >
                <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className={`${card.color} w-12 h-12 rounded-full items-center justify-center`}>
                      <Ionicons name={card.icon} size={24} color="white" />
                    </View>
                    {card.unread > 0 && (
                      <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs font-bold">
                          {card.unread}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                    {card.count}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {card.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Notices */}
        {recentNotices.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Notices
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Notices")}>
                <Text className="text-blue-500">View All</Text>
              </TouchableOpacity>
            </View>
            {recentNotices.map((notice) => (
              <TouchableOpacity
                key={notice.id}
                onPress={() => navigation.navigate("NoticeDetail", { notice })}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
              >
                <Text className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                  {notice.title}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>
                  {notice.description}
                </Text>
                <Text className="text-xs text-gray-400 mt-2">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Jobs
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Jobs")}>
                <Text className="text-blue-500">View All</Text>
              </TouchableOpacity>
            </View>
            {recentJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => navigation.navigate("JobDetail", { job })}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
              >
                <Text className="text-base font-bold text-gray-800 dark:text-white">
                  {job.title}
                </Text>
                <Text className="text-purple-600 dark:text-purple-400 font-semibold mb-2">
                  {job.company}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location" size={14} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                    {job.location}
                  </Text>
                  <Ionicons name="time" size={14} color="#9CA3AF" className="ml-3" />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                    {job.type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}