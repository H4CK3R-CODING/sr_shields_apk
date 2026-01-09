// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { NavigationContainer } from "@react-navigation/native";
// import RootNavigator from "./src/navigation/RootNavigator";
// import ThemeProvider from "./src/theme/ThemeProvider";

import React, { useEffect, useRef } from "react";
import { BackHandler, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import ThemeProvider from "./src/theme/ThemeProvider";
import * as SplashScreen from 'expo-splash-screen';


export default function App() {

  const navigationRef = useRef();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    // const hideSplash = async () => {
    //   // Wait 5 seconds so you can see the splash
    //   await new Promise(resolve => setTimeout(resolve, 9000));
    //   await SplashScreen.hideAsync();
    // };
    
    // hideSplash();
  }, []);

  useEffect(() => {
    const backAction = () => {
      // Check if we can go back
      const canGoBack = navigationRef.current?.canGoBack();
      
      if (canGoBack) {
        // Navigate to previous screen
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


  return (
    <ThemeProvider>
      <SafeAreaProvider>
        {/* Single SafeAreaView for entire app */}
        <SafeAreaView
          className=" bg-white dark:bg-gray-900"
          style={{ flex: 1 }}
        >
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
