import { Expo } from "expo-server-sdk";
import expo from "../config/expo.js";

export const sendPushToUsers = async (users, payload) => {
  const messages = [];

  for (const user of users) {
    if (!Expo.isExpoPushToken(user.expoPushToken)) continue;

    messages.push({
      to: user.expoPushToken,
      sound: "default",
      title: payload.title,
      body: payload.message,
      data: payload.data || {},
    });
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Expo push error:", error);
    }
  }
};
