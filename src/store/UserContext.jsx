/* eslint-disable react/prop-types */




import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  async function sendNotification(token, title, body) {
    console.log(token,title)
    try {
      const response = await fetch(
        "https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/send-fcm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Njg2MDUsImV4cCI6MjA1NTM0NDYwNX0.96QZYdqt7jyIw-w0PEcqXqwToFUAChPCJMzo641WU_k`, // correct header
          },
         body: JSON.stringify({
        fcm_token: token,
        title: title,
        body: body,
      }),

        }
      );

      const result = await response.json();

      console.log(response.status);
      console.log("FCM Result:", result);
    } catch (err) {
      console.error("Send notification error:", err);
    }
  }

  return (
    <UserContext.Provider value={{ userName, setUserName, sendNotification }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
