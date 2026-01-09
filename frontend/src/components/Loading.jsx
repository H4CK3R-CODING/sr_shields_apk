import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Reusable Loading Component with different variants
 * @param {string} variant - 'spinner', 'dots', 'pulse', 'bars'
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} color - hex color or tailwind color class
 * @param {string} text - optional loading text
 * @param {boolean} overlay - show as full screen overlay
 */
export default function Loading({ 
  variant = 'spinner', 
  size = 'medium', 
  color = '#3B82F6',
  text = '',
  overlay = false 
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Size configurations
  const sizeConfig = {
    small: { icon: 16, container: 'w-6 h-6', text: 'text-xs' },
    medium: { icon: 24, container: 'w-8 h-8', text: 'text-sm' },
    large: { icon: 32, container: 'w-12 h-12', text: 'text-base' }
  };

  const { icon: iconSize, container: containerSize, text: textSize } = sizeConfig[size];

  useEffect(() => {
    // Spinner animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Fade animation for overlay
    if (overlay) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    spinAnimation.start();
    if (variant === 'pulse') pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [variant, overlay]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderSpinner = () => (
    <Animated.View
      style={{ transform: [{ rotate: spin }] }}
      className={`${containerSize} items-center justify-center`}
    >
      <Ionicons name="refresh" size={iconSize} color={color} />
    </Animated.View>
  );

  const renderDots = () => (
    <View className="flex-row items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={{
            transform: [{ scale: pulseAnim }],
            animationDelay: `${index * 200}ms`,
            backgroundColor: color
          }}
          className={`w-2 h-2 rounded-full`}
        //   style={{ backgroundColor: color }}
        />
      ))}
    </View>
  );

  const renderPulse = () => (
    <Animated.View
      style={{ 
        transform: [{ scale: pulseAnim }],
        backgroundColor: `${color}20`
      }}
      className={`${containerSize} rounded-full items-center justify-center`}
    >
      <View 
        className={`w-4 h-4 rounded-full`}
        style={{ backgroundColor: color }}
      />
    </Animated.View>
  );

  const renderBars = () => (
    <View className="flex-row items-end space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={{
            height: pulseAnim.interpolate({
              inputRange: [1, 1.2],
              outputRange: [8, 16],
            }),
            backgroundColor: color,
            animationDelay: `${index * 150}ms`,
          }}
          className={`w-1 rounded-sm`}
        />
      ))}
    </View>
  );

  const renderLoadingContent = () => {
    const loadingElement = {
      spinner: renderSpinner,
      dots: renderDots,
      pulse: renderPulse,
      bars: renderBars,
    }[variant]();

    return (
      <View className="items-center justify-center">
        {loadingElement}
        {text && (
          <Text className={`${textSize} font-medium text-gray-600 dark:text-gray-400 mt-3`}>
            {text}
          </Text>
        )}
      </View>
    );
  };

  if (overlay) {
    return (
      <Animated.View 
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm items-center justify-center"
      >
        <View className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          {renderLoadingContent()}
        </View>
      </Animated.View>
    );
  }

  return renderLoadingContent();
}

// Loading variants for specific use cases
export const SpinnerLoading = (props) => <Loading variant="spinner" {...props} />;
export const DotsLoading = (props) => <Loading variant="dots" {...props} />;
export const PulseLoading = (props) => <Loading variant="pulse" {...props} />;
export const BarsLoading = (props) => <Loading variant="bars" {...props} />;