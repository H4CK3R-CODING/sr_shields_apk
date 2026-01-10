// src/screens/Profile/ProfileScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../state/authStore";
import CustomHeader from "../../components/CustomHeader";

export default function ProfileScreen({ navigation }) {
  const { user, role, updateProfile, logout } = useAuthStore();
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    department: user?.department || "",
    employeeId: user?.employeeId || "",
    bio: user?.bio || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Handle save profile
  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update profile
      await updateProfile(formData);

      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset form data
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      department: user?.department || "",
      employeeId: user?.employeeId || "",
      bio: user?.bio || "",
    });
    setEditMode(false);
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setChangePasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      Alert.alert("Success", "Password changed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.navigate("Login");
          },
        },
      ]
    );
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile stats
  const stats = [
    {
      label: role === "admin" ? "Notices Posted" : "Notices Read",
      value: role === "admin" ? "24" : "15",
      icon: "newspaper",
      color: "bg-blue-500",
    },
    {
      label: role === "admin" ? "Jobs Posted" : "Applications",
      value: role === "admin" ? "12" : "3",
      icon: "briefcase",
      color: "bg-purple-500",
    },
    {
      label: role === "admin" ? "Forms Uploaded" : "Downloads",
      value: role === "admin" ? "8" : "7",
      icon: "document-text",
      color: "bg-orange-500",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader
        title="Profile"
        showBack
        showMenu
        rightButton={
          !editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Ionicons name="create-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          )
        }
      />

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="bg-gradient-to-b from-blue-500 to-blue-600 px-6 pt-8 pb-12">
          {/* Profile Image */}
          <View className="items-center mb-4">
            <View className="relative">
              {/* Default User Avatar Icon */}
              <View className="w-32 h-32 rounded-full bg-white items-center justify-center border-4 border-white shadow-lg">
                <Ionicons name="person" size={64} color="#3B82F6" />
              </View>
            </View>

            {/* Name and Role */}
            <Text className="text-white text-2xl font-bold mt-4">
              {formData.fullName || "User Name"}
            </Text>
            <View className="bg-white/20 px-4 py-1 rounded-full mt-2">
              <Text className="text-white font-semibold capitalize">
                {role === "admin" ? "Administrator" : "User"}
              </Text>
            </View>

            {/* Member Since */}
            <View className="flex-row items-center mt-3">
              <Ionicons name="calendar-outline" size={14} color="white" />
              <Text className="text-white text-sm ml-1 opacity-90">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2026'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 -mt-8 mb-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
            <View className="flex-row justify-around">
              {stats.map((stat, index) => (
                <View key={index} className="items-center flex-1">
                  <View className={`${stat.color} w-12 h-12 rounded-xl items-center justify-center mb-2`}>
                    <Ionicons name={stat.icon} size={24} color="white" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Personal Information
          </Text>

          {/* Full Name */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Full Name</Text>
            {editMode ? (
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                className="text-gray-800 dark:text-white font-semibold"
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            ) : (
              <Text className="text-gray-800 dark:text-white font-semibold">
                {formData.fullName || "Not set"}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Email Address</Text>
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-800 dark:text-white font-semibold ml-2">
                {formData.email || "Not set"}
              </Text>
            </View>
          </View>

          {/* Phone */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Phone Number</Text>
            {editMode ? (
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  className="text-gray-800 dark:text-white font-semibold ml-2 flex-1"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                <Text className="text-gray-800 dark:text-white font-semibold ml-2">
                  {formData.phone || "Not set"}
                </Text>
              </View>
            )}
          </View>

          {/* Role-specific fields */}
          {role === "admin" ? (
            <>
              {/* Department */}
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Department</Text>
                {editMode ? (
                  <TextInput
                    value={formData.department}
                    onChangeText={(text) => setFormData({ ...formData, department: text })}
                    className="text-gray-800 dark:text-white font-semibold"
                    placeholder="Enter department"
                    placeholderTextColor="#9CA3AF"
                  />
                ) : (
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {formData.department || "Not set"}
                  </Text>
                )}
              </View>

              {/* Employee ID */}
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Employee ID</Text>
                <Text className="text-gray-800 dark:text-white font-semibold">
                  {formData.employeeId || "Not set"}
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Address */}
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Address</Text>
                {editMode ? (
                  <TextInput
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    className="text-gray-800 dark:text-white font-semibold"
                    placeholder="Enter address"
                    placeholderTextColor="#9CA3AF"
                    multiline
                  />
                ) : (
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {formData.address || "Not set"}
                  </Text>
                )}
              </View>

              {/* Date of Birth */}
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Date of Birth</Text>
                {editMode ? (
                  <TextInput
                    value={formData.dateOfBirth}
                    onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                    className="text-gray-800 dark:text-white font-semibold"
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                ) : (
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {formData.dateOfBirth || "Not set"}
                  </Text>
                )}
              </View>

              {/* Gender */}
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Gender</Text>
                {editMode ? (
                  <View className="flex-row mt-2">
                    {["Male", "Female", "Other"].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        onPress={() => setFormData({ ...formData, gender })}
                        className={`flex-1 mr-2 py-2 rounded-lg ${
                          formData.gender === gender
                            ? "bg-blue-500"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            formData.gender === gender
                              ? "text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text className="text-gray-800 dark:text-white font-semibold">
                    {formData.gender || "Not set"}
                  </Text>
                )}
              </View>
            </>
          )}

          {/* Bio */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">Bio</Text>
            {editMode ? (
              <TextInput
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                className="text-gray-800 dark:text-white"
                placeholder="Tell us about yourself"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: 'top' }}
              />
            ) : (
              <Text className="text-gray-800 dark:text-white">
                {formData.bio || "No bio added yet"}
              </Text>
            )}
          </View>
        </View>

        {/* Account Settings */}
        {!editMode && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Account Settings
            </Text>

            {/* Change Password */}
            <TouchableOpacity
              onPress={() => setChangePasswordModal(true)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name="lock-closed" size={20} color="#8B5CF6" />
                </View>
                <Text className="text-gray-800 dark:text-white font-semibold ml-3">
                  Change Password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-lg items-center justify-center">
                  <Ionicons name="log-out" size={20} color="#EF4444" />
                </View>
                <Text className="text-red-600 dark:text-red-400 font-semibold ml-3">
                  Logout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>

      {/* Edit Mode Actions */}
      {editMode && (
        <View className="bg-white dark:bg-gray-800 px-6 py-4 shadow-lg flex-row">
          <TouchableOpacity
            onPress={handleCancelEdit}
            className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl py-4 mr-2"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold text-center">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={loading}
            className="flex-1 bg-blue-500 rounded-xl py-4"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-center">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Change Password
              </Text>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Current Password */}
              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Current Password
                </Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                    secureTextEntry={!showPasswords.current}
                    className="flex-1 p-4 text-gray-800 dark:text-white"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}>
                    <Ionicons
                      name={showPasswords.current ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  New Password
                </Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                    secureTextEntry={!showPasswords.new}
                    className="flex-1 p-4 text-gray-800 dark:text-white"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}>
                    <Ionicons
                      name={showPasswords.new ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Confirm New Password
                </Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                    secureTextEntry={!showPasswords.confirm}
                    className="flex-1 p-4 text-gray-800 dark:text-white"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}>
                    <Ionicons
                      name={showPasswords.confirm ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                className="bg-blue-500 rounded-xl py-4 items-center mb-6"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Change Password</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}