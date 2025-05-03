/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseCreateClient";
import { toast } from "react-toastify";

const SubscriptionProvider = createContext();

export const useSubscriptionContext = () => useContext(SubscriptionProvider);

export const SubscriptionContext = ({ children }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const addPlan = async (planData) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Subscription")
                .insert([
                    {
                        planName: planData.planName,
                        price: parseFloat(planData.price),
                        durationInDays: parseInt(planData.durationInDays),
                        currency: planData.currency,
                        color: planData.color,
                        cancellationPolicy: planData.cancellationPolicy || "Standard policy",
                        features: planData.features || [], // Add features field (default to empty array if not provided)
                    },
                ])
                .select();

            if (error) throw error;

            console.log("Plan added successfully:", data);
            setPlans((prev) => [...prev, data[0]]);
            setShowPopup(false);
            toast.success("Plan added successfully!");
            return { success: true };
        } catch (error) {
            console.error("Error adding plan:", error);
            toast.error("Failed to add plan: " + error.message);
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (planId) => {
        try {
            const { error } = await supabase
                .from("Subscription")
                .delete()
                .eq("id", planId);

            if (error) throw error;

            console.log("Plan deleted successfully!");
            setPlans((prev) => prev.filter((plan) => plan.id !== planId));
            toast.success("Plan deleted successfully!");
            return { success: true };
        } catch (error) {
            console.error("Error deleting plan:", error);
            toast.error("Failed to delete plan: " + error.message);
            return { error: error.message };
        }
    };

    const updatePlan = async (updatedData, planId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Subscription")
                .update({
                    planName: updatedData.planName,
                    price: parseFloat(updatedData.price),
                    durationInDays: parseInt(updatedData.durationInDays),
                    currency: updatedData.currency,
                    color: updatedData.color,
                    cancellationPolicy: updatedData.cancellationPolicy,
                    features: updatedData.features || [], // Update features field
                })
                .eq("id", planId)
                .select();

            if (error) throw error;

            console.log("Plan updated successfully:", data);
            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === planId ? { ...plan, ...data[0] } : plan
                )
            );
            setShowPopup(false);
            toast.success("Plan updated successfully!");
            return { success: true, data: data[0] };
        } catch (error) {
            console.error("Error updating plan:", error);
            toast.error("Failed to update plan: " + error.message);
            return { error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        try {
            const { data, error } = await supabase.from("Subscription").select("*");

            if (error) throw error;

            setPlans(data);
            return data;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            toast.error("Failed to fetch subscriptions: " + error.message);
            return [];
        }
    };

    const fetchSubscriptionById = async (id) => {
        try {
            const { data, error } = await supabase
                .from("Subscription")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error("Error fetching subscription:", error);
            toast.error("Failed to fetch subscription: " + error.message);
            return null;
        }
    };

    return (
        <SubscriptionProvider.Provider
            value={{
                plans,
                loading,
                showPopup,
                setShowPopup,
                addPlan,
                deletePlan,
                updatePlan,
                fetchSubscription,
                fetchSubscriptionById,
                setPlans,
            }}
        >
            {children}
        </SubscriptionProvider.Provider>
    );
};