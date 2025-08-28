
// // functions/sendNotification/index.ts
// import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
// import admin from "firebase-admin";

// const serviceAccount = {
//     type: "service_account",
//     project_id: "just-need-780a4",
//     private_key_id: "9a3bf298bd61b6f2d0f49e62e2016e930339a368",
//     private_key: `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwL2+9BqvgomX1\nPwZp7jFEiUQf/kdGhGQgwPCut5FH/t2qoaCFb/7bF/bj+iNpHRnFRusLKOaTHMHT\nQCmU+Uaf/U/njYFjgHOWTtwL59cgSc4YvAEyOz30mE3CBdA9twFDa/EsP7g9Sjhv\naXn33OmcmEh8JOpn+in7tzKJT/oroUpPx4q6dhp1EVIdbBj8y5JT6SNOd0qbZNnM\n7TXHwmfQOlyX7wpTZxxc7N1eVJvf4nMQINgHTNFbP/CrOSh2tW0tzU90D5DrOxWK\nNhmSCWMgCb4vCnQj2xZYddaCa5Z8pFNjziCTwrXtAVsE+ff/oc5PzpEtn77XP37R\nJ2KgM+OfAgMBAAECggEADAqB6XpOPuD6dONkzdKQnW2AMWuQdXpQ2Yg2Ksqy7Ce4\nAJRhQx1fXpvprLUIvINXoorxP2cBMyaw/H4TGXJb6E1Iq7uZDzLVM32aPloO8s74\nfepDbqpr1o6eKdd53u3l8TSsW+jS76Vl6/9abZ00fhZOReXD+202d1SS6J2FrHuR\ncBrmV/A9V75QH/ZTnbH3VaqrpMWxtBsOb5hSsI7zm4QsOo2G4X55vwNcZ+L4kUrE\nGgGzujvtG/CJof6WuxVQRVF7TDSbyaVSMM0gs/FyareRqkJBNyF0nLWQoJqGY9ro\nuMH6KwpUDJBMnqWi14H7eYqcLmZ8j39QIS8b6A+0+QKBgQDUYneCJADQy8dHjNim\nkfIX9V2FbPiYZ26Q9DoIHwZs7bDwCYroXYJqOlnwynNgidh6G+6xBAWI0THGDSd4\nQKB4nRYJxtWwj96q83t/Vf+mgbMXN+RiepzNN8fZNpoKR6RsuaGMyNptPeAoPKIj\niNTbqsGpL6mItpXoStr+6wej8wKBgQDUXePP9KynzCx/1RRqA6Z+VYO2JYxFnmZH\nUr2twGrPP5lFTlVrO5pSmZ95c7ygUKWy84VxfX84Fgy0ckZ1arg6i3jEEMvozSbQ\nUZwNdMj1ep316DxVI83CzXNxXp0xiVgdyCQQu9jYx5KHCHUCLip0li9jDCfEgM4w\nW+60zUHopQKBgFcm1N2dgowrounUfS7VIt/7+tV+owB/KRrobUvZ11wpqXrGn668\neIC40yGBIhlSV3e8MJWJDfBXz7HyweiRtIfqBhoa8qNSVlAWO+5DzvV3sZLsh5Z1\ntBRuOF8FDe77+Rf4kLdh0GgVhP9d6jbktlwx1OhlO49zRU6eMQF8VpVLAoGAVicc\n03GEVbJb3yQ3WubONXRFsbA73sZq4cZsUr+71QYNDPPBbXZJnfbanm/YdwUgo59t\nZGQwJzWyw8WUVfAMexu3y3qw7mnDtEFXWJInMIck6+ziBPw4bi3hBn4GsWDxkWtv\nTiaWyyLzi7pflZna+V8wLDNzMqG6hB3XkhuvAE0CgYAnmxh0frTMjgl+upBA6FKJ\nJuiG9i11YZajnjm5t03W3slqA6ha3NKZuEeNcWREdAKV2BIcg0Q0+uLiHO3Wf56S\nXl37PfEsTwlgd6C0jps4NXY8iHGpwZ6JXZFQn9J57p6wd7bBIkLKZULEwsB9eJet\nem/G+JAsxy9sXrw7zySIOg`,
//     client_email: "firebase-adminsdk-fbsvc@just-need-780a4.iam.gserviceaccount.com",
//     client_id: "107853159935884489603",
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc@just-need-780a4.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com"
// };

// // Initialize Firebase Admin
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // CORS & main handler
// serve(async (req) => {
//   // Preflight OPTIONS request for CORS
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     });
//   }

//   try {
//     const { token, title, body } = await req.json();

//     if (!token) {
//       return new Response(JSON.stringify({ error: "FCM token is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
//       });
//     }

//     // Send FCM notification
//     await admin.messaging().send({
//       token,
//       notification: { title, body },
//       data: { click_action: "FLUTTER_NOTIFICATION_CLICK", current_user_fcm_token: token },
//     });

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
//     });
//   } catch (err) {
//     console.error("FCM Error:", err);
//     return new Response(JSON.stringify({ error: err.message || err.toString() }), {
//       status: 500,
//       headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
//     });
//   }
// });


// functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token, title, body } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'FCM token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Use the HTTP v1 API with your server key
    const FCM_SERVER_KEY ="BPWM56bqaQraFySlmXRv6-kmYTQPUBr-ElDgW4QAHAPharN1_KHkMKfI5w5om87ZrKdplZugFBTyPaE7h0PCKTo";
    
    if (!FCM_SERVER_KEY) {
      throw new Error('FCM server key not configured');
    }

    const message = {
      to: token,
      notification: {
        title: title,
        body: body
      },
      priority: 'high'
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify(message)
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: response.ok, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.ok ? 200 : 400
      }
    );

  } catch (error) {
    console.error('FCM Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});