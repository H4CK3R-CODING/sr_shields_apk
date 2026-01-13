import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "@/src/services/api";
import Toast from "react-native-toast-message";

export default function SupportScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("contact");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const contactMethods = [
    {
      id: "phone",
      icon: "call",
      title: "Phone Support",
      subtitle: "Talk to our experts",
      value: "+918607550898",
      action: () => Linking.openURL("tel:+918607550898"),
      color: "#10B981",
      gradient: ["#10B981", "#059669"],
    },
    {
      id: "email",
      icon: "mail",
      title: "Email Support",
      subtitle: "Get help via email",
      value: "support@csc.gov.in",
      action: () => Linking.openURL("mailto:souravrathour02@gmail.com"),
      color: "#0EA5E9",
      gradient: ["#0EA5E9", "#0284C7"],
    },
    {
      id: "whatsapp",
      icon: "logo-whatsapp",
      title: "WhatsApp",
      subtitle: "Chat with us",
      value: "+91 8607550898",
      action: () => Linking.openURL("whatsapp://send?phone=918607550898"),
      color: "#22C55E",
      gradient: ["#22C55E", "#16A34A"],
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I register for CSC services?",
      answer:
        "You can register by clicking on the 'Register' button on the welcome screen. Fill in your details including name, mobile number, email, and Aadhaar number. You'll receive an OTP for verification.",
    },
    {
      id: 2,
      question: "What documents are required for Aadhaar enrollment?",
      answer:
        "For Aadhaar enrollment, you need to provide proof of identity (like passport, voter ID, driving license) and proof of address (like passport, bank statement, electricity bill). Original documents are required for verification.",
    },
    {
      id: 3,
      question: "How long does it take to get a PAN card?",
      answer:
        "After successful application, PAN card is usually dispatched within 15-20 working days to your registered address. You can track your application status using the acknowledgment number.",
    },
    {
      id: 4,
      question: "Can I make bill payments through CSC?",
      answer:
        "Yes, you can pay electricity, water, gas, telephone, and other utility bills through CSC. Multiple payment modes are available including cash, card, UPI, and net banking.",
    },
    {
      id: 5,
      question: "What are the charges for CSC services?",
      answer:
        "Service charges vary depending on the type of service. Most government services have nominal fees as prescribed by the respective departments. You can check specific charges in the service details section.",
    },
    {
      id: 6,
      question: "Is my data safe with CSC?",
      answer:
        "Yes, CSC follows strict security protocols and encryption standards. Your personal information is stored securely and is never shared with unauthorized parties. We comply with all government data protection guidelines.",
    },
  ];

  const quickHelp = [
    {
      icon: "book-outline",
      title: "User Guide",
      subtitle: "Step-by-step tutorials",
      action: () => navigation.navigate("UserGuide"),
    },
    {
      icon: "play-circle-outline",
      title: "Video Tutorials",
      subtitle: "Watch how-to videos",
      action: () => navigation.navigate("VideoTutorials"),
    },
    {
      icon: "document-text-outline",
      title: "Terms & Conditions",
      subtitle: "Read our policies",
      action: () => navigation.navigate("Terms"),
    },
    {
      icon: "shield-checkmark-outline",
      title: "Privacy Policy",
      subtitle: "Your data protection",
      action: () => navigation.navigate("Privacy"),
    },
  ];

  const handleSubmitQuery = async () => {
    if (!email || !subject || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      setLoading(true);

      // Fetch dashboard stats
      const { data } = await api.post("/sendMessage", {
        email,
        subject,
        message,
      });

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Query Submitted",
          text2:
            "Your query has been submitted. We'll get back to you within 24 hours.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Error at query submission:", error);
      if (error.response?.status !== 401) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: error.response?.data?.msg || "Please try again later.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <NavLayout title="Help & Support" showBack={true}>
      <View className="flex-1 bg-blue-50 dark:bg-gray-900">
        {/* Tab Navigation */}
        <View className="bg-white dark:bg-gray-800 px-4 py-3 flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("contact")}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === "contact"
                ? "bg-blue-600"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "contact"
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Contact Us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("faq")}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === "faq"
                ? "bg-blue-600"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "faq"
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              FAQs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("query")}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === "query"
                ? "bg-blue-600"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "query"
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Submit Query
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Contact Tab */}
          {activeTab === "contact" && (
            <View>
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
                      <Ionicons name="headset" size={32} color="white" />
                    </View>
                    <Text className="text-white text-2xl font-bold mb-2">
                      We're Here to Help
                    </Text>
                    <Text className="text-blue-100 text-center">
                      Choose your preferred way to reach us
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Contact Methods */}
              <View className="mx-4 mt-6 gap-3">
                {contactMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={method.action}
                    className="active:scale-95"
                  >
                    <LinearGradient
                      colors={method.gradient}
                      className="rounded-2xl p-4 flex-row items-center"
                      style={{
                        borderRadius: 16,
                        shadowColor: method.color,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <View className="bg-white/20 rounded-full p-3 mr-4">
                        <Ionicons name={method.icon} size={24} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold">
                          {method.title}
                        </Text>
                        <Text className="text-white/80 text-sm mb-1">
                          {method.subtitle}
                        </Text>
                        <Text className="text-white font-semibold">
                          {method.value}
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

              {/* Quick Help */}
              <View className="mx-4 mt-6">
                <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                  Quick Help
                </Text>
                <View className="gap-3">
                  {quickHelp.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={item.action}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-3 mr-4">
                        <Ionicons name={item.icon} size={20} color="#0EA5E9" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white font-bold">
                          {item.title}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-sm">
                          {item.subtitle}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Operating Hours */}
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
                    <Ionicons name="time-outline" size={24} color="#0EA5E9" />
                    <Text className="text-gray-900 dark:text-white text-lg font-bold ml-2">
                      Operating Hours
                    </Text>
                  </View>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600 dark:text-gray-300">
                        Monday - Friday
                      </Text>
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        9:00 AM - 6:00 PM
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600 dark:text-gray-300">
                        Saturday
                      </Text>
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        10:00 AM - 4:00 PM
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600 dark:text-gray-300">
                        Sunday
                      </Text>
                      <Text className="text-red-600 dark:text-red-400 font-semibold">
                        Closed
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <View className="mx-4 mt-4">
              <View className="bg-blue-100 dark:bg-blue-900 rounded-2xl p-4 mb-4 flex-row items-center">
                <Ionicons name="information-circle" size={24} color="#0EA5E9" />
                <Text className="text-blue-900 dark:text-blue-100 ml-3 flex-1">
                  Find quick answers to common questions
                </Text>
              </View>

              {faqs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  onPress={() => toggleFaq(faq.id)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                      <Text className="text-gray-900 dark:text-white font-bold mb-1">
                        {faq.question}
                      </Text>
                      {expandedFaq === faq.id && (
                        <Text className="text-gray-600 dark:text-gray-300 mt-2 leading-5">
                          {faq.answer}
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name={
                        expandedFaq === faq.id ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Submit Query Tab */}
          {activeTab === "query" && (
            <View className="mx-4 mt-4">
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
                  <View className="bg-blue-100 dark:bg-blue-600 rounded-full p-3 mr-3">
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={20}
                      color="#0EA5E9"
                    />
                  </View>
                  <Text className="text-gray-900 dark:text-white text-xl font-bold">
                    Submit Your Query
                  </Text>
                </View>

                <View className="gap-4">
                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Email Address *
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="your.email@example.com"
                      keyboardType="email-address"
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-900 dark:text-white"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Subject *
                    </Text>
                    <TextInput
                      value={subject}
                      onChangeText={setSubject}
                      placeholder="What is your query about?"
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-900 dark:text-white"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View>
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Message *
                    </Text>
                    <TextInput
                      value={message}
                      onChangeText={setMessage}
                      placeholder="Describe your issue in detail..."
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-900 dark:text-white"
                      placeholderTextColor="#9CA3AF"
                      style={{ minHeight: 120 }}
                    />
                  </View>

                  <TouchableOpacity onPress={handleSubmitQuery}>
                    <LinearGradient
                      colors={["#0EA5E9", "#0284C7"]}
                      className="rounded-xl p-4 flex-row items-center justify-center"
                      style={{ borderRadius: 12 }}
                    >
                      <Ionicons name="send" size={20} color="white" />
                      <Text className="text-white font-bold ml-2 text-base">
                        Submit Query
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 flex-row">
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#F59E0B"
                    />
                    <Text className="text-yellow-800 dark:text-yellow-200 text-sm ml-2 flex-1">
                      We typically respond within 24 hours during business days
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    </NavLayout>
  );
}
