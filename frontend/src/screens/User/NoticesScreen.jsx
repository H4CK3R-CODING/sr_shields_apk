// src/screens/User/NoticesScreen.jsx (Updated with File View/Download)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function NoticesScreen({ navigation }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [filterCategory, setFilterCategory] = useState("");
  const [downloadingFile, setDownloadingFile] = useState(null);

  const categories = [
    { key: "", label: "All", icon: "apps", color: "blue" },
    { key: "general", label: "General", icon: "document-text", color: "blue" },
    { key: "important", label: "Important", icon: "alert-circle", color: "red" },
    { key: "event", label: "Event", icon: "calendar", color: "purple" },
    { key: "holiday", label: "Holiday", icon: "sunny", color: "orange" },
    { key: "maintenance", label: "Maintenance", icon: "construct", color: "yellow" },
    { key: "announcement", label: "Announcement", icon: "megaphone", color: "green" },
  ];

  useEffect(() => {
    fetchNotices();
  }, [filterCategory]);

  const fetchNotices = async () => {
    try {
      setRefreshing(true);
      const params = {};
      if (filterCategory) params.category = filterCategory;

      const { data } = await api.get("/notices/active", { params });

      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNoticePress = async (notice) => {
    setSelectedNotice(notice);
    setModalVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      await api.get(`/notices/${notice._id}`);
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedNotice(null);
    });
  };

  // View file in browser
  const viewFile = async (attachment) => {
    try {
      const supported = await Linking.canOpenURL(attachment.viewLink);
      if (supported) {
        await Linking.openURL(attachment.viewLink);
      } else {
        Alert.alert('Error', 'Cannot open this file');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open file');
    }
  };

  // Download file
  const downloadFile = async (attachment) => {
    try {
      setDownloadingFile(attachment.fileId);

      if (Platform.OS === 'web') {
        // For web, just open the download link
        window.open(attachment.downloadLink, '_blank');
        Alert.alert('Success', 'File download started');
      } else {
        // For mobile, download and share
        const fileUri = FileSystem.documentDirectory + attachment.name;
        
        const downloadResumable = FileSystem.createDownloadResumable(
          attachment.downloadLink,
          fileUri
        );

        const result = await downloadResumable.downloadAsync();
        
        if (result && result.uri) {
          // Check if sharing is available
          const isAvailable = await Sharing.isAvailableAsync();
          
          if (isAvailable) {
            await Sharing.shareAsync(result.uri, {
              mimeType: attachment.mimeType,
              dialogTitle: 'Save or Share File',
            });
            Alert.alert('Success', 'File downloaded successfully');
          } else {
            Alert.alert('Success', `File saved to ${result.uri}`);
          }
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'document-text';
    if (mimeType?.includes('image')) return 'image';
    return 'document';
  };

  const getFileColor = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'text-red-500';
    if (mimeType?.includes('image')) return 'text-blue-500';
    return 'text-gray-500';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getCategoryInfo = (cat) => categories.find(c => c.key === cat) || categories[1];
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return { bg: "bg-red-500", text: "text-red-600", light: "bg-red-100 dark:bg-red-900/30" };
      case "high": return { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-100 dark:bg-orange-900/30" };
      case "normal": return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100 dark:bg-blue-900/30" };
      case "low": return { bg: "bg-gray-500", text: "text-gray-600", light: "bg-gray-100 dark:bg-gray-700" };
      default: return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100 dark:bg-blue-900/30" };
    }
  };

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

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader title="Notices" showBack showMenu />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading notices...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Notices" showBack showMenu />

      {/* Category Filter */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setFilterCategory(cat.key)}
              className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                filterCategory === cat.key ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Ionicons name={cat.icon} size={16} color={filterCategory === cat.key ? "#FFF" : "#9CA3AF"} />
              <Text className={`ml-2 font-semibold ${filterCategory === cat.key ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notices List */}
      <ScrollView className="flex-1 px-4 py-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotices} />}>
        {notices.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-12 items-center mt-8">
            <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons name="document-text-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-lg mb-2">No Notices</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              {filterCategory ? `No ${getCategoryInfo(filterCategory).label.toLowerCase()} notices found` : "No notices available"}
            </Text>
          </View>
        ) : (
          notices.map((notice) => {
            const categoryInfo = getCategoryInfo(notice.category);
            const priorityColors = getPriorityColor(notice.priority);

            return (
              <TouchableOpacity
                key={notice._id}
                onPress={() => handleNoticePress(notice)}
                activeOpacity={0.7}
                className="bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm overflow-hidden"
              >
                {notice.isPinned && (
                  <View className="bg-yellow-400 px-4 py-2">
                    <Text className="text-yellow-900 text-xs font-bold">📌 PINNED NOTICE</Text>
                  </View>
                )}

                <View className="p-4">
                  <View className="flex-row items-start mb-3">
                    <View className={`bg-${categoryInfo.color}-500 w-12 h-12 rounded-xl items-center justify-center mr-3`}>
                      <Ionicons name={categoryInfo.icon} size={24} color="white" />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className={priorityColors.light + " px-2 py-1 rounded mr-2"}>
                          <Text className={priorityColors.text + " text-xs font-bold uppercase"}>{notice.priority}</Text>
                        </View>
                        <Text className="text-gray-400 text-xs">{getRelativeTime(notice.createdAt)}</Text>
                      </View>

                      <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">{notice.title}</Text>
                      <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>{notice.description}</Text>

                      {/* Attachment indicator */}
                      {notice.attachments && notice.attachments.length > 0 && (
                        <View className="flex-row items-center mt-2">
                          <Ionicons name="attach" size={16} color="#3B82F6" />
                          <Text className="text-blue-500 text-xs ml-1 font-semibold">
                            {notice.attachments.length} file{notice.attachments.length > 1 ? 's' : ''} attached
                          </Text>
                        </View>
                      )}
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>

                  <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                    <View className={`bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-900/30 px-2 py-1 rounded`}>
                      <Text className={`text-${categoryInfo.color}-700 dark:text-${categoryInfo.color}-400 text-xs font-semibold`}>
                        {categoryInfo.label}
                      </Text>
                    </View>
                    <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400">👁 {notice.views} views</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
          <View className="flex-1 bg-black/70 justify-center items-center px-6">
            <Animated.View style={{ opacity: fadeAnim }} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              {/* Header */}
              <View className={`${getPriorityColor(selectedNotice.priority).bg} p-6 pb-4`}>
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-white/20 w-14 h-14 rounded-xl items-center justify-center">
                    <Ionicons name={getCategoryInfo(selectedNotice.category).icon} size={28} color="white" />
                  </View>
                  <TouchableOpacity onPress={closeModal} className="p-2 -m-2">
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-2">
                  <Text className="text-white text-xs font-bold uppercase">
                    {selectedNotice.priority} • {getCategoryInfo(selectedNotice.category).label}
                  </Text>
                </View>
              </View>

              {/* Body */}
              <ScrollView className="max-h-96 p-6 bg-white dark:bg-gray-800">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedNotice.title}</Text>
                <Text className="text-gray-700 dark:text-gray-300 leading-6 mb-6">{selectedNotice.description}</Text>

                {/* Attachments Section */}
                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-3">
                      📎 Attachments ({selectedNotice.attachments.length})
                    </Text>
                    {selectedNotice.attachments.map((attachment, index) => (
                      <View key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-3">
                        <View className="flex-row items-center mb-3">
                          <View className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg items-center justify-center mr-3">
                            <Ionicons name={getFileIcon(attachment.mimeType)} size={24} color="#3B82F6" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-gray-900 dark:text-white font-semibold mb-1" numberOfLines={1}>
                              {attachment.name}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">
                              {formatFileSize(attachment.size)}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row space-x-2">
                          <TouchableOpacity
                            onPress={() => viewFile(attachment)}
                            className="flex-1 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center"
                          >
                            <Ionicons name="eye" size={18} color="white" />
                            <Text className="text-white font-semibold ml-2">View</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => downloadFile(attachment)}
                            disabled={downloadingFile === attachment.fileId}
                            className="flex-1 bg-green-500 rounded-lg p-3 flex-row items-center justify-center"
                          >
                            {downloadingFile === attachment.fileId ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <>
                                <Ionicons name="download" size={18} color="white" />
                                <Text className="text-white font-semibold ml-2">Download</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Metadata */}
                <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="person-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                      Posted by {selectedNotice.createdBy?.fullName || "Admin"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                      {new Date(selectedNotice.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                      {new Date(selectedNotice.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <TouchableOpacity onPress={closeModal} className="bg-blue-500 rounded-xl py-4 items-center">
                  <Text className="text-white font-bold text-base">Got it</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}