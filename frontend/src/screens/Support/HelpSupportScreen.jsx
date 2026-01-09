// src/screens/Support/HelpSupportScreen.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { width } = Dimensions.get('window');

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const supportOptions = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      subtitle: 'Get instant help',
      icon: 'chatbubble-ellipses',
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1D4ED8']
    },
    {
      id: 'call-support',
      title: 'Call Support',
      subtitle: '24/7 Emergency line',
      icon: 'call',
      color: '#10B981',
      gradient: ['#10B981', '#047857']
    },
    {
      id: 'email-support',
      title: 'Email Support',
      subtitle: 'Response in 24hrs',
      icon: 'mail',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706']
    },
    {
      id: 'appointment',
      title: 'Book Support Call',
      subtitle: 'Schedule assistance',
      icon: 'calendar',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED']
    }
  ];

  const faqData = [
    {
      id: 1,
      question: "How do I book an appointment?",
      answer: "You can book an appointment by navigating to the 'Appointments' section, selecting your preferred doctor, choosing an available time slot, and confirming your booking. You'll receive a confirmation notification."
    },
    {
      id: 2,
      question: "How can I access my medical records?",
      answer: "Your medical records are available in the 'Health Records' section. You can view, download, or share your records with healthcare providers. All records are securely encrypted and HIPAA compliant."
    },
    {
      id: 3,
      question: "What should I do in case of emergency?",
      answer: "For medical emergencies, always call 911 first. For urgent medical questions, you can use our 24/7 emergency chat or call our emergency hotline at +1-800-MEDCARE."
    },
    {
      id: 4,
      question: "How do I update my profile information?",
      answer: "Go to 'Profile Settings' where you can update your personal information, contact details, insurance information, and emergency contacts. Changes are saved automatically."
    },
    {
      id: 5,
      question: "Can I cancel or reschedule appointments?",
      answer: "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to 'My Appointments' and select the appointment you want to modify."
    }
  ];

  const quickLinks = [
    { title: 'Privacy Policy', icon: 'shield-checkmark', action: () => {} },
    { title: 'Terms of Service', icon: 'document-text', action: () => {} },
    { title: 'Account Settings', icon: 'settings', action: () => {} },
    { title: 'Billing Support', icon: 'card', action: () => {} }
  ];

  const handleSupportOption = (optionId) => {
    switch (optionId) {
      case 'live-chat':
        // Navigate to chat screen
        break;
      case 'call-support':
        Linking.openURL('tel:+18002633227');
        break;
      case 'email-support':
        Linking.openURL('mailto:support@medcarepro.com');
        break;
      case 'appointment':
        // Navigate to appointment booking
        break;
      default:
        break;
    }
  };

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <NavLayout title="Help & Support" showAiChat={false}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Section */}
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            className="mx-4 mt-4 rounded-3xl p-6"
            style={{borderRadius: 24,}}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-white/20 rounded-full p-3 mr-4">
                <Ionicons name="help-circle" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  How can we help you?
                </Text>
                <Text className="text-blue-100 text-sm mt-1">
                  We're here 24/7 for your support
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Support Options */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Contact Support
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {supportOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSupportOption(option.id)}
                  className="mb-4"
                  style={{ width: (width - 48) / 2 - 6 }}
                >
                  <LinearGradient
                    colors={option.gradient}
                    className="rounded-2xl p-4"
                    style={{
                      borderRadius: 24,
                      shadowColor: option.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color="white" 
                      style={{ marginBottom: 8 }}
                    />
                    <Text className="text-white font-bold text-sm mb-1">
                      {option.title}
                    </Text>
                    <Text className="text-white/80 text-xs">
                      {option.subtitle}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search FAQ */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Frequently Asked Questions
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons 
                  name="search" 
                  size={20} 
                  color="#9CA3AF" 
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  placeholder="Search FAQs..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* FAQ List */}
            <View className="gap-3">
              {filteredFaqs.map((faq) => (
                <View 
                  key={faq.id} 
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="p-4 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-900 dark:text-white font-medium flex-1 mr-3">
                      {faq.question}
                    </Text>
                    <Ionicons 
                      name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                  {expandedFaq === faq.id && (
                    <View className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                      <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5 mt-3">
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Quick Links */}
          <View className="mx-4 mt-6">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Quick Links
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              {quickLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={link.action}
                  className={`p-4 flex-row items-center ${
                    index !== quickLinks.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
                >
                  <View className="bg-blue-100 dark:bg-blue-600/20 rounded-full p-2 mr-3">
                    <Ionicons 
                      name={link.icon} 
                      size={18} 
                      color="#3B82F6"
                    />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-medium flex-1">
                    {link.title}
                  </Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Feedback Section */}
          <View className="mx-4 mt-6">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                Send Feedback
              </Text>
              <TextInput
                placeholder="Tell us how we can improve..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
                className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-900 dark:text-white mb-4"
                textAlignVertical="top"
              />
              <TouchableOpacity className="bg-blue-600 rounded-xl py-3 flex-row items-center justify-center">
                <Ionicons name="send" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Send Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Contact */}
          <View className="mx-4 mt-6">
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:911')}
              className="bg-red-600 rounded-2xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="warning" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Emergency? Call 911
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </NavLayout>
  );
}