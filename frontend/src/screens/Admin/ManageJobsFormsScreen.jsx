// src/screens/Admin/ManageJobsFormsScreen.jsx - Admin Jobs & Forms Management
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => (
  <View
    style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-4 mr-3 min-w-[140px] shadow-sm"
  >
    <View className="flex-row items-center justify-between mb-2">
      <View
        style={{ backgroundColor: color + "20" }}
        className="w-10 h-10 rounded-xl items-center justify-center"
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={{ color }} className="text-2xl font-bold">
        {value}
      </Text>
    </View>
    <Text className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
      {label}
    </Text>
  </View>
);

export default function ManageJobsFormsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Google Drive URL Modal
  const [gdriveModalVisible, setGdriveModalVisible] = useState(false);
  const [gdriveUrl, setGdriveUrl] = useState("");
  const [gdriveFileName, setGdriveFileName] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("active");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState("");

  // Job specific
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Form specific
  const [isImportant, setIsImportant] = useState(false);

  const jobCategories = [
    {
      key: "government",
      label: "Government",
      color: "#10B981",
      icon: "business",
    },
    { key: "private", label: "Private", color: "#8B5CF6", icon: "people" },
    { key: "banking", label: "Banking", color: "#F59E0B", icon: "card" },
    { key: "education", label: "Education", color: "#EF4444", icon: "school" },
    {
      key: "healthcare",
      label: "Healthcare",
      color: "#EC4899",
      icon: "medical",
    },
    {
      key: "other",
      label: "Other",
      color: "#6B7280",
      icon: "ellipsis-horizontal",
    },
  ];

  const formCategories = [
    {
      key: "government",
      label: "Government",
      color: "#10B981",
      icon: "business",
    },
    {
      key: "certificate",
      label: "Certificate",
      color: "#F59E0B",
      icon: "ribbon",
    },
    {
      key: "application",
      label: "Application",
      color: "#8B5CF6",
      icon: "create",
    },
    { key: "income", label: "Income", color: "#EF4444", icon: "cash" },
    { key: "other", label: "Other", color: "#6B7280", icon: "document" },
  ];

  const categories = activeTab === "jobs" ? jobCategories : formCategories;

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setRefreshing(true);
      const endpoint =
        activeTab === "jobs" ? "/jobs/admin/all" : "/forms/admin/all";
      const { data } = await api.get(endpoint);

      if (data.success) {
        setItems(data[activeTab] || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      Alert.alert("Error", `Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const convertGDriveUrl = (url) => {
    try {
      let fileId = null;

      if (url.includes("/file/d/")) {
        fileId = url.split("/file/d/")[1].split("/")[0];
      } else if (url.includes("open?id=")) {
        fileId = url.split("open?id=")[1].split("&")[0];
      } else if (url.includes("uc?id=")) {
        fileId = url.split("uc?id=")[1].split("&")[0];
      } else if (url.length === 33 || url.length === 44) {
        fileId = url;
      }

      if (!fileId) {
        throw new Error("Invalid Google Drive URL");
      }

      return {
        fileId,
        viewLink: `https://drive.google.com/file/d/${fileId}/view`,
        downloadLink: `https://drive.google.com/uc?export=download&id=${fileId}`,
        previewLink: `https://drive.google.com/file/d/${fileId}/preview`,
      };
    } catch (error) {
      return null;
    }
  };

  const handleAddGDriveUrl = () => {
    if (!gdriveUrl.trim() || !gdriveFileName.trim()) {
      Alert.alert("Error", "Please enter both file name and Google Drive URL");
      return;
    }

    const convertedUrls = convertGDriveUrl(gdriveUrl.trim());

    if (!convertedUrls) {
      Alert.alert("Error", "Invalid Google Drive URL");
      return;
    }

    const newAttachment = {
      name: gdriveFileName.trim().endsWith(".pdf")
        ? gdriveFileName.trim()
        : `${gdriveFileName.trim()}.pdf`,
      url: convertedUrls.viewLink,
      type: "application/pdf",
      fileId: convertedUrls.fileId,
      viewLink: convertedUrls.viewLink,
      downloadLink: convertedUrls.downloadLink,
      previewLink: convertedUrls.previewLink,
      mimeType: "application/pdf",
      source: "google-drive",
    };

    setAttachments([...attachments, newAttachment]);
    setGdriveUrl("");
    setGdriveFileName("");
    setGdriveModalVisible(false);
    Alert.alert("Success", "Google Drive file added successfully");
  };

  const uploadFile = async (file) => {
    try {
      setUploadingFile(true);

      const formData = new FormData();

      if (Platform.OS === "web") {
        if (file instanceof File) {
          formData.append("file", file);
        } else {
          Alert.alert("Error", "Invalid file format for web");
          return;
        }
      } else {
        const fileUri = file.uri;
        const fileName = file.name || fileUri.split("/").pop();
        const fileType =
          file.mimeType || file.type || "application/octet-stream";

        formData.append("file", {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      }

      const authData = await AsyncStorage.getItem("authData");
      const parsedData = JSON.parse(authData);
      const token = parsedData ? parsedData.token : null;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setAttachments([
          ...attachments,
          {
            ...data.file,
            source: "server-upload",
          },
        ]);
        Alert.alert("Success", "File uploaded successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  const pickDocument = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf,image/*";

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const validTypes = [
              "application/pdf",
              "image/jpeg",
              "image/jpg",
              "image/png",
            ];
            if (!validTypes.includes(file.type)) {
              Alert.alert("Error", "Only PDF and image files are allowed");
              return;
            }

            if (file.size > 10 * 1024 * 1024) {
              Alert.alert("Error", "File size must be less than 10MB");
              return;
            }

            uploadFile(file);
          }
        };

        input.click();
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["application/pdf", "image/*"],
          copyToCacheDirectory: true,
        });

        if (result.type === "success" || !result.canceled) {
          const fileData = result.assets ? result.assets[0] : result;
          uploadFile(fileData);
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const removeAttachment = (index) => {
    Alert.alert(
      "Remove Attachment",
      "Are you sure you want to remove this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setAttachments(attachments.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (activeTab === "jobs" && !organization.trim()) {
      Alert.alert("Error", "Organization name is required for jobs");
      return;
    }

    try {
      setLoading(true);

      const baseData = {
        title,
        description,
        category: category || "other",
        status,
        deadline: deadline || null,
        attachments: attachments.map((att) => ({
          name: att.name,
          url: att.url || att.viewLink,
          type: att.type || att.mimeType,
          fileId: att.fileId,
          viewLink: att.viewLink,
          downloadLink: att.downloadLink,
          previewLink: att.previewLink,
          mimeType: att.mimeType,
          source: att.source,
          size: att.size,
        })),
        requirements,
      };

      let itemData;
      let endpoint;

      if (activeTab === "jobs") {
        itemData = {
          ...baseData,
          organization,
          location,
          salary,
          experience,
          isFeatured,
        };
        endpoint = editMode ? `/jobs/${selectedItem._id}` : "/jobs";
      } else {
        itemData = {
          ...baseData,
          isImportant,
        };
        endpoint = editMode ? `/forms/${selectedItem._id}` : "/forms";
      }

      let response;
      if (editMode) {
        response = await api.put(endpoint, itemData);
      } else {
        response = await api.post(endpoint, itemData);
      }

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        resetForm();
        setModalVisible(false);
        fetchItems();
      }
    } catch (error) {
      console.error(`Error saving ${activeTab}:`, error);
      Alert.alert(
        "Error",
        error.response?.data?.message || `Failed to save ${activeTab}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setStatus(item.status);
    setDeadline(
      item.deadline ? new Date(item.deadline).toISOString().split("T")[0] : ""
    );
    setAttachments(item.attachments || []);
    setRequirements(item.requirements || []);

    if (activeTab === "jobs") {
      setOrganization(item.organization || "");
      setLocation(item.location || "");
      setSalary(item.salary || "");
      setExperience(item.experience || "");
      setIsFeatured(item.isFeatured || false);
    } else {
      setIsImportant(item.isImportant || false);
    }

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
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const endpoint =
        activeTab === "jobs"
          ? `/jobs/${itemToDelete._id}`
          : `/forms/${itemToDelete._id}`;

      const { data } = await api.delete(endpoint);

      if (data.success) {
        Alert.alert(
          "Success",
          `${activeTab === "jobs" ? "Job" : "Form"} deleted successfully`
        );
        fetchItems();
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      Alert.alert("Error", `Failed to delete ${activeTab}`);
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setStatus("active");
    setDeadline("");
    setAttachments([]);
    setRequirements([]);
    setOrganization("");
    setLocation("");
    setSalary("");
    setExperience("");
    setIsFeatured(false);
    setIsImportant(false);
    setEditMode(false);
    setSelectedItem(null);
  };

  const getCategoryInfo = (cat) => {
    const category = categories.find((c) => c.key === cat);
    return category || { color: "#6B7280", label: "Other", icon: "document" };
  };

  const getFileIcon = (attachment) => {
    if (attachment.source === "google-drive") return "logo-google";
    if (attachment.mimeType?.includes("pdf")) return "document-text";
    if (attachment.mimeType?.includes("image")) return "image";
    return "document";
  };

  const getFileColor = (attachment) => {
    if (attachment.source === "google-drive") return "#4285F4";
    if (attachment.mimeType?.includes("pdf")) return "#EF4444";
    if (attachment.mimeType?.includes("image")) return "#3B82F6";
    return "#6B7280";
  };

  if (loading && items.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader
          title={`Manage ${activeTab === "jobs" ? "Jobs" : "Forms"}`}
          showBack
          showMenu
        />
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
      <CustomHeader
        title={`Manage ${activeTab === "jobs" ? "Jobs" : "Forms"}`}
        showBack
        showMenu
      />

      {/* Tab Switcher with Gradient */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm">
        <View className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-1.5">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab("jobs")}
              className={`flex-1 py-3.5 rounded-xl ${
                activeTab === "jobs"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                  : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="briefcase"
                  size={22}
                  color={activeTab === "jobs" ? "#FFFFFF" : "#9CA3AF"}
                />
                <Text
                  className={`ml-2 font-bold text-base ${
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
              onPress={() => setActiveTab("forms")}
              className={`flex-1 py-3.5 rounded-xl ${
                activeTab === "forms"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                  : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="document-text"
                  size={22}
                  color={activeTab === "forms" ? "#FFFFFF" : "#9CA3AF"}
                />
                <Text
                  className={`ml-2 font-bold text-base ${
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
      </View>

      {/* Enhanced Stats Cards */}
      <View className="bg-white dark:bg-gray-800 px-4 py-5 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StatCard
            label="Total"
            value={stats.total || 0}
            color="#3B82F6"
            icon="stats-chart"
          />
          <StatCard
            label="Active"
            value={stats.active || 0}
            color="#10B981"
            icon="checkmark-circle"
          />
          <StatCard
            label="Closed"
            value={stats.closed || 0}
            color="#EF4444"
            icon="close-circle"
          />
          <StatCard
            label={activeTab === "jobs" ? "Featured" : "Important"}
            value={
              activeTab === "jobs" ? stats.featured || 0 : stats.important || 0
            }
            color="#F59E0B"
            icon="star"
          />
        </ScrollView>
      </View>

      {/* Enhanced Add Button */}
      <View className="px-4 py-4">
        <TouchableOpacity
          onPress={() => {
            resetForm();
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
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 flex-row items-center justify-center shadow-lg"
        >
          <View className="bg-white/20 w-10 h-10 rounded-xl items-center justify-center mr-3">
            <Ionicons name="add" size={28} color="white" />
          </View>
          <Text className="text-white font-bold text-lg">
            Create New {activeTab === "jobs" ? "Job" : "Form"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Enhanced Items List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchItems}
            colors={["#3B82F6"]}
          />
        }
      >
        {items.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-12 items-center mt-8 shadow-sm">
            <View className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 w-32 h-32 rounded-full items-center justify-center mb-6">
              <Ionicons
                name={
                  activeTab === "jobs"
                    ? "briefcase-outline"
                    : "document-text-outline"
                }
                size={64}
                color="#3B82F6"
              />
            </View>
            <Text className="text-gray-800 dark:text-white font-bold text-2xl mb-3">
              No {activeTab === "jobs" ? "Jobs" : "Forms"} Yet
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-base leading-6">
              Create your first {activeTab === "jobs" ? "job posting" : "form"}{" "}
              to get started
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            const statusColors = {
              active: { bg: "#10B981", light: "#D1FAE5", dark: "#065F46" },
              closed: { bg: "#EF4444", light: "#FEE2E2", dark: "#991B1B" },
              upcoming: { bg: "#F59E0B", light: "#FEF3C7", dark: "#92400E" },
            };
            const statusConfig =
              statusColors[item.status] || statusColors.active;

            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.95}
                className="bg-white dark:bg-gray-800 rounded-3xl mb-4 shadow-lg overflow-hidden"
              >
                {/* Enhanced Header Badge */}
                {(item.isFeatured || item.isImportant || item.isPinned) && (
                  <View
                    style={{ backgroundColor: statusConfig.bg }}
                    className="px-5 py-3 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-white/30 w-7 h-7 rounded-lg items-center justify-center mr-2">
                        <Ionicons name="star" size={16} color="#FFFFFF" />
                      </View>
                      <Text className="text-white text-sm font-bold tracking-wide">
                        {activeTab === "jobs"
                          ? "FEATURED JOB"
                          : "IMPORTANT FORM"}
                      </Text>
                    </View>
                    <View
                      style={{ backgroundColor: statusConfig.dark }}
                      className="px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-white text-xs font-bold uppercase">
                        {item.status}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="p-6">
                  <View className="flex-row items-start mb-4">
                    {/* Enhanced Category Icon */}
                    <View className="relative mr-4">
                      <View
                        style={{ backgroundColor: categoryInfo.color }}
                        className="w-16 h-16 rounded-2xl items-center justify-center shadow-md"
                      >
                        <Ionicons
                          name={categoryInfo.icon}
                          size={28}
                          color="white"
                        />
                      </View>
                      <View
                        style={{ backgroundColor: categoryInfo.color }}
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white dark:border-gray-800"
                      >
                        <Ionicons
                          name={
                            activeTab === "jobs" ? "briefcase" : "document-text"
                          }
                          size={12}
                          color="white"
                        />
                      </View>
                    </View>

                    <View className="flex-1">
                      {/* Category Badge */}
                      <View
                        style={{ backgroundColor: categoryInfo.color + "20" }}
                        className="px-3 py-1.5 rounded-lg self-start mb-2"
                      >
                        <Text
                          style={{ color: categoryInfo.color }}
                          className="text-xs font-bold uppercase tracking-wider"
                        >
                          {categoryInfo.label}
                        </Text>
                      </View>

                      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-7">
                        {item.title}
                      </Text>

                      {activeTab === "jobs" && item.organization && (
                        <View className="flex-row items-center mb-2">
                          <View className="bg-blue-100 dark:bg-blue-900/30 w-6 h-6 rounded-lg items-center justify-center mr-2">
                            <Ionicons
                              name="business"
                              size={14}
                              color="#3B82F6"
                            />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                            {item.organization}
                          </Text>
                        </View>
                      )}

                      <Text
                        className="text-gray-600 dark:text-gray-400 text-sm leading-6"
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>

                      {/* Enhanced Attachments Badge */}
                      {item.attachments?.length > 0 && (
                        <View className="flex-row items-center mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-2.5 rounded-xl self-start border border-blue-200/50 dark:border-blue-700/30">
                          <View className="bg-blue-500 w-7 h-7 rounded-lg items-center justify-center mr-2">
                            <Ionicons name="attach" size={16} color="white" />
                          </View>
                          <Text className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                            {item.attachments.length} Attachment
                            {item.attachments.length > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Enhanced Footer */}
                  <View className="flex-row items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        <Ionicons
                          name="eye-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                        <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2 font-semibold">
                          {item.views || 0}
                        </Text>
                      </View>

                      {item.deadline && (
                        <View className="flex-row items-center bg-orange-100 dark:bg-orange-900/30 px-3 py-2 rounded-lg">
                          <Ionicons name="calendar" size={14} color="#F59E0B" />
                          <Text className="text-orange-600 dark:text-orange-400 text-xs ml-1.5 font-bold">
                            {new Date(item.deadline).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Enhanced Action Buttons */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md"
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create" size={20} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDelete(item)}
                        className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-md"
                        activeOpacity={0.8}
                      >
                        <Ionicons name="trash" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Enhanced Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="none" transparent={true}>
        <View className="flex-1 justify-end bg-black/70">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              maxHeight: "95%",
            }}
            className="bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden"
          >
            {/* Drag Indicator */}
            <View className="items-center py-3 bg-white dark:bg-gray-900">
              <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </View>

            {/* Enhanced Header */}
            <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold mb-1">
                    {editMode ? "Edit" : "Create"}{" "}
                    {activeTab === "jobs" ? "Job" : "Form"}
                  </Text>
                  <Text className="text-blue-100 text-sm">
                    Fill in the details below
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
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
                    ]).start(() => setModalVisible(false));
                  }}
                  className="bg-white/20 w-10 h-10 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              className="bg-white dark:bg-gray-900 px-6 py-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View className="mb-5">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                  Title <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  placeholder={`Enter ${activeTab === "jobs" ? "job" : "form"} title`}
                  value={title}
                  onChangeText={setTitle}
                  className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base border-2 border-transparent focus:border-blue-500"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Description */}
              <View className="mb-5">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                  Description <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  placeholder={`Enter ${activeTab === "jobs" ? "job" : "form"} description`}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base border-2 border-transparent focus:border-blue-500"
                  placeholderTextColor="#9CA3AF"
                  style={{ textAlignVertical: "top", minHeight: 100 }}
                />
              </View>

              {/* Job Specific Fields */}
              {activeTab === "jobs" && (
                <>
                  <View className="mb-5">
                    <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                      Organization <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder="Enter organization name"
                      value={organization}
                      onChangeText={setOrganization}
                      className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base border-2 border-transparent focus:border-blue-500"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View className="flex-row gap-3 mb-5">
                    <View className="flex-1">
                      <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                        Location
                      </Text>
                      <TextInput
                        placeholder="City, State"
                        value={location}
                        onChangeText={setLocation}
                        className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                        Experience
                      </Text>
                      <TextInput
                        placeholder="e.g., 2-5 years"
                        value={experience}
                        onChangeText={setExperience}
                        className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <View className="mb-5">
                    <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                      Salary Range
                    </Text>
                    <TextInput
                      placeholder="e.g., ₹30,000 - ₹50,000"
                      value={salary}
                      onChangeText={setSalary}
                      className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </>
              )}

              {/* Category */}
              <View className="mb-5">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-3 text-base">
                  Category
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-2"
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setCategory(cat.key)}
                      style={{
                        backgroundColor:
                          category === cat.key ? cat.color : undefined,
                      }}
                      className={`mr-3 px-5 py-3 rounded-xl flex-row items-center ${
                        category !== cat.key
                          ? "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                          : "shadow-lg"
                      }`}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={18}
                        color={category === cat.key ? "white" : "#9CA3AF"}
                      />
                      <Text
                        className={`ml-2 font-bold ${
                          category === cat.key
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Status & Deadline */}
              <View className="flex-row gap-3 mb-5">
                <View className="flex-1">
                  <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                    Status
                  </Text>
                  <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                    <TouchableOpacity
                      onPress={() => setStatus("active")}
                      className={`p-4 flex-row items-center ${status === "active" ? "bg-green-500" : ""}`}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={status === "active" ? "white" : "#10B981"}
                      />
                      <Text
                        className={`ml-2 font-semibold ${status === "active" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        Active
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-base">
                    Deadline
                  </Text>
                  <TextInput
                    placeholder="YYYY-MM-DD"
                    value={deadline}
                    onChangeText={setDeadline}
                    className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Feature/Important Toggle */}
              <TouchableOpacity
                onPress={() =>
                  activeTab === "jobs"
                    ? setIsFeatured(!isFeatured)
                    : setIsImportant(!isImportant)
                }
                className={`flex-row items-center justify-between p-4 rounded-2xl mb-5 ${
                  (activeTab === "jobs" ? isFeatured : isImportant)
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="star"
                    size={24}
                    color={
                      (activeTab === "jobs" ? isFeatured : isImportant)
                        ? "white"
                        : "#F59E0B"
                    }
                  />
                  <Text
                    className={`ml-3 font-bold text-base ${
                      (activeTab === "jobs" ? isFeatured : isImportant)
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Mark as {activeTab === "jobs" ? "Featured" : "Important"}
                  </Text>
                </View>
                <View
                  className={`w-14 h-8 rounded-full p-1 ${
                    (activeTab === "jobs" ? isFeatured : isImportant)
                      ? "bg-white/30"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded-full transition-all ${
                      (activeTab === "jobs" ? isFeatured : isImportant)
                        ? "bg-white ml-auto"
                        : "bg-white"
                    }`}
                  />
                </View>
              </TouchableOpacity>

              {/* Requirements */}
              <View className="mb-5">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-3 text-base">
                  {activeTab === "jobs"
                    ? "Requirements"
                    : "Eligibility Criteria"}
                </Text>
                <View className="flex-row mb-3">
                  <TextInput
                    placeholder="Add requirement"
                    value={newRequirement}
                    onChangeText={setNewRequirement}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mr-2 text-gray-900 dark:text-white"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={addRequirement}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl px-5 items-center justify-center shadow-md"
                  >
                    <Ionicons name="add" size={28} color="white" />
                  </TouchableOpacity>
                </View>
                {requirements.map((req, index) => (
                  <View
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 mb-2 flex-row items-center border border-blue-200/50 dark:border-blue-700/30"
                  >
                    <View className="bg-blue-500 w-2 h-2 rounded-full mr-3" />
                    <Text className="flex-1 text-gray-800 dark:text-gray-200 font-medium">
                      {req}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeRequirement(index)}
                      className="ml-2"
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Attachments */}
              <View className="mb-5">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-3 text-base">
                  Attachments
                </Text>

                <View className="flex-row gap-3 mb-3">
                  <TouchableOpacity
                    onPress={pickDocument}
                    disabled={uploadingFile}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 flex-row items-center justify-center shadow-md"
                  >
                    {uploadingFile ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons name="cloud-upload" size={22} color="white" />
                        <Text className="text-white font-bold ml-2">
                          Upload File
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setGdriveModalVisible(true)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 flex-row items-center justify-center shadow-md"
                  >
                    <Ionicons name="logo-google" size={22} color="white" />
                    <Text className="text-white font-bold ml-2">
                      Google Drive
                    </Text>
                  </TouchableOpacity>
                </View>

                {attachments.map((attachment, index) => {
                  const fileColor = getFileColor(attachment);
                  return (
                    <View
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-3 border-2 border-gray-200 dark:border-gray-700"
                    >
                      <View className="flex-row items-center">
                        <View
                          style={{ backgroundColor: fileColor + "20" }}
                          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        >
                          <Ionicons
                            name={getFileIcon(attachment)}
                            size={24}
                            color={fileColor}
                          />
                        </View>
                        <View className="flex-1 mr-2">
                          <Text
                            className="text-gray-900 dark:text-white font-semibold mb-1"
                            numberOfLines={1}
                          >
                            {attachment.name}
                          </Text>
                          <View
                            style={{ backgroundColor: fileColor + "20" }}
                            className="px-2 py-1 rounded self-start"
                          >
                            <Text
                              style={{ color: fileColor }}
                              className="text-xs font-bold"
                            >
                              {attachment.source === "google-drive"
                                ? "Google Drive"
                                : "Uploaded"}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeAttachment(index)}
                          className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-xl items-center justify-center"
                        >
                          <Ionicons name="trash" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Enhanced Footer */}
            <View className="px-6 py-5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
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
                    ]).start(() => setModalVisible(false));
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-2xl py-4 items-center"
                >
                  <Text className="text-gray-800 dark:text-white font-bold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreateOrUpdate}
                  disabled={loading}
                  className="flex-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl py-4 items-center shadow-lg"
                  style={{ flex: 2 }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <View className="flex-row items-center">
                      <Ionicons
                        name={editMode ? "save" : "add-circle"}
                        size={22}
                        color="white"
                      />
                      <Text className="text-white font-bold text-base ml-2">
                        {editMode ? "Update" : "Create"}{" "}
                        {activeTab === "jobs" ? "Job" : "Form"}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Google Drive URL Modal */}
      <Modal
        visible={gdriveModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md">
            <View className="items-center mb-6">
              <View className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full items-center justify-center mb-4 shadow-lg">
                <Ionicons name="logo-google" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Add Google Drive File
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Enter the Google Drive sharing link
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                File Name
              </Text>
              <TextInput
                placeholder="Enter file name"
                value={gdriveFileName}
                onChangeText={setGdriveFileName}
                className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Google Drive URL
              </Text>
              <TextInput
                placeholder="Paste Google Drive link here"
                value={gdriveUrl}
                onChangeText={setGdriveUrl}
                className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-gray-900 dark:text-white"
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setGdriveModalVisible(false);
                  setGdriveUrl("");
                  setGdriveFileName("");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddGDriveUrl}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 items-center shadow-lg"
              >
                <Text className="text-white font-bold">Add File</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Enhanced Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md">
            <View className="items-center mb-6">
              <View className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-full items-center justify-center mb-4 shadow-lg">
                <Ionicons name="warning" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Delete {activeTab === "jobs" ? "Job" : "Form"}?
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to delete "{itemToDelete?.title}"? This
                action cannot be undone.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 items-center shadow-lg"
              >
                <View className="flex-row items-center">
                  <Ionicons name="trash" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
