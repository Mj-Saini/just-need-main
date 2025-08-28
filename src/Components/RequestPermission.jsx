// src/requestPermission.js
import { messaging, getToken, onMessage } from "./firebase";

export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY" // Firebase Console > Cloud Messaging से मिलेगा
    });

    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
