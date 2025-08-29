// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// serve(async (req) => {
//   try {
//     const { fcm_token, title, body } = await req.json()
    
//     // Your Firebase Server Key (from Firebase Console)
//     const serverKey = "BPWM56bqaQraFySlmXRv6-kmYTQPUBr-ElDgW4QAHAPharN1_KHkMKfI5w5om87ZrKdplZugFBTyPaE7h0PCKTo"
    
//     const response = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers: {
//         'Authorization': `key=${serverKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         to: fcm_token,
//         notification: {
//           title: title,
//           body: body,
//         },
//         data: {
//           extra_data: 'any custom data you need',
//         },
//       }),
//     })
    
//     const json = await response.json()
    
//     if (response.ok) {
//       return new Response(JSON.stringify({ success: true, data: json }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       })
//     } else {
//       return new Response(JSON.stringify({ success: false, error: json }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       })
//     }
//   } catch (err) {
//     return new Response(JSON.stringify({ success: false, error: err.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     })
//   }
// })







import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  // -------------------
  // CORS helper
  // -------------------
  const setCorsHeaders = (response: Response) => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // dev: localhost or your frontend URL
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*'); // allow all headers
    return response;
  };

  // -------------------
  // Handle preflight OPTIONS request
  // -------------------
  if (req.method === 'OPTIONS') {
    return setCorsHeaders(new Response(null, { status: 204 }));
  }

  try {
    // -------------------
    // Supabase auth check (optional)
    // -------------------
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return setCorsHeaders(
        new Response(JSON.stringify({ code: 401, message: 'Missing authorization header' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // -------------------
    // Read request body
    // -------------------
    const { fcm_token, title, body } = await req.json();

    if (!fcm_token) throw new Error('FCM token is required');

    // -------------------
    // Firebase server key
    // -------------------
    const serverKey = "BPWM56bqaQraFySlmXRv6-kmYTQPUBr-ElDgW4QAHAPharN1_KHkMKfI5w5om87ZrKdplZugFBTyPaE7h0PCKTo";
    if (!serverKey) throw new Error('Firebase server key not set');

    // -------------------
    // Send notification to FCM
    // -------------------
    const fcmRes = await fetch('https://fcm.googleapis.com/v1/projects/just-need-780a4/messages:send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: fcm_token,
        notification: { title, body },
        data: { extra_data: 'custom data' },
      }),
    });

    // -------------------
    // Read FCM response safely
    // -------------------
    const text = await fcmRes.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return setCorsHeaders(
        new Response(JSON.stringify({ success: false, error: 'FCM returned non-JSON', raw: text }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    // -------------------
    // Return JSON
    // -------------------
    return setCorsHeaders(
      new Response(JSON.stringify({ success: fcmRes.ok, data: json }), {
        status: fcmRes.ok ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      })
    );

  } catch (err) {
    return setCorsHeaders(
      new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
});
