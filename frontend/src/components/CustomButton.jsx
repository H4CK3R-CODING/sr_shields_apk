import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, Animated, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Loading from './Loading';

/**
 * Professional Custom Button Component with Advanced Styling
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {string} variant - 'primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'glass', 'neon'
 * @param {string} size - 'small', 'medium', 'large', 'xl'
 * @param {boolean} disabled - Button disabled state
 * @param {boolean} loading - Loading state
 * @param {string} icon - Icon name
 * @param {string} iconLib - 'Ionicons', 'MaterialIcons', 'FontAwesome5'
 * @param {string} iconPosition - 'left' or 'right'
 * @param {string} gradient - Custom gradient classes
 * @param {string} shadowColor - Custom shadow color
 * @param {boolean} fullWidth - Full width button
 * @param {boolean} animated - Enable press animations
 * @param {string} shape - 'rounded', 'pill', 'square'
 * @param {object} style - Additional styles
 */
export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconLib = 'Ionicons',
  iconPosition = 'left',
  gradient,
  shadowColor,
  fullWidth = false,
  animated = true,
  shape = 'rounded',
  style,
  ...props
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated && !disabled && !loading) {
      // Subtle glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Shimmer effect for premium buttons
      if (variant === 'primary' || variant === 'success') {
        Animated.loop(
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          })
        ).start();
      }
    }
  }, [animated, disabled, loading, variant]);

  // Enhanced variant configurations
  const variantConfig = {
    primary: {
      container: gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800',
      text: 'text-white',
      shadow: shadowColor || '#3B82F6',
      disabled: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
      glow: 'rgba(59, 130, 246, 0.5)',
      border: 'border-0',
    },
    secondary: {
      container: 'bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700',
      text: 'text-gray-700 dark:text-gray-200',
      shadow: '#6B7280',
      disabled: 'bg-gray-200 dark:bg-gray-700',
      glow: 'rgba(107, 114, 128, 0.3)',
      border: 'border border-gray-200 dark:border-gray-600',
    },
    outline: {
      container: 'bg-transparent dark:bg-transparent',
      text: 'text-blue-600 dark:text-blue-400',
      shadow: 'transparent',
      disabled: 'bg-transparent',
      glow: 'rgba(59, 130, 246, 0.3)',
      border: 'border-2 border-blue-500 dark:border-blue-400',
    },
    ghost: {
      container: 'bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      shadow: 'transparent',
      disabled: 'bg-transparent',
      glow: 'rgba(59, 130, 246, 0.2)',
      border: 'border-0',
    },
    danger: {
      container: 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800',
      text: 'text-white',
      shadow: '#EF4444',
      disabled: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
      glow: 'rgba(239, 68, 68, 0.5)',
      border: 'border-0',
    },
    success: {
      container: 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 dark:from-green-600 dark:via-emerald-700 dark:to-green-800',
      text: 'text-white',
      shadow: '#10B981',
      disabled: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
      glow: 'rgba(16, 185, 129, 0.5)',
      border: 'border-0',
    },
    warning: {
      container: 'bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 dark:from-orange-600 dark:via-amber-700 dark:to-orange-800',
      text: 'text-white',
      shadow: '#F97316',
      disabled: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
      glow: 'rgba(249, 115, 22, 0.5)',
      border: 'border-0',
    },
    glass: {
      container: 'bg-white/10 dark:bg-white/5 backdrop-blur-md',
      text: 'text-gray-800 dark:text-white',
      shadow: 'rgba(255, 255, 255, 0.2)',
      disabled: 'bg-gray-200/20 dark:bg-gray-800/20',
      glow: 'rgba(255, 255, 255, 0.3)',
      border: 'border border-white/20 dark:border-white/10',
    },
    neon: {
      container: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600',
      text: 'text-white',
      shadow: '#8B5CF6',
      disabled: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
      glow: 'rgba(139, 92, 246, 0.8)',
      border: 'border-0',
    },
  };

  // Enhanced size configurations
  const sizeConfig = {
    small: {
      container: 'px-4 py-2.5',
      text: 'text-sm font-semibold tracking-wide',
      icon: 16,
      minHeight: 'min-h-[36px]',
    },
    medium: {
      container: 'px-6 py-3.5',
      text: 'text-base font-bold tracking-wide',
      icon: 20,
      minHeight: 'min-h-[44px]',
    },
    large: {
      container: 'px-8 py-4',
      text: 'text-lg font-bold tracking-wide',
      icon: 24,
      minHeight: 'min-h-[52px]',
    },
    xl: {
      container: 'px-10 py-5',
      text: 'text-xl font-bold tracking-wide',
      icon: 28,
      minHeight: 'min-h-[60px]',
    },
  };

  // Shape configurations
  const shapeConfig = {
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
    square: 'rounded-lg',
  };

  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];
  const shapeStyle = shapeConfig[shape];

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (animated && !isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && !isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const dynamicButtonStyle = {
    shadowColor: config.shadow,
    shadowOffset: { width: 0, height: isDisabled ? 0 : variant === 'neon' ? 8 : 6 },
    shadowOpacity: isDisabled ? 0 : variant === 'neon' ? 0.6 : 0.25,
    shadowRadius: isDisabled ? 0 : variant === 'neon' ? 16 : 12,
    elevation: isDisabled ? 0 : variant === 'neon' ? 12 : 8,
    transform: [{ scale: scaleAnim }],
  };

  // Enhanced glow effect
  const glowStyle = animated && !isDisabled ? {
    shadowColor: config.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowAnim,
    shadowRadius: 20,
  } : {};

  const renderIcon = () => {
    if (!icon) return null;
    
    const IconComponent = iconLib === 'FontAwesome5' ? FontAwesome5 : 
                         iconLib === 'MaterialIcons' ? MaterialIcons : Ionicons;
    
    const iconColor = isDisabled ? '#9CA3AF' : 
                     config.text.includes('white') ? 'white' : 
                     config.text.includes('blue') ? '#3B82F6' : '#374151';

    return (
      <IconComponent 
        name={icon} 
        size={sizeStyle.icon} 
        color={iconColor}
      />
    );
  };

  const renderShimmer = () => {
    if (!animated || isDisabled || (variant !== 'primary' && variant !== 'success' && variant !== 'neon')) {
      return null;
    }

    return (
      <Animated.View
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          opacity: 0.3,
          transform: [
            {
              translateX: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 300],
              }),
            },
          ],
        }}
      >
        <View className="w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </Animated.View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-row items-center justify-center">
          <Loading 
            variant="spinner" 
            size={size === 'xl' ? 'large' : size === 'large' ? 'medium' : 'small'} 
            color={config.text.includes('white') ? 'white' : '#3B82F6'}
          />
          {title && (
            <Text className={`${sizeStyle.text} ${isDisabled ? 'text-gray-400 dark:text-gray-500' : config.text} ml-3`}>
              {title}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View className="flex-row items-center justify-center relative">
        {icon && iconPosition === 'left' && (
          <View className="mr-2">
            {renderIcon()}
          </View>
        )}
        
        {title && (
          <Text className={`${sizeStyle.text} ${isDisabled ? 'text-gray-400 dark:text-gray-500' : config.text} text-center`}>
            {title}
          </Text>
        )}
        
        {icon && iconPosition === 'right' && (
          <View className="ml-2">
            {renderIcon()}
          </View>
        )}
      </View>
    );
  };

  return (
    <Animated.View style={[dynamicButtonStyle, glowStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        className={`
          ${sizeStyle.container}
          ${sizeStyle.minHeight}
          ${isDisabled ? config.disabled : config.container}
          ${config.border}
          ${shapeStyle}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'opacity-50' : ''}
          items-center justify-center
          overflow-hidden
          relative my-2
        `}
        style={style}
        {...props}
      >
        {/* Shimmer Effect */}
        {renderShimmer()}
        
        {/* Button Content */}
        <View className="relative z-10">
          {renderContent()}
        </View>

        {/* Ripple Effect Overlay */}
        {variant === 'glass' && (
          <View className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        )}
      </Pressable>
    </Animated.View>
  );
}

// Enhanced pre-configured button variants
export const PrimaryButton = (props) => <CustomButton variant="primary" animated={true} {...props} />;
export const SecondaryButton = (props) => <CustomButton variant="secondary" {...props} />;
export const OutlineButton = (props) => <CustomButton variant="outline" {...props} />;
export const GhostButton = (props) => <CustomButton variant="ghost" {...props} />;
export const DangerButton = (props) => <CustomButton variant="danger" animated={true} {...props} />;
export const SuccessButton = (props) => <CustomButton variant="success" animated={true} {...props} />;
export const WarningButton = (props) => <CustomButton variant="warning" {...props} />;
export const GlassButton = (props) => <CustomButton variant="glass" shape="pill" {...props} />;
export const NeonButton = (props) => <CustomButton variant="neon" animated={true} shape="pill" {...props} />;