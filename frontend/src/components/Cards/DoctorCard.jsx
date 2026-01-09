import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function DoctorCard({ name, specialty, rating, experience, consultationFee, image, isOnline, nextAvailable, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-xl border border-gray-100 dark:border-gray-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      {/* Header with status */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-24 h-24 rounded-2xl border-3 border-blue-500 dark:border-blue-400"
          />
          {/* Online badge */}
          <View className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-3 border-white dark:border-gray-800 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </View>

        {/* Action buttons */}
        <View className="flex-row space-x-2">
          <TouchableOpacity className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full">
            <Ionicons name="videocam" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full">
            <Ionicons name="call" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Doctor info */}
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">{name}</Text>
      <Text className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">{specialty}</Text>

      {/* Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-full">
          <MaterialIcons name="star" size={18} color="#F59E0B" />
          <Text className="ml-1 text-sm font-bold text-amber-600 dark:text-amber-400">{rating.toFixed(1)}</Text>
        </View>

        <View className="flex-row items-center bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-full">
          <MaterialIcons name="work" size={16} color="#8B5CF6" />
          <Text className="ml-1 text-sm font-semibold text-purple-600 dark:text-purple-400">{experience}y exp</Text>
        </View>

        <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 rounded-full">
          <MaterialIcons name="currency-rupee" size={16} color="#10B981" />
          <Text className="ml-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{consultationFee}</Text>
        </View>
      </View>

      {/* Availability */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <Text className={`text-sm font-medium ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
          {isOnline ? 'Available Now' : `Next: ${nextAvailable}`}
        </Text>
        <TouchableOpacity className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 rounded-full">
          <Text className="text-white font-semibold text-sm">Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
