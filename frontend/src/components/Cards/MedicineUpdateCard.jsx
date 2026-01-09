import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function MedicineUpdateCard() {
  const medicines = [
    { name: 'Paracetamol 500mg', stock: 150, status: 'in-stock', price: 25 },
    { name: 'Amoxicillin 250mg', stock: 45, status: 'low-stock', price: 120 },
    { name: 'Insulin Injection', stock: 0, status: 'out-of-stock', price: 890 },
    { name: 'Vitamin D3 Tablets', stock: 200, status: 'in-stock', price: 180 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'low-stock': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'out-of-stock': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          💊 Medicine Inventory
        </Text>
        <TouchableOpacity className="bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 rounded-full">
          <Text className="text-white font-semibold text-sm">+ Add Medicine</Text>
        </TouchableOpacity>
      </View>

      <View className="flex space-y-4 flex-col gap-4">
        {medicines.map((medicine, index) => (
          <View key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {medicine.name}
              </Text>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(medicine.status)}`}>
                <Text className={`text-xs font-bold ${getStatusColor(medicine.status).split(' ')[0]}`}>
                  {medicine.status.toUpperCase().replace('-', ' ')}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <MaterialIcons name="inventory" size={16} color="#6B7280" />
                  <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    Stock: {medicine.stock}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="currency-rupee" size={16} color="#6B7280" />
                  <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    ₹{medicine.price}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity className="bg-blue-500 dark:bg-blue-600 px-4 py-2 rounded-full">
                <Text className="text-white text-xs font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
