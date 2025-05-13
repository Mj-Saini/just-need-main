/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseCreateClient";
import { toast } from "react-toastify";

const bannerContext = createContext();

function BannerProvider({ children }) {
  const [offer, setOffer] = useState([]);

  useEffect(() => {
    fetchOffer();
  }, []);

  const fetchOffer = async () => {
    const { data, error } = await supabase.from("Offers").select("*");
    if (error) {
      toast.error("Error fetching Offers");
    } else {
      setOffer(data);
    }
  };


  const handleDelete = async (id) => {
    // console.log("harish", id);
    const { error } = await supabase.from("Offers").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting offer");
    } else {
      toast.success("Offer deleted successfully!");
      setOffer((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
    }
  };

  return (
    <bannerContext.Provider
      value={{ offer, setOffer, handleDelete, fetchOffer }}
    >
      {children}
    </bannerContext.Provider>
  );
}

export default BannerProvider;
export const useBannerContext = () => useContext(bannerContext);
