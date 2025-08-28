// export async function sendNotification(token, title, body) {
//   try {
//     const message = {
//       to: token,
//       notification: {
//         title: title,
//         body: body
//       },
//       priority: "high"
//     };


//     const res = await fetch("https://fcm.googleapis.com/fcm/send", {
  //       method: "POST",
  //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `key=BPWM56bqaQraFySlmXRv6-kmYTQPUBr-ElDgW4QAHAPharN1_KHkMKfI5w5om87ZrKdplZugFBTyPaE7h0PCKTo`
    //       },
    //       body: JSON.stringify(message),
    //     });
    
    //     const data = await res.json();
    
    //     if (res.ok) {
      //       console.log("Notification sent successfully:", data);
      //     } else {
        //       console.error("Failed to send notification:", data);
        //     }
        
        //     return data;
        
        //   } catch (err) {
          //     console.error("Error sending notification:", err);
          //     throw err;
          //   }
          // }
          
          
          // Components/Notification.js
          // export async function sendNotification(token, title, body) {
            //     const anonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Njg2MDUsImV4cCI6MjA1NTM0NDYwNX0.96QZYdqt7jyIw-w0PEcqXqwToFUAChPCJMzo641WU_k"
            //   try {
              //     // Call your Supabase Edge Function instead of FCM directly
              //     const res = await fetch('https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send', {
                //       method: 'POST',
                //       headers: {
                  //         'Content-Type': 'application/json',
                  //         'Authorization': `Bearer ${anonKey}` // Add your Supabase anon key
                  //       },
                  //       body: JSON.stringify({ token, title, body }),
                  //     });
                  
                  //     const data = await res.json();
                  
                  //     if (res.ok) {
                    //       console.log('Notification sent successfully:', data);
                    //       return { success: true, data };
                    //     } else {
                      //       console.error('Failed to send notification:', data);
                      //       return { success: false, error: data };
                      //     }
                      
                      //   } catch (err) {
                        //     console.error('Error sending notification:', err);
                        //     throw err;
                        //   }
                        
                        
                        // }
                        
                        
//                         import { getAccessToken } from "../../utility/getAccessToken";
//                         export const  sendFCMMessage = async () => {
//   try {
//     // Get FCM server key using your own logic
//     const serverKey = await getAccessToken(); // Implement this like your Flutter code

//     const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send';

//     const message = {
//       message: {
//         token: 'd1FMfLkvS-azXi6gV2bRGm:APA91bEk8AvHENGf8LQBHZ2ELCyoxMuMsBZO5fZTtrPiidMLyAu2KKt9bJwKgQjWwygWcAD50MfIDeY66iKB-eJESSb0dV_91QG1_9BYB-O1byQbnsD4zjM', // Device token
//         notification: {
//           body: "Test Notification",
//           title: "Just Needs"
//         },
//         data: {
//           action: 'routeType',
//           click_action: 'FLUTTER_NOTIFICATION_CLICK',
//           current_user_fcm_token: 'd1FMfLkvS-azXi6gV2bRGm:APA91bEk8AvHENGf8LQBHZ2ELCyoxMuMsBZO5fZTtrPiidMLyAu2KKt9bJwKgQjWwygWcAD50MfIDeY66iKB-eJESSb0dV_91QG1_9BYB-O1byQbnsD4zjM'``
//         }
//       }
//     };

//     const response = await fetch(fcmEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${serverKey}`
//       },
//       body: JSON.stringify(message)
//     });

//     if (response.ok) {
//       console.log("Notification sent successfully.");
//     } else {
//       const errorText = await response.text();
//       console.error("Failed to send notification:", response.status, errorText);
//     }
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };



// pages/api/send-notification.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    // Your service account details (move these to .env.local in production)
    const clientEmail = "firebase-adminsdk-fbsvc@just-need-780a4.iam.gserviceaccount.com";
    const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwL2+9BqvgomX1\nPwZp7jFEiUQf/kdGhGQgwPCut5FH/t2qoaCFb/7bF/bj+iNpHRnFRusLKOaTHMHT\nQCmU+Uaf/U/njYFjgHOWTtwL59cgSc4YvAEyOz30mE3CBdA9twFDa/EsP7g9Sjhv\naXn33OmcmEh8JOpn+in7tzKJT/oroUpPx4q6dhp1EVIdbBj8y5JT6SNOd0qbZNnM\n7TXHwmfQOlyX7wpTZxxc7N1eVJvf4nMQINgHTNFbP/CrOSh2tW0tzU90D5DrOxWK\nNhmSCWMgCb4vCnQj2xZYddaCa5Z8pFNjziCTwrXtAVsE+ff/oc5PzpEtn77XP37R\nJ2KgM+OfAgMBAAECggEADAqB6XpOPuD6dONkzdKQnW2AMWuQdXpQ2Yg2Ksqy7Ce4\nAJRhQx1fXpvprLUIvINXoorxP2cBMyaw/H4TGXJb6E1Iq7uZDzLVM32aPloO8s74\nfepDbqpr1o6eKdd53u3l8TSsW+jS76Vl6/9abZ00fhZOReXD+202d1SS6J2FrHuR\ncBrmV/A9V75QH/ZTnbH3VaqrpMWxtBsOb5hSsI7zm4QsOo2G4X55vwNcZ+L4kUrE\nGgGzujvtG/CJof6WuxVQRVF7TDSbyaVSMM0gs/FyareRqkJBNyF0nLWQoJqGY9ro\nuMH6KwpUDJBMnqWi14H7eYqcLmZ8j39QIS8b6A+0+QKBgQDUYneCJADQy8dHjNim\nkfIX9V2FbPiYZ26Q9DoIHwZs7bDwCYroXYJqOlnwynNgidh6G+6xBAWI0THGDSd4\nQKB4nRYJxtWwj96q83t/Vf+mgbMXN+RiepzNN8fZNpoKR6RsuaGMyNptPeAoPKIj\niNTbqsGpL6mItpXoStr+6wej8wKBgQDUXePP9KynzCx/1RRqA6Z+VYO2JYxFnmZH\nUr2twGrPP5lFTlVrO5pSmZ95c7ygUKWy84VxfX84Fgy0ckZ1arg6i3jEEMvozSbQ\nUZwNdMj1ep316DxVI83CzXNxXp0xiVgdyCQQu9jYx5KHCHUCLip0li9jDCfEgM4w\nW+60zUHopQKBgFcm1N2dgowrounUfS7VIt/7+tV+owB/KRrobUvZ11wpqXrGn668\neIC40yGBIhlSV3e8MJWJDfBXz7HyweiRtIfqBhoa8qNSVlAWO+5DzvV3sZLsh5Z1\ntBRuOF8FDe77+Rf4kLdh0GgVhP9d6jbktlwx1OhlO49zRU6eMQF8VpVLAoGAVicc\n03GEVbJb3yQ3WubONXRFsbA73sZq4cZsUr+71QYNDPPBbXZJnfbanm/YdwUgo59t\nZGQwJzWyw8WUVfAMexu3y3qw7mnDtEFXWJInMIck6+ziBPw4bi3hBn4GsWDxkWtv\nTiaWyyLzi7pflZna+V8wLDNzMqG6hB3XkhuvAE0CgYAnmxh0frTMjgl+upBA6FKJ\nJuiG9i11YZajnjm5t03W3slqA6ha3NKZuEeNcWREdAKV2BIcg0Q0+uLiHO3Wf56S\nXl37PfEsTwlgd6C0jps4NXY8iHGpwZ6JXZFQn9J57p6wd7bBIkLKZULEwsB9eJet\nem/G+JAsxy9sXrw7zySIOg==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/firebase.messaging']
    );

    // Authorize and get access token
    const tokens = await jwtClient.authorize();
    const accessToken = tokens.access_token;

    // Send FCM message
    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send`;

    const message = {
      message: {
        token,
        notification: {
          title: 'Just Needs',
          body: 'Test Notification'
        },
        data: {
          action: 'routeType',
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          current_user_fcm_token: token
        }
      }
    };

    const response = await fetch(fcmEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    return res.status(200).json({ message: 'Notification sent successfully' });

  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



// export const sendFcmNotification = async () => {
//   try {
//     const token = 'YOUR_DEVICE_FCM_TOKEN';

//     const response = await fetch('/api/send-notification', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ token })
//     });

//     const data = await response.json();
//     if (response.ok) {
//       console.log('Notification sent:', data);
//     } else {
//       console.error('Error:', data);
//     }
//   } catch (error) {
//     console.error('Request failed:', error);
//   }
// };
