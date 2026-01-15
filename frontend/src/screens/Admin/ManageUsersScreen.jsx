// src/screens/Admin/ManageUsersScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  RefreshControl,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import CustomHeader from "../../components/CustomHeader";

export default function ManageUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState(""); // '', 'user', 'admin'
  const [filterStatus, setFilterStatus] = useState(""); // '', 'true', 'false'
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.isActive = filterStatus;

      const { data } = await api.get("/users", { params });

      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleToggleStatus = (user) => {
    setUserToToggle(user);
    setStatusModalVisible(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const { data } = await api.patch(`/users/${userToToggle._id}/toggle-status`);

      if (data.success) {
        // Update user in list
        setUsers(users.map(u => 
          u._id === userToToggle._id 
            ? { ...u, isActive: data.user.isActive } 
            : u
        ));
        
        // Update stats
        if (data.user.isActive) {
          setStats({
            ...stats,
            activeUsers: stats.activeUsers + 1,
            inactiveUsers: stats.inactiveUsers - 1,
          });
        } else {
          setStats({
            ...stats,
            activeUsers: stats.activeUsers - 1,
            inactiveUsers: stats.inactiveUsers + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert(error.response?.data?.message || "Failed to update user status");
    } finally {
      setStatusModalVisible(false);
      setUserToToggle(null);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setDetailModalVisible(true);
  };

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-500" : "bg-red-500";
  };

  const getStatusText = (isActive) => {
    return isActive ? "Active" : "Inactive";
  };

  if (loading) {
    return (
      <ManageUsersSkeleton />
      // <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      //   <CustomHeader title="Manage Users" showBack showMenu />
      //   <View className="flex-1 justify-center items-center">
      //     <ActivityIndicator size="large" color="#3B82F6" />
      //     <Text className="text-gray-500 dark:text-gray-400 mt-4">
      //       Loading users...
      //     </Text>
      //   </View>
      // </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Users" showBack showMenu />

      {/* Stats Cards */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          <View className="bg-blue-500 rounded-xl p-4 mr-3 min-w-[140px]">
            <Text className="text-white text-2xl font-bold">
              {stats.totalUsers}
            </Text>
            <Text className="text-white/80 text-sm mt-1">Total Users</Text>
          </View>
          <View className="bg-green-500 rounded-xl p-4 mr-3 min-w-[140px]">
            <Text className="text-white text-2xl font-bold">
              {stats.activeUsers}
            </Text>
            <Text className="text-white/80 text-sm mt-1">Active</Text>
          </View>
          <View className="bg-red-500 rounded-xl p-4 mr-3 min-w-[140px]">
            <Text className="text-white text-2xl font-bold">
              {stats.inactiveUsers}
            </Text>
            <Text className="text-white/80 text-sm mt-1">Inactive</Text>
          </View>
          <View className="bg-purple-500 rounded-xl p-4 min-w-[140px]">
            <Text className="text-white text-2xl font-bold">
              {stats.totalAdmins}
            </Text>
            <Text className="text-white/80 text-sm mt-1">Admins</Text>
          </View>
        </ScrollView>
      </View>

      {/* Search and Filters */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 mb-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            className="flex-1 ml-2 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => {
              setSearchQuery("");
              setTimeout(fetchUsers, 100);
            }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filters */}
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setFilterRole(filterRole === "user" ? "" : "user")}
            className={`px-4 py-2 rounded-lg ${
              filterRole === "user" ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`font-semibold ${
                filterRole === "user" ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Users Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterStatus(filterStatus === "true" ? "" : "true")}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === "true" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`font-semibold ${
                filterStatus === "true" ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterStatus(filterStatus === "false" ? "" : "false")}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === "false" ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`font-semibold ${
                filterStatus === "false" ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Inactive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Users List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
        }
      >
        {users.length === 0 ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-12 items-center">
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
              No users found
            </Text>
          </View>
        ) : (
          users.map((user) => (
            <TouchableOpacity
              key={user._id}
              onPress={() => viewUserDetails(user)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  {/* User Info */}
                  <View className="flex-row items-center mb-2">
                    <View className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full items-center justify-center mr-3">
                      <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {user.fullName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-gray-900 dark:text-white font-bold text-base">
                          {user.fullName}
                        </Text>
                        {user.role === "admin" && (
                          <View className="bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded ml-2">
                            <Text className="text-purple-600 dark:text-purple-400 text-xs font-semibold">
                              Admin
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.email}
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-500 text-sm">
                        {user.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View className="flex-row items-center">
                    <View
                      className={`${getStatusColor(user.isActive)} px-3 py-1 rounded-full`}
                    >
                      <Text className="text-white text-xs font-semibold">
                        {getStatusText(user.isActive)}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xs ml-2">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Toggle Switch (Only for non-admin users) */}
                {user.role !== "admin" && (
                  <TouchableOpacity
                    onPress={() => handleToggleStatus(user)}
                    className="ml-3"
                  >
                    <View
                      className={`w-12 h-6 rounded-full ${
                        user.isActive ? "bg-green-500" : "bg-gray-300"
                      } justify-center`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white ${
                          user.isActive ? "self-end mr-0.5" : "self-start ml-0.5"
                        }`}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-6" />
      </ScrollView>

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          visible={detailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/70">
            <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  User Details
                </Text>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View className="items-center mb-6">
                  <View className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full items-center justify-center mb-3">
                    <Text className="text-blue-600 dark:text-blue-400 font-bold text-3xl">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.fullName}
                  </Text>
                  <View
                    className={`${getStatusColor(selectedUser.isActive)} px-3 py-1 rounded-full mt-2`}
                  >
                    <Text className="text-white text-xs font-semibold">
                      {getStatusText(selectedUser.isActive)}
                    </Text>
                  </View>
                </View>

                <View className="space-y-3">
                  <DetailRow icon="mail" label="Email" value={selectedUser.email} />
                  <DetailRow icon="call" label="Phone" value={selectedUser.phone} />
                  <DetailRow
                    icon="person"
                    label="Role"
                    value={selectedUser.role.toUpperCase()}
                  />
                  {selectedUser.role === "user" && (
                    <>
                      <DetailRow
                        icon="location"
                        label="Address"
                        value={selectedUser.address || "N/A"}
                      />
                      <DetailRow
                        icon="calendar"
                        label="Date of Birth"
                        value={
                          selectedUser.dateOfBirth
                            ? new Date(selectedUser.dateOfBirth).toLocaleDateString()
                            : "N/A"
                        }
                      />
                      <DetailRow
                        icon="male-female"
                        label="Gender"
                        value={selectedUser.gender?.toUpperCase() || "N/A"}
                      />
                    </>
                  )}
                  {selectedUser.role === "admin" && (
                    <DetailRow
                      icon="briefcase"
                      label="Department"
                      value={selectedUser.department || "N/A"}
                    />
                  )}
                  <DetailRow
                    icon="time"
                    label="Joined"
                    value={new Date(selectedUser.createdAt).toLocaleString()}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Status Toggle Confirmation Modal */}
      <Modal
        visible={statusModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View
                className={`${
                  userToToggle?.isActive ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
                } w-16 h-16 rounded-full items-center justify-center mb-4`}
              >
                <Ionicons
                  name={userToToggle?.isActive ? "close-circle" : "checkmark-circle"}
                  size={32}
                  color={userToToggle?.isActive ? "#EF4444" : "#10B981"}
                />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {userToToggle?.isActive ? "Deactivate User" : "Activate User"}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to {userToToggle?.isActive ? "deactivate" : "activate"}{" "}
                <Text className="font-semibold">{userToToggle?.fullName}</Text>?
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setStatusModalVisible(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 items-center"
              >
                <Text className="text-gray-800 dark:text-white font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmToggleStatus}
                className={`flex-1 rounded-lg p-4 items-center ${
                  userToToggle?.isActive ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <Text className="text-white font-semibold">
                  {userToToggle?.isActive ? "Deactivate" : "Activate"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper component for detail rows
const DetailRow = ({ icon, label, value }) => (
  <View className="flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <Ionicons name={icon} size={20} color="#9CA3AF" />
    <View className="ml-3 flex-1">
      <Text className="text-xs text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-base text-gray-900 dark:text-white font-medium">
        {value}
      </Text>
    </View>
  </View>
);


// Professional Skeleton Loading Component for Manage Users
const ManageUsersSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ width, height, style }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E5E7EB",
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
      className="dark:bg-gray-700"
    />
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="Manage Users" showBack showMenu />

      {/* Stats Cards Skeleton */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item} className="mr-3 min-w-[140px]">
              <SkeletonBox width={140} height={80} style={{ borderRadius: 12 }} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Search and Filters Skeleton */}
      <View className="bg-white dark:bg-gray-800 px-4 py-3">
        {/* Search Bar */}
        <SkeletonBox width="100%" height={44} style={{ marginBottom: 12, borderRadius: 8 }} />

        {/* Filters */}
        <View className="flex-row space-x-2">
          <SkeletonBox width={110} height={40} style={{ marginRight: 8, borderRadius: 8 }} />
          <SkeletonBox width={90} height={40} style={{ marginRight: 8, borderRadius: 8 }} />
          <SkeletonBox width={100} height={40} style={{ borderRadius: 8 }} />
        </View>
      </View>

      {/* Users List Skeleton */}
      <ScrollView className="flex-1 px-4 py-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <View
            key={item}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                {/* User Info */}
                <View className="flex-row items-center mb-2">
                  {/* Avatar */}
                  <SkeletonBox
                    width={48}
                    height={48}
                    style={{ marginRight: 12, borderRadius: 24 }}
                  />

                  {/* Name and Email */}
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <SkeletonBox width={140} height={18} style={{ borderRadius: 6 }} />
                      <SkeletonBox
                        width={50}
                        height={20}
                        style={{ marginLeft: 8, borderRadius: 4 }}
                      />
                    </View>
                    <SkeletonBox
                      width="90%"
                      height={14}
                      style={{ marginBottom: 6, borderRadius: 4 }}
                    />
                    <SkeletonBox width="70%" height={14} style={{ borderRadius: 4 }} />
                  </View>
                </View>

                {/* Status Badge and Date */}
                <View className="flex-row items-center">
                  <SkeletonBox width={70} height={26} style={{ borderRadius: 13 }} />
                  <SkeletonBox
                    width={100}
                    height={12}
                    style={{ marginLeft: 8, borderRadius: 4 }}
                  />
                </View>
              </View>

              {/* Toggle Switch */}
              <SkeletonBox width={48} height={24} style={{ borderRadius: 12 }} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
