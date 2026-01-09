// src/screens/Details/DetailsScreen.jsx
import React from "react";
import { View, Text } from "react-native";
import NavLayout from "../components/Navbar/NavLayout";
// import NavLayout from "../../components/NavLayout";

export default function DetailsScreen() {
  return (
    <NavLayout title="Doctor Details">
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-900 dark:text-white">
          Doctor Details Content Here
        </Text>
      </View>
    </NavLayout>
  );
}
