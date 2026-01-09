import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * Reusable App Header Component
 */
export default function AppHeader({ 
  title = "SR Shilds Digital Seva", 
  subtitle = "Common Service Centre – Government Services",
  icon = "shield-alt",
  animated = true 
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [animated]);

  return (
    <Animated.View 
      style={animated ? { opacity: fadeAnim, transform: [{ translateY: slideAnim }] } : {}}
      className="pt-16 pb-8 px-6"
    >
      <View className="items-center mb-8">
        {/* Icon Container */}
        <Animated.View 
          style={[
            animated 
              ? { transform: [{ scale: scaleAnim }] }
              : {},
            {
              shadowColor: "#2563EB", // Tailwind blue-600
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 10,
            }
          ]}
          className="w-24 h-24 bg-blue-500 dark:bg-blue-700 rounded-3xl items-center justify-center mb-6"
        >
          <FontAwesome5 name={icon} size={40} color="#fff" />
        </Animated.View>
        
        {/* Title */}
        <Text className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">
          {title}
        </Text>

        {/* Subtitle */}
        <Text className="text-lg text-gray-600 dark:text-gray-300 text-center px-4 leading-6">
          {subtitle}
        </Text>
      </View>
    </Animated.View>
  );
}
