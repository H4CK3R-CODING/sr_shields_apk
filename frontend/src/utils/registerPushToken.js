import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { api } from "../services/api";

export async function registerPushToken() {
  try {
    // Android notification channel (required)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  
    // Request permission
    const { status } = await Notifications.requestPermissionsAsync();
  
    if (status !== "granted") {
      console.log("Push permission denied");
      return;
    }
  
    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
  
    // Send token to backend
    await api.post("/user/push-token", { token });
  
    console.log("Expo push token registered:", token);
  } catch (error) {
    console.log("Error registering push token:", error);
  }
}
