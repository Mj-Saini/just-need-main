/* eslint-disable react/prop-types */




import { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseCreateClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState("");

  async function sendNotification(data) {
    console.log(data)
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
            fcm_token: data.token,
            title: data.title,
            body: data.body,
          }),

        }
      );

      const result = await response.json();

      console.log(response.status);
      console.log("FCM Result:", result);
      // 2. Insert notification data into Supabase table
      const { error } = await supabase
        .from("Notifications")
        .insert([
          {
            userId: data.userId || null, // If you have userId
            title: data.title,
            description: data.body,
            created_at: new Date(),
          },
        ]); if (error) {
          console.error("Error inserting into Notifications:", error);
        } else {
        console.log("Notification stored in Supabase successfully!");
      }
    }
    catch (err) {
      console.error("Send notification error:", err);
    }
  }
// async function sendNotification(data) {
//   // ✅ Validate token
//   if (!data.token || data.token.trim() === "") {
//     console.error("❌ No valid FCM token provided. Notification not sent.");
//     return;
//   }

//   // ✅ Validate title & body
//   if (!data.title || !data.body) {
//     console.error("❌ Missing title or body. Notification aborted.");
//     return;
//   }

//   console.log("✅ Sending notification:", data);

//   try {
//     // ✅ Check if notification already exists in DB
//     const { data: existing, error: fetchError } = await supabase
//       .from("Notifications")
//       .select("*")
//       .eq("userId", data.userId || null)
//       .eq("title", data.title)
//       .eq("description", data.body);

//     if (fetchError) {
//       console.error("❌ Error checking existing notification:", fetchError);
//       return;
//     }

//     if (existing && existing.length > 0) {
//       console.warn("⚠️ Notification already exists, skipping insert.");
//       return;
//     }

//     // ✅ Send FCM only if token exists
//     if (data.token) {
//       const response = await fetch(
//         "https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/send-fcm",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer YOUR_SUPABASE_ANON_KEY`,
//           },
//           body: JSON.stringify({
//             fcm_token: data.token,
//             title: data.title,
//             body: data.body,
//           }),
//         }
//       );

//       const result = await response.json();
//       console.log(`📡 FCM Response [${response.status}]:`, result);

//       // ✅ Insert into DB only if FCM is successful
//       if (result.success) {
//         const { error } = await supabase.from("Notifications").insert([
//           {
//             userId: data.userId || null,
//             title: data.title,
//             description: data.body,
//             created_at: new Date(),
//           },
//         ]);

//         if (error) {
//           console.error("❌ Error inserting into Notifications:", error);
//         } else {
//           console.log("✅ Notification stored in Supabase successfully!");
//         }
//       } else {
//         console.warn("⚠️ Skipping DB insert because FCM failed.");
//       }
//     }
//   } catch (err) {
//     console.error("❌ Send notification error:", err);
//   }
// }




  return (
    <UserContext.Provider value={{ userName, setUserName, sendNotification }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
