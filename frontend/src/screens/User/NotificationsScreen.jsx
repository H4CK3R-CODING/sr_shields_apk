// src/screens/User/NotificationsScreen.jsx
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Modal,
  Alert,
  Animated,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, unread, high, normal, low
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [markAllModalVisible, setMarkAllModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications/my-notifications");
      
      if (data.success) {
        setNotifications(data.notifications || []);
        // If backend returns readNotifications array, use it
        if (data.readNotifications && Array.isArray(data.readNotifications)) {
          setReadNotifications(data.readNotifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status !== 401) {
        Alert.alert('Error', 'Failed to load notifications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Check if notification is read
  const isRead = (notificationId) => {
    return readNotifications.includes(notificationId);
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { data } = await api.put(`/notifications/${notificationId}/read`);
      
      if (data.success) {
        setReadNotifications([...readNotifications, notificationId]);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Filter notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    switch (filterType) {
      case "unread":
        filtered = filtered.filter(n => !isRead(n._id));
        break;
      case "high":
        filtered = filtered.filter(n => n.priority === "high");
        break;
      case "normal":
        filtered = filtered.filter(n => n.priority === "normal");
        break;
      case "low":
        filtered = filtered.filter(n => n.priority === "low");
        break;
      default:
        // all - no filter
        break;
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Get counts for each filter
  const counts = {
    all: notifications.length,
    unread: notifications.filter(n => !isRead(n._id)).length,
    high: notifications.filter(n => n.priority === "high").length,
    normal: notifications.filter(n => n.priority === "normal").length,
    low: notifications.filter(n => n.priority === "low").length,
  };

  // Handle notification tap
  const handleNotificationTap = async (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Mark as read if unread
    if (!isRead(notification._id)) {
      await markAsRead(notification._id);
    }
  };

  // Close modal
  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedNotification(null);
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setMarkAllModalVisible(true);
  };

  const confirmMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !isRead(n._id));
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification._id);
      }
      
      setMarkAllModalVisible(false);
      Alert.alert("Success", "All notifications marked as read");
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert("Error", "Failed to mark all as read");
      setMarkAllModalVisible(false);
    }
  };

  const cancelMarkAllAsRead = () => {
    setMarkAllModalVisible(false);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-500",
          bgLight: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-500",
        };
      case "normal":
        return {
          bg: "bg-blue-500",
          bgLight: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-500",
        };
      case "low":
        return {
          bg: "bg-gray-500",
          bgLight: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-500",
        };
      default:
        return {
          bg: "bg-blue-500",
          bgLight: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-500",
        };
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "alert-circle";
      case "normal":
        return "information-circle";
      case "low":
        return "checkmark-circle";
      default:
        return "information-circle";
    }
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Filter tabs
  const filterTabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "unread", label: "Unread", count: counts.unread },
    { key: "high", label: "Urgent", count: counts.high },
    { key: "normal", label: "Normal", count: counts.normal },
    { key: "low", label: "Low", count: counts.low },
  ];

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader title="Notifications" showBack showMenu />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">
            Loading notifications...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader 
        title="Notifications" 
        showBack 
        showMenu
        rightButton={
          counts.unread > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-blue-500 font-semibold">Mark All Read</Text>
            </TouchableOpacity>
          )
        }
      />

      {/* Stats Banner */}
      <View className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800 dark:text-white">
              {counts.all}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Total Notifications
            </Text>
          </View>
          <View>
            <Text className="text-2xl font-bold text-blue-500">
              {counts.unread}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Unread
            </Text>
          </View>
          <View>
            <Text className="text-2xl font-bold text-red-500">
              {counts.high}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Urgent
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilterType(tab.key)}
              className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                filterType === tab.key
                  ? "bg-blue-500"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`font-semibold ${
                  filterType === tab.key
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  className={`ml-2 rounded-full px-2 py-0.5 ${
                    filterType === tab.key
                      ? "bg-white/30"
                      : "bg-blue-500"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      filterType === tab.key ? "text-white" : "text-white"
                    }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-12 items-center mt-8">
            <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons name="notifications-off" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-lg mb-2">
              No Notifications
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              {filterType === "all"
                ? "You don't have any notifications yet"
                : `No ${filterType} notifications found`}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification, index) => {
            const colors = getPriorityColor(notification.priority);
            const isUnread = !isRead(notification._id);

            return (
              <TouchableOpacity
                key={notification._id}
                onPress={() => handleNotificationTap(notification)}
                activeOpacity={0.7}
                className={`bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm overflow-hidden ${
                  isUnread ? `border-l-4 ${colors.border}` : ""
                }`}
              >
                {/* Unread Indicator */}
                {isUnread && (
                  <View className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full" />
                )}

                <View className="p-4">
                  {/* Header */}
                  <View className="flex-row items-start mb-3">
                    {/* Priority Icon */}
                    <View className={`${colors.bg} w-12 h-12 rounded-xl items-center justify-center mr-3`}>
                      <Ionicons
                        name={getPriorityIcon(notification.priority)}
                        size={24}
                        color="white"
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      {/* Priority Badge */}
                      <View className="flex-row items-center mb-2">
                        <View className={`${colors.bgLight} px-2 py-1 rounded`}>
                          <Text className={`${colors.text} text-xs font-bold uppercase`}>
                            {notification.priority}
                          </Text>
                        </View>
                        <Text className="text-gray-400 text-xs ml-2">
                          • {getRelativeTime(notification.createdAt)}
                        </Text>
                      </View>

                      {/* Title */}
                      <Text
                        className={`text-base font-bold mb-1 ${
                          isUnread
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {notification.title}
                      </Text>

                      {/* Message Preview */}
                      <Text
                        className="text-gray-600 dark:text-gray-400 text-sm"
                        numberOfLines={2}
                      >
                        {notification.message}
                      </Text>
                    </View>

                    {/* Arrow */}
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>

                  {/* Footer */}
                  <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                    {isUnread && (
                      <>
                        <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                        <Ionicons name="eye-off" size={14} color="#3B82F6" />
                        <Text className="text-xs text-blue-500 ml-1 font-semibold">
                          Unread
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View className="flex-1 bg-black/70 justify-center items-center px-6">
            <Animated.View
              style={{ opacity: fadeAnim }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <View className={`${getPriorityColor(selectedNotification.priority).bg} p-6 pb-4`}>
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-white/20 w-14 h-14 rounded-xl items-center justify-center">
                    <Ionicons
                      name={getPriorityIcon(selectedNotification.priority)}
                      size={28}
                      color="white"
                    />
                  </View>
                  <TouchableOpacity onPress={closeModal} className="p-2 -m-2">
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-2">
                  <Text className="text-white text-xs font-bold uppercase">
                    {selectedNotification.priority} Priority
                  </Text>
                </View>
              </View>

              {/* Modal Body */}
              <ScrollView className="max-h-96 p-6 bg-white dark:bg-gray-800">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedNotification.title}
                </Text>

                <Text className="text-gray-700 dark:text-gray-300 leading-6 mb-6">
                  {selectedNotification.message}
                </Text>

                {/* Metadata */}
                <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                      {new Date(selectedNotification.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                      {new Date(selectedNotification.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Modal Footer */}
              <View className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <TouchableOpacity
                  onPress={closeModal}
                  className="bg-blue-500 rounded-xl py-4 items-center"
                >
                  <Text className="text-white font-bold text-base">Got it</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Mark All as Read Confirmation Modal */}
      <Modal
        visible={markAllModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelMarkAllAsRead}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark-done" size={32} color="#3B82F6" />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Mark All as Read
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to mark all {counts.unread} unread notifications as read?
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={cancelMarkAllAsRead}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmMarkAllAsRead}
                className="flex-1 bg-blue-500 rounded-lg p-4 items-center"
              >
                <Text className="text-white font-semibold">Mark All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}