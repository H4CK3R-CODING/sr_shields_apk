import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";

export default function AboutScreen({ navigation }) {
  const { width } = Dimensions.get("window");

  const missionValues = [
    {
      icon: "shield-checkmark",
      title: "Trust & Security",
      description: "Government-authorized services with bank-level encryption",
      color: "#10B981",
    },
    {
      icon: "people",
      title: "Accessibility",
      description: "Bringing digital services to every corner of India",
      color: "#0EA5E9",
    },
    {
      icon: "rocket",
      title: "Innovation",
      description: "Leveraging technology for citizen empowerment",
      color: "#8B5CF6",
    },
    {
      icon: "heart",
      title: "Excellence",
      description: "Committed to delivering quality services",
      color: "#EF4444",
    },
  ];

  const achievements = [
    {
      number: "4 Lakh+",
      label: "Active Centers",
      icon: "business",
      color: "#0EA5E9",
    },
    {
      number: "5 Cr+",
      label: "Citizens Served",
      icon: "people",
      color: "#10B981",
    },
    {
      number: "500+",
      label: "Services Offered",
      icon: "apps",
      color: "#F59E0B",
    },
    {
      number: "All States",
      label: "Pan-India Presence",
      icon: "location",
      color: "#8B5CF6",
    },
  ];

  const features = [
    {
      icon: "document-text-outline",
      title: "Government Services",
      items: [
        "Aadhaar Enrollment & Updates",
        "PAN Card Services",
        "Passport Applications",
        "Birth/Death Certificates",
        "Income & Caste Certificates",
      ],
    },
    {
      icon: "wallet-outline",
      title: "Banking & Finance",
      items: [
        "Bank Account Opening",
        "Money Transfer",
        "Insurance Services",
        "Loan Applications",
        "Mutual Funds",
      ],
    },
    {
      icon: "school-outline",
      title: "Education & Skills",
      items: [
        "Digital Literacy Programs",
        "Skill Development Courses",
        "Online Examinations",
        "Certification Programs",
        "Career Guidance",
      ],
    },
    {
      icon: "receipt-outline",
      title: "Utility Services",
      items: [
        "Bill Payments (Electricity, Water, Gas)",
        "Mobile & DTH Recharge",
        "Travel Bookings (Train, Bus, Flight)",
        "Printing & Scanning",
        "Photocopying Services",
      ],
    },
  ];

  const socialLinks = [
    {
      icon: "logo-facebook",
      label: "Facebook",
      url: "https://facebook.com/csc",
      color: "#1877F2",
    },
    {
      icon: "logo-twitter",
      label: "Twitter",
      url: "https://twitter.com/csc",
      color: "#1DA1F2",
    },
    {
      icon: "logo-instagram",
      label: "Instagram",
      url: "https://instagram.com/csc",
      color: "#E4405F",
    },
    {
      icon: "logo-youtube",
      label: "YouTube",
      url: "https://youtube.com/csc",
      color: "#FF0000",
    },
    {
      icon: "logo-linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/company/csc",
      color: "#0A66C2",
    },
  ];

  const openUrl = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <NavLayout title="About CSC" showBack={true}>
      <View className="flex-1 bg-blue-50 dark:bg-gray-900">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Hero Section */}
          <View className="mx-4 mt-4">
            <LinearGradient
              colors={["#0EA5E9", "#8B5CF6"]}
              className="rounded-3xl p-6"
              style={{
                borderRadius: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="items-center">
                <View className="bg-white/20 rounded-full p-4 mb-4">
                  <Ionicons name="business" size={40} color="white" />
                </View>
                <Text className="text-white text-3xl font-bold mb-2 text-center">
                  Common Service Center
                </Text>
                <Text className="text-blue-100 text-center text-base">
                  Empowering Digital India
                </Text>
                <View className="bg-white/20 rounded-full px-4 py-2 mt-4">
                  <Text className="text-white font-semibold">
                    A Digital India Initiative
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* About Description */}
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
              <View className="flex-row items-center mb-4">
                <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-2 mr-3">
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#0EA5E9"
                  />
                </View>
                <Text className="text-gray-900 dark:text-white text-xl font-bold">
                  About Us
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 leading-6 mb-4">
                Common Service Centers (CSC) are the access points for delivery
                of essential public utility services, social welfare schemes,
                healthcare, financial, education and agriculture services,
                apart from a host of B2C services to citizens at their doorstep.
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 leading-6 mb-4">
                CSC enables three pronged strategy of CSC 2.0 as Service
                Delivery, Social Empowerment and Rural Entrepreneurship, thus
                playing the role of Change Agent by bridging the digital divide
                in the country.
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 leading-6">
                With over 4 lakh centers across India, CSC is the largest
                platform for digital service delivery in rural and remote areas
                of the country.
              </Text>
            </View>
          </View>

          {/* Mission & Values */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Our Core Values
            </Text>
            <View className="gap-3">
              {missionValues.map((value, index) => (
                <View
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-start"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View
                    className="rounded-full p-3 mr-4"
                    style={{ backgroundColor: `${value.color}20` }}
                  >
                    <Ionicons name={value.icon} size={24} color={value.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-bold text-base mb-1">
                      {value.title}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5">
                      {value.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View className="mx-4 mt-6">
            <LinearGradient
              colors={["#2563EB", "#7C3AED"]}
              className="rounded-3xl p-6"
              style={{
                borderRadius: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-white text-xl font-bold mb-6 text-center">
                Our Impact
              </Text>
              <View className="flex-row flex-wrap justify-center gap-1">
                {achievements.map((achievement, index) => (
                  <View
                    key={index}
                    className="bg-white/20 rounded-2xl p-4 items-center mb-4"
                    style={{ width: (width - 64) / 2 - 6 }}
                  >
                    <View className="bg-white/20 rounded-full p-3 mb-3">
                      <Ionicons
                        name={achievement.icon}
                        size={28}
                        color="white"
                      />
                    </View>
                    <Text className="text-white text-2xl font-bold mb-1">
                      {achievement.number}
                    </Text>
                    <Text className="text-blue-100 text-xs text-center">
                      {achievement.label}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Services Offered */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Services We Offer
            </Text>
            {features.map((feature, index) => (
              <View
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-2 mr-3">
                    <Ionicons name={feature.icon} size={20} color="#0EA5E9" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-bold text-base">
                    {feature.title}
                  </Text>
                </View>
                {feature.items.map((item, idx) => (
                  <View key={idx} className="flex-row items-center mb-2 ml-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3" />
                    <Text className="text-gray-600 dark:text-gray-300 text-sm flex-1">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Vision Section */}
          <View className="mx-4 mt-6">
            <LinearGradient
              colors={["#10B981", "#059669"]}
              className="rounded-3xl p-6"
              style={{
                borderRadius: 24,
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-white/20 rounded-full p-3 mr-3">
                  <Ionicons name="eye" size={24} color="white" />
                </View>
                <Text className="text-white text-xl font-bold">Our Vision</Text>
              </View>
              <Text className="text-white/90 leading-6">
                To transform CSC into preferred digital service delivery
                platform in the rural and remote areas by providing end-to-end
                solutions in the field of G2C, B2C, and B2B services enabling
                entrepreneurship amongst rural youth and women.
              </Text>
            </LinearGradient>
          </View>

          {/* Social Media */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Connect With Us
            </Text>
            <View
              className="bg-white dark:bg-gray-800 rounded-2xl p-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openUrl(social.url)}
                    className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3"
                    style={{ minWidth: (width - 80) / 2 - 6 }}
                  >
                    <Ionicons name={social.icon} size={20} color={social.color} />
                    <Text className="text-gray-900 dark:text-white font-semibold ml-2">
                      {social.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View className="mx-4 mt-6 mb-4">
            <View
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-4">
                <Ionicons name="call" size={20} color="#0EA5E9" />
                <Text className="text-gray-900 dark:text-white font-bold ml-2">
                  Helpline
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                Toll Free: 1800-XXX-XXXX
              </Text>

              <View className="flex-row items-center mb-4">
                <Ionicons name="mail" size={20} color="#10B981" />
                <Text className="text-gray-900 dark:text-white font-bold ml-2">
                  Email
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                info@csc.gov.in
              </Text>

              <View className="flex-row items-center mb-4">
                <Ionicons name="globe" size={20} color="#8B5CF6" />
                <Text className="text-gray-900 dark:text-white font-bold ml-2">
                  Website
                </Text>
              </View>
              <TouchableOpacity onPress={() => openUrl("https://csc.gov.in")}>
                <Text className="text-blue-600 dark:text-blue-400">
                  www.csc.gov.in
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version */}
          <View className="mx-4 mb-4">
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
              <Text className="text-gray-600 dark:text-gray-400 text-center text-sm">
                CSC Mobile App v1.0.0
              </Text>
              <Text className="text-gray-500 dark:text-gray-500 text-center text-xs mt-1">
                © 2026 Common Service Centers. All rights reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </NavLayout>
  );
}