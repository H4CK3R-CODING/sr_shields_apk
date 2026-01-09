import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

/**
 * Reusable Role Card Component
 * @param {object} roleInfo - Role information object
 * @param {function} onPress - Press handler
 * @param {boolean} selected - Selected state
 */
export default function RoleCard({ roleInfo, onPress, selected = false }) {
  const renderIcon = () => {
    const { icon, iconLib } = roleInfo;
    const IconComponent = iconLib === "FontAwesome5" ? FontAwesome5 : 
                         iconLib === "MaterialIcons" ? MaterialIcons : Ionicons;
    
    return <IconComponent name={icon} size={32} color="white" />;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(roleInfo.role)}
      className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border-2 mb-4 ${
        selected ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
      }`}
      style={{
        shadowColor: roleInfo.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center">
        {/* Role Icon */}
        <View className={`w-16 h-16 bg-gradient-to-br ${roleInfo.gradient} ${roleInfo.darkGradient} rounded-2xl items-center justify-center mr-4 shadow-lg`}>
          {renderIcon()}
        </View>
        
        {/* Role Info */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-1">
            {roleInfo.title}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-2">
            {roleInfo.subtitle}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-500">
            {roleInfo.description}
          </Text>
        </View>

        {/* Arrow Icon */}
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={selected ? "#3B82F6" : "#9CA3AF"} 
        />
      </View>

      {/* Features */}
      <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <View className="flex-row flex-wrap gap-2">
          {roleInfo.features.map((feature, idx) => (
            <View 
              key={idx} 
              className={`px-3 py-1 rounded-full ${
                selected 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <Text className={`text-xs font-medium ${
                selected
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}