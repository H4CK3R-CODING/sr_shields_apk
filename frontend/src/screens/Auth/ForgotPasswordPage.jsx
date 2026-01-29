// src/screens/Auth/ForgotPasswordPage.jsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { sendPasswordResetOTP, resetPassword } from "../../services/authService";

export default function ForgotPasswordPage({ navigation }) {
  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef([]);

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    // Validate email
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!isValidEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await sendPasswordResetOTP(email);

      if (response.success) {
        setOtpSent(true);
        setStep(2);
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: `Verification code sent to ${email}`,
          position: "top",
          visibilityTime: 3000,
        });

        // Start resend timer (5 minutes = 300 seconds)
        setResendTimer(300);
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Send OTP",
          text2: response.message || "Please try again",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send OTP. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password (combined OTP verification + password reset)
  const handleResetPassword = async () => {
    const otpCode = otp.join("");
    const newErrors = {};

    // Validate OTP
    if (otpCode.length !== 5) {
      newErrors.otp = "Please enter all 5 digits";
    }

    // Validate password
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!isStrongPassword(newPassword)) {
      newErrors.newPassword =
        "Password must be 8+ chars with uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await resetPassword(email, otpCode, newPassword);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful",
          text2: "You can now login with your new password",
          position: "top",
          visibilityTime: 3000,
        });

        // Navigate to login after delay
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Password Reset Failed",
          text2: response.message || "Please try again",
          position: "top",
          visibilityTime: 3000,
        });
        
        // If OTP is wrong, clear OTP inputs
        if (response.message?.toLowerCase().includes('invalid') || 
            response.message?.toLowerCase().includes('code')) {
          setOtp(["", "", "", "", ""]);
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to reset password. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors({ ...errors, otp: null });

    // Auto-focus next input
    if (value && index < 4) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else if (step === 2) {
      setStep(1);
      setOtp(["", "", "", "", ""]);
      setOtpSent(false);
    } else if (step === 3) {
      setStep(2);
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  };

  // Render Step 1: Enter Email
  const renderStepEmail = () => (
    <View>
      <View className="items-center mb-8">
        <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <Ionicons name="lock-closed" size={48} color="#3B82F6" />
        </View>
        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Forgot Password?
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center px-4">
          No worries! Enter your email address and we'll send you a verification code to reset your password.
        </Text>
      </View>

      {/* Email Input */}
      <View className="mb-6">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Email Address
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${
            errors.email ? "border-2 border-red-500" : ""
          }`}
        >
          <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({});
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email}</Text>
        )}
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        onPress={handleSendOTP}
        disabled={loading}
        className="bg-blue-500 rounded-xl py-4 items-center mb-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Send Verification Code</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="mt-2"
      >
        <Text className="text-center text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Text className="text-blue-500 font-semibold">Back to Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Step 2: Enter OTP and New Password (Combined)
  const renderStepResetPassword = () => (
    <View>
      <View className="items-center mb-8">
        <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <Ionicons name="shield-checkmark" size={48} color="#3B82F6" />
        </View>
        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Reset Password
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center px-4 mb-2">
          We've sent a 5-digit code to
        </Text>
        <Text className="text-blue-500 font-semibold">{email}</Text>
      </View>

      {/* OTP Input */}
      <View className="mb-6">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-center">
          Enter 5-Digit Verification Code
        </Text>
        <View className="flex-row justify-center mb-2">
          {otp.map((digit, index) => (
            <View
              key={index}
              className={`w-12 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl mx-1 ${
                errors.otp ? "border-2 border-red-500" : ""
              }`}
            >
              <TextInput
                ref={(ref) => {
                  otpInputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleOtpKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="flex-1 text-center text-xl font-bold text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}
        </View>
        {errors.otp && (
          <Text className="text-red-500 text-sm mt-1 text-center">{errors.otp}</Text>
        )}
        
        {/* Resend OTP */}
        <View className="items-center mt-3">
          {resendTimer > 0 ? (
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Resend in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
              <Text className="text-blue-500 font-semibold text-sm">
                {loading ? "Sending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* New Password */}
      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          New Password
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${
            errors.newPassword ? "border-2 border-red-500" : ""
          }`}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setErrors({ ...errors, newPassword: null });
            }}
            secureTextEntry={!showNewPassword}
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.newPassword && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.newPassword}
          </Text>
        )}
        <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1 ml-1">
          At least 8 characters with uppercase, lowercase, and number
        </Text>
      </View>

      {/* Confirm Password */}
      <View className="mb-6">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Confirm Password
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${
            errors.confirmPassword ? "border-2 border-red-500" : ""
          }`}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors({ ...errors, confirmPassword: null });
            }}
            secureTextEntry={!showConfirmPassword}
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={loading}
        className="bg-blue-500 rounded-xl py-4 items-center mb-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* Change Email */}
      <TouchableOpacity
        onPress={() => {
          setStep(1);
          setOtp(["", "", "", "", ""]);
          setOtpSent(false);
          setNewPassword("");
          setConfirmPassword("");
          setErrors({});
        }}
        className="mt-2"
      >
        <Text className="text-center text-gray-600 dark:text-gray-400">
          Wrong email?{" "}
          <Text className="text-blue-500 font-semibold">Change Email</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm">
          <TouchableOpacity onPress={handleBack} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View className="flex-row mb-4">
            {[1, 2].map((s) => (
              <View
                key={s}
                className={`h-2 flex-1 rounded-full mr-2 ${
                  s <= step ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </View>
          <Text className="text-gray-600 dark:text-gray-400">
            Step {step} of 2
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 p-6">
          {step === 1 && renderStepEmail()}
          {step === 2 && renderStepResetPassword()}
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}