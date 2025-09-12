/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseCreateClient";
const ListingContext = createContext();

export const useListingContext = () => useContext(ListingContext);

function ListingProvider({ children }) {
  const [listData, setListData] = useState([]);
  const fetchlisting = async () => {
    const { data, error } = await supabase.from("ServiceListings").select("");
    if (!error) {
      return data;
    }
  };

  // get listing with id

  const fetchlistingWithId = async (id) => {
    const { data, error } = await supabase
      .from("ServiceListings")
      .select("*")
      .eq("id", id) // Fetch data where id matches
      .single(); // Get only one record
    if (!error) {
      return data;
    }
  };
  async function getData() {
    const value = await fetchlisting();

    setListData([...value]);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ListingContext.Provider value={{ fetchlisting, fetchlistingWithId, listData, setListData }}>
      {children}
    </ListingContext.Provider>
  );
}

export default ListingProvider;
