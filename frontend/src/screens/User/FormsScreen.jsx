// src/screens/User/FormsScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function FormsScreen({ navigation }) {
  const { forms, incrementFormDownloads } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Application", "Registration", "Request", "Certificate", "Other"];

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          form.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "All" || form.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = async (form) => {
    try {
      // Simulate download - in production, you'd download from a real URL
      await incrementFormDownloads(form.id);
      Alert.alert(
        "Download Started",
        `Downloading ${form.title}...`,
        [{ text: "OK" }]
      );
      
      // In production, implement actual file download:
      // const fileUri = FileSystem.documentDirectory + form.fileName;
      // await FileSystem.downloadAsync(form.url, fileUri);
      // await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to download the form");
    }
  };

  const handleViewDetails = (form) => {
    navigation.navigate("FormDetail", { form });
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
      <CustomHeader title="Forms & Documents" showBack showMenu />

      <View className="px-4 py-4">
        {/* Search Bar */}
        <View className="bg-white dark:bg-gray-800 rounded-lg flex-row items-center px-4 py-3 mb-4 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search forms..."
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

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setFilterCategory(category)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filterCategory === category
                  ? "bg-orange-500"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <Text className={`font-semibold ${
                filterCategory === category
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Forms List */}
        {filteredForms.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              {searchQuery ? "No forms found matching your search" : "No forms available"}
            </Text>
          </View>
        ) : (
          filteredForms.map((form) => (
            <TouchableOpacity
              key={form.id}
              onPress={() => handleViewDetails(form)}
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
              </View>

              {/* Form Description */}
              {form.description && (
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-3" numberOfLines={2}>
                  {form.description}
                </Text>
              )}

              {/* Form Meta Info */}
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="document" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    {form.fileType?.toUpperCase() || "PDF"}
                  </Text>
                </View>
                <View className="flex-row items-center mr-4">
                  <Ionicons name="resize" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    {getFileSizeText(form.fileSize)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="download" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    {form.downloads || 0} downloads
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row pt-3 border-t border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleViewDetails(form);
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg py-2 mr-2 flex-row items-center justify-center"
                >
                  <Ionicons name="eye" size={16} color="#6B7280" />
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-1 text-sm">
                    View
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDownload(form);
                  }}
                  className="flex-1 bg-orange-500 rounded-lg py-2 flex-row items-center justify-center"
                >
                  <Ionicons name="download" size={16} color="white" />
                  <Text className="text-white font-semibold ml-1 text-sm">Download</Text>
                </TouchableOpacity>
              </View>

              {/* Posted Date */}
              <Text className="text-xs text-gray-400 mt-2">
                Posted {new Date(form.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}