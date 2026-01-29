// src/screens/Auth/RegistrationPage.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../state/authStore";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { sendOTP, verifyOTP } from "../../services/authService";

export default function RegistrationPage({ navigation }) {
  const { register } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isEmailVerified: false,
    role: "user", // user or admin
    // Admin specific fields
    department: "",
    // User specific fields
    address: "",
    dateOfBirth: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Multi-step form: 1 = Basic Info, 2 = Email Verification, 3 = Role Selection, 4 = Additional Info

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  // const [otpInputRefs, setOtpInputRefs] = useState([]);
  const otpInputRefs = React.useRef([]);

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Validate password strength
  const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  // Validate Step 1 (Basic Info)
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Invalid phone number (10 digits required)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 4 (Additional Info)
  const validateStep4 = () => {
    const newErrors = {};

    if (formData.role === "admin") {
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
    } else {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = "Date of birth is required";
      }

      if (!formData.gender) {
        newErrors.gender = "Please select gender";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await sendOTP(formData.email);

      if (response.success) {
        setOtpSent(true);
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: `Verification code sent to ${formData.email}`,
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

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 5) {
      // Changed from 6 to 5
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter all 5 digits", // Changed from 6 to 5
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(formData.email, otpCode);

      if (response.success) {
        setOtpVerified(true);
        setFormData({ ...formData, isEmailVerified: true });
        Toast.show({
          type: "success",
          text1: "Email Verified",
          text2: "Your email has been verified successfully",
          position: "top",
          visibilityTime: 2000,
        });

        // Move to next step after a short delay
        setTimeout(() => {
          setStep(3);
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid OTP",
          text2: response.message || "Please check the code and try again",
          position: "top",
          visibilityTime: 3000,
        });
        // Clear OTP inputs (changed to 5 empty strings)
        setOtp(["", "", "", "", ""]);
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: "Please try again",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input (changed from index < 5 to index < 4)
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

  // Handle Next button
  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      // Send OTP when moving to step 2
      setStep(2);
      if (!otpSent) {
        await handleSendOTP();
      }
    } else if (step === 2) {
      // Verify OTP before proceeding
      if (!otpVerified) {
        Toast.show({
          type: "error",
          text1: "Email Not Verified",
          text2: "Please verify your email to continue",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  // Handle Back button
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  // Handle Registration
  const handleRegister = async () => {
    if (!validateStep4()) return;

    if (!otpVerified) {
      Toast.show({
        type: "error",
        text1: "Email Not Verified",
        text2: "Please verify your email first",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare user data
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        emailVerified: true,
        isEmailVerified: formData.isEmailVerified,
        confirmPassword: formData.confirmPassword,
        createdAt: new Date().toISOString(),
      };

      if (formData.role === "user") {
        const [day, month, year] = formData.dateOfBirth.trim().split("/");
        userData.address = formData.address.trim();
        userData.dateOfBirth = new Date(`${year}-${month}-${day}`);
        userData.gender = formData.gender.toLowerCase();
      } else {
        userData.department = formData.department.trim();
      }

      // Call register function from auth store
      console.log("Registering user with data:", userData);
      const { error } = await register(userData, formData.password);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: error,
          position: "top",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Welcome! You can now log in 🎉",
          position: "top",
          visibilityTime: 3000,
        });

        // Navigate to login after delay
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1500);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: "An unexpected error occurred",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Render Step 1: Basic Information
  const renderStep1 = () => (
    <View>
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Create Account
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 mb-6">
        Enter your basic information to get started
      </Text>

      {/* Full Name */}
      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Full Name *
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.fullName ? "border-2 border-red-500" : ""}`}
        >
          <Ionicons name="person-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => updateField("fullName", text)}
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {errors.fullName && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.fullName}
          </Text>
        )}
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Email Address *
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.email ? "border-2 border-red-500" : ""}`}
        >
          <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
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

      {/* Phone */}
      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Phone Number *
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.phone ? "border-2 border-red-500" : ""}`}
        >
          <Ionicons name="call-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="10-digit phone number"
            value={formData.phone}
            onChangeText={(text) => updateField("phone", text)}
            keyboardType="phone-pad"
            maxLength={10}
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {errors.phone && (
          <Text className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Password *
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.password ? "border-2 border-red-500" : ""}`}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            secureTextEntry={!showPassword}
            className="flex-1 p-4 text-gray-800 dark:text-white"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1 ml-1">
            {errors.password}
          </Text>
        )}
      </View>

      {/* Confirm Password */}
      <View className="mb-6">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
          Confirm Password *
        </Text>
        <View
          className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.confirmPassword ? "border-2 border-red-500" : ""}`}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField("confirmPassword", text)}
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
    </View>
  );

  // Render Step 2: Email Verification
  const renderStep2 = () => (
    <View>
      <View className="items-center mb-6">
        <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
          <Ionicons name="mail-outline" size={40} color="#3B82F6" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Verify Your Email
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center px-4">
          We've sent a 5-digit verification code to
        </Text>
        <Text className="text-blue-500 font-semibold mt-1">
          {formData.email}
        </Text>
      </View>

      {/* OTP Input */}
      <View className="mb-6">
        <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-center">
          Enter 5-Digit Verification Code
        </Text>
        <View className="flex-row justify-center space-x-2">
          {otp.map((digit, index) => (
            <View
              key={index}
              className={`w-12 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl mx-1 ${
                otpVerified ? "border-2 border-green-500" : ""
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
                editable={!otpVerified}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Verify Button */}
      {!otpVerified && (
        <TouchableOpacity
          onPress={handleVerifyOTP}
          disabled={loading || otp.join("").length !== 5} // Changed from 6 to 5
          className={`rounded-xl py-4 items-center mb-4 ${
            loading || otp.join("").length !== 5
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-blue-500"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Verify Code</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Resend OTP */}
      <View className="items-center mt-4">
        <Text className="text-gray-600 dark:text-gray-400 mb-2">
          Didn't receive the code?
        </Text>
        {resendTimer > 0 ? (
          <Text className="text-gray-500 dark:text-gray-400">
            Resend in {Math.floor(resendTimer / 60)}:
            {String(resendTimer % 60).padStart(2, "0")}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
            <Text className="text-blue-500 font-semibold">
              {loading ? "Sending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Change Email */}
      <TouchableOpacity
        onPress={() => {
          setStep(1);
          setOtpSent(false);
          setOtpVerified(false);
          setOtp(["", "", "", "", ""]); // Changed from 6 to 5
        }}
        className="mt-6"
      >
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Wrong email?{" "}
          <Text className="text-blue-500 font-semibold">Change Email</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Step 3: Role Selection
  const renderStep3 = () => (
    <View>
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Select Your Role
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 mb-6">
        Choose the type of account you want to create
      </Text>

      {/* User Role Card */}
      <TouchableOpacity
        onPress={() => updateField("role", "user")}
        className={`rounded-2xl p-6 mb-4 border-2 ${
          formData.role === "user"
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center mb-3">
          <View
            className={`w-16 h-16 rounded-2xl items-center justify-center ${
              formData.role === "user"
                ? "bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Ionicons
              name="person"
              size={32}
              color={formData.role === "user" ? "white" : "#9CA3AF"}
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              User Account
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              For general users
            </Text>
          </View>
          {formData.role === "user" && (
            <Ionicons name="checkmark-circle" size={28} color="#3B82F6" />
          )}
        </View>
        <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            ✓ View notifications and notices
          </Text>
          <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            ✓ Browse and apply for jobs
          </Text>
          <Text className="text-gray-700 dark:text-gray-300 text-sm">
            ✓ Download forms and documents
          </Text>
        </View>
      </TouchableOpacity>

      {/* Admin Role Card */}
      <TouchableOpacity
        onPress={() => updateField("role", "admin")}
        className={`rounded-2xl p-6 border-2 ${
          formData.role === "admin"
            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center mb-3">
          <View
            className={`w-16 h-16 rounded-2xl items-center justify-center ${
              formData.role === "admin"
                ? "bg-purple-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Ionicons
              name="shield-checkmark"
              size={32}
              color={formData.role === "admin" ? "white" : "#9CA3AF"}
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              Admin Account
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              For administrators
            </Text>
          </View>
          {formData.role === "admin" && (
            <Ionicons name="checkmark-circle" size={28} color="#8B5CF6" />
          )}
        </View>
        <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
          <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            ✓ Manage notifications and notices
          </Text>
          <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            ✓ Post and manage job listings
          </Text>
          <Text className="text-gray-700 dark:text-gray-300 text-sm">
            ✓ Upload forms and documents
          </Text>
        </View>
        <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 flex-row items-start">
          <Ionicons name="information-circle" size={18} color="#F59E0B" />
          <Text className="text-orange-600 dark:text-orange-400 text-xs ml-2 flex-1">
            Admin accounts have additional privileges
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Render Step 4: Additional Information
  const renderStep4 = () => {
    if (formData.role === "admin") {
      return (
        <View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Admin Details
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-6">
            Complete your admin account setup
          </Text>

          {/* Department */}
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Department *
            </Text>
            <View
              className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.department ? "border-2 border-red-500" : ""}`}
            >
              <Ionicons name="business-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Your department"
                value={formData.department}
                onChangeText={(text) => updateField("department", text)}
                className="flex-1 p-4 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.department && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.department}
              </Text>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Additional Details
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-6">
            Tell us a bit more about yourself
          </Text>

          {/* Address */}
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Address *
            </Text>
            <View
              className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-start px-4 ${errors.address ? "border-2 border-red-500" : ""}`}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color="#9CA3AF"
                className="mt-4"
              />
              <TextInput
                placeholder="Enter your address"
                value={formData.address}
                onChangeText={(text) => updateField("address", text)}
                multiline
                numberOfLines={3}
                className="flex-1 p-4 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: "top" }}
              />
            </View>
            {errors.address && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.address}
              </Text>
            )}
          </View>

          {/* Date of Birth */}
          <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Date of Birth *
            </Text>
            <View
              className={`bg-gray-100 dark:bg-gray-700 rounded-xl flex-row items-center px-4 ${errors.dateOfBirth ? "border-2 border-red-500" : ""}`}
            >
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="DD/MM/YYYY"
                value={formData.dateOfBirth}
                onChangeText={(text) => updateField("dateOfBirth", text)}
                className="flex-1 p-4 text-gray-800 dark:text-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.dateOfBirth && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.dateOfBirth}
              </Text>
            )}
          </View>

          {/* Gender */}
          <View className="mb-6">
            <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Gender *
            </Text>
            <View className="flex-row">
              {["Male", "Female", "Other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => updateField("gender", gender)}
                  className={`flex-1 mr-2 p-4 rounded-xl ${
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
            {errors.gender && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.gender}
              </Text>
            )}
          </View>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm">
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : handleBack())}
            className="mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View className="flex-row mb-4">
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                className={`h-2 flex-1 rounded-full mr-2 ${
                  s <= step ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </View>
          <Text className="text-gray-600 dark:text-gray-400">
            Step {step} of 4
          </Text>
        </View>

        {/* Form Content */}
        <View className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>
      </KeyboardAwareScrollView>

      {/* Bottom Action Buttons */}
      <View className="bg-white dark:bg-gray-800 p-6 shadow-lg">
        {step === 2 ? (
          // Email verification step - button handled in renderStep2
          otpVerified && (
            <TouchableOpacity
              onPress={handleNext}
              className="bg-blue-500 rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">Continue</Text>
            </TouchableOpacity>
          )
        ) : step < 4 ? (
          <TouchableOpacity
            onPress={handleNext}
            className="bg-blue-500 rounded-xl py-4 items-center"
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-blue-500 rounded-xl py-4 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="mt-4"
        >
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <Text className="text-blue-500 font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
