// src/screens/User/NoticesScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function NoticesScreen({ navigation }) {
  const { notices, loadAllData } = useContentStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, alphabetical

  useEffect(() => {
    loadAllData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Categories for filtering
  const categories = [
    "All",
    "Announcement",
    "Academic",
    "Event",
    "Holiday",
    "Exam",
    "Result",
    "Admission",
    "Other",
  ];

  // Filter and sort notices
  const getFilteredNotices = () => {
    let filtered = [...notices];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (notice) =>
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notice.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== "All") {
      filtered = filtered.filter((notice) => notice.category === filterCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredNotices = getFilteredNotices();

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      Announcement: "megaphone",
      Academic: "school",
      Event: "calendar",
      Holiday: "sunny",
      Exam: "document-text",
      Result: "trophy",
      Admission: "person-add",
      Other: "information-circle",
    };
    return icons[category] || "newspaper";
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      Announcement: { bg: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
      Academic: { bg: "bg-purple-500", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
      Event: { bg: "bg-green-500", light: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
      Holiday: { bg: "bg-orange-500", light: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
      Exam: { bg: "bg-red-500", light: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
      Result: { bg: "bg-yellow-500", light: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
      Admission: { bg: "bg-indigo-500", light: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
      Other: { bg: "bg-gray-500", light: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400" },
    };
    return colors[category] || colors.Other;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  // Handle notice tap
  const handleNoticeTap = (notice) => {
    navigation.navigate("NoticeDetail", { notice });
  };

  // Quick download PDF
  const handleQuickDownload = async (notice, event) => {
    event.stopPropagation();

    if (!notice.pdfFileId) {
      Alert.alert("No PDF", "This notice doesn't have an attached PDF");
      return;
    }

    Alert.alert(
      "Download PDF",
      `Download ${notice.pdfFileName || "notice.pdf"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: async () => {
            try {
              // Simulate download - in production, fetch from Google Drive
              Alert.alert("Success", "PDF downloaded successfully!");
              // In production: Download from Google Drive using pdfFileId
            } catch (error) {
              Alert.alert("Error", "Failed to download PDF");
            }
          },
        },
      ]
    );
  };

  // Sort options
  const sortOptions = [
    { key: "newest", label: "Newest First", icon: "arrow-down" },
    { key: "oldest", label: "Oldest First", icon: "arrow-up" },
    { key: "alphabetical", label: "A to Z", icon: "text" },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader
        title="Notices"
        showBack
        showMenu
        rightButton={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="filter" size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      {/* Search and Filter Section */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm">
        {/* Search Bar */}
        <View className="bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 py-3 mb-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search notices..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Options */}
        <View className="flex-row mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSortBy(option.key)}
                className={`mr-2 px-3 py-2 rounded-lg flex-row items-center ${
                  sortBy === option.key
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Ionicons
                  name={option.icon}
                  size={14}
                  color={sortBy === option.key ? "white" : "#9CA3AF"}
                />
                <Text
                  className={`ml-1 text-sm font-semibold ${
                    sortBy === option.key
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setFilterCategory(category)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filterCategory === category
                  ? "bg-green-500"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`font-semibold ${
                  filterCategory === category
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Bar */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3 flex-row items-center justify-between shadow-sm">
        <Text className="text-gray-600 dark:text-gray-400">
          {filteredNotices.length} {filteredNotices.length === 1 ? "Notice" : "Notices"}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="document-text" size={16} color="#10B981" />
          <Text className="text-green-600 dark:text-green-400 ml-1 font-semibold">
            {notices.filter(n => n.pdfFileId).length} with PDF
          </Text>
        </View>
      </View>

      {/* Notices List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotices.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-12 items-center mt-8">
            <View className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full items-center justify-center mb-4">
              <Ionicons name="newspaper-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-lg mb-2">
              No Notices Found
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Check back later for new notices"}
            </Text>
          </View>
        ) : (
          filteredNotices.map((notice, index) => {
            const colors = getCategoryColor(notice.category);
            const hasPDF = notice.pdfFileId;

            return (
              <TouchableOpacity
                key={notice.id}
                onPress={() => handleNoticeTap(notice)}
                activeOpacity={0.7}
                className="bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm overflow-hidden"
              >
                {/* Header Section */}
                <View className="p-4 pb-3">
                  <View className="flex-row items-start mb-3">
                    {/* Category Icon */}
                    <View
                      className={`${colors.bg} w-14 h-14 rounded-2xl items-center justify-center mr-3`}
                    >
                      <Ionicons
                        name={getCategoryIcon(notice.category)}
                        size={26}
                        color="white"
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      {/* Category Badge */}
                      <View className="flex-row items-center mb-2">
                        <View className={`${colors.light} px-2 py-1 rounded`}>
                          <Text className={`${colors.text} text-xs font-bold`}>
                            {notice.category || "General"}
                          </Text>
                        </View>
                        {hasPDF && (
                          <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded ml-2">
                            <Text className="text-green-600 dark:text-green-400 text-xs font-bold">
                              PDF
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Title */}
                      <Text className="text-base font-bold text-gray-800 dark:text-white mb-1">
                        {notice.title}
                      </Text>

                      {/* Date */}
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          {getRelativeTime(notice.createdAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Arrow */}
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>

                  {/* Description Preview */}
                  {notice.description && (
                    <Text
                      className="text-gray-600 dark:text-gray-400 text-sm mb-3"
                      numberOfLines={2}
                    >
                      {notice.description}
                    </Text>
                  )}

                  {/* PDF Info */}
                  {hasPDF && (
                    <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3 flex-row items-center">
                      <Ionicons name="document-attach" size={20} color="#10B981" />
                      <View className="flex-1 ml-2">
                        <Text className="text-gray-800 dark:text-white font-semibold text-sm">
                          {notice.pdfFileName || "Attachment.pdf"}
                        </Text>
                        {notice.pdfFileSize && (
                          <Text className="text-gray-500 dark:text-gray-400 text-xs">
                            {(notice.pdfFileSize / 1024).toFixed(1)} MB
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={(e) => handleQuickDownload(notice, e)}
                        className="bg-green-500 w-9 h-9 rounded-lg items-center justify-center"
                      >
                        <Ionicons name="download" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Footer */}
                <View className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      Posted on {formatDate(notice.createdAt)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="eye" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {notice.views || 0} views
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}