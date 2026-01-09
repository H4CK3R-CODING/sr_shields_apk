// src/screens/User/JobDetailScreen.jsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../components/CustomHeader";

export default function JobDetailScreen({ route, navigation }) {
  const { job } = route.params;

  const handleApply = () => {
    Alert.alert(
      "Apply for Job",
      "This will redirect you to the application process. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => {
          // Here you would handle the application process
          // For now, just show a success message
          Alert.alert("Success", "Your application has been submitted!");
        }}
      ]
    );
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert("Share", "Share functionality will be implemented here");
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Job Details" showBack showMenu />

      <ScrollView className="flex-1">
        {/* Job Header Card */}
        <View className="bg-white dark:bg-gray-800 p-6 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {job.title}
          </Text>
          <Text className="text-xl text-purple-600 dark:text-purple-400 font-semibold mb-4">
            {job.company}
          </Text>

          {/* Job Meta Info */}
          <View className="space-y-2">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={18} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2">
                {job.location}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="time" size={18} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2">
                {job.type}
              </Text>
            </View>

            {job.salary && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="cash" size={18} color="#9CA3AF" />
                <Text className="text-gray-600 dark:text-gray-400 ml-2">
                  {job.salary}
                </Text>
              </View>
            )}

            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar" size={18} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {job.deadline && (
              <View className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 mt-2">
                <View className="flex-row items-center">
                  <Ionicons name="alarm" size={18} color="#EA580C" />
                  <Text className="text-orange-600 dark:text-orange-400 font-semibold ml-2">
                    Application Deadline: {job.deadline}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 bg-purple-500 rounded-lg py-3 mr-2 flex-row items-center justify-center"
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Apply Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-3 items-center justify-center"
            >
              <Ionicons name="share-social" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Description */}
        {job.description && (
          <View className="bg-white dark:bg-gray-800 p-6 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              Job Description
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 leading-6">
              {job.description}
            </Text>
          </View>
        )}

        {/* Requirements */}
        {job.requirements && (
          <View className="bg-white dark:bg-gray-800 p-6 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              Requirements
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 leading-6">
              {job.requirements}
            </Text>
          </View>
        )}

        {/* Additional Info */}
        <View className="bg-white dark:bg-gray-800 p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 dark:text-white mb-3">
            Additional Information
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
              <Ionicons name="people" size={20} color="#3B82F6" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Total Applicants
              </Text>
              <Text className="text-gray-800 dark:text-white font-semibold">
                {job.applicants || 0} applicants
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Job Status
              </Text>
              <Text className="text-gray-800 dark:text-white font-semibold">
                Currently Hiring
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>

      {/* Floating Apply Button */}
      <View className="bg-white dark:bg-gray-800 p-4 shadow-lg">
        <TouchableOpacity
          onPress={handleApply}
          className="bg-purple-500 rounded-lg py-4 flex-row items-center justify-center"
        >
          <Ionicons name="paper-plane" size={20} color="white" />
          <Text className="text-white font-bold ml-2 text-lg">Apply for this Position</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}