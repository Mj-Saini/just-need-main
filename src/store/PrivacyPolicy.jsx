import React, { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseCreateClient";
const PolicyContext = createContext();

export const usePolicyContext = () => useContext(PolicyContext);

function PolicyProvider({ children }) {
  //get policy

  const fetchPolicy = async () => {
    const { data, error } = await supabase
      .from("policy")
      .select("*")
      .eq("id", 2)
      .single();
    if (!error) {
      return data;
    }
  };

  // Add policy
  const AddPolicy = async (value) => {
    const { data, error } = await supabase
      .from("policy")
      .update({ privacy: value.privacy, service: value.service })
      .eq("id", 2); // passing Id hardcode because there is not delete option in admin panel so it will be fix
    if (error) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <PolicyContext.Provider value={{ AddPolicy, fetchPolicy }}>
      {children}
    </PolicyContext.Provider>
  );
}

export default PolicyProvider;
