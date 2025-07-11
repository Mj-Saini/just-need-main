/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseCreateClient";

const customerProvider = createContext();

export const useCustomerContext = () => useContext(customerProvider);

export function CustomerContext({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("userview").select("*").order("created_at", { ascending: false });;

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <customerProvider.Provider value={{ users, setUsers, loading, setLoading, fetchUsers }}>
      {children}
    </customerProvider.Provider>
  );
}
