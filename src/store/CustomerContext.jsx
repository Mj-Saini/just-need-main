/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseCreateClient";

const customerProvider = createContext();

export const useCustomerContext = () => useContext(customerProvider);

export function CustomerContext({ children }) {
  const [users, setUsers] = useState([]);
  const [riders, setRiders] = useState([]);
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
  const fetchRiders = async () => {
    setLoading(true);

    // First, get all users who are riders with their accountStatus
    let { data: usersData, error: usersError } = await supabase
      .from('Users')
      .select('*')
      .eq('userType', 'Rider');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      setLoading(false);
      return;
    }

    // Then get rider details for these users
    let { data: RiderDetailsView, error: riderError } = await supabase
      .from('RiderDetailsView')
      .select('*');

    if (riderError) {
      console.error('Error fetching rider details:', riderError);
      setLoading(false);
      return;
    }

    // Combine the data
    const combinedRiders = usersData.map(user => {
      const riderDetail = RiderDetailsView.find(rider => rider.userId === user.id);
      return {
        ...riderDetail,
        user_detail: {
          firstName: user.firstName,
          lastName: user.lastName,
          useremail: user.useremail,
          mobile_number: user.mobile_number,
          accountStatus: user.accountStatus,
          userType: user.userType
        }
      };
    });

    // console.log("Combined riders data:", combinedRiders);
    setRiders(combinedRiders || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
    fetchRiders()
  }, []);


  return (
    <customerProvider.Provider value={{ users, setUsers, loading, setLoading, fetchUsers, riders, setRiders }}>
      {children}
    </customerProvider.Provider>
  );
}
