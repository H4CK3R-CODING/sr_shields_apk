import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import useAuthStore from "@/src/state/authStore";

// Import our reusable components
import AppHeader from "@/src/components/Auth/AppHeader";
import RoleCard from "@/src/components/RoleCard";
import LoginForm from "./LoginForm";
import Loading from "@/src/components/Loading";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const roleData = [
  {
    role: "user",
    title: "User",
    subtitle: "Access government services",
    icon: "person",
    iconLib: "Ionicons",
    bgColor: "bg-blue-500",
    darkBgColor: "dark:bg-blue-600",
    borderColor: "border-blue-200",
    darkBorderColor: "dark:border-blue-700",
    shadowColor: "shadow-blue-200",
    darkShadowColor: "dark:shadow-blue-800",
    iconColor: "text-white",
    textColor: "text-white",
    description: "View notifications, download notices, and apply for jobs or government forms through CSC.",
    features: ["Notifications", "Notices (PDF)", "Jobs & Forms", "Status Tracking"],
  },
  {
    role: "admin",
    title: "Administrator",
    subtitle: "Manage CSC content & users",
    icon: "shield-checkmark",
    iconLib: "Ionicons",
    bgColor: "bg-purple-500",
    darkBgColor: "dark:bg-purple-600",
    borderColor: "border-purple-200",
    darkBorderColor: "dark:border-purple-700",
    shadowColor: "shadow-purple-200",
    darkShadowColor: "dark:shadow-purple-800",
    iconColor: "text-white",
    textColor: "text-white",
    description: "Manage notifications, upload notices, publish jobs/forms, and control users.",
    features: ["Manage Notices", "Publish Jobs", "Notifications", "User Control"],
  },
];

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Enhanced initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showLoginFormAnimation = () => {
    setShowLoginForm(true);
    Animated.spring(formSlideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const hideLoginFormAnimation = () => {
    Animated.timing(formSlideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowLoginForm(false);
      setSelectedRole(null);
    });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    showLoginFormAnimation();
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userNames = {
        user: "John Doe",
        admin: "Admin User",
      };

      login(selectedRole, { 
        name: userNames[selectedRole], 
        email: email,
        role: selectedRole 
      });
      setIsLoading(false);
    }, 2000);
  };

  const selectedRoleData = roleData.find(r => r.role === selectedRole);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-gray-900">
      {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent /> */}
      
      {/* Enhanced Background Pattern */}
      <View className="absolute inset-0">
        {/* Animated background shapes */}
        <View className="absolute top-10 left-5 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-xl" />
        <View className="absolute top-32 right-8 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-50 blur-lg" />
        <View className="absolute bottom-40 left-10 w-36 h-36 bg-emerald-100 dark:bg-emerald-900/20 rounded-full opacity-40 blur-xl" />
        <View className="absolute bottom-20 right-5 w-28 h-28 bg-orange-100 dark:bg-orange-900/20 rounded-full opacity-60 blur-lg" />
        
        {/* Subtle grid pattern */}
        <View className="absolute inset-0 opacity-5">
          <View className="flex-1" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #000 20px, #000 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)'
          }} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* App Header */}
          <AppHeader />

          {/* Enhanced Role Selection */}
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }}
            className="flex-1 px-6 pt-4"
          >
            {/* Title Section */}
            <View className="mb-8 items-center">
              <View className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Choose Your Role
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
                  Select how you'd like to access the platform
                </Text>
              </View>
            </View>

            {/* Role Cards Grid */}
            <View className="space-y-4">
              {roleData.map((roleInfo, index) => (
                <Animated.View
                  key={roleInfo.role}
                  style={{
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 * (index + 1), 0]
                      })
                    }]
                  }}
                >
                  <Pressable
                    onPress={() => handleRoleSelect(roleInfo.role)}
                    className={`
                      ${roleInfo.bgColor} ${roleInfo.darkBgColor}
                      rounded-2xl p-6 mb-4 shadow-xl
                      border-2 ${roleInfo.borderColor} ${roleInfo.darkBorderColor}
                      transform transition-all duration-300
                      ${selectedRole === roleInfo.role ? 'scale-105' : 'scale-100'}
                    `}
                    style={{
                      elevation: 8,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className={`text-2xl font-bold ${roleInfo.textColor} mb-1`}>
                          {roleInfo.title}
                        </Text>
                        <Text className={`${roleInfo.textColor} opacity-90 text-base mb-3`}>
                          {roleInfo.subtitle}
                        </Text>
                        <Text className={`${roleInfo.textColor} opacity-80 text-sm leading-5`}>
                          {roleInfo.description}
                        </Text>
                      </View>
                      
                      {/* Icon Container */}
                      <View className="ml-4">
                        <View className="bg-white/20 dark:bg-black/20 rounded-full p-4">
                          {/* Icon placeholder - you'll need to implement the actual icon based on iconLib */}
                          <View className="w-8 h-8 bg-white/40 rounded-full items-center justify-center">
                            <Text className={`${roleInfo.iconColor} font-bold text-lg`}>
                              {roleInfo.title.charAt(0)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Features */}
                    <View className="mt-4 flex-row flex-wrap">
                      {roleInfo.features.slice(0, 3).map((feature, idx) => (
                        <View 
                          key={idx}
                          className="bg-white/20 dark:bg-black/20 rounded-full px-3 py-1 mr-2 mb-2"
                        >
                          <Text className={`${roleInfo.textColor} opacity-90 text-xs`}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                      {roleInfo.features.length > 3 && (
                        <View className="bg-white/20 dark:bg-black/20 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className={`${roleInfo.textColor} opacity-90 text-xs`}>
                            +{roleInfo.features.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Selection Indicator */}
                    {selectedRole === roleInfo.role && (
                      <View className="absolute top-4 right-4">
                        <View className="bg-white rounded-full p-1">
                          <View className="w-4 h-4 bg-green-500 rounded-full items-center justify-center">
                            <Text className="text-white font-bold text-xs">✓</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            {/* Enhanced Footer */}
            <View className="mt-8 mb-6">
              <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center justify-center space-x-6">
                  <View className="items-center">
                    <View className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-2">
                      <Text className="text-green-600 dark:text-green-400 font-bold">🔒</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Secure</Text>
                  </View>
                  
                  
                  <View className="items-center">
                    <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full items-center justify-center mb-2">
                      <Text className="text-purple-600 dark:text-purple-400 font-bold">🔐</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Encrypted</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Enhanced Login Form Overlay */}
      {showLoginForm && selectedRoleData && (
        <View className="absolute inset-0 z-50">
          <Pressable 
            className="absolute inset-0 bg-black/70 dark:bg-black/80"
            onPress={hideLoginFormAnimation}
          />
          
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <Animated.View
              style={{ 
                transform: [{ translateY: formSlideAnim }],
                maxHeight: SCREEN_HEIGHT * 0.9 
              }}
              className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t-4 border-gray-200 dark:border-gray-700"
            >
              {/* Enhanced Handle */}
              <View className="items-center pt-4 pb-3">
                <View className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full shadow-sm" />
              </View>

              <LoginForm
                roleInfo={selectedRoleData}
                onLogin={handleLogin}
                onClose={hideLoginFormAnimation}
                isLoading={isLoading}
              />
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* Enhanced Global Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 z-60 bg-black/50 items-center justify-center">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Loading 
              variant="spinner" 
              size="large" 
              text="Authenticating..." 
              overlay={false} 
            />
          </View>
        </View>
      )}
    </View>
  );
}