// src/screens/Admin/ManageNotificationsScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function ManageNotificationsScreen() {
  const { notifications, addNotification, deleteNotification } = useContentStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");

  const handleAddNotification = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    await addNotification({ title, message, priority });
    setTitle("");
    setMessage("");
    setPriority("normal");
    setModalVisible(false);
    Alert.alert("Success", "Notification posted successfully");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteNotification(id)
        }
      ]
    );
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

      <ScrollView className="flex-1 px-4 py-4">
        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 rounded-lg p-4 mb-4 flex-row items-center justify-center"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Post New Notification</Text>
        </TouchableOpacity>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              No notifications yet
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View
              key={notification.id}
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
                <TouchableOpacity onPress={() => handleDelete(notification.id)}>
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
              className="bg-blue-500 rounded-lg p-4 items-center"
            >
              <Text className="text-white font-semibold">Post Notification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}