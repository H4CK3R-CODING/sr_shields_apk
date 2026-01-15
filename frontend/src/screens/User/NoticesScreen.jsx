// src/screens/User/NoticesScreen.jsx (Enhanced with Skeleton Loading)
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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

const { width } = Dimensions.get("window");

// Skeleton Loading Component
const SkeletonLoader = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View className="px-4 py-4">
      {[1, 2, 3, 4].map((item) => (
        <Animated.View
          key={item}
          style={{ opacity: fadeAnim }}
          className="bg-white dark:bg-gray-800 rounded-2xl mb-4 p-5 shadow-md"
        >
          {/* Header Row */}
          <View className="flex-row items-start mb-3">
            {/* Icon Skeleton */}
            <View className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 mr-4" />

            <View className="flex-1">
              {/* Priority and Time Skeleton */}
              <View className="flex-row items-center mb-2">
                <View className="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
                <View className="w-16 h-4 rounded bg-gray-200 dark:bg-gray-700" />
              </View>

              {/* Title Skeleton */}
              <View className="w-full h-5 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <View className="w-3/4 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-3" />

              {/* Description Skeleton */}
              <View className="w-full h-4 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <View className="w-5/6 h-4 rounded bg-gray-200 dark:bg-gray-700 mb-3" />

              {/* Attachment Badge Skeleton */}
              <View className="w-28 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </View>

            {/* Chevron Skeleton */}
            <View className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          </View>

          {/* Footer Row Skeleton */}
          <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
            <View className="w-20 h-7 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <View className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-3" />
            <View className="w-16 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

// Category Filter Skeleton
const CategoryFilterSkeleton = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Animated.View
            key={item}
            style={{ opacity: fadeAnim }}
            className="mr-3 px-5 py-2.5 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            <View className="w-20 h-5" />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function NoticesScreen({ navigation }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [filterCategory, setFilterCategory] = useState("");
  const [downloadingFile, setDownloadingFile] = useState(null);

  const categories = [
    { key: "", label: "All", icon: "apps", color: "#3B82F6" },
    {
      key: "general",
      label: "General",
      icon: "document-text",
      color: "#3B82F6",
    },
    {
      key: "important",
      label: "Important",
      icon: "alert-circle",
      color: "#EF4444",
    },
    { key: "event", label: "Event", icon: "calendar", color: "#8B5CF6" },
    { key: "holiday", label: "Holiday", icon: "sunny", color: "#F59E0B" },
    {
      key: "maintenance",
      label: "Maintenance",
      icon: "construct",
      color: "#EAB308",
    },
    {
      key: "announcement",
      label: "Announcement",
      icon: "megaphone",
      color: "#10B981",
    },
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

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await api.get(`/notices/${notice._id}`);
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedNotice(null);
    });
  };

  const viewFile = async (attachment) => {
    try {
      const supported = await Linking.canOpenURL(attachment.viewLink);
      if (supported) {
        await Linking.openURL(attachment.viewLink);
      } else {
        Alert.alert("Error", "Cannot open this file");
      }
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open file");
    }
  };

  const downloadFile = async (attachment) => {
    try {
      setDownloadingFile(attachment.fileId);

      if (Platform.OS === "web") {
        window.open(attachment.downloadLink, "_blank");
        Alert.alert("Success", "File download started");
      } else {
        const fileUri = FileSystem.documentDirectory + attachment.name;

        const downloadResumable = FileSystem.createDownloadResumable(
          attachment.downloadLink,
          fileUri
        );

        const result = await downloadResumable.downloadAsync();

        if (result && result.uri) {
          const isAvailable = await Sharing.isAvailableAsync();

          if (isAvailable) {
            await Sharing.shareAsync(result.uri, {
              mimeType: attachment.mimeType,
              dialogTitle: "Save or Share File",
            });
            Alert.alert("Success", "File downloaded successfully");
          } else {
            Alert.alert("Success", `File saved to ${result.uri}`);
          }
        }
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "Failed to download file");
    } finally {
      setDownloadingFile(null);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return "document-text";
    if (mimeType?.includes("image")) return "image";
    if (mimeType?.includes("video")) return "videocam";
    if (mimeType?.includes("audio")) return "musical-notes";
    return "document";
  };

  const getFileColor = (mimeType) => {
    if (mimeType?.includes("pdf")) return "#EF4444";
    if (mimeType?.includes("image")) return "#3B82F6";
    if (mimeType?.includes("video")) return "#8B5CF6";
    if (mimeType?.includes("audio")) return "#10B981";
    return "#6B7280";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getCategoryInfo = (cat) =>
    categories.find((c) => c.key === cat) || categories[1];

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "#DC2626",
          text: "#DC2626",
          light: "#FEE2E2",
          darkLight: "rgba(220, 38, 38, 0.2)",
          gradient: ["#DC2626", "#991B1B"],
        };
      case "high":
        return {
          bg: "#EA580C",
          text: "#EA580C",
          light: "#FFEDD5",
          darkLight: "rgba(234, 88, 12, 0.2)",
          gradient: ["#EA580C", "#C2410C"],
        };
      case "normal":
        return {
          bg: "#2563EB",
          text: "#2563EB",
          light: "#DBEAFE",
          darkLight: "rgba(37, 99, 235, 0.2)",
          gradient: ["#2563EB", "#1D4ED8"],
        };
      case "low":
        return {
          bg: "#6B7280",
          text: "#6B7280",
          light: "#F3F4F6",
          darkLight: "rgba(107, 114, 128, 0.2)",
          gradient: ["#6B7280", "#4B5563"],
        };
      default:
        return {
          bg: "#2563EB",
          text: "#2563EB",
          light: "#DBEAFE",
          darkLight: "rgba(37, 99, 235, 0.2)",
          gradient: ["#2563EB", "#1D4ED8"],
        };
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
        <CategoryFilterSkeleton />
        <ScrollView className="flex-1">
          <SkeletonLoader />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Notices" showBack showMenu />

      {/* Category Filter */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => {
            const isActive = filterCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setFilterCategory(cat.key)}
                style={{
                  backgroundColor: isActive ? cat.color : undefined,
                }}
                className={`mr-3 px-5 py-2.5 rounded-full flex-row items-center shadow-sm ${
                  !isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isActive ? "#FFFFFF" : "#9CA3AF"}
                />
                <Text
                  className={`ml-2 font-semibold text-sm ${
                    isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notices List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchNotices}
            colors={["#3B82F6"]}
          />
        }
      >
        {notices.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-12 items-center mt-8 shadow-sm">
            <View className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full items-center justify-center mb-4">
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#9CA3AF"
              />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-xl mb-2">
              No Notices Found
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
              {filterCategory
                ? `No ${getCategoryInfo(filterCategory).label.toLowerCase()} notices available`
                : "No notices available at the moment"}
            </Text>
          </View>
        ) : (
          notices.map((notice) => {
            const categoryInfo = getCategoryInfo(notice.category);
            const priorityConfig = getPriorityConfig(notice.priority);

            return (
              <TouchableOpacity
                key={notice._id}
                onPress={() => handleNoticePress(notice)}
                activeOpacity={0.7}
                className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-md overflow-hidden"
              >
                {notice.isPinned && (
                  <View className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2.5 flex-row items-center">
                    <Ionicons name="pin" size={16} color="#78350F" />
                    <Text className="text-yellow-900 text-xs font-bold ml-2">
                      PINNED NOTICE
                    </Text>
                  </View>
                )}

                <View className="p-5">
                  <View className="flex-row items-start mb-3">
                    <View
                      style={{ backgroundColor: categoryInfo.color }}
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4 shadow-sm"
                    >
                      <Ionicons
                        name={categoryInfo.icon}
                        size={26}
                        color="white"
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center mb-2 flex-wrap">
                        <View
                          style={{ backgroundColor: priorityConfig.light }}
                          className="px-3 py-1.5 rounded-full mr-2 mb-1"
                        >
                          <Text
                            style={{ color: priorityConfig.text }}
                            className="text-xs font-bold uppercase"
                          >
                            {notice.priority}
                          </Text>
                        </View>
                        <Text className="text-gray-400 text-xs mb-1">
                          {getRelativeTime(notice.createdAt)}
                        </Text>
                      </View>

                      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-6">
                        {notice.title}
                      </Text>
                      <Text
                        className="text-gray-600 dark:text-gray-400 text-sm leading-5"
                        numberOfLines={2}
                      >
                        {notice.description}
                      </Text>

                      {notice.attachments && notice.attachments.length > 0 && (
                        <View className="flex-row items-center mt-3 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg self-start">
                          <Ionicons name="attach" size={16} color="#3B82F6" />
                          <Text className="text-blue-600 dark:text-blue-400 text-xs ml-1.5 font-semibold">
                            {notice.attachments.length} attachment
                            {notice.attachments.length > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="#9CA3AF"
                    />
                  </View>

                  <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                    <View
                      style={{ backgroundColor: categoryInfo.color + "20" }}
                      className="px-3 py-1.5 rounded-lg"
                    >
                      <Text
                        style={{ color: categoryInfo.color }}
                        className="text-xs font-semibold"
                      >
                        {categoryInfo.label}
                      </Text>
                    </View>
                    <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-3" />
                    <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {notice.views} views
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Enhanced Notice Detail Modal */}
      {selectedNotice && (
        <Modal
          visible={modalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={closeModal}
          statusBarTranslucent
        >
          <View className="flex-1 bg-black/60 justify-end">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                maxHeight: "90%",
              }}
              className="bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden"
            >
              {/* Drag Indicator */}
              <View className="items-center py-3 bg-white dark:bg-gray-900">
                <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </View>

              {/* Header with Gradient */}
              <View
                style={{
                  backgroundColor: getPriorityConfig(selectedNotice.priority)
                    .bg,
                }}
                className="p-6 pb-8"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-white/20 backdrop-blur-lg w-16 h-16 rounded-2xl items-center justify-center shadow-lg">
                    <Ionicons
                      name={getCategoryInfo(selectedNotice.category).icon}
                      size={32}
                      color="white"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={closeModal}
                    className="bg-white/20 backdrop-blur-lg p-2.5 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View className="bg-white/25 backdrop-blur-lg px-4 py-2 rounded-full self-start">
                  <Text className="text-white text-xs font-bold uppercase">
                    {selectedNotice.priority} •{" "}
                    {getCategoryInfo(selectedNotice.category).label}
                  </Text>
                </View>
              </View>

              {/* Body with Scroll */}
              <ScrollView
                className="bg-white dark:bg-gray-900"
                style={{ maxHeight: 500 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="px-6 pt-6 pb-4">
                  {/* Title */}
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-8">
                    {selectedNotice.title}
                  </Text>

                  {/* Description */}
                  <Text className="text-gray-700 dark:text-gray-300 leading-7 mb-6 text-base">
                    {selectedNotice.description}
                  </Text>

                  {/* Attachments Section */}
                  {selectedNotice.attachments &&
                    selectedNotice.attachments.length > 0 && (
                      <View className="mb-6">
                        <View className="flex-row items-center mb-4">
                          <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="attach" size={20} color="#3B82F6" />
                          </View>
                          <Text className="text-gray-900 dark:text-white font-bold text-lg">
                            Attachments ({selectedNotice.attachments.length})
                          </Text>
                        </View>

                        {selectedNotice.attachments.map((attachment, index) => {
                          const fileColor = getFileColor(attachment.mimeType);
                          return (
                            <View
                              key={index}
                              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700"
                            >
                              <View className="flex-row items-center mb-4">
                                <View
                                  style={{ backgroundColor: fileColor + "20" }}
                                  className="w-14 h-14 rounded-xl items-center justify-center mr-3"
                                >
                                  <Ionicons
                                    name={getFileIcon(attachment.mimeType)}
                                    size={26}
                                    color={fileColor}
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text
                                    className="text-gray-900 dark:text-white font-semibold mb-1.5 text-base"
                                    numberOfLines={1}
                                  >
                                    {attachment.name}
                                  </Text>
                                  <View className="flex-row items-center">
                                    <View
                                      style={{
                                        backgroundColor: fileColor + "20",
                                      }}
                                      className="px-2 py-1 rounded"
                                    >
                                      <Text
                                        style={{ color: fileColor }}
                                        className="text-xs font-semibold"
                                      >
                                        {formatFileSize(attachment.size)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>

                              <View className="flex-row gap-3">
                                <TouchableOpacity
                                  onPress={() => viewFile(attachment)}
                                  className="flex-1 bg-blue-500 rounded-xl p-3.5 flex-row items-center justify-center shadow-sm"
                                >
                                  <Ionicons
                                    name="eye"
                                    size={20}
                                    color="white"
                                  />
                                  <Text className="text-white font-bold ml-2 text-base">
                                    View
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => downloadFile(attachment)}
                                  disabled={
                                    downloadingFile === attachment.fileId
                                  }
                                  className="flex-1 bg-green-500 rounded-xl p-3.5 flex-row items-center justify-center shadow-sm"
                                  style={{
                                    opacity:
                                      downloadingFile === attachment.fileId
                                        ? 0.7
                                        : 1,
                                  }}
                                >
                                  {downloadingFile === attachment.fileId ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="white"
                                    />
                                  ) : (
                                    <>
                                      <Ionicons
                                        name="download"
                                        size={20}
                                        color="white"
                                      />
                                      <Text className="text-white font-bold ml-2 text-base">
                                        Download
                                      </Text>
                                    </>
                                  )}
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}

                  {/* Metadata Card */}
                  <View className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-4">
                      Notice Information
                    </Text>

                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <View className="bg-blue-100 dark:bg-blue-900/30 w-9 h-9 rounded-lg items-center justify-center mr-3">
                          <Ionicons name="person" size={18} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                            Posted by
                          </Text>
                          <Text className="text-gray-900 dark:text-white font-semibold">
                            {selectedNotice.createdBy?.fullName || "Admin"}
                          </Text>
                        </View>
                      </View>

                      <View className="h-px bg-gray-200 dark:bg-gray-700" />

                      <View className="flex-row items-center">
                        <View className="bg-purple-100 dark:bg-purple-900/30 w-9 h-9 rounded-lg items-center justify-center mr-3">
                          <Ionicons name="calendar" size={18} color="#8B5CF6" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                            Date
                          </Text>
                          <Text className="text-gray-900 dark:text-white font-semibold">
                            {new Date(
                              selectedNotice.createdAt
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Text>
                        </View>
                      </View>

                      <View className="h-px bg-gray-200 dark:bg-gray-700" />

                      <View className="flex-row items-center">
                        <View className="bg-green-100 dark:bg-green-900/30 w-9 h-9 rounded-lg items-center justify-center mr-3">
                          <Ionicons name="time" size={18} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                            Time
                          </Text>
                          <Text className="text-gray-900 dark:text-white font-semibold">
                            {new Date(
                              selectedNotice.createdAt
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Footer Button */}
              <View className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <TouchableOpacity
                  onPress={closeModal}
                  className="bg-blue-500 rounded-2xl py-4 items-center shadow-lg"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-lg">
                    Got it, Thanks!
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}