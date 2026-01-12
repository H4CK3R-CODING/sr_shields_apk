// src/screens/User/JobsFormsScreen.jsx - Jobs & Forms Management
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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function JobsFormsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'forms'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const jobCategories = [
    { key: "", label: "All Jobs", icon: "briefcase", color: "#3B82F6" },
    {
      key: "government",
      label: "Government",
      icon: "business",
      color: "#10B981",
    },
    { key: "private", label: "Private", icon: "people", color: "#8B5CF6" },
    { key: "banking", label: "Banking", icon: "card", color: "#F59E0B" },
    { key: "education", label: "Education", icon: "school", color: "#EF4444" },
    {
      key: "healthcare",
      label: "Healthcare",
      icon: "medical",
      color: "#EC4899",
    },
  ];

  const formCategories = [
    { key: "", label: "All Forms", icon: "document-text", color: "#3B82F6" },
    {
      key: "government",
      label: "Government",
      icon: "business",
      color: "#10B981",
    },
    {
      key: "certificate",
      label: "Certificate",
      icon: "ribbon",
      color: "#F59E0B",
    },
    {
      key: "application",
      label: "Application",
      icon: "create",
      color: "#8B5CF6",
    },
    { key: "income", label: "Income", icon: "cash", color: "#EF4444" },
    { key: "other", label: "Other", icon: "document", color: "#6B7280" },
  ];

  const categories = activeTab === "jobs" ? jobCategories : formCategories;

  useEffect(() => {
    fetchItems();
  }, [activeTab, filterCategory, searchQuery]);

  const fetchItems = async () => {
    try {
      setRefreshing(true);
      const endpoint = activeTab === "jobs" ? "/jobs/active" : "/forms/active";
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const { data } = await api.get(endpoint, { params });

      if (data.success) {
        setItems(data[activeTab] || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      Alert.alert("Error", `Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleItemPress = async (item) => {
    setSelectedItem(item);
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
      const endpoint =
        activeTab === "jobs"
          ? `/jobs/${item._id}/view`
          : `/forms/${item._id}/view`;
      await api.post(endpoint);
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
      setSelectedItem(null);
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
      setDownloadingFile(attachment.fileId || attachment._id);

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

  const handleApplyForJob = () => {
    setApplyModalVisible(true);
  };

  const submitJobApplication = async () => {
    if (
      !applicationData.name ||
      !applicationData.email ||
      !applicationData.phone
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const { data } = await api.post(
        `/jobs/${selectedItem._id}/apply`,
        applicationData
      );

      if (data.success) {
        Alert.alert(
          "Success",
          "Your application has been submitted successfully!"
        );
        setApplyModalVisible(false);
        setApplicationData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit application"
      );
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return "document-text";
    if (mimeType?.includes("image")) return "image";
    if (mimeType?.includes("word") || mimeType?.includes("document"))
      return "document";
    return "document";
  };

  const getFileColor = (mimeType) => {
    if (mimeType?.includes("pdf")) return "#EF4444";
    if (mimeType?.includes("image")) return "#3B82F6";
    if (mimeType?.includes("word")) return "#2563EB";
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
    categories.find((c) => c.key === cat) || categories[0];

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: "#10B981", light: "#D1FAE5" },
      closed: { bg: "#EF4444", light: "#FEE2E2" },
      upcoming: { bg: "#F59E0B", light: "#FEF3C7" },
    };
    return colors[status] || colors.active;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && items.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader title="Jobs & Forms" showBack showMenu />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Jobs & Forms" showBack showMenu />

      {/* Tab Switcher */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        <View className="flex-row bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => {
              setActiveTab("jobs");
              setFilterCategory("");
              setSearchQuery("");
            }}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "jobs" ? "bg-blue-500" : "bg-transparent"
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="briefcase"
                size={20}
                color={activeTab === "jobs" ? "#FFFFFF" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-bold ${
                  activeTab === "jobs"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Jobs
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveTab("forms");
              setFilterCategory("");
              setSearchQuery("");
            }}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "forms" ? "bg-blue-500" : "bg-transparent"
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="document-text"
                size={20}
                color={activeTab === "forms" ? "#FFFFFF" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-bold ${
                  activeTab === "forms"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Forms
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="bg-white dark:bg-gray-800 px-4 pb-3">
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

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

      {/* Items List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchItems}
            colors={["#3B82F6"]}
          />
        }
      >
        {items.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-12 items-center mt-8 shadow-sm">
            <View className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full items-center justify-center mb-4">
              <Ionicons
                name={
                  activeTab === "jobs"
                    ? "briefcase-outline"
                    : "document-text-outline"
                }
                size={48}
                color="#9CA3AF"
              />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-xl mb-2">
              No {activeTab === "jobs" ? "Jobs" : "Forms"} Found
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
              {filterCategory
                ? `No ${getCategoryInfo(filterCategory).label.toLowerCase()} ${activeTab} available`
                : `No ${activeTab} available at the moment`}
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            const statusConfig = getStatusColor(item.status);

            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
                className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-md overflow-hidden"
              >
                {/* Header Badge */}
                {(item.isFeatured || item.isPinned) && (
                  <View
                    style={{ backgroundColor: statusConfig.bg }}
                    className="px-4 py-2.5 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#FFFFFF" />
                      <Text className="text-white text-xs font-bold ml-2">
                        {activeTab === "jobs"
                          ? "FEATURED JOB"
                          : "IMPORTANT FORM"}
                      </Text>
                    </View>
                    {item.deadline && (
                      <View className="flex-row items-center">
                        <Ionicons name="time" size={14} color="#FFFFFF" />
                        <Text className="text-white text-xs font-semibold ml-1">
                          {formatDate(item.deadline)}
                        </Text>
                      </View>
                    )}
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
                      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-6">
                        {item.title}
                      </Text>

                      {activeTab === "jobs" && item.organization && (
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="business" size={14} color="#6B7280" />
                          <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1.5">
                            {item.organization}
                          </Text>
                        </View>
                      )}

                      {activeTab === "jobs" && item.location && (
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="location" size={14} color="#6B7280" />
                          <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1.5">
                            {item.location}
                          </Text>
                        </View>
                      )}

                      <Text
                        className="text-gray-600 dark:text-gray-400 text-sm leading-5"
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>

                      {item.attachments && item.attachments.length > 0 && (
                        <View className="flex-row items-center mt-3 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg self-start">
                          <Ionicons name="attach" size={16} color="#3B82F6" />
                          <Text className="text-blue-600 dark:text-blue-400 text-xs ml-1.5 font-semibold">
                            {item.attachments.length} file
                            {item.attachments.length > 1 ? "s" : ""}
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

                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <View className="flex-row items-center">
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
                        {item.views || 0} views
                      </Text>
                    </View>

                    {item.deadline && (
                      <View className="flex-row items-center bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                        <Ionicons name="calendar" size={12} color="#F59E0B" />
                        <Text className="text-orange-600 dark:text-orange-400 text-xs ml-1 font-semibold">
                          {formatDate(item.deadline)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Detail Modal */}
      {selectedItem && (
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

              {/* Header */}
              <View
                style={{
                  backgroundColor: getCategoryInfo(selectedItem.category).color,
                }}
                className="p-6 pb-8"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-white/20 backdrop-blur-lg w-16 h-16 rounded-2xl items-center justify-center shadow-lg">
                    <Ionicons
                      name={getCategoryInfo(selectedItem.category).icon}
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
                    {getCategoryInfo(selectedItem.category).label} •{" "}
                    {activeTab === "jobs" ? "JOB" : "FORM"}
                  </Text>
                </View>
              </View>

              {/* Body */}
              <ScrollView
                className="bg-white dark:bg-gray-900"
                style={{ maxHeight: 500 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="px-6 pt-6 pb-4">
                  {/* Title */}
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-8">
                    {selectedItem.title}
                  </Text>

                  {/* Job Specific Info */}
                  {activeTab === "jobs" && (
                    <View className="mb-4">
                      {selectedItem.organization && (
                        <View className="flex-row items-center mb-2">
                          <View className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-lg items-center justify-center mr-2">
                            <Ionicons
                              name="business"
                              size={16}
                              color="#3B82F6"
                            />
                          </View>
                          <Text className="text-gray-700 dark:text-gray-300 font-semibold">
                            {selectedItem.organization}
                          </Text>
                        </View>
                      )}

                      {selectedItem.location && (
                        <View className="flex-row items-center mb-2">
                          <View className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-lg items-center justify-center mr-2">
                            <Ionicons
                              name="location"
                              size={16}
                              color="#10B981"
                            />
                          </View>
                          <Text className="text-gray-700 dark:text-gray-300">
                            {selectedItem.location}
                          </Text>
                        </View>
                      )}

                      {selectedItem.salary && (
                        <View className="flex-row items-center mb-2">
                          <View className="bg-yellow-100 dark:bg-yellow-900/30 w-8 h-8 rounded-lg items-center justify-center mr-2">
                            <Ionicons name="cash" size={16} color="#F59E0B" />
                          </View>
                          <Text className="text-gray-700 dark:text-gray-300">
                            {selectedItem.salary}
                          </Text>
                        </View>
                      )}

                      {selectedItem.experience && (
                        <View className="flex-row items-center mb-2">
                          <View className="bg-purple-100 dark:bg-purple-900/30 w-8 h-8 rounded-lg items-center justify-center mr-2">
                            <Ionicons
                              name="briefcase"
                              size={16}
                              color="#8B5CF6"
                            />
                          </View>
                          <Text className="text-gray-700 dark:text-gray-300">
                            Experience: {selectedItem.experience}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Description */}
                  <Text className="text-gray-700 dark:text-gray-300 leading-7 mb-6 text-base">
                    {selectedItem.description}
                  </Text>

                  {/* Requirements/Eligibility */}
                  {selectedItem.requirements &&
                    selectedItem.requirements.length > 0 && (
                      <View className="mb-6">
                        <Text className="text-gray-900 dark:text-white font-bold text-lg mb-3">
                          📋{" "}
                          {activeTab === "jobs"
                            ? "Requirements"
                            : "Eligibility"}
                        </Text>
                        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          {selectedItem.requirements.map((req, index) => (
                            <View
                              key={index}
                              className="flex-row items-start mb-2"
                            >
                              <View className="bg-blue-500 w-2 h-2 rounded-full mt-2 mr-3" />
                              <Text className="flex-1 text-gray-700 dark:text-gray-300 leading-6">
                                {req}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                  {/* Attachments */}
                  {selectedItem.attachments &&
                    selectedItem.attachments.length > 0 && (
                      <View className="mb-6">
                        <View className="flex-row items-center mb-4">
                          <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="attach" size={20} color="#3B82F6" />
                          </View>
                          <Text className="text-gray-900 dark:text-white font-bold text-lg">
                            Attachments ({selectedItem.attachments.length})
                          </Text>
                        </View>

                        {selectedItem.attachments.map((attachment, index) => {
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
                                    downloadingFile ===
                                    (attachment.fileId || attachment._id)
                                  }
                                  className="flex-1 bg-green-500 rounded-xl p-3.5 flex-row items-center justify-center shadow-sm"
                                  style={{
                                    opacity:
                                      downloadingFile ===
                                      (attachment.fileId || attachment._id)
                                        ? 0.7
                                        : 1,
                                  }}
                                >
                                  {downloadingFile ===
                                  (attachment.fileId || attachment._id) ? (
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

                  {/* Deadline & Status */}
                  <View className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 mb-4">
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-4">
                      Important Information
                    </Text>

                    <View className="space-y-3">
                      {selectedItem.deadline && (
                        <View className="flex-row items-center">
                          <View className="bg-orange-100 dark:bg-orange-900/30 w-9 h-9 rounded-lg items-center justify-center mr-3">
                            <Ionicons
                              name="calendar"
                              size={18}
                              color="#F59E0B"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                              Deadline
                            </Text>
                            <Text className="text-gray-900 dark:text-white font-semibold">
                              {formatDate(selectedItem.deadline)}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View className="h-px bg-gray-200 dark:bg-gray-700" />

                      <View className="flex-row items-center">
                        <View className="bg-purple-100 dark:bg-purple-900/30 w-9 h-9 rounded-lg items-center justify-center mr-3">
                          <Ionicons name="time" size={18} color="#8B5CF6" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                            Posted on
                          </Text>
                          <Text className="text-gray-900 dark:text-white font-semibold">
                            {new Date(
                              selectedItem.createdAt
                            ).toLocaleDateString("en-US", {
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
                          <Ionicons name="eye" size={18} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                            Total Views
                          </Text>
                          <Text className="text-gray-900 dark:text-white font-semibold">
                            {selectedItem.views || 0} views
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Footer Buttons */}
              <View className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                {activeTab === "jobs" ? (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={closeModal}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-2xl py-4 items-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-gray-800 dark:text-white font-bold text-base">
                        Close
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleApplyForJob}
                      className="flex-1 bg-blue-500 rounded-2xl py-4 items-center shadow-lg"
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="paper-plane" size={20} color="white" />
                        <Text className="text-white font-bold text-base ml-2">
                          Apply Now
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={closeModal}
                    className="bg-blue-500 rounded-2xl py-4 items-center shadow-lg"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-lg">
                      Got it, Thanks!
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Job Application Modal */}
      {activeTab === "jobs" && (
        <Modal
          visible={applyModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View className="flex-1 justify-center items-center bg-black/70 px-6">
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
              <View className="items-center mb-6">
                <View className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                  <Ionicons name="paper-plane" size={32} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Apply for Job
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center text-sm">
                  Fill in your details to apply for this position
                </Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
              >
                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Full Name *
                </Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={applicationData.name}
                  onChangeText={(text) =>
                    setApplicationData({ ...applicationData, name: text })
                  }
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
                  placeholderTextColor="#9CA3AF"
                />

                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Email *
                </Text>
                <TextInput
                  placeholder="Enter your email"
                  value={applicationData.email}
                  onChangeText={(text) =>
                    setApplicationData({ ...applicationData, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
                  placeholderTextColor="#9CA3AF"
                />

                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Phone *
                </Text>
                <TextInput
                  placeholder="Enter your phone number"
                  value={applicationData.phone}
                  onChangeText={(text) =>
                    setApplicationData({ ...applicationData, phone: text })
                  }
                  keyboardType="phone-pad"
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
                  placeholderTextColor="#9CA3AF"
                />

                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Cover Message (Optional)
                </Text>
                <TextInput
                  placeholder="Why are you interested in this position?"
                  value={applicationData.message}
                  onChangeText={(text) =>
                    setApplicationData({ ...applicationData, message: text })
                  }
                  multiline
                  numberOfLines={4}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
                  placeholderTextColor="#9CA3AF"
                  style={{ textAlignVertical: "top" }}
                />
              </ScrollView>

              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  onPress={() => {
                    setApplyModalVisible(false);
                    setApplicationData({
                      name: "",
                      email: "",
                      phone: "",
                      message: "",
                    });
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl p-4 items-center"
                >
                  <Text className="text-gray-800 dark:text-white font-bold">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={submitJobApplication}
                  className="flex-1 bg-blue-500 rounded-xl p-4 items-center shadow-lg"
                >
                  <Text className="text-white font-bold">
                    Submit Application
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
