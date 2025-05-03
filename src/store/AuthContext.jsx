import React, { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseCreateClient";
const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {

    
  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { success: false, response: error };
    }

    return { success: true, response: data };
  }


  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.clear();
    if (error) {
      return { success: false, response: error };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ signInWithEmail, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
