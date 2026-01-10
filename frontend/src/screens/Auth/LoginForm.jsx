import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "@/src/components/CustomButton";

/**
 * Reusable Login Form Component
 * @param {object} roleInfo - Selected role information
 * @param {function} onLogin - Login handler
 * @param {function} onClose - Close handler
 * @param {boolean} isLoading - Loading state
 */
export default function LoginForm({
  roleInfo,
  onLogin,
  onClose,
  isLoading = false,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const renderIcon = () => {
    const { icon, iconLib } = roleInfo;
    const IconComponent =
      iconLib === "FontAwesome5"
        ? FontAwesome5
        : iconLib === "MaterialIcons"
          ? MaterialIcons
          : Ionicons;

    return <IconComponent name={icon} size={24} color="white" />;
  };

  const handleLogin = () => {
    if (email && password) {
      onLogin(email, password);
    }
  };

  const isFormValid = email.trim() && password.trim();

  return (
    <ScrollView
      className="px-6 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <View
            className={`w-12 h-12 bg-gradient-to-br ${roleInfo.gradient} ${roleInfo.darkGradient} rounded-2xl items-center justify-center mr-3`}
          >
            {renderIcon()}
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-800 dark:text-white">
              {roleInfo.title} Login
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              Enter your credentials
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Role Description */}
      <View className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <Text className="text-sm text-blue-800 dark:text-blue-300 font-medium">
          {roleInfo.description}
        </Text>
      </View>

      {/* Login Form */}
      <View className="space-y-6">
        {/* Email Input */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Email Address
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 focus:border-blue-500 dark:focus:border-blue-400">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 dark:text-white text-base"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Password Input */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 focus:border-blue-500 dark:focus:border-blue-400">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 dark:text-white text-base"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <CustomButton
          title={isLoading ? "Signing In..." : "Sign In"}
          variant="outline"
          onPress={handleLogin}
          disabled={!isFormValid}
          loading={isLoading}
          gradient={`${roleInfo.gradient} ${roleInfo.darkGradient}`}
          shadowColor={roleInfo.shadowColor}
          size="large"
          fullWidth
          icon={!isLoading ? "log-in-outline" : undefined}
        />

        {/* Additional Options */}
        <View className="flex-row justify-between items-center pt-4">
          <TouchableOpacity>
            <Text className="text-blue-600 dark:text-blue-400 font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-gray-600 dark:text-gray-400 font-medium">
              Need Help?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Note */}
        <View className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2">
              Your data is encrypted and secure. We follow HIPAA compliance
              standards.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
