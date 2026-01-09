// src/screens/ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    dateOfBirth: "15/03/1990",
    gender: "Male",
    bloodGroup: "O+",
    address: "123, Medical Street, Health City, HC 12345",
    emergencyContact: "+91 9876543211",
    emergencyName: "Jane Doe",
    allergies: "Penicillin, Dust",
    chronicConditions: "Hypertension",
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const profileImage =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400";

  const statsData = [
    {
      label: "Orders",
      value: "24",
      icon: "receipt-outline",
      color: "#059669",
    },
    {
      label: "Saved",
      value: "₹1,240",
      icon: "wallet-outline",
      color: "#3b82f6",
    },
    {
      label: "Rewards",
      value: "340",
      icon: "star-outline",
      color: "#f59e0b",
    },
  ];

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleImagePicker = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: () => console.log("Open Camera") },
      { text: "Gallery", onPress: () => console.log("Open Gallery") },
    ]);
  };

  const renderInputField = (
    label,
    key,
    placeholder,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </Text>
      <TextInput
        className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={isEditing ? tempData[key] : profileData[key]}
        onChangeText={(text) =>
          isEditing && setTempData({ ...tempData, [key]: text })
        }
        editable={isEditing}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderStatCard = (stat) => (
    <View
      key={stat.label}
      className="flex-1 mx-1 p-4 rounded-xl items-center bg-white dark:bg-gray-800 shadow-sm"
    >
      <View
        className="w-12 h-12 rounded-full justify-center items-center mb-2"
        style={{ backgroundColor: `${stat.color}20` }}
      >
        <Ionicons name={stat.icon} size={24} color={stat.color} />
      </View>
      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {stat.value}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {stat.label}
      </Text>
    </View>
  );

  return (
    <NavLayout title="Profile" showAiChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View className="p-6 mx-4 rounded-xl items-center bg-white dark:bg-gray-800 shadow-sm">
            <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.8}>
              <View className="relative">
                <Image
                  source={{ uri: profileImage }}
                  className="w-24 h-24 rounded-full"
                  resizeMode="cover"
                />
                <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-full justify-center items-center">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            <Text className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
              {profileData.name}
            </Text>

            <Text className="text-gray-600 dark:text-gray-400">
              {profileData.email}
            </Text>

            {/* Edit/Save Buttons */}
            <View className="flex-row mt-4 space-x-3">
              {!isEditing ? (
                <TouchableOpacity
                  className="bg-emerald-600 dark:bg-emerald-500 px-6 py-2 rounded-full flex-row items-center"
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={18} color="white" />
                  <Text className="text-white font-medium ml-2">
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    className="bg-gray-500 px-6 py-2 rounded-full"
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-emerald-600 dark:bg-emerald-500 px-6 py-2 rounded-full"
                    onPress={handleSave}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-medium">Save</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row px-4 py-4">
            {statsData.map(renderStatCard)}
          </View>

          {/* Personal Information */}
          <View className="mx-4 mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Personal Information
            </Text>

            {renderInputField("Full Name", "name", "Enter your full name")}
            {renderInputField(
              "Email Address",
              "email",
              "Enter your email",
              false,
              "email-address"
            )}
            {renderInputField(
              "Phone Number",
              "phone",
              "Enter your phone number",
              false,
              "phone-pad"
            )}
            {renderInputField("Date of Birth", "dateOfBirth", "DD/MM/YYYY")}
            {renderInputField("Gender", "gender", "Select gender")}
            {renderInputField("Blood Group", "bloodGroup", "Enter blood group")}
            {renderInputField(
              "Address",
              "address",
              "Enter your complete address",
              true
            )}
          </View>

          {/* Emergency Contact */}
          <View className="mx-4 mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Emergency Contact
            </Text>

            {renderInputField(
              "Contact Name",
              "emergencyName",
              "Emergency contact name"
            )}
            {renderInputField(
              "Phone Number",
              "emergencyContact",
              "Emergency contact number",
              false,
              "phone-pad"
            )}
          </View>

          {/* Medical Information */}
          <View className="mx-4 mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Medical Information
            </Text>

            {renderInputField(
              "Known Allergies",
              "allergies",
              "List any known allergies",
              true
            )}
            {renderInputField(
              "Chronic Conditions",
              "chronicConditions",
              "List chronic conditions",
              true
            )}
          </View>

          {/* Quick Actions */}
          <View className="mx-4 mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Quick Actions
            </Text>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700"
              onPress={() => navigation.navigate("OrderHistory")}
              activeOpacity={0.7}
            >
              <Ionicons name="receipt-outline" size={24} color="#059669" />
              <Text className="flex-1 ml-4 text-gray-900 dark:text-white">
                Order History
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700"
              onPress={() => console.log("Prescription History")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#059669"
              />
              <Text className="flex-1 ml-4 text-gray-900 dark:text-white">
                Prescription History
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700"
              onPress={() => console.log("Saved Medicines")}
              activeOpacity={0.7}
            >
              <Ionicons name="bookmark-outline" size={24} color="#059669" />
              <Text className="flex-1 ml-4 text-gray-900 dark:text-white">
                Saved Medicines
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => navigation.navigate("Settings")}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={24} color="#059669" />
              <Text className="flex-1 ml-4 text-gray-900 dark:text-white">
                Settings
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View className="px-4 pb-6">
            <TouchableOpacity
              className="py-4 rounded-lg border border-red-300 dark:border-red-600 flex-row justify-center items-center mb-3"
              onPress={() => {
                Alert.alert(
                  "Deactivate Account",
                  "Are you sure you want to deactivate your account? This action can be undone later.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Deactivate",
                      style: "destructive",
                      onPress: () => console.log("Account deactivated"),
                    },
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-remove-outline"
                size={20}
                color="#dc2626"
              />
              <Text className="text-red-600 text-lg font-medium ml-2">
                Deactivate Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-600 dark:bg-red-500 py-4 rounded-lg flex-row justify-center items-center"
              onPress={() => {
                Alert.alert(
                  "Delete Account",
                  "This will permanently delete your account and all data. This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => console.log("Account deleted"),
                    },
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </NavLayout>
  );
};

export default ProfileScreen;

{
  /* <NavLayout title="Profile" showAiChat={false}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          Profile Screen
        </Text>
      </View>
    </NavLayout> */
}
