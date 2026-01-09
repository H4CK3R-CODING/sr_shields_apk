import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";
export default function WelcomeScreen({ navigation }) {
  const { width } = Dimensions.get("window");

  // const theme = useColorScheme(); // "light" or "dark"

  // Background gradient based on theme
  // const backgroundColors =
  //   theme === "dark" ? ["#1F2937", "#111827"] : ["#EFF6FF", "#FFFFFF"];
  // const bannerColors =
  //   theme === "dark" ? ["#2563EB", "#7C3AED"] : ["#3B82F6", "#8B5CF6"];

  const userTypes = [
    {
      id: "patient",
      title: "Patient",
      icon: "heart",
      subtitle: "Book & Track",
      color: ["#3B82F6", "#1E40AF"],
    },
    {
      id: "doctor",
      title: "Doctor",
      icon: "medical",
      subtitle: "Manage Care",
      color: ["#10B981", "#047857"],
    },
    {
      id: "medical",
      title: "Staff",
      icon: "people",
      subtitle: "Support Care",
      color: ["#8B5CF6", "#6D28D9"],
    },
  ];

  const quickFeatures = [
    {
      icon: "calendar-outline",
      title: "Quick Booking",
      subtitle: "Schedule appointments instantly",
      color: "#3B82F6",
    },
    {
      icon: "document-text-outline",
      title: "Medical Records",
      subtitle: "Access your health data",
      color: "#10B981",
    },
    {
      icon: "chatbubble-ellipses-outline",
      title: "Telemedicine",
      subtitle: "Consult from anywhere",
      color: "#F59E0B",
    },
    {
      icon: "shield-checkmark-outline",
      title: "Health Monitoring",
      subtitle: "Track your wellness",
      color: "#EF4444",
    },
  ];

  const handleGetStarted = (userType) => {
    navigation.navigate("Login", { userType });
  };

  return (
    <NavLayout title="Welcome" showAiChat={false}>
      <View className="flex-1 bg-blue-50 dark:bg-gray-900">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1"
        >
          {/* Hero Banner */}
          <View className="mx-4 mt-4">
            <LinearGradient
              colors={["#3B82F6", "#8B5CF6"]}
              className="rounded-3xl p-6 shadow-lg"
              style={{
                borderRadius: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-white/20 rounded-full p-3 mr-4">
                  <Ionicons name="medical" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    Welcome to MedCare Pro
                  </Text>
                  <Text className="text-blue-100 text-sm mt-1">
                    Your health companion
                  </Text>
                </View>
              </View>

              <Text className="text-blue-100 text-base mb-6 leading-6">
                Experience seamless healthcare with smart features, secure
                records, and instant access to medical professionals.
              </Text>

              {/* Quick Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  className="flex-1 bg-white dark:bg-gray-800 rounded-2xl py-4 flex-row items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="log-in-outline" size={18} color="#1E40AF" />
                  <Text className="text-blue-800 dark:text-white ml-2 font-semibold">
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("About")}
                  className="flex-1 bg-white/20 rounded-2xl py-4 flex-row items-center justify-center border border-white/30"
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white ml-2 font-semibold">About</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Get Started Section */}
          <View className="mx-4 mt-6">
            <View
              className="bg-white dark:bg-gray-800 rounded-3xl p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center mb-6">
                <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-2 mr-3">
                  <Ionicons
                    name="rocket-outline"
                    size={20}
                    color={ "#3B82F6"}
                  />
                </View>
                <Text className="text-gray-900 dark:text-white text-xl font-bold">
                  Get Started
                </Text>
              </View>

              <View className=" gap-3">
                {userTypes.map((type, index) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => handleGetStarted(type.id)}
                    className="active:scale-95"
                    style={{ transform: [{ scale: 1 }] }}
                  >
                    <LinearGradient
                      colors={type.color}
                      className="rounded-2xl p-4 flex-row items-center"
                      style={{
                        borderRadius: 24,
                        shadowColor: type.color[0],
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <View className="bg-white/20 rounded-full p-3 mr-4">
                        <Ionicons name={type.icon} size={24} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold">
                          {type.title}
                        </Text>
                        <Text className="text-white/80 text-sm">
                          {type.subtitle}
                        </Text>
                      </View>
                      <View className="bg-white/20 rounded-full p-2">
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="white"
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Quick Features Grid */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4 ml-2">
              Quick Features
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {quickFeatures.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4"
                  style={{
                    width: (width - 48) / 2 - 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View
                    className="rounded-full p-3 mb-3 self-start"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Ionicons
                      name={feature.icon}
                      size={24}
                      color={feature.color}
                    />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-bold text-sm mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs leading-4">
                    {feature.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Section */}
          <View className="mx-4 mt-6">
            <View
              className="bg-white dark:bg-gray-800 rounded-3xl p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4 text-center">
                Trusted by Healthcare Community
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                    10K+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Patients
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-green-600 dark:text-green-400 text-2xl font-bold">
                    500+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Doctors
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-purple-600 dark:text-purple-400 text-2xl font-bold">
                    50+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Hospitals
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <TouchableOpacity
            className="mx-4 mt-6"
            onPress={() => {
              /* Handle emergency */
            }}
          >
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              className="rounded-2xl p-4 flex-row items-center justify-center"
              style={{
                borderRadius: 24,
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Emergency Support 24/7
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </NavLayout>
  );
}
