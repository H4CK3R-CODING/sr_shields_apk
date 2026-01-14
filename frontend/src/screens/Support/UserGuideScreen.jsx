// src/screens/UserGuideScreen.jsx - CSC App User Guide
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "@/src/components/CustomHeader";
const { width } = Dimensions.get("window");

// Guide Card Component
const GuideCard = ({ icon, title, description, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    className="mb-4"
  >
    <LinearGradient
      colors={[color + "20", color + "10"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-5 border-2"
      style={{ borderColor: color + "40" }}
    >
      <View className="flex-row items-center mb-3">
        <View
          style={{ backgroundColor: color }}
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4 shadow-md"
        >
          <Ionicons name={icon} size={28} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 dark:text-white font-bold text-lg mb-1">
            {title}
          </Text>
          <View className="flex-row items-center">
            <Text style={{ color }} className="text-sm font-semibold mr-2">
              Learn More
            </Text>
            <Ionicons name="arrow-forward" size={16} color={color} />
          </View>
        </View>
      </View>
      <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6">
        {description}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Feature Item Component
const FeatureItem = ({ icon, text, color }) => (
  <View className="flex-row items-center mb-4">
    <View
      style={{ backgroundColor: color + "20" }}
      className="w-10 h-10 rounded-xl items-center justify-center mr-3"
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text className="flex-1 text-gray-700 dark:text-gray-300 text-base">
      {text}
    </Text>
  </View>
);

// Step Item Component
const StepItem = ({ number, title, description, color }) => (
  <View className="flex-row mb-6">
    <View className="items-center mr-4">
      <LinearGradient
        colors={[color, color + "DD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white font-bold text-lg">{number}</Text>
      </LinearGradient>
      {number < 5 && (
        <View
          style={{ backgroundColor: color + "30" }}
          className="w-1 flex-1 mt-2"
        />
      )}
    </View>
    <View className="flex-1 pt-2">
      <Text className="text-gray-900 dark:text-white font-bold text-base mb-2">
        {title}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6">
        {description}
      </Text>
    </View>
  </View>
);

// FAQ Item Component
const FAQItem = ({ question, answer, isExpanded, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-sm"
  >
    <View className="flex-row items-center justify-between mb-2">
      <Text className="flex-1 text-gray-900 dark:text-white font-bold text-base mr-3">
        {question}
      </Text>
      <Ionicons
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={24}
        color="#3B82F6"
      />
    </View>
    {isExpanded && (
      <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6 mt-2">
        {answer}
      </Text>
    )}
  </TouchableOpacity>
);

export default function UserGuideScreen({ navigation }) {
  const [activeSection, setActiveSection] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const sections = [
    {
      id: "normal-user",
      icon: "person",
      title: "Normal User Guide",
      description: "Learn how to browse jobs, forms, and access CSC services as a regular user",
      color: "#3B82F6",
    },
    {
      id: "admin",
      icon: "shield-checkmark",
      title: "Admin User Guide",
      description: "Manage jobs, forms, users, and all administrative functions",
      color: "#8B5CF6",
    },
    {
      id: "getting-started",
      icon: "rocket",
      title: "Getting Started",
      description: "Quick setup guide to start using the CSC app effectively",
      color: "#10B981",
    },
    {
      id: "faq",
      icon: "help-circle",
      title: "FAQ & Troubleshooting",
      description: "Common questions and solutions to help you",
      color: "#F59E0B",
    },
  ];

  const normalUserFeatures = [
    { icon: "briefcase", text: "Browse and search available jobs", color: "#3B82F6" },
    { icon: "document-text", text: "Access and download government forms", color: "#10B981" },
    { icon: "notifications", text: "Get notifications for new opportunities", color: "#F59E0B" },
    { icon: "bookmark", text: "Save jobs and forms for later", color: "#EF4444" },
    { icon: "filter", text: "Filter by category, location, and deadline", color: "#8B5CF6" },
    { icon: "share-social", text: "Share jobs and forms with others", color: "#EC4899" },
  ];

  const adminFeatures = [
    { icon: "add-circle", text: "Create and publish new jobs and forms", color: "#3B82F6" },
    { icon: "create", text: "Edit and update existing content", color: "#10B981" },
    { icon: "trash", text: "Delete outdated or incorrect posts", color: "#EF4444" },
    { icon: "people", text: "Manage user accounts and permissions", color: "#8B5CF6" },
    { icon: "stats-chart", text: "View analytics and engagement metrics", color: "#F59E0B" },
    { icon: "cloud-upload", text: "Upload attachments and documents", color: "#EC4899" },
  ];

  const gettingStartedSteps = [
    {
      number: 1,
      title: "Download & Install",
      description: "Download the CSC app from your app store and install it on your device",
      color: "#3B82F6",
    },
    {
      number: 2,
      title: "Create Account",
      description: "Sign up with your email, phone number, or social media account",
      color: "#10B981",
    },
    {
      number: 3,
      title: "Complete Profile",
      description: "Fill in your profile details including location and preferences",
      color: "#F59E0B",
    },
    {
      number: 4,
      title: "Explore Features",
      description: "Browse jobs, forms, and familiarize yourself with the app interface",
      color: "#8B5CF6",
    },
    {
      number: 5,
      title: "Enable Notifications",
      description: "Turn on push notifications to stay updated with new opportunities",
      color: "#EF4444",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to Login screen, tap 'Forgot Password', enter your email, and follow the instructions sent to your email.",
    },
    {
      question: "Can I apply for jobs directly through the app?",
      answer: "The app provides job information and application links. You'll be directed to the official application portal or website.",
    },
    {
      question: "How do I become an admin?",
      answer: "Admin access is granted by system administrators. Contact your CSC center manager to request admin privileges.",
    },
    {
      question: "Are the forms and jobs verified?",
      answer: "Yes, all content is verified by admins before publishing. We ensure all information is from official sources.",
    },
    {
      question: "How often is the content updated?",
      answer: "Admins regularly update jobs and forms. You can enable notifications to get instant alerts for new postings.",
    },
    {
      question: "Can I download forms offline?",
      answer: "Yes, you can download PDF forms and access them offline anytime from your device.",
    },
  ];

  const renderNormalUserGuide = () => (
    <View>
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
      >
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mr-4">
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl mb-1">
              Normal User
            </Text>
            <Text className="text-blue-100 text-sm">
              Access jobs, forms & services
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Text className="text-gray-900 dark:text-white font-bold text-xl mb-4">
        Key Features
      </Text>
      {normalUserFeatures.map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}

      <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 mt-4 border-2 border-blue-200 dark:border-blue-700">
        <View className="flex-row items-center mb-3">
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text className="text-blue-900 dark:text-blue-100 font-bold text-base ml-2">
            Quick Tips
          </Text>
        </View>
        <Text className="text-blue-800 dark:text-blue-200 text-sm leading-6">
          • Enable notifications to never miss new opportunities{"\n"}
          • Use filters to find relevant jobs quickly{"\n"}
          • Bookmark important forms for easy access{"\n"}
          • Check the app daily for fresh updates
        </Text>
      </View>
    </View>
  );

  const renderAdminGuide = () => (
    <View>
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
      >
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mr-4">
            <Ionicons name="shield-checkmark" size={32} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl mb-1">
              Admin User
            </Text>
            <Text className="text-purple-100 text-sm">
              Manage content & users
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Text className="text-gray-900 dark:text-white font-bold text-xl mb-4">
        Admin Capabilities
      </Text>
      {adminFeatures.map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}

      <View className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 mt-4 mb-4 border-2 border-purple-200 dark:border-purple-700">
        <View className="flex-row items-center mb-3">
          <Ionicons name="warning" size={24} color="#8B5CF6" />
          <Text className="text-purple-900 dark:text-purple-100 font-bold text-base ml-2">
            Admin Responsibilities
          </Text>
        </View>
        <Text className="text-purple-800 dark:text-purple-200 text-sm leading-6">
          • Verify all information before publishing{"\n"}
          • Update expired jobs and forms promptly{"\n"}
          • Maintain accurate contact details{"\n"}
          • Monitor user reports and feedback{"\n"}
          • Ensure all documents are from official sources
        </Text>
      </View>

      <Text className="text-gray-900 dark:text-white font-bold text-xl mb-4 mt-6">
        How to Create a Job/Form
      </Text>
      <StepItem
        number={1}
        title="Navigate to Manage Section"
        description="Go to the admin panel and select 'Manage Jobs' or 'Manage Forms'"
        color="#8B5CF6"
      />
      <StepItem
        number={2}
        title="Click Create New"
        description="Tap the 'Create New' button to open the form"
        color="#8B5CF6"
      />
      <StepItem
        number={3}
        title="Fill in Details"
        description="Enter title, description, organization, category, and deadline"
        color="#8B5CF6"
      />
      <StepItem
        number={4}
        title="Add Attachments"
        description="Upload relevant documents or add Google Drive links"
        color="#8B5CF6"
      />
      <StepItem
        number={5}
        title="Review & Publish"
        description="Double-check all information and tap 'Create' to publish"
        color="#8B5CF6"
      />
    </View>
  );

  const renderGettingStarted = () => (
    <View>
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
      >
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mr-4">
            <Ionicons name="rocket" size={32} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl mb-1">
              Getting Started
            </Text>
            <Text className="text-green-100 text-sm">
              Quick setup in 5 steps
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Text className="text-gray-900 dark:text-white font-bold text-xl mb-6">
        Setup Steps
      </Text>
      {gettingStartedSteps.map((step) => (
        <StepItem key={step.number} {...step} />
      ))}

      <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 mt-4 border-2 border-green-200 dark:border-green-700">
        <View className="flex-row items-center mb-3">
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text className="text-green-900 dark:text-green-100 font-bold text-base ml-2">
            You're All Set!
          </Text>
        </View>
        <Text className="text-green-800 dark:text-green-200 text-sm leading-6">
          Once you complete these steps, you're ready to explore all features of the CSC app and stay updated with jobs and forms!
        </Text>
      </View>
    </View>
  );

  const renderFAQ = () => (
    <View>
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 mb-6"
      >
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mr-4">
            <Ionicons name="help-circle" size={32} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl mb-1">
              FAQ & Help
            </Text>
            <Text className="text-orange-100 text-sm">
              Find answers quickly
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Text className="text-gray-900 dark:text-white font-bold text-xl mb-4">
        Frequently Asked Questions
      </Text>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isExpanded={expandedFAQ === index}
          onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
        />
      ))}

      <View className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 mt-4 border-2 border-orange-200 dark:border-orange-700">
        <View className="flex-row items-center mb-3">
          <Ionicons name="chatbubbles" size={24} color="#F59E0B" />
          <Text className="text-orange-900 dark:text-orange-100 font-bold text-base ml-2">
            Need More Help?
          </Text>
        </View>
        <Text className="text-orange-800 dark:text-orange-200 text-sm leading-6 mb-4">
          If you couldn't find your answer here, feel free to contact our support team.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Help")}>
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-xl py-3 px-5"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="mail" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Contact Support</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader title="User Guide" showBack showMenu />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={["#3B82F6", "#2563EB", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-12"
        >
          <View className="items-center">
            <View className="bg-white/20 w-24 h-24 rounded-3xl items-center justify-center mb-6">
              <Ionicons name="book" size={48} color="white" />
            </View>
            <Text className="text-white font-bold text-3xl mb-3 text-center">
              Welcome to CSC App
            </Text>
            <Text className="text-blue-100 text-center text-base leading-7 px-4">
              Your complete guide to using the Common Service Center application for jobs and government forms
            </Text>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View className="px-4 py-6">
          {activeSection === null ? (
            <>
              <Text className="text-gray-900 dark:text-white font-bold text-2xl mb-6">
                Choose Your Guide
              </Text>
              {sections.map((section) => (
                <GuideCard
                  key={section.id}
                  {...section}
                  onPress={() => setActiveSection(section.id)}
                />
              ))}

              {/* Quick Access Section */}
              {/* <View className="mt-8 mb-4">
                <Text className="text-gray-900 dark:text-white font-bold text-xl mb-4">
                  Quick Access
                </Text>
                <View className="flex-row gap-3 mb-3">
                  <TouchableOpacity className="flex-1">
                    <LinearGradient
                      colors={["#3B82F6", "#2563EB"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="rounded-2xl p-4 items-center"
                    >
                      <Ionicons name="briefcase" size={28} color="white" />
                      <Text className="text-white font-bold text-sm mt-2">
                        Browse Jobs
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1">
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="rounded-2xl p-4 items-center"
                    >
                      <Ionicons name="document-text" size={28} color="white" />
                      <Text className="text-white font-bold text-sm mt-2">
                        View Forms
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View> */}
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setActiveSection(null)}
                className="flex-row items-center mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
              >
                <Ionicons name="arrow-back" size={24} color="#3B82F6" />
                <Text className="text-blue-600 dark:text-blue-400 font-bold text-base ml-3">
                  Back to All Guides
                </Text>
              </TouchableOpacity>

              {activeSection === "normal-user" && renderNormalUserGuide()}
              {activeSection === "admin" && renderAdminGuide()}
              {activeSection === "getting-started" && renderGettingStarted()}
              {activeSection === "faq" && renderFAQ()}
            </>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}