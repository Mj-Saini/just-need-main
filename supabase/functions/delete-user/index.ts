import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  "https://qmxzutndbzkpccffzoxy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo" // ⚠️ Use service role key here
);

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 1. Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 2. Delete from Users table (CASCADE will handle related tables)
    const { error: userError } = await supabaseAdmin
      .from("Users")
      .delete()
      .eq("id", userId);

    if (userError) {
      return new Response(JSON.stringify({ success: false, error: userError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "User and related data deleted successfully" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});





// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const supabaseAdmin = createClient(
//   "https://qmxzutndbzkpccffzoxy.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo"
// );

// serve(async (req) => {
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };

//   if (req.method === "OPTIONS") {
//     return new Response(null, { status: 204, headers: corsHeaders });
//   }

//   try {
//     if (req.method !== "POST") {
//       return new Response(JSON.stringify({ error: "Method not allowed" }), {
//         status: 405,
//         headers: corsHeaders,
//       });
//     }

//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Missing authorization header" }), {
//         status: 401,
//         headers: corsHeaders,
//       });
//     }

//     const { userId } = await req.json();
//     if (!userId) {
//       return new Response(JSON.stringify({ error: "userId is required" }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: corsHeaders,
//     });
//   } catch (err: any) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// });
