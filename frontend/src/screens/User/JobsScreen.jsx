// src/screens/User/JobsScreen.jsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useContentStore from "../../state/contentStore";
import CustomHeader from "../../components/CustomHeader";

export default function JobsScreen({ navigation }) {
  const { jobs } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const jobTypes = ["All", "Full-time", "Part-time", "Contract"];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Jobs" showBack showMenu />

      <View className="px-4 py-4">
        {/* Search Bar */}
        <View className="bg-white dark:bg-gray-800 rounded-lg flex-row items-center px-4 py-3 mb-4 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search jobs..."
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

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {jobTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filterType === type
                  ? "bg-purple-500"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <Text className={`font-semibold ${
                filterType === type
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-lg p-8 items-center">
            <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              {searchQuery ? "No jobs found matching your search" : "No jobs available"}
            </Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => navigation.navigate("JobDetail", { job })}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm"
            >
              {/* Job Header */}
              <View className="mb-3">
                <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {job.title}
                </Text>
                <Text className="text-purple-600 dark:text-purple-400 font-semibold">
                  {job.company}
                </Text>
              </View>

              {/* Job Details */}
              <View className="flex-row flex-wrap mb-2">
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="location" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                    {job.location}
                  </Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="time" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                    {job.type}
                  </Text>
                </View>
                {job.salary && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="cash" size={16} color="#9CA3AF" />
                    <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                      {job.salary}
                    </Text>
                  </View>
                )}
              </View>

              {/* Job Description Preview */}
              {job.description && (
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-3" numberOfLines={2}>
                  {job.description}
                </Text>
              )}

              {/* Footer */}
              <View className="flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-xs text-gray-400">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </Text>
                {job.deadline && (
                  <View className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                    <Text className="text-orange-600 dark:text-orange-400 text-xs font-semibold">
                      Deadline: {job.deadline}
                    </Text>
                  </View>
                )}
              </View>

              {/* View Details Arrow */}
              <View className="absolute right-4 top-4">
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}