import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

// Color Theme Testing Card
export default function ColorTestingCard() {
  const colorVariants = [
    { name: 'Primary Blue', bg: 'bg-blue-500', darkBg: 'dark:bg-blue-600', icon: 'briefcase-medical', iconLib: 'FontAwesome5' },
    { name: 'Success Green', bg: 'bg-green-500', darkBg: 'dark:bg-green-600', icon: 'checkmark-circle', iconLib: 'Ionicons' },
    { name: 'Warning Orange', bg: 'bg-orange-500', darkBg: 'dark:bg-orange-600', icon: 'warning', iconLib: 'MaterialIcons' },
    { name: 'Error Red', bg: 'bg-red-500', darkBg: 'dark:bg-red-600', icon: 'close-circle', iconLib: 'Ionicons' },
    { name: 'Purple Accent', bg: 'bg-purple-500', darkBg: 'dark:bg-purple-600', icon: 'star', iconLib: 'MaterialIcons' },
    { name: 'Teal Medical', bg: 'bg-teal-500', darkBg: 'dark:bg-teal-600', icon: 'favorite', iconLib: 'MaterialIcons' },
  ];

  return (
    <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🎨 Color Theme Testing
      </Text>

      {/* Gradient Buttons */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Gradient Action Buttons
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <TouchableOpacity className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-2xl shadow-lg">
            <Text className="text-white font-bold text-center">Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-2xl shadow-lg">
            <Text className="text-white font-bold text-center">Confirm Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-2xl shadow-lg">
            <Text className="text-white font-bold text-center">Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Color Variants Grid */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Medical App Color Palette
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {colorVariants.map((variant, index) => (
            <TouchableOpacity
              key={index}
              className={`${variant.bg} ${variant.darkBg} px-4 py-3 rounded-2xl flex-row items-center shadow-md min-w-[140px]`}
            >
              {variant.iconLib === 'FontAwesome5' && (
                <FontAwesome5 name={variant.icon} size={16} color="white" />
              )}
              {variant.iconLib === 'Ionicons' && (
                <Ionicons name={variant.icon} size={16} color="white" />
              )}
              {variant.iconLib === 'MaterialIcons' && (
                <MaterialIcons name={variant.icon} size={16} color="white" />
              )}
              <Text className="text-white font-semibold text-xs ml-2">
                {variant.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status Indicators */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Status Indicators
        </Text>
        <View className="space-y-3">
          <View className="flex-row items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-green-500 rounded-full mr-3" />
              <Text className="text-green-700 dark:text-green-300 font-semibold">Available for Consultation</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>

          <View className="flex-row items-center justify-between bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-orange-500 rounded-full mr-3" />
              <Text className="text-orange-700 dark:text-orange-300 font-semibold">Busy - Next available in 2 hours</Text>
            </View>
            <MaterialIcons name="schedule" size={24} color="#F97316" />
          </View>

          <View className="flex-row items-center justify-between bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-red-500 rounded-full mr-3" />
              <Text className="text-red-700 dark:text-red-300 font-semibold">Offline - Emergency only</Text>
            </View>
            <MaterialIcons name="error" size={24} color="#EF4444" />
          </View>
        </View>
      </View>
    </View>
  );
}
