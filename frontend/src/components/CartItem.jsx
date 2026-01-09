// src/components/CartItem.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartItem = ({ medicine }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { theme } = useTheme();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        `Remove ${medicine.name} from cart?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(medicine.id) }
        ]
      );
    } else {
      updateQuantity(medicine.id, newQuantity);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${medicine.name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(medicine.id) }
      ]
    );
  };

  return (
    <View className={`mb-4 rounded-xl p-4 ${
      theme.isDark ? 'bg-gray-800' : 'bg-white'
    } shadow-sm`}>
      <View className="flex-row">
        {/* Medicine Image */}
        <Image
          source={{ uri: medicine.image }}
          className="w-16 h-16 rounded-lg mr-3"
          resizeMode="cover"
        />

        {/* Medicine Details */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-1 mr-2">
              <Text className={`font-semibold ${
                theme.isDark ? 'text-white' : 'text-gray-900'
              }`} numberOfLines={1}>
                {medicine.name}
              </Text>
              <Text className={`text-sm ${
                theme.isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {medicine.brand}
              </Text>
            </View>
            
            {/* Remove Button */}
            <TouchableOpacity
              onPress={handleRemove}
              className="p-1"
              activeOpacity={0.7}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={theme.colors.error} 
              />
            </TouchableOpacity>
          </View>

          {/* Prescription Badge */}
          {medicine.prescription && (
            <View className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full self-start mb-2">
              <Text className="text-orange-800 dark:text-orange-200 text-xs font-medium">
                Prescription Required
              </Text>
            </View>
          )}

          {/* Price and Quantity Controls */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className={`text-lg font-bold ${
                theme.isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{medicine.price.toFixed(2)}
              </Text>
              <Text className={`text-xs ${
                theme.isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Total: ₹{(medicine.price * medicine.quantity).toFixed(2)}
              </Text>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleQuantityChange(medicine.quantity - 1)}
                className={`w-8 h-8 rounded-full justify-center items-center ${
                  theme.isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="remove" 
                  size={16} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>

              <Text className={`mx-4 font-semibold text-lg ${
                theme.isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {medicine.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => handleQuantityChange(medicine.quantity + 1)}
                className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-500 justify-center items-center"
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="add" 
                  size={16} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;