// src/screens/User/UserDashboardScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useContentStore from "../../state/contentStore";
import useAuthStore from "../../state/authStore";
import CustomHeader from "../../components/CustomHeader";

const { width } = Dimensions.get('window');

export default function UserDashboardScreen({ navigation }) {
  const { notifications, notices, jobs, forms, loadAllData } = useContentStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadAllData();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Calculate stats
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const urgentNotifications = notifications.filter(n => n.priority === "high" && !n.read).length;
  const recentJobs = jobs.filter(job => {
    const jobDate = new Date(job.createdAt);
    const daysDiff = (new Date() - jobDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7; // Jobs posted in last 7 days
  }).length;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Format date
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Quick access cards
  const quickAccessCards = [
    {
      title: "Notifications",
      count: notifications.length,
      unread: unreadNotifications,
      icon: "notifications",
      gradient: ["#3B82F6", "#2563EB"],
      color: "bg-blue-500",
      screen: "Notifications",
      description: urgentNotifications > 0 ? `${urgentNotifications} urgent` : "All up to date"
    },
    {
      title: "Notices",
      count: notices.length,
      icon: "newspaper",
      gradient: ["#10B981", "#059669"],
      color: "bg-green-500",
      screen: "Notices",
      description: notices.length > 0 ? "View latest" : "No notices yet"
    },
    {
      title: "Jobs",
      count: jobs.length,
      badge: recentJobs > 0 ? `${recentJobs} new` : null,
      icon: "briefcase",
      gradient: ["#8B5CF6", "#7C3AED"],
      color: "bg-purple-500",
      screen: "Jobs",
      description: recentJobs > 0 ? `${recentJobs} this week` : "Browse openings"
    },
    {
      title: "Forms",
      count: forms.length,
      icon: "document-text",
      gradient: ["#F59E0B", "#D97706"],
      color: "bg-orange-500",
      screen: "Forms",
      description: "Download & view"
    },
  ];

  // Recent notices (latest 3)
  const recentNotices = notices.slice(0, 3);

  // Featured/Latest jobs (latest 3)
  const featuredJobs = jobs.slice(0, 3);

  // Latest unread notifications (latest 3)
  const latestNotifications = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader 
        title="CSC Portal" 
        showMenu 
        rightButton={
          <TouchableOpacity 
            onPress={() => navigation.navigate("Profile")}
            className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center"
          >
            <Ionicons name="person" size={20} color="white" />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section with Date/Time */}
        <View className="bg-white dark:bg-gray-800 px-6 py-6 mb-4 shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {getGreeting()}!
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mb-1">
            {user?.name || "User"}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {formatDate()}
            </Text>
          </View>
        </View>

        {/* Quick Stats Banner */}
        {urgentNotifications > 0 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate("Notifications")}
            className="mx-6 mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4"
          >
            <View className="flex-row items-center">
              <View className="bg-red-500 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons name="alert-circle" size={22} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-red-800 dark:text-red-300 font-bold">
                  {urgentNotifications} Urgent Notification{urgentNotifications > 1 ? 's' : ''}
                </Text>
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  Requires your attention
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </View>
          </TouchableOpacity>
        )}

        {/* Quick Access Cards Grid */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Access
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {quickAccessCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(card.screen)}
                className="w-1/2 px-2 mb-4"
                activeOpacity={0.7}
              >
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  {/* Card Header with Icon */}
                  <View className={`${card.color} p-4 pb-3`}>
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center">
                        <Ionicons name={card.icon} size={24} color="white" />
                      </View>
                      {card.unread > 0 && (
                        <View className="bg-red-500 rounded-full min-w-6 h-6 px-2 items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {card.unread}
                          </Text>
                        </View>
                      )}
                      {card.badge && (
                        <View className="bg-white/30 rounded-full px-2 py-1">
                          <Text className="text-white text-xs font-semibold">
                            {card.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Card Body */}
                  <View className="p-4">
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {card.count}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                      {card.title}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-500 text-xs">
                      {card.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest Unread Notifications */}
        {latestNotifications.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Unread Notifications
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Text className="text-blue-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {latestNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => navigation.navigate("Notifications")}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm border-l-4 border-blue-500"
              >
                <View className="flex-row items-start">
                  <View className={`${
                    notification.priority === 'high' ? 'bg-red-500' : 
                    notification.priority === 'normal' ? 'bg-blue-500' : 'bg-gray-500'
                  } w-10 h-10 rounded-full items-center justify-center mr-3`}>
                    <Ionicons name="notifications" size={20} color="white" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-base font-bold text-gray-800 dark:text-white flex-1">
                        {notification.title}
                      </Text>
                      {notification.priority === 'high' && (
                        <View className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                          <Text className="text-red-600 dark:text-red-400 text-xs font-semibold">
                            URGENT
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Notices Section */}
        {recentNotices.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Latest Notices
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Notices")}>
                <Text className="text-blue-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {recentNotices.map((notice) => (
              <TouchableOpacity
                key={notice.id}
                onPress={() => navigation.navigate("NoticeDetail", { notice })}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
                activeOpacity={0.7}
              >
                <View className="flex-row items-start">
                  <View className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="newspaper" size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800 dark:text-white mb-1">
                      {notice.title}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2" numberOfLines={2}>
                      {notice.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                        <Text className="text-xs text-gray-400 ml-1">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Featured Jobs Section */}
        {featuredJobs.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Latest Job Openings
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Jobs")}>
                <Text className="text-blue-500 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {featuredJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => navigation.navigate("JobDetail", { job })}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
                activeOpacity={0.7}
              >
                <View className="flex-row items-start mb-3">
                  <View className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="briefcase" size={24} color="#8B5CF6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800 dark:text-white mb-1">
                      {job.title}
                    </Text>
                    <Text className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                      {job.company}
                    </Text>
                  </View>
                  {recentJobs > 0 && (
                    <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                      <Text className="text-green-600 dark:text-green-400 text-xs font-semibold">
                        NEW
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row flex-wrap mb-3">
                  <View className="flex-row items-center mr-4 mb-2">
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
                      {job.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center mr-4 mb-2">
                    <Ionicons name="time" size={14} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
                      {job.type}
                    </Text>
                  </View>
                  {job.salary && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="cash" size={14} color="#9CA3AF" />
                      <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
                        {job.salary}
                      </Text>
                    </View>
                  )}
                </View>

                {job.deadline && (
                  <View className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                    <Text className="text-orange-600 dark:text-orange-400 text-xs">
                      ⏰ Apply by: {job.deadline}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions Footer */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <TouchableOpacity 
              onPress={() => navigation.navigate("Forms")}
              className="w-1/2 px-2 mb-3"
            >
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex-row items-center">
                <View className="bg-orange-100 dark:bg-orange-900/30 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="download" size={20} color="#F59E0B" />
                </View>
                <Text className="text-gray-800 dark:text-white font-semibold flex-1">
                  Download Forms
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Help")}
              className="w-1/2 px-2 mb-3"
            >
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex-row items-center">
                <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="help-circle" size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-800 dark:text-white font-semibold flex-1">
                  Get Help
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Settings")}
              className="w-1/2 px-2 mb-3"
            >
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex-row items-center">
                <View className="bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="settings" size={20} color="#6B7280" />
                </View>
                <Text className="text-gray-800 dark:text-white font-semibold flex-1">
                  Settings
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Profile")}
              className="w-1/2 px-2 mb-3"
            >
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex-row items-center">
                <View className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color="#10B981" />
                </View>
                <Text className="text-gray-800 dark:text-white font-semibold flex-1">
                  My Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Empty State */}
        {notifications.length === 0 && notices.length === 0 && jobs.length === 0 && forms.length === 0 && (
          <View className="px-6 mb-8">
            <View className="bg-white dark:bg-gray-800 rounded-xl p-8 items-center shadow-sm">
              <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="folder-open-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-800 dark:text-white font-bold text-lg mb-2">
                No Content Yet
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Check back later for notifications, notices, jobs, and forms
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}