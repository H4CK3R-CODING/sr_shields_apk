// src/screens/Admin/ManageNoticesScreen.jsx (Complete Google Drive Integration)
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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  
  // Google Drive URL Modal
  const [gdriveModalVisible, setGdriveModalVisible] = useState(false);
  const [gdriveUrl, setGdriveUrl] = useState("");
  const [gdriveFileName, setGdriveFileName] = useState("");

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
    { key: "general", label: "General", icon: "document-text", color: "#3B82F6" },
    { key: "important", label: "Important", icon: "alert-circle", color: "#EF4444" },
    { key: "event", label: "Event", icon: "calendar", color: "#8B5CF6" },
    { key: "holiday", label: "Holiday", icon: "sunny", color: "#F59E0B" },
    { key: "maintenance", label: "Maintenance", icon: "construct", color: "#EAB308" },
    { key: "announcement", label: "Announcement", icon: "megaphone", color: "#10B981" },
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

  // Convert Google Drive sharing link to direct view/download links
  const convertGDriveUrl = (url) => {
    try {
      let fileId = null;
      
      // Format: https://drive.google.com/file/d/FILE_ID/view
      if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1].split('/')[0];
      }
      // Format: https://drive.google.com/open?id=FILE_ID
      else if (url.includes('open?id=')) {
        fileId = url.split('open?id=')[1].split('&')[0];
      }
      // Format: https://drive.google.com/uc?id=FILE_ID
      else if (url.includes('uc?id=')) {
        fileId = url.split('uc?id=')[1].split('&')[0];
      }
      // Direct file ID
      else if (url.length === 33 || url.length === 44) {
        fileId = url;
      }

      if (!fileId) {
        throw new Error('Invalid Google Drive URL');
      }

      return {
        fileId,
        viewLink: `https://drive.google.com/file/d/${fileId}/view`,
        downloadLink: `https://drive.google.com/uc?export=download&id=${fileId}`,
        previewLink: `https://drive.google.com/file/d/${fileId}/preview`,
      };
    } catch (error) {
      console.error('Error converting GDrive URL:', error);
      return null;
    }
  };

  // Add Google Drive PDF
  const handleAddGDriveUrl = () => {
    if (!gdriveUrl.trim()) {
      Alert.alert('Error', 'Please enter a Google Drive URL');
      return;
    }

    if (!gdriveFileName.trim()) {
      Alert.alert('Error', 'Please enter a file name');
      return;
    }

    const convertedUrls = convertGDriveUrl(gdriveUrl.trim());
    
    if (!convertedUrls) {
      Alert.alert('Error', 'Invalid Google Drive URL. Please check and try again.');
      return;
    }

    // Add to attachments
    const newAttachment = {
      name: gdriveFileName.trim().endsWith('.pdf') 
        ? gdriveFileName.trim() 
        : `${gdriveFileName.trim()}.pdf`,
      url: convertedUrls.viewLink,
      type: 'application/pdf',
      fileId: convertedUrls.fileId,
      viewLink: convertedUrls.viewLink,
      downloadLink: convertedUrls.downloadLink,
      previewLink: convertedUrls.previewLink,
      mimeType: 'application/pdf',
      source: 'google-drive',
    };

    setAttachments([...attachments, newAttachment]);
    
    // Reset modal
    setGdriveUrl("");
    setGdriveFileName("");
    setGdriveModalVisible(false);
    
    Alert.alert('Success', 'Google Drive PDF added successfully');
  };

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            if (!file.type.startsWith('image/')) {
              Alert.alert('Error', 'Please select an image file');
              return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
              Alert.alert('Error', 'File size must be less than 10MB');
              return;
            }
            
            uploadFile(file);
          }
        };
        
        input.click();
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          uploadFile(result.assets[0]);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf,image/*';
        
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
              Alert.alert('Error', 'Only PDF and image files are allowed');
              return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
              Alert.alert('Error', 'File size must be less than 10MB');
              return;
            }
            
            uploadFile(file);
          }
        };
        
        input.click();
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });

        if (result.type === 'success' || !result.canceled) {
          const fileData = result.assets ? result.assets[0] : result;
          uploadFile(fileData);
        }
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
      
      if (Platform.OS === 'web') {
        if (file instanceof File) {
          formData.append('file', file);
        } else {
          Alert.alert('Error', 'Invalid file format for web');
          return;
        }
      } else {
        const fileUri = file.uri;
        const fileName = file.name || fileUri.split('/').pop();
        const fileType = file.mimeType || file.type || 'application/octet-stream';

        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      }

      const authData = await AsyncStorage.getItem('authData');
      const parsedData = JSON.parse(authData);
      const token = parsedData ? parsedData.token : null;
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAttachments([...attachments, {
          ...data.file,
          source: 'server-upload',
        }]);
        Alert.alert('Success', 'File uploaded successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = async (index) => {
    try {
      const attachment = attachments[index];
      
      // Only delete from server if it was uploaded to server
      if (editMode && selectedNotice && attachment.source === 'server-upload') {
        await api.delete(`/files/notice/${selectedNotice._id}/attachment/${attachment._id}`);
      }
      
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
        attachments: attachments.map(att => ({
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
    const colors = {
      urgent: "#EF4444",
      high: "#F59E0B",
      normal: "#3B82F6",
      low: "#6B7280",
    };
    return colors[priority] || colors.normal;
  };

  const getFileIcon = (attachment) => {
    if (attachment.source === 'google-drive') return 'logo-google';
    if (attachment.mimeType?.includes('pdf') || attachment.type?.includes('pdf')) return 'document-text';
    if (attachment.mimeType?.includes('image') || attachment.type?.includes('image')) return 'image';
    return 'document';
  };

  const getFileColor = (attachment) => {
    if (attachment.source === 'google-drive') return '#4285F4';
    if (attachment.mimeType?.includes('pdf')) return '#EF4444';
    if (attachment.mimeType?.includes('image')) return '#3B82F6';
    return '#6B7280';
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
          <StatCard label="Total" value={stats.total} color="#3B82F6" />
          <StatCard label="Active" value={stats.active} color="#10B981" />
          <StatCard label="Inactive" value={stats.inactive} color="#6B7280" />
          <StatCard label="Pinned" value={stats.pinned} color="#EAB308" />
        </ScrollView>
      </View>

      {/* Add Button */}
      <View className="px-4 py-3">
        <TouchableOpacity
          onPress={() => { resetForm(); setModalVisible(true); }}
          className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center shadow-md"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-bold ml-2 text-base">Create Notice</Text>
        </TouchableOpacity>
      </View>

      {/* Notices List */}
      <ScrollView 
        className="flex-1 px-4" 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotices} colors={['#3B82F6']} />}
      >
        {notices.map((notice) => {
          const categoryInfo = getCategoryInfo(notice.category);
          return (
            <View key={notice._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-2">
                    <View 
                      style={{ backgroundColor: categoryInfo.color }}
                      className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    >
                      <Ionicons name={categoryInfo.icon} size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {notice.title}
                      </Text>
                      <View 
                        style={{ backgroundColor: getPriorityColor(notice.priority) + '20' }}
                        className="px-2 py-1 rounded self-start"
                      >
                        <Text 
                          style={{ color: getPriorityColor(notice.priority) }}
                          className="text-xs font-bold uppercase"
                        >
                          {notice.priority}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2" numberOfLines={2}>
                    {notice.description}
                  </Text>
                  
                  {notice.attachments?.length > 0 && (
                    <View className="flex-row items-center mt-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg self-start">
                      <Ionicons name="attach" size={16} color="#3B82F6" />
                      <Text className="text-blue-600 dark:text-blue-400 text-xs ml-1 font-semibold">
                        {notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                  <Ionicons name="eye-outline" size={16} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {notice.views} views
                  </Text>
                </View>
                
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => togglePin(notice)} 
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <Ionicons 
                      name={notice.isPinned ? "pin" : "pin-outline"} 
                      size={20} 
                      color={notice.isPinned ? "#EAB308" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => toggleStatus(notice)} 
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <Ionicons 
                      name={notice.isActive ? "eye" : "eye-off"} 
                      size={20} 
                      color={notice.isActive ? "#10B981" : "#EF4444"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleEdit(notice)} 
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Ionicons name="create" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDelete(notice)} 
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
        <View className="h-4" />
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {editMode ? "Edit Notice" : "Create Notice"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Title *</Text>
              <TextInput 
                placeholder="Enter notice title" 
                value={title} 
                onChangeText={setTitle}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white text-base" 
                placeholderTextColor="#9CA3AF" 
              />
              
              {/* Description */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Description *</Text>
              <TextInput 
                placeholder="Enter notice description" 
                value={description} 
                onChangeText={setDescription} 
                multiline 
                numberOfLines={4}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white text-base" 
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: 'top' }} 
              />

              {/* Category */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => setCategory(cat.key)}
                    style={{
                      backgroundColor: category === cat.key ? cat.color : undefined,
                    }}
                    className={`mr-3 px-4 py-3 rounded-xl flex-row items-center ${
                      category !== cat.key ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                  >
                    <Ionicons 
                      name={cat.icon} 
                      size={18} 
                      color={category === cat.key ? "#FFFFFF" : "#9CA3AF"} 
                    />
                    <Text 
                      className={`ml-2 font-semibold ${
                        category === cat.key ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Priority */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Priority</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    style={{
                      backgroundColor: priority === p ? getPriorityColor(p) : undefined,
                    }}
                    className={`px-5 py-3 rounded-xl ${
                      priority !== p ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                  >
                    <Text 
                      className={`font-bold uppercase text-sm ${
                        priority === p ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target Audience */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Target Audience</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {audiences.map((aud) => (
                  <TouchableOpacity
                    key={aud.key}
                    onPress={() => setTargetAudience(aud.key)}
                    className={`px-5 py-3 rounded-xl ${
                      targetAudience === aud.key 
                        ? "bg-purple-500" 
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <Text 
                      className={`font-semibold ${
                        targetAudience === aud.key 
                          ? "text-white" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {aud.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Pin Notice */}
              <TouchableOpacity
                onPress={() => setIsPinned(!isPinned)}
                className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4"
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name={isPinned ? "pin" : "pin-outline"} 
                    size={24} 
                    color={isPinned ? "#EAB308" : "#9CA3AF"} 
                  />
                  <Text className="text-gray-900 dark:text-white font-semibold ml-3">
                    Pin this notice
                  </Text>
                </View>
                <View 
                  className={`w-12 h-7 rounded-full ${
                    isPinned ? "bg-yellow-500" : "bg-gray-300 dark:bg-gray-600"
                  } justify-center`}
                >
                  <View 
                    className={`w-5 h-5 bg-white rounded-full shadow-sm ${
                      isPinned ? "ml-6" : "ml-1"
                    }`}
                  />
                </View>
              </TouchableOpacity>

              {/* Expiry Date */}
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Expiry Date (Optional)</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                value={expiryDate}
                onChangeText={setExpiryDate}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white text-base"
                placeholderTextColor="#9CA3AF"
              />

              {/* Attachments Section */}
              <Text className="text-gray-900 dark:text-white font-bold text-lg mb-3">📎 Attachments</Text>
              
              <View className="mb-4">
                {/* Upload Buttons */}
                <View className="flex-row gap-2 mb-3">
                  <TouchableOpacity 
                    onPress={pickImage} 
                    disabled={uploadingFile}
                    className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 flex-row items-center justify-center"
                  >
                    <Ionicons name="image" size={20} color="#3B82F6" />
                    <Text className="text-blue-600 dark:text-blue-400 font-semibold ml-2">Image</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={pickDocument} 
                    disabled={uploadingFile}
                    className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-xl p-4 flex-row items-center justify-center"
                  >
                    <Ionicons name="document-text" size={20} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 font-semibold ml-2">PDF</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => setGdriveModalVisible(true)}
                    className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-xl p-4 flex-row items-center justify-center"
                  >
                    <Ionicons name="logo-google" size={20} color="#10B981" />
                    <Text className="text-green-600 dark:text-green-400 font-semibold ml-2">Drive</Text>
                  </TouchableOpacity>
                </View>

                {/* Upload Progress */}
                {uploadingFile && (
                  <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-3 flex-row items-center">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className="text-blue-600 dark:text-blue-400 ml-3 font-semibold">Uploading file...</Text>
                  </View>
                )}

                {/* Attachments List */}
                {attachments.map((file, index) => {
                  const fileColor = getFileColor(file);
                  return (
                    <View 
                      key={index} 
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
                    >
                      <View className="flex-row items-center">
                        <View 
                          style={{ backgroundColor: fileColor + '20' }}
                          className="w-12 h-12 rounded-lg items-center justify-center mr-3"
                        >
                          <Ionicons 
                            name={getFileIcon(file)} 
                            size={24} 
                            color={fileColor} 
                          />
                        </View>
                        
                        <View className="flex-1">
                          <Text className="text-gray-900 dark:text-white font-semibold mb-1" numberOfLines={1}>
                            {file.name}
                          </Text>
                          <View className="flex-row items-center">
                            <View 
                              style={{ backgroundColor: fileColor + '20' }}
                              className="px-2 py-1 rounded mr-2"
                            >
                              <Text style={{ color: fileColor }} className="text-xs font-semibold">
                                {file.source === 'google-drive' ? 'Google Drive' : 'Uploaded'}
                              </Text>
                            </View>
                            {file.size && (
                              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                {(file.size / 1024).toFixed(1)} KB
                              </Text>
                            )}
                          </View>
                        </View>
                        
                        <TouchableOpacity onPress={() => removeAttachment(index)}>
                          <Ionicons name="close-circle" size={28} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                onPress={handleCreateOrUpdate} 
                disabled={loading}
                className="bg-blue-500 rounded-xl p-4 items-center mb-4 shadow-lg"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {editMode ? "Update Notice" : "Create Notice"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Google Drive URL Modal */}
      <Modal visible={gdriveModalVisible} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-6">
              <View className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="logo-google" size={32} color="#10B981" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add Google Drive PDF</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Paste the sharing link of your PDF from Google Drive
              </Text>
            </View>

            {/* File Name Input */}
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">File Name</Text>
            <TextInput
              placeholder="e.g., Important Document"
              value={gdriveFileName}
              onChangeText={setGdriveFileName}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
              placeholderTextColor="#9CA3AF"
            />

            {/* Google Drive URL Input */}
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Google Drive URL</Text>
            <TextInput
              placeholder="https://drive.google.com/file/d/..."
              value={gdriveUrl}
              onChangeText={setGdriveUrl}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-gray-900 dark:text-white"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
              autoCapitalize="none"
            />

            {/* Help Text */}
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <Text className="text-blue-800 dark:text-blue-300 text-xs font-semibold mb-2">
                💡 How to get the sharing link:
              </Text>
              <Text className="text-blue-700 dark:text-blue-400 text-xs leading-5">
                1. Open your file in Google Drive{'\n'}
                2. Click "Share" or right-click → "Get link"{'\n'}
                3. Set access to "Anyone with the link"{'\n'}
                4. Copy and paste the link here
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setGdriveModalVisible(false);
                  setGdriveUrl("");
                  setGdriveFileName("");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-bold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddGDriveUrl}
                className="flex-1 bg-green-500 rounded-xl p-4 items-center shadow-lg"
              >
                <Text className="text-white font-bold">Add PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="trash" size={40} color="#EF4444" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Delete Notice?</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                This action cannot be undone. The notice will be permanently deleted.
              </Text>
            </View>
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-bold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-red-500 rounded-xl p-4 items-center shadow-lg"
              >
                <Text className="text-white font-bold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const StatCard = ({ label, value, color }) => (
  <View 
    style={{ backgroundColor: color }}
    className="rounded-2xl p-5 mr-3 min-w-[110px] shadow-md"
  >
    <Text className="text-white text-3xl font-bold mb-1">{value}</Text>
    <Text className="text-white/90 text-sm font-semibold">{label}</Text>
  </View>
);