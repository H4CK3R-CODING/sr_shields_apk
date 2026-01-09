import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function QuickActionsCard() {
  const actions = [
    { title: 'Emergency', subtitle: 'Immediate help', colors: ['#ef4444', '#dc2626'], iconName: 'local-hospital' }, // red
    { title: 'Book Appointment', subtitle: 'Schedule visit', colors: ['#3b82f6', '#2563eb'], iconName: 'event' }, // blue
    { title: 'Health Records', subtitle: 'View history', colors: ['#8b5cf6', '#7c3aed'], iconName: 'folder' }, // purple
    { title: 'Prescriptions', subtitle: 'Digital Rx', colors: ['#14b8a6', '#0d9488'], iconName: 'receipt' }, // teal
    { title: 'Lab Reports', subtitle: 'Test results', colors: ['#22c55e', '#16a34a'], iconName: 'science' }, // green
    { title: 'Video Call', subtitle: 'Online consult', colors: ['#f97316', '#ea580c'], iconName: 'videocam' }, // orange
  ];

  return (
    <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-xl border">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">⚡ Quick Actions</Text>
      <View className="flex-row flex-wrap gap-4">
        {actions.map((action, i) => (
          <TouchableOpacity key={i} className="flex-1 min-w-[140px] max-w-[160px] rounded-2xl shadow-lg overflow-hidden">
            <LinearGradient
              colors={action.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4 rounded-2xl"
            >
              <MaterialIcons name={action.iconName} size={32} color="white" />
              <Text className="text-white font-bold text-sm mt-2">{action.title}</Text>
              <Text className="text-white/80 text-xs mt-1">{action.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
