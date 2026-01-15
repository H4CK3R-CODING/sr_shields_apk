// App.jsx
import React, { useEffect, useRef } from "react";
import { BackHandler, Alert, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import ThemeProvider from "./src/theme/ThemeProvider";
import * as SplashScreen from 'expo-splash-screen';
import useAuthStore from "./src/state/authStore";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

Notifications.addNotificationResponseReceivedListener(
  (response) => {
    const screen =
      response.notification.request.content.data.screen;

    if (screen === "Notifications") {
      navigation.navigate("Notifications");
    }
  }
);

// Keep splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync();

export default function App() {
  const navigationRef = useRef();
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize authentication (check AsyncStorage for saved login)
        await initialize();
        
        // Additional setup: pre-load fonts, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('App initialization error:', e);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const backAction = () => {
      const canGoBack = navigationRef.current?.canGoBack();
      
      if (canGoBack) {
        navigationRef.current?.goBack();
        return true;
      }

      // Show exit confirmation dialog
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit the app?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4">
              Loading...
            </Text>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView className="bg-white dark:bg-gray-900" style={{ flex: 1 }}>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}