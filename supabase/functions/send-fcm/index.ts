


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

serve(async (req) => {
  // -------------------
  // CORS helper
  // -------------------
  const setCorsHeaders = (response: Response) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  };

  if (req.method === "OPTIONS") {
    return setCorsHeaders(new Response(null, { status: 204 }));
  }

  try {
    // -------------------
    // Auth header check
    // -------------------
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return setCorsHeaders(
        new Response(JSON.stringify({ code: 401, message: "Missing authorization header" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    // -------------------
    // Parse body
    // -------------------
    const { fcm_token, title, body } = await req.json();
    if (!fcm_token) throw new Error("FCM token is required");

    // -------------------
    // Load service account from env
    // -------------------
    const serviceAccountStr = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
    if (!serviceAccountStr) throw new Error("FIREBASE_SERVICE_ACCOUNT env variable not set");

    const serviceAccount = JSON.parse(serviceAccountStr);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");


    // -------------------
    // Create JWT for OAuth token
    // -------------------
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const jwt = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .sign(await jose.importPKCS8(serviceAccount.private_key, "RS256"));

    // -------------------
    // Exchange JWT for access token
    // -------------------
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("Failed to obtain access token");

    // -------------------
    // Send FCM message
    // -------------------
    const fcmRes = await fetch(
      `https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            token: fcm_token,
            notification: {
              title: title || "Default Title",
              body: body || "Default Body",
            },
            data: { extra_data: "custom data" },
          },
        }),
      }
    );

    const responseData = await fcmRes.json();

    // -------------------
    // Return response
    // -------------------
    return setCorsHeaders(
      new Response(JSON.stringify({ success: fcmRes.ok, data: responseData }), {
        status: fcmRes.ok ? 200 : 400,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (err) {
    return setCorsHeaders(
      new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
});
