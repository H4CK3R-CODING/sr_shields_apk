import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive sizing helper
const getResponsiveSize = () => {
  const isSmallDevice = width < 360;
  const isMediumDevice = width >= 360 && width < 400;
  const isLargeDevice = width >= 400;
  
  return {
    chatWidth: width > 768 ? 440 : Math.min(width - 24, 400),
    chatHeight: height * 0.88,
    headerIcon: isSmallDevice ? 24 : 28,
    heroIcon: isSmallDevice ? 48 : isMediumDevice ? 56 : 64,
    featureIcon: isSmallDevice ? 20 : 24,
    padding: isSmallDevice ? 16 : 20,
  };
};

export default function ChatbotModal({ visible, onClose }) {
  const [message, setMessage] = useState("");
  const [slideAnim] = useState(new Animated.Value(height));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef(null);
  const responsive = getResponsiveSize();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation for the status dot
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const features = [
    {
      icon: "chatbubble-ellipses",
      title: "24/7 Instant Support",
      desc: "Get answers to your questions anytime, anywhere",
      color: "#2563EB",
      bgColor: "#DBEAFE",
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      icon: "document-text",
      title: "Document Assistance",
      desc: "Help with forms, applications, and submissions",
      color: "#7C3AED",
      bgColor: "#EDE9FE",
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      icon: "briefcase",
      title: "Job Recommendations",
      desc: "Personalized job suggestions based on your profile",
      color: "#059669",
      bgColor: "#D1FAE5",
      gradient: ['#10B981', '#059669'],
    },
    {
      icon: "notifications",
      title: "Smart Notifications",
      desc: "Never miss important updates and deadlines",
      color: "#DC2626",
      bgColor: "#FEE2E2",
      gradient: ['#EF4444', '#DC2626'],
    },
  ];

  const sampleQuestions = [
    {
      icon: "information-circle-outline",
      text: "What services do you offer?",
      color: "#2563EB",
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      icon: "document-text-outline",
      text: "How do I apply for a job?",
      color: "#7C3AED",
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      icon: "people-outline",
      text: "Contact support",
      color: "#059669",
      gradient: ['#10B981', '#059669'],
    },
    {
      icon: "help-circle-outline",
      text: "FAQs",
      color: "#DC2626",
      gradient: ['#EF4444', '#DC2626'],
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Semi-transparent backdrop */}
        <Animated.View
          style={{ opacity: fadeAnim, flex: 1 }}
          className="bg-black/60"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={{ flex: 1 }}
          >
            {/* Bottom-Right Chatbot Container */}
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 16 : 12,
                right: Platform.OS === 'ios' ? 16 : 12,
                width: responsive.chatWidth,
                height: responsive.chatHeight,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 32,
                elevation: 20,
              }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                style={{ flex: 1 }}
              >
                {/* Animated Gradient Header */}
                <View className="relative">
                  <LinearGradient
                    colors={['#1E40AF', '#7C3AED', '#C026D3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: responsive.padding, paddingVertical: 16 }}
                    className="relative"
                  >
                    {/* Animated Decorative circles */}
                    <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full" 
                      style={{ marginRight: -48, marginTop: -48 }} 
                    />
                    <View className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full" 
                      style={{ marginLeft: -32, marginBottom: -32 }} 
                    />
                    <View className="absolute top-10 left-10 w-16 h-16 bg-pink-400/10 rounded-full" />
                    
                    <View className="flex-row items-center justify-between relative z-10">
                      <View className="flex-row items-center flex-1">
                        {/* Animated Robot Icon with glow */}
                        <View className="relative">
                          <View className="absolute inset-0 bg-white/40 rounded-xl" 
                            style={{ 
                              shadowColor: '#FFF',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.8,
                              shadowRadius: 12,
                            }} 
                          />
                          <View className="bg-white/25 backdrop-blur-lg p-2.5 rounded-xl mr-2.5 border border-white/40"
                            style={{
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.3,
                              shadowRadius: 8,
                              elevation: 8,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="robot-excited"
                              size={responsive.headerIcon}
                              color="white"
                            />
                          </View>
                        </View>
                        <View className="flex-1">
                          <Text className="text-white text-lg font-bold tracking-wide" style={{ fontSize: responsive.padding > 16 ? 18 : 16 }}>
                            AI Assistant
                          </Text>
                          <View className="flex-row items-center mt-0.5">
                            <Animated.View 
                              style={{ 
                                transform: [{ scale: pulseAnim }],
                              }}
                            >
                              <View className="w-2 h-2 bg-yellow-300 rounded-full mr-1.5" 
                                style={{
                                  shadowColor: '#FCD34D',
                                  shadowOffset: { width: 0, height: 0 },
                                  shadowOpacity: 0.8,
                                  shadowRadius: 6,
                                }}
                              />
                            </Animated.View>
                            <Text className="text-white/95 text-xs font-semibold">
                              Coming Soon
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={onClose}
                        className="bg-white/25 backdrop-blur-lg p-2 rounded-full active:bg-white/40 border border-white/40"
                        style={{ 
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 6,
                        }}
                      >
                        <Ionicons name="close" size={22} color="white" />
                      </TouchableOpacity>
                    </View>

                    {/* Wave decoration at bottom */}
                    <View 
                      className="absolute bottom-0 left-0 right-0 h-4 bg-gray-50 dark:bg-gray-800" 
                      style={{
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    />
                  </LinearGradient>
                </View>

                {/* Scrollable Content - Fixed for Android */}
                <View style={{ flex: 1 }} className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ 
                      paddingBottom: 16,
                      paddingHorizontal: responsive.padding,
                      paddingTop: 12,
                    }}
                    style={{ flex: 1 }}
                  >
                    {/* Hero Coming Soon Banner with shimmer effect */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl mb-4 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                      style={{ padding: responsive.padding }}
                    >
                      <LinearGradient
                        colors={['#DBEAFE', '#E0E7FF', '#FEF3C7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="absolute inset-0 opacity-60"
                      />
                      <View className="items-center relative z-10">
                        {/* Animated Robot with floating effect */}
                        <View className="relative mb-4">
                          <View className="absolute inset-0 bg-blue-500/30 rounded-full" 
                            style={{ 
                              shadowColor: '#2563EB',
                              shadowOffset: { width: 0, height: 8 },
                              shadowOpacity: 0.5,
                              shadowRadius: 24,
                              elevation: 12,
                            }} 
                          />
                          <LinearGradient
                            colors={['#2563EB', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                              padding: responsive.padding,
                              borderRadius: 24,
                              shadowColor: '#7C3AED',
                              shadowOffset: { width: 0, height: 6 },
                              shadowOpacity: 0.5,
                              shadowRadius: 16,
                              elevation: 10,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="robot-happy-outline"
                              size={responsive.heroIcon}
                              color="white"
                            />
                          </LinearGradient>
                          {/* Floating particles with glow */}
                          <View className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full" 
                            style={{
                              shadowColor: '#FCD34D',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.8,
                              shadowRadius: 6,
                            }}
                          />
                          <View className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full"
                            style={{
                              shadowColor: '#60A5FA',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.8,
                              shadowRadius: 6,
                            }}
                          />
                          <View className="absolute top-2 -left-2 w-2 h-2 bg-purple-400 rounded-full"
                            style={{
                              shadowColor: '#C084FC',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.8,
                              shadowRadius: 4,
                            }}
                          />
                        </View>

                        <LinearGradient
                          colors={['#2563EB', '#7C3AED']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="px-4 py-2 rounded-full mb-3"
                          style={{
                            shadowColor: '#7C3AED',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4,
                            shadowRadius: 8,
                            elevation: 6,
                            borderRadius: 24,
                          }}
                        >
                          <Text className="text-white font-bold text-sm tracking-wider">
                            🚀 LAUNCHING SOON
                          </Text>
                        </LinearGradient>

                        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center" style={{ fontSize: responsive.padding > 16 ? 24 : 20 }}>
                          AI-Powered Assistant
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-center text-sm leading-5 px-2">
                          Your intelligent companion is being trained to provide exceptional support
                        </Text>
                      </View>
                    </View>

                    {/* Features Grid with hover effects */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3">
                        <LinearGradient
                          colors={['#2563EB', '#7C3AED']}
                          className="w-1.5 h-6 rounded-full mr-2.5"
                        />
                        <Text className="text-base font-bold text-gray-900 dark:text-white">
                          Upcoming Features
                        </Text>
                        <View className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 ml-3" />
                      </View>

                      {features.map((feature, index) => (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          className="bg-white dark:bg-gray-900 rounded-2xl mb-3 border border-gray-100 dark:border-gray-800"
                          style={{
                            padding: responsive.padding > 16 ? 16 : 14,
                            shadowColor: feature.color,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.18,
                            shadowRadius: 12,
                            elevation: 5,
                          }}
                        >
                          <View className="flex-row items-center">
                            <View className="relative">
                              <View 
                                className="absolute inset-0 rounded-xl opacity-20"
                                style={{ backgroundColor: feature.color }}
                              />
                              <LinearGradient
                                colors={feature.gradient}
                                className="p-3 rounded-xl mr-3"
                                style={{
                                  shadowColor: feature.color,
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 4,
                                  elevation: 3,
                                }}
                              >
                                <Ionicons
                                  name={feature.icon}
                                  size={responsive.featureIcon}
                                  color="white"
                                />
                              </LinearGradient>
                            </View>
                            <View className="flex-1">
                              <Text className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                                {feature.title}
                              </Text>
                              <Text className="text-xs text-gray-600 dark:text-gray-400 leading-4">
                                {feature.desc}
                              </Text>
                            </View>
                            <Ionicons
                              name="chevron-forward"
                              size={18}
                              color={feature.color}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Quick Actions Preview with gradient cards */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3">
                        <LinearGradient
                          colors={['#7C3AED', '#C026D3']}
                          className="w-1.5 h-6 rounded-full mr-2.5"
                        />
                        <Text className="text-base font-bold text-gray-900 dark:text-white">
                          Sample Questions
                        </Text>
                        <View className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 ml-3" />
                      </View>
                      <View className="flex-row flex-wrap -mx-1">
                        {sampleQuestions.map((question, index) => (
                          <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            className="w-1/2 px-1 mb-2"
                          >
                            <View className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
                              style={{
                                shadowColor: question.color,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.12,
                                shadowRadius: 6,
                                elevation: 3,
                              }}
                            >
                              <View className="flex-row items-center mb-2">
                                <LinearGradient
                                  colors={question.gradient}
                                  className="p-1.5 rounded-lg"
                                  style={{
                                    shadowColor: question.color,
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 3,
                                    elevation: 2,
                                  }}
                                >
                                  <Ionicons
                                    name={question.icon}
                                    size={16}
                                    color="white"
                                  />
                                </LinearGradient>
                              </View>
                              <Text
                                className="text-gray-700 dark:text-gray-300 text-xs font-medium"
                                numberOfLines={2}
                              >
                                {question.text}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Development Timeline with enhanced design */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800"
                      style={{
                        padding: responsive.padding,
                        shadowColor: '#7C3AED',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.12,
                        shadowRadius: 12,
                        elevation: 5,
                      }}
                    >
                      <View className="flex-row items-center mb-4">
                        <LinearGradient
                          colors={['#7C3AED', '#C026D3']}
                          className="p-2 rounded-xl mr-2.5"
                          style={{
                            shadowColor: '#7C3AED',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Ionicons name="time-outline" size={20} color="white" />
                        </LinearGradient>
                        <Text className="text-base font-bold text-gray-900 dark:text-white">
                          Development Timeline
                        </Text>
                      </View>

                      {/* Timeline Items */}
                      <View>
                        {/* Phase 1 */}
                        <View className="flex-row items-start mb-3">
                          <View className="items-center mr-3 mt-1">
                            <View className="bg-green-500 w-3.5 h-3.5 rounded-full" 
                              style={{
                                shadowColor: '#10B981',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.6,
                                shadowRadius: 4,
                                elevation: 3,
                              }}
                            />
                            <LinearGradient
                              colors={['#10B981', '#D1D5DB']}
                              className="w-0.5 h-14 mt-2"
                            />
                          </View>
                          <View className="flex-1 rounded-xl p-3.5 border border-green-300 dark:border-green-800/30"
                            style={{
                              backgroundColor: '#D1FAE5',
                              shadowColor: '#10B981',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 2,
                            }}
                          >
                            <View className="flex-row items-center mb-1.5">
                              <Text className="font-bold text-sm text-gray-900 dark:text-white flex-1">
                                Phase 1: Design Complete
                              </Text>
                              <View className="bg-green-500 p-1 rounded-full"
                                style={{
                                  shadowColor: '#10B981',
                                  shadowOffset: { width: 0, height: 1 },
                                  shadowOpacity: 0.5,
                                  shadowRadius: 2,
                                }}
                              >
                                <Ionicons name="checkmark" size={14} color="white" />
                              </View>
                            </View>
                            <Text className="text-xs text-gray-700 dark:text-gray-400 leading-4">
                              UI/UX design and planning finished
                            </Text>
                          </View>
                        </View>

                        {/* Phase 2 */}
                        <View className="flex-row items-start mb-3">
                          <View className="items-center mr-3 mt-1">
                            <Animated.View 
                              style={{ 
                                transform: [{ scale: pulseAnim }],
                              }}
                            >
                              <View className="bg-orange-500 w-3.5 h-3.5 rounded-full" 
                                style={{
                                  shadowColor: '#F97316',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.7,
                                  shadowRadius: 6,
                                  elevation: 4,
                                }}
                              />
                            </Animated.View>
                            <LinearGradient
                              colors={['#F97316', '#D1D5DB']}
                              className="w-0.5 h-14 mt-2"
                            />
                          </View>
                          <View className="flex-1 rounded-xl p-3.5 border border-orange-300 dark:border-orange-800/30"
                            style={{
                              backgroundColor: '#FED7AA',
                              shadowColor: '#F97316',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.15,
                              shadowRadius: 6,
                              elevation: 3,
                            }}
                          >
                            <View className="flex-row items-center mb-1.5">
                              <Text className="font-bold text-sm text-gray-900 dark:text-white flex-1">
                                Phase 2: AI Training
                              </Text>
                              <LinearGradient
                                colors={['#F97316', '#EA580C']}
                                className="px-2 py-1 rounded-full"
                                style={{
                                  shadowColor: '#F97316',
                                  shadowOffset: { width: 0, height: 1 },
                                  shadowOpacity: 0.4,
                                  shadowRadius: 2,
                                  borderRadius: 12,
                                }}
                              >
                                <Text className="text-[10px] font-bold text-white">IN PROGRESS</Text>
                              </LinearGradient>
                            </View>
                            <Text className="text-xs text-gray-700 dark:text-gray-400 mb-2.5 leading-4">
                              Training AI model with relevant data
                            </Text>
                            {/* Enhanced Progress Bar */}
                            <View className="bg-orange-200/60 dark:bg-orange-900/30 rounded-full h-2 overflow-hidden border border-orange-300/50 dark:border-orange-700/30">
                              <LinearGradient
                                colors={['#FB923C', '#F97316']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-full rounded-full"
                                style={{ 
                                  width: '65%',
                                  shadowColor: '#F97316',
                                  shadowOffset: { width: 0, height: 0 },
                                  shadowOpacity: 0.5,
                                  shadowRadius: 4,
                                }}
                              />
                            </View>
                            <Text className="text-[10px] text-orange-700 dark:text-orange-400 mt-1.5 font-semibold">
                              65% Complete
                            </Text>
                          </View>
                        </View>

                        {/* Phase 3 */}
                        <View className="flex-row items-start">
                          <View className="items-center mr-3 mt-1">
                            <View className="bg-gray-300 dark:bg-gray-600 w-3.5 h-3.5 rounded-full" />
                          </View>
                          <View className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-300 dark:border-gray-700">
                            <Text className="font-bold text-sm text-gray-900 dark:text-white mb-1.5">
                              Phase 3: Testing & Launch
                            </Text>
                            <Text className="text-xs text-gray-600 dark:text-gray-400 leading-4">
                              Quality assurance and public release
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Enhanced CTA - Notify Me */}
                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="rounded-2xl mb-4 overflow-hidden"
                      style={{
                        padding: responsive.padding + 4,
                        shadowColor: '#C026D3',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.35,
                        shadowRadius: 16,
                        elevation: 10,
                      }}
                    >
                      <LinearGradient
                        colors={['#1E40AF', '#7C3AED', '#C026D3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="absolute inset-0"
                      />
                      {/* Decorative circles */}
                      <View className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full" />
                      <View className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full" />
                      <View className="absolute top-8 left-8 w-20 h-20 bg-pink-400/10 rounded-full" />
                      
                      <View className="items-center relative z-10">
                        <View className="bg-white/30 backdrop-blur-lg p-4 rounded-full mb-3 border border-white/40"
                          style={{
                            shadowColor: '#FFF',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            elevation: 6,
                          }}
                        >
                          <Ionicons name="notifications" size={30} color="white" />
                        </View>
                        <Text className="text-white text-xl font-bold mb-2 text-center" style={{ fontSize: responsive.padding > 16 ? 20 : 18 }}>
                          Get Notified!
                        </Text>
                        <Text className="text-white/95 text-center mb-5 text-sm px-4 leading-5">
                          Be among the first to experience our AI assistant when it launches
                        </Text>
                        <View className="bg-white px-7 py-3.5 rounded-full active:bg-gray-100"
                          style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 6,
                          }}
                        >
                          <View className="flex-row items-center">
                            <Ionicons name="mail" size={20} color="#2563EB" />
                            <Text className="text-blue-600 font-bold text-base ml-2">
                              Notify Me
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Enhanced Info Card */}
                    <View className="rounded-xl p-4 border border-blue-300 dark:border-blue-800/30 mb-3 overflow-hidden"
                      style={{
                        shadowColor: '#2563EB',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                        elevation: 3,
                      }}
                    >
                      <LinearGradient
                        colors={['#DBEAFE', '#E0E7FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="absolute inset-0"
                      />
                      <View className="flex-row items-start relative z-10">
                        <LinearGradient
                          colors={['#2563EB', '#1E40AF']}
                          className="p-2 rounded-full mr-3"
                          style={{
                            shadowColor: '#2563EB',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Ionicons name="bulb" size={18} color="white" />
                        </LinearGradient>
                        <View className="flex-1">
                          <Text className="text-xs text-gray-800  leading-4">
                            <Text className="font-bold text-sm">Did you know?</Text> {'\n'}
                            Our AI will learn from interactions to provide increasingly personalized assistance over time.
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>

                {/* Enhanced Footer - Disabled Input */}
                <View className="bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700"
                  style={{
                    paddingHorizontal: responsive.padding,
                    paddingVertical: 14,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 10,
                  }}
                >
                  <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3.5 py-3 opacity-60 border-2 border-gray-300 dark:border-gray-700">
                    <View className="bg-gray-200 dark:bg-gray-700 p-1.5 rounded-lg mr-2.5">
                      <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
                    </View>
                    <TextInput
                      placeholder="Type your message..."
                      placeholderTextColor="#9CA3AF"
                      editable={false}
                      value={message}
                      className="flex-1 text-gray-800 dark:text-white text-sm"
                    />
                    <View className="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg ml-2">
                      <Ionicons name="send" size={16} color="#6B7280" />
                    </View>
                  </View>
                  <View className="flex-row items-center justify-center mt-2.5">
                    <Animated.View 
                      style={{ 
                        transform: [{ scale: pulseAnim }],
                      }}
                    >
                      <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"
                        style={{
                          shadowColor: '#3B82F6',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.8,
                          shadowRadius: 4,
                        }}
                      />
                    </Animated.View>
                    <Text className="text-[10px] text-center text-gray-500 dark:text-gray-400">
                      Chat functionality coming in the next update
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}