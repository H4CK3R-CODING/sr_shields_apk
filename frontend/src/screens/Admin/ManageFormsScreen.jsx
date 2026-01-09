// src/screens/Admin/ManageFormsScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function ManageFormsScreen() {
  const { forms, addForm, deleteForm, updateForm } = useContentStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Application",
    fileType: "pdf",
    fileSize: 0,
    fileName: "",
  });

  const categories = ["Application", "Registration", "Request", "Certificate", "Other"];

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success" || !result.canceled) {
        const file = result.assets ? result.assets[0] : result;
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const fileSizeKB = Math.round(file.size / 1024);

        setFormData({
          ...formData,
          fileName: file.name,
          fileType: fileExtension,
          fileSize: fileSizeKB,
        });
        Alert.alert("Success", `File selected: ${file.name}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleAddForm = async () => {
    if (!formData.title.trim() || !formData.fileName) {
      Alert.alert("Error", "Please provide a title and select a file");
      return;
    }

    await addForm(formData);
    setFormData({
      title: "",
      description: "",
      category: "Application",
      fileType: "pdf",
      fileSize: 0,
      fileName: "",
    });
    setModalVisible(false);
    Alert.alert("Success", "Form uploaded successfully");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Form",
      "Are you sure you want to delete this form?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteForm(id)
        }
      ]
    );
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "document-text";
      case "doc":
      case "docx":
        return "document";
      case "xls":
      case "xlsx":
        return "grid";
      default:
        return "document-outline";
    }
  };

  const getFileSizeText = (size) => {
    if (!size) return "N/A";
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Forms" showBack showMenu />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Upload Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-orange-500 rounded-lg p-4 mb-4 flex-row items-center justify-center"
        >
          <Ionicons name="cloud-upload" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Upload New Form</Text>
        </TouchableOpacity>

        {/* Stats Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                {forms.length}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Total Forms</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                {forms.reduce((acc, form) => acc + (form.downloads || 0), 0)}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Downloads</Text>
            </View>
          </View>
        </View>

        {/* Forms List */}
        {forms.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              No forms uploaded yet
            </Text>
          </View>
        ) : (
          forms.map((form) => (
            <View
              key={form.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
            >
              {/* Form Header */}
              <View className="flex-row items-start mb-3">
                <View className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 mr-3">
                  <Ionicons 
                    name={getFileIcon(form.fileType)} 
                    size={24} 
                    color="#EA580C" 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800 dark:text-white mb-1">
                    {form.title}
                  </Text>
                  {form.category && (
                    <View className="bg-gray-100 dark:bg-gray-700 self-start px-2 py-1 rounded">
                      <Text className="text-xs text-gray-600 dark:text-gray-400">
                        {form.category}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDelete(form.id)}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Form Description */}
              {form.description && (
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {form.description}
                </Text>
              )}

              {/* File Info */}
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  File Name
                </Text>
                <Text className="text-sm text-gray-800 dark:text-white font-mono">
                  {form.fileName}
                </Text>
              </View>

              {/* Stats Row */}
              <View className="flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                  <Ionicons name="document" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1 mr-3">
                    {form.fileType?.toUpperCase()}
                  </Text>
                  <Ionicons name="resize" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1 mr-3">
                    {getFileSizeText(form.fileSize)}
                  </Text>
                  <Ionicons name="download" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    {form.downloads || 0}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400">
                  {new Date(form.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Upload Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl" style={{ maxHeight: '90%' }}>
            <ScrollView className="p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  Upload Form
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Form Title *"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
                numberOfLines={3}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: 'top' }}
              />

              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setFormData({...formData, category})}
                    className={`mr-2 px-4 py-2 rounded-lg ${
                      formData.category === category
                        ? "bg-orange-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <Text className={`text-sm ${
                      formData.category === category
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* File Picker */}
              <TouchableOpacity
                onPress={handlePickDocument}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 flex-row items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
              >
                <Ionicons name="attach" size={24} color="#9CA3AF" />
                <Text className="text-gray-600 dark:text-gray-400 ml-2">
                  {formData.fileName || "Select File *"}
                </Text>
              </TouchableOpacity>

              {formData.fileName && (
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                  <Text className="text-blue-600 dark:text-blue-400 text-sm">
                    ✓ {formData.fileName} ({getFileSizeText(formData.fileSize)})
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleAddForm}
                className="bg-orange-500 rounded-lg p-4 items-center mb-6"
              >
                <Text className="text-white font-semibold">Upload Form</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}