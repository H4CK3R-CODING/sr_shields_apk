// src/screens/User/ProfileScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAuthStore from "../../state/authStore";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function ProfileScreen({ navigation }) {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: new Date(),
    gender: "male",
    department: "",
    role: "user",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Determine endpoint based on user role
      const endpoint =
        user?.role === "admin" ? "/user/profile" : "/user/profile";

      const { data } = await api.get(endpoint);

      if (data.success) {
        setProfileData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          dateOfBirth: data.user.dateOfBirth
            ? new Date(data.user.dateOfBirth)
            : new Date(),
          gender: data.user.gender || "male",
          department: data.user.department || "",
          role: data.user.role || "user",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (key) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    try {
      // Validation
      if (!profileData.fullName.trim()) {
        Alert.alert("Error", "Full name is required");
        return;
      }

      if (!profileData.phone.match(/^[0-9]{10}$/)) {
        Alert.alert("Error", "Please enter a valid 10-digit phone number");
        return;
      }

      // Role-specific validation
      if (profileData.role === "user") {
        if (!profileData.address.trim()) {
          Alert.alert("Error", "Address is required for users");
          return;
        }
        if (!profileData.gender) {
          Alert.alert("Error", "Gender is required for users");
          return;
        }
      }

      if (profileData.role === "admin") {
        if (!profileData.department.trim()) {
          Alert.alert("Error", "Department is required for admins");
          return;
        }
      }

      setSaving(true);

      const updatePayload = {
        fullName: profileData.fullName,
        phone: profileData.phone,
      };

      // Add role-specific fields
      if (profileData.role === "user") {
        updatePayload.address = profileData.address;
        updatePayload.dateOfBirth = profileData.dateOfBirth;
        updatePayload.gender = profileData.gender;
      }

      if (profileData.role === "admin") {
        updatePayload.department = profileData.department;
      }

      const endpoint =
        profileData.role === "admin" ? "/user/profile" : "/user/profile";

      const { data } = await api.put(endpoint, updatePayload);

      if (data.success) {
        // Update local user state
        setUser(data.user);
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validation
      if (!passwordData.currentPassword) {
        Alert.alert("Error", "Current password is required");
        return;
      }

      if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        Alert.alert("Error", "New password must be at least 6 characters");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      setSaving(true);

      const endpoint =
        profileData.role === "admin"
          ? "/user/change-password"
          : "/user/change-password";

      const { data } = await api.put(endpoint, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (data.success) {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        Alert.alert("Success", "Password changed successfully");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // Change "Login" to your actual route name
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfileData({ ...profileData, dateOfBirth: selectedDate });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CustomHeader title="My Profile" showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-base">
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader
        title="My Profile"
        showBack
        rightButton={
          !isEditing && (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="px-4 py-2"
            >
              <Ionicons name="create-outline" size={24} color="#3B82F6" />
            </TouchableOpacity>
          )
        }
      />

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <LinearGradient
          colors={["#3B82F6", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-8 pb-12 rounded-b-3xl"
        >
          <View className="items-center">
            {/* Avatar */}
            <View className="bg-white/20 w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-white/30">
              <Text className="text-white text-4xl font-bold">
                {profileData.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>

            {!isEditing ? (
              <>
                <Text className="text-white text-2xl font-bold mb-1">
                  {profileData.fullName}
                </Text>
                <Text className="text-white/90 text-base mb-2">
                  {profileData.email}
                </Text>
                <View className="bg-white/20 px-4 py-2 rounded-full">
                  <Text className="text-white text-sm font-semibold">
                    Member since {new Date(user?.createdAt).getFullYear()}
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-white text-xl font-bold">Edit Profile</Text>
            )}
          </View>
        </LinearGradient>

        {/* Profile Form */}
        <View className="px-6 -mt-6">
          {/* Personal Information Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Ionicons name="person" size={20} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 dark:text-white font-bold text-lg">
                Personal Information
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                Full Name *
              </Text>
              {isEditing ? (
                <TextInput
                  value={profileData.fullName}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, fullName: text })
                  }
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <Text className="text-gray-900 dark:text-white text-base">
                  {profileData.fullName}
                </Text>
              )}
            </View>

            {/* Email (Read-only) */}
            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                Email Address
              </Text>
              <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
                <Text className="text-gray-500 dark:text-gray-400 text-base flex-1">
                  {profileData.email}
                </Text>
                <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-xs mt-1">
                Email cannot be changed
              </Text>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                Phone Number *
              </Text>
              {isEditing ? (
                <TextInput
                  value={profileData.phone}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, phone: text })
                  }
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              ) : (
                <Text className="text-gray-900 dark:text-white text-base">
                  {profileData.phone}
                </Text>
              )}
            </View>

            {/* Admin-specific fields */}
            {profileData.role === "admin" && (
              <>
                {/* Department */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                    Department *
                  </Text>
                  {isEditing ? (
                    <TextInput
                      value={profileData.department}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, department: text })
                      }
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                      placeholder="Enter department name"
                      placeholderTextColor="#9CA3AF"
                    />
                  ) : (
                    <Text className="text-gray-900 dark:text-white text-base">
                      {profileData.department || "Not specified"}
                    </Text>
                  )}
                </View>

                {/* Role Badge */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                    Role
                  </Text>
                  <View className="bg-purple-100 dark:bg-purple-900/30 px-4 py-3 rounded-xl flex-row items-center">
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#8B5CF6"
                    />
                    <Text className="text-purple-700 dark:text-purple-400 font-bold ml-2 capitalize">
                      Administrator
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* User-specific fields */}
            {profileData.role === "user" && (
              <>
                {/* Gender */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                    Gender *
                  </Text>
                  {isEditing ? (
                    <View className="flex-row">
                      {["male", "female", "other"].map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() =>
                            setProfileData({ ...profileData, gender: option })
                          }
                          className={`flex-1 mr-2 rounded-xl py-3 ${
                            profileData.gender === option
                              ? "bg-blue-500"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Text
                            className={`text-center font-semibold capitalize ${
                              profileData.gender === option
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text className="text-gray-900 dark:text-white text-base capitalize">
                      {profileData.gender}
                    </Text>
                  )}
                </View>

                {/* Date of Birth */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                    Date of Birth *
                  </Text>
                  {isEditing ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 flex-row justify-between items-center"
                    >
                      <Text className="text-gray-900 dark:text-white text-base">
                        {formatDate(profileData.dateOfBirth)}
                      </Text>
                      <Ionicons name="calendar" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  ) : (
                    <Text className="text-gray-900 dark:text-white text-base">
                      {formatDate(profileData.dateOfBirth)}
                    </Text>
                  )}
                </View>

                {/* Address */}
                <View>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                    Address *
                  </Text>
                  {isEditing ? (
                    <TextInput
                      value={profileData.address}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, address: text })
                      }
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                      placeholder="Enter your address"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  ) : (
                    <Text className="text-gray-900 dark:text-white text-base">
                      {profileData.address}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <View className="flex-row mb-4">
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset to original data
                }}
                disabled={saving}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-4 mr-2"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                className="flex-1 bg-blue-500 rounded-xl py-4 ml-2"
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-base">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Security Card */}
          {!isEditing && (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-orange-100 dark:bg-orange-900/30 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-lg">
                  Security
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowPasswordModal(true)}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-4 flex-row justify-between items-center"
              >
                <View className="flex-row items-center">
                  <Ionicons name="key" size={20} color="#3B82F6" />
                  <Text className="text-gray-900 dark:text-white font-semibold ml-3">
                    Change Password
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Account Info Card */}
          {!isEditing && (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#10B981"
                  />
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-lg">
                  Account Information
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Account Status
                  </Text>
                  <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <Text className="text-green-600 dark:text-green-400 font-semibold text-xs">
                      Active
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Member Since
                  </Text>
                  <Text className="text-gray-900 dark:text-white font-semibold">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600 dark:text-gray-400">
                    Last Login
                  </Text>
                  <Text className="text-gray-900 dark:text-white font-semibold">
                    {user?.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Logout Button */}
          {!isEditing && (
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 dark:bg-red-900/20 rounded-2xl py-4 mb-6"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text className="text-red-600 dark:text-red-400 font-bold text-base ml-2">
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View className="h-6" />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={profileData.dateOfBirth}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-gray-900 dark:text-white font-bold text-xl">
                Change Password
              </Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Current Password */}
            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                Current Password
              </Text>

              <View className="relative">
                <TextInput
                  value={passwordData.currentPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, currentPassword: text })
                  }
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.current}
                />

                <TouchableOpacity
                  onPress={() => togglePassword("current")}
                  className="absolute right-4 top-3"
                >
                  <Ionicons
                    name={showPasswords.current ? "eye-off" : "eye"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                New Password
              </Text>

              <View className="relative">
                <TextInput
                  value={passwordData.newPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, newPassword: text })
                  }
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-900 dark:text-white"
                  placeholder="Enter new password (min 6 chars)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.new}
                />

                <TouchableOpacity
                  onPress={() => togglePassword("new")}
                  className="absolute right-4 top-3"
                >
                  <Ionicons
                    name={showPasswords.new ? "eye-off" : "eye"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-semibold">
                Confirm New Password
              </Text>

              <View className="relative">
                <TextInput
                  value={passwordData.confirmPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, confirmPassword: text })
                  }
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.confirm}
                />

                <TouchableOpacity
                  onPress={() => togglePassword("confirm")}
                  className="absolute right-4 top-3"
                >
                  <Ionicons
                    name={showPasswords.confirm ? "eye-off" : "eye"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                disabled={saving}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-4 mr-2"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={saving}
                className="flex-1 bg-blue-500 rounded-xl py-4 ml-2"
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Update Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="log-out-outline" size={32} color="#EF4444" />
              </View>
              <Text className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                Logout
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to logout?
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-4 mr-2"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmLogout}
                className="flex-1 bg-red-500 rounded-xl py-4 ml-2"
              >
                <Text className="text-white text-center font-bold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
