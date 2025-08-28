// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/prop-types */
// // import axios from "axios";
// import { createContext, useContext, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [userName, setUserName] = useState("");

//     const sendFCMMessage = async (token, bodyText) => {
//     console.log(token,"token",bodyText,"bodyText");
//   try {
//     const response = await fetch("https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: token,
//         title: "Just Needs",
//         body: bodyText,
//       }),
//     });

//     if (response.ok) {
//       console.log("Notification sent successfully.");
//     } else {
//       console.error("Failed to send notification", await response.text());
//     }
//   } catch (error) {
//     console.error("Error sending FCM message:", error);
//   }
// };


//     return (
//         <UserContext.Provider value={{ userName, setUserName,sendFCMMessage }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUserContext = () => useContext(UserContext);


/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/prop-types */
// import { createContext, useContext, useState } from "react";
// import notificationConfig from "../store/notification.json"; // Import your service account file

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userName, setUserName] = useState("");

//   // Get OAuth2 Access Token from Google
//   const getAccessToken = async () => {
//     const tokenUrl = "https://oauth2.googleapis.com/token";

//     const payload = {
//       grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//       assertion: createJWT(),
//     };

//     const response = await fetch(tokenUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams(payload).toString(),
//     });

//     const data = await response.json();
//     if (data.access_token) {
//       return data.access_token;
//     } else {
//       throw new Error("Failed to get access token: " + JSON.stringify(data));
//     }
//   };

//   // Create JWT for Google OAuth
//   const createJWT = () => {
//     const header = {
//       alg: "RS256",
//       typ: "JWT",
//     };

//     const now = Math.floor(Date.now() / 1000);
//     const claimSet = {
//       iss: notificationConfig.client_email,
//       scope: "https://www.googleapis.com/auth/firebase.messaging",
//       aud: notificationConfig.token_uri,
//       iat: now,
//       exp: now + 3600,
//     };

//     const base64url = (source) => {
//       let encodedSource = btoa(JSON.stringify(source));
//       encodedSource = encodedSource.replace(/=+$/, "");
//       encodedSource = encodedSource.replace(/\+/g, "-");
//       encodedSource = encodedSource.replace(/\//g, "_");
//       return encodedSource;
//     };

//     const encodedHeader = base64url(header);
//     const encodedClaimSet = base64url(claimSet);
//     const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

//     // Sign with private key (RS256) – requires SubtleCrypto in browser
//     // Since Web Crypto API does not support PKCS8 PEM directly, you need a library like `jsrsasign` or `jose`
//     // For simplicity, I’ll use a placeholder function signWithPrivateKey()
//     return signWithPrivateKey(unsignedToken);
//   };

//   const signWithPrivateKey = (unsignedToken) => {
//     // ❌ You cannot natively do RS256 signing with the raw private key string in browser without a lib
//     // ✅ Use a library like `jose` or `jsrsasign` for this step
//     // For now, placeholder (pseudo implementation):
//     throw new Error(
//       "Browser cannot sign JWT with RS256 without a crypto lib. Use `jose` or `jsrsasign`."
//     );
//   };

//   const sendFCMMessage = async (token, bodyText) => {
//     try {
//       const accessToken = await getAccessToken();

//       const response = await fetch(
//         `https://fcm.googleapis.com/v1/projects/${notificationConfig.project_id}/messages:send`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({
//             message: {
//               token,
//               notification: {
//                 title: "Just Needs",
//                 body: bodyText,
//               },
//             },
//           }),
//         }
//       );

//       if (response.ok) {
//         console.log("Notification sent successfully.");
//       } else {
//         console.error("Failed to send notification", await response.text());
//       }
//     } catch (error) {
//       console.error("Error sending FCM message:", error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ userName, setUserName, sendFCMMessage }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => useContext(UserContext);




import { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseCreateClient";

const UserContext = createContext();


export const UserProvider = ({ children }) => {

  console.log(supabase,"supabase");
  const [userName, setUserName] = useState("");




  return (
    <UserContext.Provider value={{ userName, setUserName, }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
