// src/screens/Admin/ManageJobsScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function ManageJobsScreen() {
  const { jobs, addJob, deleteJob, updateJob } = useContentStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
  });

  const handleAddJob = async () => {
    if (!formData.title.trim() || !formData.company.trim()) {
      Alert.alert("Error", "Please fill in required fields");
      return;
    }

    await addJob(formData);
    setFormData({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
      deadline: "",
    });
    setModalVisible(false);
    Alert.alert("Success", "Job posted successfully");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job posting?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteJob(id)
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Jobs" showBack showMenu />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-purple-500 rounded-lg p-4 mb-4 flex-row items-center justify-center"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Post New Job</Text>
        </TouchableOpacity>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              No job postings yet
            </Text>
          </View>
        ) : (
          jobs.map((job) => (
            <View
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800 dark:text-white">
                    {job.title}
                  </Text>
                  <Text className="text-purple-600 dark:text-purple-400 font-semibold">
                    {job.company}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(job.id)}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text className="text-gray-600 dark:text-gray-400 ml-1">
                  {job.location}
                </Text>
                <Ionicons name="time" size={16} color="#9CA3AF" className="ml-4" />
                <Text className="text-gray-600 dark:text-gray-400 ml-1">
                  {job.type}
                </Text>
              </View>

              {job.salary && (
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cash" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 ml-1">
                    {job.salary}
                  </Text>
                </View>
              )}

              <Text className="text-gray-600 dark:text-gray-400 mb-2" numberOfLines={2}>
                {job.description}
              </Text>

              {job.deadline && (
                <View className="bg-orange-100 dark:bg-orange-900/30 rounded p-2 mt-2">
                  <Text className="text-orange-600 dark:text-orange-400 text-sm">
                    Deadline: {job.deadline}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-xs text-gray-400">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="people" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {job.applicants || 0} applicants
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Job Modal */}
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
                  Post New Job
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Job Title *"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                placeholder="Company Name *"
                value={formData.company}
                onChangeText={(text) => setFormData({...formData, company: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => setFormData({...formData, location: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Job Type
              </Text>
              <View className="flex-row mb-3">
                {["Full-time", "Part-time", "Contract"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setFormData({...formData, type})}
                    className={`flex-1 mr-2 p-3 rounded-lg ${
                      formData.type === type ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <Text className={`text-center text-sm ${
                      formData.type === type ? "text-white" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Salary Range"
                value={formData.salary}
                onChangeText={(text) => setFormData({...formData, salary: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                placeholder="Job Description"
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
                numberOfLines={4}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: 'top' }}
              />

              <TextInput
                placeholder="Requirements"
                value={formData.requirements}
                onChangeText={(text) => setFormData({...formData, requirements: text})}
                multiline
                numberOfLines={4}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: 'top' }}
              />

              <TextInput
                placeholder="Application Deadline (e.g., Jan 31, 2026)"
                value={formData.deadline}
                onChangeText={(text) => setFormData({...formData, deadline: text})}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-3 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity
                onPress={handleAddJob}
                className="bg-purple-500 rounded-lg p-4 items-center mb-6"
              >
                <Text className="text-white font-semibold">Post Job</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}