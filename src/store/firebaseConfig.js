// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDIIQ_HJZ2tPjgzTwAXWuBL0FZLCmXZK18",
  authDomain: "just-need-780a4.firebaseapp.com",
  projectId: "just-need-780a4",
  storageBucket: "just-need-780a4.firebasestorage.app",
  messagingSenderId: "1058241471166",
  appId: "1:1058241471166:web:cb790b644b2f7afc38b4ef",
  measurementId: "G-8ZS34HJ0PF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging only if supported
let messaging = null;

// Check if messaging is supported in this environment
isSupported().then((isSupported) => {
  if (isSupported) {
    messaging = getMessaging(app);
  } else {
    console.warn('Firebase Messaging is not supported in this environment');
  }
});

export { messaging };

export const requestForToken = async () => {
  try {
    // Check if messaging is supported and initialized
    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported || !messaging) {
      console.warn('Messaging not supported');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BPWM56bqaQraFySlmXRv6-kmYTQPUBr-ElDgW4QAHAPharN1_KHkMKfI5w5om87ZrKdplZugFBTyPaE7h0PCKTo"
    });
    
    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};