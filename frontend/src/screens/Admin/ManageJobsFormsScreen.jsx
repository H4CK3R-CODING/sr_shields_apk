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
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NavLayout from "@/src/components/Navbar/NavLayout";

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => (
  <View
    style={{ borderLeftColor: color, borderLeftWidth: 4, borderRadius: 16 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-4 mr-3 min-w-[140px] shadow-sm"
  >
    <View className="flex-row items-center justify-between mb-2">
      <View
        style={{ backgroundColor: color + "20", borderRadius: 16 }}
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

export default function ManageJobsFormsScreen() {
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
        },
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
      ],
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
        error.response?.data?.message || `Failed to save ${activeTab}`,
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
      item.deadline ? new Date(item.deadline).toISOString().split("T")[0] : "",
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
          `${activeTab === "jobs" ? "Job" : "Form"} deleted successfully`,
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
    return <AdminJobsFormsSkeleton />;
  }

  return (
    <NavLayout title={`Manage ${activeTab === "jobs" ? "Jobs" : "Forms"}`}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* <CustomHeader
        title={`Manage ${activeTab === "jobs" ? "Jobs" : "Forms"}`}
        showBack
        showMenu
      /> */}

        {/* Tab Switcher with LinearGradient */}
        <View className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm">
          <LinearGradient
            colors={["#F3F4F6", "#E5E7EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16 }}
            className="rounded-2xl p-1.5"
          >
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setActiveTab("jobs")}
                style={{ borderRadius: 16 }}
                className="flex-1 rounded-xl"
              >
                {activeTab === "jobs" ? (
                  <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3.5 rounded-xl"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                      borderRadius: 16,
                    }}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="briefcase" size={22} color="#FFFFFF" />
                      <Text className="ml-2 font-bold text-base text-white">
                        Jobs
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View className="py-3.5 bg-transparent">
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="briefcase" size={22} color="#9CA3AF" />
                      <Text className="ml-2 font-bold text-base text-gray-600 dark:text-gray-400">
                        Jobs
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("forms")}
                className="flex-1 rounded-xl"
                style={{ borderRadius: 16 }}
              >
                {activeTab === "forms" ? (
                  <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3.5 rounded-xl"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                      borderRadius: 16,
                    }}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name="document-text"
                        size={22}
                        color="#FFFFFF"
                      />
                      <Text className="ml-2 font-bold text-base text-white">
                        Forms
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View className="py-3.5 bg-transparent">
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name="document-text"
                        size={22}
                        color="#9CA3AF"
                      />
                      <Text className="ml-2 font-bold text-base text-gray-600 dark:text-gray-400">
                        Forms
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Cards */}
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
                activeTab === "jobs"
                  ? stats.featured || 0
                  : stats.important || 0
              }
              color="#F59E0B"
              icon="star"
            />
          </ScrollView>
        </View>

        {/* Add Button with LinearGradient */}
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
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 10,
                borderRadius: 16,
              }}
            >
              <View className="flex-row items-center justify-center">
                <View className="bg-white/20 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="add" size={28} color="white" />
                </View>
                <Text className="text-white font-bold text-lg">
                  Create New {activeTab === "jobs" ? "Job" : "Form"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Items List */}
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
              <LinearGradient
                colors={["#DBEAFE", "#BFDBFE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 9999 }}
                className="w-32 h-32 rounded-full items-center justify-center mb-6"
              >
                <Ionicons
                  name={
                    activeTab === "jobs"
                      ? "briefcase-outline"
                      : "document-text-outline"
                  }
                  size={64}
                  color="#3B82F6"
                />
              </LinearGradient>
              <Text className="text-gray-800 dark:text-white font-bold text-2xl mb-3">
                No {activeTab === "jobs" ? "Jobs" : "Forms"} Yet
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center text-base leading-6">
                Create your first{" "}
                {activeTab === "jobs" ? "job posting" : "form"} to get started
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
                  style={{ borderRadius: 16 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl mb-4 shadow-lg overflow-hidden"
                >
                  {/* Header Badge */}
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
                        style={{
                          backgroundColor: statusConfig.dark,
                          borderRadius: 9999,
                        }}
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
                      {/* Category Icon */}
                      <View className="relative mr-4">
                        <View
                          style={{
                            backgroundColor: categoryInfo.color,
                            borderRadius: 16,
                          }}
                          className="w-16 h-16 rounded-2xl items-center justify-center shadow-md"
                        >
                          <Ionicons
                            name={categoryInfo.icon}
                            size={28}
                            color="white"
                          />
                        </View>
                        <View
                          style={{
                            backgroundColor: categoryInfo.color,
                            borderRadius: 9999,
                          }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white dark:border-gray-800"
                        >
                          <Ionicons
                            name={
                              activeTab === "jobs"
                                ? "briefcase"
                                : "document-text"
                            }
                            size={12}
                            color="white"
                          />
                        </View>
                      </View>

                      <View className="flex-1">
                        {/* Category Badge */}
                        <View
                          style={{
                            backgroundColor: categoryInfo.color + "20",
                            borderRadius: 12,
                          }}
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

                        {/* Attachments Badge with LinearGradient */}
                        {item.attachments?.length > 0 && (
                          <View className="mt-3 self-start">
                            <LinearGradient
                              colors={["#EFF6FF", "#E0E7FF"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              className="flex-row items-center px-4 py-2.5 rounded-xl border border-blue-200/50 dark:border-blue-700/30"
                            >
                              <View className="bg-blue-500 w-7 h-7 rounded-lg items-center justify-center mr-2">
                                <Ionicons
                                  name="attach"
                                  size={16}
                                  color="white"
                                />
                              </View>
                              <Text className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                                {item.attachments.length} Attachment
                                {item.attachments.length > 1 ? "s" : ""}
                              </Text>
                            </LinearGradient>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Footer */}
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
                            <Ionicons
                              name="calendar"
                              size={14}
                              color="#F59E0B"
                            />
                            <Text className="text-orange-600 dark:text-orange-400 text-xs ml-1.5 font-bold">
                              {new Date(item.deadline).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Action Buttons with LinearGradient */}
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => handleEdit(item)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={["#3B82F6", "#2563EB"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-3 rounded-xl"
                            style={{
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 4,
                              elevation: 5,
                            }}
                          >
                            <Ionicons name="create" size={20} color="white" />
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDelete(item)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={["#EF4444", "#DC2626"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-3 rounded-xl"
                            style={{
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 4,
                              elevation: 5,
                            }}
                          >
                            <Ionicons name="trash" size={20} color="white" />
                          </LinearGradient>
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

        {/* Create/Edit Modal */}
        <Modal visible={modalVisible} animationType="none" transparent={true}>
          <View className="flex-1 justify-end bg-black/60">
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 0 }}
              style={{ maxHeight: "90%" }}
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
                className="bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden"
              >
                {/* Drag Indicator */}
                <View className="items-center py-3 bg-white dark:bg-gray-900">
                  <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </View>

                {/* Header */}
                <View className="px-6 pb-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-gray-900 dark:text-white text-2xl font-bold mb-1">
                        {editMode ? "Edit" : "Create"}{" "}
                        {activeTab === "jobs" ? "Job" : "Form"}
                      </Text>
                      <Text className="text-gray-600 dark:text-gray-400 text-sm">
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
                      className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800"
                    >
                      <Ionicons name="close" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  className="px-6"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Title */}
                  <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Title <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder={`Enter ${activeTab === "jobs" ? "job" : "form"} title`}
                      value={title}
                      onChangeText={setTitle}
                      className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  {/* Description */}
                  <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Description <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder={`Enter ${activeTab === "jobs" ? "job" : "form"} description`}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                      placeholderTextColor="#9CA3AF"
                      style={{ textAlignVertical: "top", minHeight: 100 }}
                    />
                  </View>

                  {/* Job Specific Fields */}
                  {activeTab === "jobs" && (
                    <>
                      <View className="mb-4">
                        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                          Organization <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                          placeholder="Enter organization name"
                          value={organization}
                          onChangeText={setOrganization}
                          className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>

                      <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                          <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Location
                          </Text>
                          <TextInput
                            placeholder="City, State"
                            value={location}
                            onChangeText={setLocation}
                            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>

                        <View className="flex-1">
                          <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Experience
                          </Text>
                          <TextInput
                            placeholder="e.g., 2-5 years"
                            value={experience}
                            onChangeText={setExperience}
                            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>

                      <View className="mb-4">
                        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                          Salary Range
                        </Text>
                        <TextInput
                          placeholder="e.g., ₹30,000 - ₹50,000"
                          value={salary}
                          onChangeText={setSalary}
                          className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                    </>
                  )}

                  {/* Category */}
                  <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Category
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
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
                              ? "bg-gray-100 dark:bg-gray-800"
                              : ""
                          }`}
                        >
                          <Ionicons
                            name={cat.icon}
                            size={18}
                            color={category === cat.key ? "white" : "#9CA3AF"}
                          />
                          <Text
                            className={`ml-2 font-semibold ${
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
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                      <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Status
                      </Text>
                      <TouchableOpacity
                        onPress={() => setStatus("active")}
                        className={`p-4 rounded-xl flex-row items-center ${
                          status === "active"
                            ? "bg-green-500"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={status === "active" ? "white" : "#10B981"}
                        />
                        <Text
                          className={`ml-2 font-semibold ${
                            status === "active"
                              ? "text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Active
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-1">
                      <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Deadline
                      </Text>
                      <TextInput
                        placeholder="YYYY-MM-DD"
                        value={deadline}
                        onChangeText={setDeadline}
                        className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
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
                    className="mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 p-4"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name={
                            (activeTab === "jobs" ? isFeatured : isImportant)
                              ? "star"
                              : "star-outline"
                          }
                          size={24}
                          color={
                            (activeTab === "jobs" ? isFeatured : isImportant)
                              ? "#F59E0B"
                              : "#9CA3AF"
                          }
                        />
                        <Text className="ml-3 font-semibold text-gray-900 dark:text-white">
                          Mark as{" "}
                          {activeTab === "jobs" ? "Featured" : "Important"}
                        </Text>
                      </View>
                      <View
                        className={`w-12 h-7 rounded-full ${
                          (activeTab === "jobs" ? isFeatured : isImportant)
                            ? "bg-yellow-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        } justify-center`}
                      >
                        <View
                          className={`w-5 h-5 bg-white rounded-full shadow-sm ${
                            (activeTab === "jobs" ? isFeatured : isImportant)
                              ? "ml-6"
                              : "ml-1"
                          }`}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Requirements */}
                  <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {activeTab === "jobs"
                        ? "Requirements"
                        : "Eligibility Criteria"}
                    </Text>
                    <View className="flex-row mb-3">
                      <TextInput
                        placeholder="Add requirement"
                        value={newRequirement}
                        onChangeText={setNewRequirement}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mr-2 text-gray-900 dark:text-white"
                        placeholderTextColor="#9CA3AF"
                      />
                      <TouchableOpacity
                        onPress={addRequirement}
                        className="bg-blue-500 rounded-xl px-4 items-center justify-center"
                      >
                        <Ionicons name="add" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    {requirements.map((req, index) => (
                      <View
                        key={index}
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-2 flex-row items-center border border-blue-200 dark:border-blue-800"
                      >
                        <View className="bg-blue-500 w-2 h-2 rounded-full mr-3" />
                        <Text className="flex-1 text-gray-800 dark:text-gray-200 font-medium">
                          {req}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeRequirement(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Attachments */}
                  <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      Attachments
                    </Text>

                    <View className="flex-row gap-3 mb-3">
                      <TouchableOpacity
                        onPress={pickDocument}
                        disabled={uploadingFile}
                        className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-xl p-4 flex-row items-center justify-center"
                      >
                        {uploadingFile ? (
                          <ActivityIndicator size="small" color="#10B981" />
                        ) : (
                          <>
                            <Ionicons
                              name="cloud-upload"
                              size={20}
                              color="#10B981"
                            />
                            <Text className="text-green-600 dark:text-green-400 font-semibold ml-2">
                              Upload
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setGdriveModalVisible(true)}
                        className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 flex-row items-center justify-center"
                      >
                        <Ionicons
                          name="logo-google"
                          size={20}
                          color="#3B82F6"
                        />
                        <Text className="text-blue-600 dark:text-blue-400 font-semibold ml-2">
                          Drive
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {attachments.map((attachment, index) => {
                      const fileColor = getFileColor(attachment);
                      return (
                        <View
                          key={index}
                          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
                        >
                          <View className="flex-row items-center">
                            <View
                              style={{ backgroundColor: fileColor + "20" }}
                              className="w-12 h-12 rounded-lg items-center justify-center mr-3"
                            >
                              <Ionicons
                                name={getFileIcon(attachment)}
                                size={24}
                                color={fileColor}
                              />
                            </View>
                            <View className="flex-1">
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
                                  className="text-xs font-semibold"
                                >
                                  {attachment.source === "google-drive"
                                    ? "Google Drive"
                                    : "Uploaded"}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => removeAttachment(index)}
                            >
                              <Ionicons
                                name="close-circle"
                                size={28}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Footer */}
                <View className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <TouchableOpacity
                    onPress={handleCreateOrUpdate}
                    disabled={loading}
                    className="bg-blue-500 rounded-xl p-4 items-center shadow-lg"
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold text-lg">
                        {editMode ? "Update" : "Create"}{" "}
                        {activeTab === "jobs" ? "Job" : "Form"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </KeyboardAwareScrollView>
          </View>
        </Modal>

        {/* Google Drive URL Modal */}
        <Modal
          visible={gdriveModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setGdriveModalVisible(false);
            setGdriveUrl("");
            setGdriveFileName("");
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/60 px-4">
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingVertical: 20,
              }}
              style={{ width: "100%" }}
            >
              <View
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full mx-auto"
                style={{ maxWidth: 500 }}
              >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-6">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl items-center justify-center mr-3">
                        <Ionicons
                          name="logo-google"
                          size={24}
                          color="#3B82F6"
                        />
                      </View>
                      <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
                        Google Drive
                      </Text>
                    </View>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      Add a file from your Google Drive
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setGdriveModalVisible(false);
                      setGdriveUrl("");
                      setGdriveFileName("");
                    }}
                    className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800 ml-2"
                  >
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Info Card */}
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#3B82F6"
                      className="mt-0.5"
                    />
                    <Text className="flex-1 text-blue-700 dark:text-blue-300 text-sm ml-3">
                      Make sure your Google Drive file has sharing enabled with
                      "Anyone with the link can view"
                    </Text>
                  </View>
                </View>

                {/* File Name Input */}
                <View className="mb-4">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    File Name <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="e.g., Assignment Document"
                    value={gdriveFileName}
                    onChangeText={setGdriveFileName}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Google Drive URL Input */}
                <View className="mb-6">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Google Drive Link <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="https://drive.google.com/file/d/..."
                    value={gdriveUrl}
                    onChangeText={setGdriveUrl}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-base"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    style={{ textAlignVertical: "top" }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => {
                      setGdriveModalVisible(false);
                      setGdriveUrl("");
                      setGdriveFileName("");
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl py-4 items-center"
                  >
                    <Text className="text-gray-800 dark:text-white font-bold text-base">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAddGDriveUrl}
                    disabled={!gdriveFileName.trim() || !gdriveUrl.trim()}
                    className={`flex-1 rounded-xl py-4 items-center ${
                      !gdriveFileName.trim() || !gdriveUrl.trim()
                        ? "bg-gray-400"
                        : "bg-blue-500"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="add-circle" size={20} color="white" />
                      <Text className="text-white font-bold text-base ml-2">
                        Add File
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View className="flex-1 justify-center items-center bg-black/70 px-6">
            <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md">
              <View className="items-center mb-6">
                <LinearGradient
                  colors={["#EF4444", "#DC2626"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 10,
                  }}
                >
                  <Ionicons name="warning" size={40} color="white" />
                </LinearGradient>
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

                <TouchableOpacity onPress={confirmDelete} className="flex-1">
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-2xl p-4 items-center"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 10,
                    }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="trash" size={20} color="white" />
                      <Text className="text-white font-bold ml-2">Delete</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </NavLayout>
  );
}

// Professional Skeleton Loading Component for Admin Jobs & Forms
const AdminJobsFormsSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ width, height, borderRadius = 8 }) => (
    <Animated.View
      style={{
        width,
        height,
        backgroundColor: "#E5E7EB",
        borderRadius,
        opacity,
      }}
      className="dark:bg-gray-700"
    />
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Jobs & Forms" showBack showMenu />

      {/* Tab Switcher Skeleton */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        <View
          className="bg-gray-100 dark:bg-gray-700 p-1"
          style={{ borderRadius: 12 }}
        >
          <View className="flex-row">
            <View className="flex-1 mr-1">
              <SkeletonBox width="100%" height={48} borderRadius={10} />
            </View>
            <View className="flex-1 ml-1">
              <SkeletonBox width="100%" height={48} borderRadius={10} />
            </View>
          </View>
        </View>
      </View>

      {/* Stats Cards Skeleton */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {[1, 2, 3, 4].map((item) => (
              <View key={item} className="mr-3">
                <SkeletonBox width={140} height={90} borderRadius={16} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Create Button Skeleton */}
      <View className="px-4 py-3">
        <SkeletonBox width="100%" height={56} borderRadius={16} />
      </View>

      {/* Items List Skeleton */}
      <ScrollView className="flex-1 px-4">
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            className="bg-white dark:bg-gray-800 mb-4 overflow-hidden"
            style={{ borderRadius: 16 }}
          >
            {/* Featured Badge */}
            <View className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700">
              <View className="flex-row justify-between items-center">
                <SkeletonBox width={120} height={16} borderRadius={4} />
                <SkeletonBox width={60} height={20} borderRadius={10} />
              </View>
            </View>

            <View className="p-5">
              {/* Header Section */}
              <View className="flex-row items-start mb-4">
                {/* Icon */}
                <SkeletonBox width={56} height={56} borderRadius={16} />

                <View className="flex-1 ml-4">
                  {/* Category Badge */}
                  <View className="mb-2">
                    <SkeletonBox width={100} height={24} borderRadius={12} />
                  </View>

                  {/* Title */}
                  <SkeletonBox width="90%" height={20} borderRadius={6} />

                  {/* Organization */}
                  <View className="mt-2 mb-2">
                    <SkeletonBox width="70%" height={16} borderRadius={4} />
                  </View>

                  {/* Description */}
                  <SkeletonBox width="100%" height={14} borderRadius={4} />
                  <View className="mt-1">
                    <SkeletonBox width="80%" height={14} borderRadius={4} />
                  </View>

                  {/* Attachment Badge */}
                  <View className="mt-3">
                    <SkeletonBox width={110} height={32} borderRadius={8} />
                  </View>
                </View>
              </View>

              {/* Footer Section */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <View className="flex-row items-center">
                  <SkeletonBox width={60} height={14} borderRadius={4} />
                  <View className="ml-3">
                    <SkeletonBox width={80} height={24} borderRadius={6} />
                  </View>
                </View>

                <View className="flex-row">
                  <SkeletonBox width={40} height={40} borderRadius={12} />
                  <View className="ml-2">
                    <SkeletonBox width={40} height={40} borderRadius={12} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
