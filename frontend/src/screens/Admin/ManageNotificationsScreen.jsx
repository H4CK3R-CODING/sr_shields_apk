// src/screens/Admin/ManageNotificationsScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api"; // Adjust path according to your project structure
import CustomHeader from "../../components/CustomHeader";

export default function ManageNotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      const { data } = await api.get("/notifications/all");

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNotification = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/notifications", {
        title,
        message,
        priority,
      });

      if (data.success) {
        Alert.alert(
          "Success", 
          `Notification sent to ${data.recipientCount} users!`,
          [{ text: "OK", onPress: () => {
            setTitle("");
            setMessage("");
            setPriority("normal");
            setModalVisible(false);
            fetchNotifications();
          }}]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setNotificationToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;
    
    try {
      const { data } = await api.delete(`/notifications/${notificationToDelete}`);

      if (data.success) {
        Alert.alert('Success', 'Notification deleted successfully');
        fetchNotifications();
      } else {
        Alert.alert('Error', data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete notification');
    } finally {
      setDeleteModalVisible(false);
      setNotificationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setNotificationToDelete(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Notifications" showBack showMenu />

      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshing={refreshing}
        onRefresh={fetchNotifications}
      >
        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 rounded-lg p-4 mb-4 flex-row items-center justify-center"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Post New Notification</Text>
        </TouchableOpacity>

        {/* Notifications List */}
        {refreshing ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              Loading notifications...
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              No notifications yet
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View
              key={notification._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View className={`${getPriorityColor(notification.priority)} px-2 py-1 rounded`}>
                      <Text className="text-white text-xs font-semibold uppercase">
                        {notification.priority}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                    {notification.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(notification._id)}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 mb-2">
                {notification.message}
              </Text>
              <Text className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Notification Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                New Notification
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Notification Title"
              value={title}
              onChangeText={setTitle}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
              placeholderTextColor="#9CA3AF"
              style={{ textAlignVertical: 'top' }}
            />

            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Priority
            </Text>
            <View className="flex-row mb-4">
              {["high", "normal", "low"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  className={`flex-1 mr-2 p-3 rounded-lg ${
                    priority === p ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <Text className={`text-center font-semibold ${
                    priority === p ? "text-white" : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddNotification}
              disabled={loading}
              className="bg-blue-500 rounded-lg p-4 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Post Notification</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelDelete}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="trash" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Delete Notification
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to delete this notification? This action cannot be undone.
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-red-500 rounded-lg p-4 items-center"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}