// /* eslint-disable react/prop-types */
// import { createContext, useContext } from "react";
// import { supabase } from "./supabaseCreateClient";
// const AuthContext = createContext();

// export const useAuthContext = () => useContext(AuthContext);

// function AuthProvider({ children }) {

    
//   async function signInWithEmail(email, password) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });
// localStorage.setItem('senderId', data.user?.id);
    
//     if (error) {
//       return { success: false, response: error };
//     }

//     return { success: true, response: data };
//   }


//   const handleLogOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     localStorage.clear();
//     if (error) {
//       return { success: false, response: error };
//     }
//     return { success: true };
//   };

//   return (
//     <AuthContext.Provider value={{ signInWithEmail, handleLogOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;



/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseCreateClient";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Login with Email ---
  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, response: error };
    }

    if (data?.session) {
      // Save session (includes refresh_token)
      localStorage.setItem("supabase-session", JSON.stringify(data.session));
      setSession(data.session);
      setUser(data.user);
      localStorage.setItem("senderId", data.user?.id);
    }

    return { success: true, response: data };
  }

  // --- Logout ---
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("supabase-session");
    localStorage.removeItem("senderId");
    setUser(null);
    setSession(null);

    if (error) {
      return { success: false, response: error };
    }
    return { success: true };
  };

  // --- Restore session on app load ---
  useEffect(() => {
    const savedSession = localStorage.getItem("supabase-session");

    if (savedSession) {
      const parsed = JSON.parse(savedSession);

      supabase.auth.setSession({
        access_token: parsed.access_token,
        refresh_token: parsed.refresh_token,
      });

      setSession(parsed);
      setUser(parsed.user);
    }

    setLoading(false);

    // 🔥 Listen for session changes (auto-refresh, sign in/out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem("supabase-session", JSON.stringify(session));
        setSession(session);
        setUser(session.user);
      } else {
        localStorage.removeItem("supabase-session");
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

