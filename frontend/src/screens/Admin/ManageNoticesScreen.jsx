// src/screens/Admin/ManageNoticesScreen.jsx (Updated with File Upload)
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function ManageNoticesScreen({ navigation }) {
  const [notices, setNotices] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, pinned: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("normal");
  const [targetAudience, setTargetAudience] = useState("all");
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [attachments, setAttachments] = useState([]);

  const categories = [
    { key: "general", label: "General", icon: "document-text", color: "blue" },
    { key: "important", label: "Important", icon: "alert-circle", color: "red" },
    { key: "event", label: "Event", icon: "calendar", color: "purple" },
    { key: "holiday", label: "Holiday", icon: "sunny", color: "orange" },
    { key: "maintenance", label: "Maintenance", icon: "construct", color: "yellow" },
    { key: "announcement", label: "Announcement", icon: "megaphone", color: "green" },
  ];

  const priorities = ["low", "normal", "high", "urgent"];
  const audiences = [
    { key: "all", label: "All Users" },
    { key: "users", label: "Users Only" },
    { key: "admins", label: "Admins Only" },
  ];

  useEffect(() => {
    fetchNotices();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library permissions');
      }
    }
  };

  const fetchNotices = async () => {
    try {
      setRefreshing(true);
      const { data } = await api.get("/notices/admin/all");
      if (data.success) {
        setNotices(data.notices);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      Alert.alert("Error", "Failed to fetch notices");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        uploadFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        uploadFile(result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploadingFile(true);
      
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/octet-stream',
        name: file.name || 'file',
      });

      const { data } = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setAttachments([...attachments, data.file]);
        Alert.alert('Success', 'File uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = async (index, fileId) => {
    try {
      if (editMode && selectedNotice) {
        // Remove from server if editing existing notice
        const attachment = selectedNotice.attachments[index];
        await api.delete(`/files/notice/${selectedNotice._id}/attachment/${attachment._id}`);
      }
      
      // Remove from local state
      setAttachments(attachments.filter((_, i) => i !== index));
      Alert.alert('Success', 'Attachment removed');
    } catch (error) {
      console.error('Error removing attachment:', error);
      Alert.alert('Error', 'Failed to remove attachment');
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const noticeData = {
        title,
        description,
        category,
        priority,
        targetAudience,
        isPinned,
        expiryDate: expiryDate || null,
        attachments,
      };

      let response;
      if (editMode && selectedNotice) {
        response = await api.put(`/notices/${selectedNotice._id}`, noticeData);
      } else {
        response = await api.post("/notices", noticeData);
      }

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        resetForm();
        setModalVisible(false);
        fetchNotices();
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to save notice");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setEditMode(true);
    setSelectedNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setCategory(notice.category);
    setPriority(notice.priority);
    setTargetAudience(notice.targetAudience);
    setIsPinned(notice.isPinned);
    setExpiryDate(notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : "");
    setAttachments(notice.attachments || []);
    setModalVisible(true);
  };

  const handleDelete = (notice) => {
    setNoticeToDelete(notice);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    try {
      const { data } = await api.delete(`/notices/${noticeToDelete._id}`);
      if (data.success) {
        Alert.alert("Success", "Notice deleted successfully");
        fetchNotices();
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      Alert.alert("Error", "Failed to delete notice");
    } finally {
      setDeleteModalVisible(false);
      setNoticeToDelete(null);
    }
  };

  const toggleStatus = async (notice) => {
    try {
      const { data } = await api.patch(`/notices/${notice._id}/toggle-status`);
      if (data.success) {
        setNotices(notices.map(n => n._id === notice._id ? data.notice : n));
        Alert.alert("Success", data.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const togglePin = async (notice) => {
    try {
      const { data } = await api.patch(`/notices/${notice._id}/toggle-pin`);
      if (data.success) {
        setNotices(notices.map(n => n._id === notice._id ? data.notice : n));
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      Alert.alert("Error", "Failed to update pin status");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("general");
    setPriority("normal");
    setTargetAudience("all");
    setIsPinned(false);
    setExpiryDate("");
    setAttachments([]);
    setEditMode(false);
    setSelectedNotice(null);
  };

  const getCategoryInfo = (cat) => categories.find(c => c.key === cat) || categories[0];
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'document-text';
    if (mimeType?.includes('image')) return 'image';
    return 'document';
  };

  if (loading && notices.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader title="Manage Notices" showBack showMenu />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Notices" showBack showMenu />

      {/* Stats Cards */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <StatCard label="Total" value={stats.total} color="bg-blue-500" />
          <StatCard label="Active" value={stats.active} color="bg-green-500" />
          <StatCard label="Inactive" value={stats.inactive} color="bg-gray-500" />
          <StatCard label="Pinned" value={stats.pinned} color="bg-yellow-500" />
        </ScrollView>
      </View>

      {/* Add Button */}
      <View className="px-4 py-3">
        <TouchableOpacity
          onPress={() => { resetForm(); setModalVisible(true); }}
          className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-bold ml-2 text-base">Create Notice</Text>
        </TouchableOpacity>
      </View>

      {/* Notices List */}
      <ScrollView className="flex-1 px-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotices} />}>
        {notices.map((notice) => {
          const categoryInfo = getCategoryInfo(notice.category);
          return (
            <View key={notice._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">{notice.title}</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>{notice.description}</Text>
                  {notice.attachments?.length > 0 && (
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="attach" size={16} color="#3B82F6" />
                      <Text className="text-blue-500 text-xs ml-1">{notice.attachments.length} attachment(s)</Text>
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-xs text-gray-500">👁 {notice.views} views</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity onPress={() => togglePin(notice)} className="p-2">
                    <Ionicons name={notice.isPinned ? "pin" : "pin-outline"} size={20} color={notice.isPinned ? "#EAB308" : "#9CA3AF"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleStatus(notice)} className="p-2">
                    <Ionicons name={notice.isActive ? "eye" : "eye-off"} size={20} color={notice.isActive ? "#10B981" : "#EF4444"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEdit(notice)} className="p-2">
                    <Ionicons name="create" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(notice)} className="p-2">
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                {editMode ? "Edit Notice" : "Create Notice"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput placeholder="Title *" value={title} onChangeText={setTitle}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white" placeholderTextColor="#9CA3AF" />
              
              <TextInput placeholder="Description *" value={description} onChangeText={setDescription} multiline numberOfLines={4}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white" placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: 'top' }} />

              {/* Attachments Section */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Attachments</Text>
              <View className="mb-3">
                <View className="flex-row space-x-2 mb-3">
                  <TouchableOpacity onPress={pickImage} disabled={uploadingFile}
                    className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 flex-row items-center justify-center">
                    <Ionicons name="image" size={20} color="#3B82F6" />
                    <Text className="text-blue-600 dark:text-blue-400 font-semibold ml-2">Add Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickDocument} disabled={uploadingFile}
                    className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-lg p-3 flex-row items-center justify-center">
                    <Ionicons name="document-text" size={20} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 font-semibold ml-2">Add PDF</Text>
                  </TouchableOpacity>
                </View>

                {uploadingFile && (
                  <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-2 flex-row items-center">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className="text-gray-600 dark:text-gray-400 ml-2">Uploading...</Text>
                  </View>
                )}

                {attachments.map((file, index) => (
                  <View key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Ionicons name={getFileIcon(file.mimeType)} size={24} color="#3B82F6" />
                      <Text className="text-gray-800 dark:text-white ml-2 flex-1" numberOfLines={1}>{file.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeAttachment(index, file.id)}>
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity onPress={handleCreateOrUpdate} disabled={loading}
                className="bg-blue-500 rounded-lg p-4 items-center mb-4">
                {loading ? <ActivityIndicator color="white" /> : 
                  <Text className="text-white font-bold">{editMode ? "Update" : "Create"}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="trash" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Notice</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure? This action cannot be undone.
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 items-center">
                <Text className="text-gray-800 dark:text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} className="flex-1 bg-red-500 rounded-lg p-4 items-center">
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const StatCard = ({ label, value, color }) => (
  <View className={`${color} rounded-xl p-4 mr-3 min-w-[100px]`}>
    <Text className="text-white text-2xl font-bold">{value}</Text>
    <Text className="text-white/80 text-sm mt-1">{label}</Text>
  </View>
);