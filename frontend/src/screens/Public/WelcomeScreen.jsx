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

export default function CSCWelcomeScreen({ navigation }) {
  const { width } = Dimensions.get("window");

  const serviceCategories = [
    {
      id: "digital",
      title: "Digital Services",
      icon: "laptop-outline",
      subtitle: "E-Governance & Online",
      color: ["#0EA5E9", "#0284C7"],
    },
    {
      id: "banking",
      title: "Banking Services",
      icon: "wallet-outline",
      subtitle: "Financial & Payments",
      color: ["#10B981", "#059669"],
    },
    {
      id: "education",
      title: "Education",
      icon: "school-outline",
      subtitle: "Learning & Skills",
      color: ["#F59E0B", "#D97706"],
    },
    {
      id: "utility",
      title: "Utility Services",
      icon: "flash-outline",
      subtitle: "Bills & Recharges",
      color: ["#8B5CF6", "#7C3AED"],
    },
  ];

  const popularServices = [
    {
      icon: "document-text-outline",
      title: "Aadhaar Services",
      subtitle: "Enrollment & updates",
      color: "#0EA5E9",
    },
    {
      icon: "card-outline",
      title: "PAN Card",
      subtitle: "Apply & corrections",
      color: "#10B981",
    },
    {
      icon: "receipt-outline",
      title: "Bill Payments",
      subtitle: "Electricity, water & more",
      color: "#F59E0B",
    },
    {
      icon: "business-outline",
      title: "Certificates",
      subtitle: "Birth, income & caste",
      color: "#EF4444",
    },
    {
      icon: "train-outline",
      title: "Travel Booking",
      subtitle: "Train, bus & flights",
      color: "#8B5CF6",
    },
    {
      icon: "print-outline",
      title: "Print & Scan",
      subtitle: "Documents & photos",
      color: "#06B6D4",
    },
  ];

  const handleServiceSelect = (serviceId) => {
    navigation.navigate("Services", { category: serviceId });
  };

  return (
    <NavLayout title="CSC Services" showAiChat={false}>
      <View className="flex-1 bg-blue-50 dark:bg-gray-900">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1"
        >
          {/* Hero Banner */}
          <View className="mx-4 mt-4">
            <LinearGradient
              colors={["#0EA5E9", "#8B5CF6"]}
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
                  <Ionicons name="business" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    Common Service Center
                  </Text>
                  <Text className="text-blue-100 text-sm mt-1">
                    Your Digital India Partner
                  </Text>
                </View>
              </View>

              <Text className="text-blue-100 text-base mb-6 leading-6">
                Access 100+ government and private services at your fingertips.
                From certificates to banking, we've got you covered.
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
                  <Ionicons name="log-in-outline" size={18} color="#0284C7" />
                  <Text className="text-blue-700 dark:text-white ml-2 font-semibold">
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                  className="flex-1 bg-white/20 rounded-2xl py-4 flex-row items-center justify-center border border-white/30"
                >
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white ml-2 font-semibold">
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Service Categories */}
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
                  <Ionicons name="grid-outline" size={20} color="#0EA5E9" />
                </View>
                <Text className="text-gray-900 dark:text-white text-xl font-bold">
                  Service Categories
                </Text>
              </View>

              <View className="gap-3">
                {serviceCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => handleServiceSelect(category.id)}
                    className="active:scale-95"
                    style={{ transform: [{ scale: 1 }] }}
                  >
                    <LinearGradient
                      colors={category.color}
                      className="rounded-2xl p-4 flex-row items-center"
                      style={{
                        borderRadius: 16,
                        shadowColor: category.color[0],
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <View className="bg-white/20 rounded-full p-3 mr-4">
                        <Ionicons
                          name={category.icon}
                          size={24}
                          color="white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold">
                          {category.title}
                        </Text>
                        <Text className="text-white/80 text-sm">
                          {category.subtitle}
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

          {/* Popular Services Grid */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4 ml-2">
              Popular Services
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {popularServices.map((service, index) => (
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
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <Ionicons
                      name={service.icon}
                      size={24}
                      color={service.color}
                    />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-bold text-sm mb-1">
                    {service.title}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs leading-4">
                    {service.subtitle}
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
                Serving India Digitally
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                    5L+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Users
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-green-600 dark:text-green-400 text-2xl font-bold">
                    100+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Services
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-purple-600 dark:text-purple-400 text-2xl font-bold">
                    1000+
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 text-xs">
                    Centers
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Why Choose CSC Section */}
          <View className="mx-4 mt-6">
            <View
              className="bg-purple-50 dark:bg-gray-800 rounded-3xl p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                Why Choose CSC?
              </Text>
              <View className="gap-3">
                <View className="flex-row items-start">
                  <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-2 mr-3">
                    <Ionicons name="checkmark" size={16} color="#0EA5E9" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                      Government Authorized
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      Official partner for Digital India initiatives
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start">
                  <View className="bg-green-100 dark:bg-green-600 rounded-full p-2 mr-3">
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                      Secure & Reliable
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      Your data is protected with bank-level security
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start">
                  <View className="bg-purple-100 dark:bg-purple-600 rounded-full p-2 mr-3">
                    <Ionicons name="checkmark" size={16} color="#8B5CF6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                      24/7 Support
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      Round-the-clock assistance for all services
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Help & Support */}
          <TouchableOpacity
            className="mx-4 mt-6"
            onPress={() => navigation.navigate("Support")}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              className="rounded-2xl p-4 flex-row items-center justify-center"
              style={{
                borderRadius: 16,
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="headset-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Need Help? Contact Support
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </NavLayout>
  );
}