/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseCreateClient';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);

    // Fetch data from Supabase
    const fetchComplaints = async () => {
        try {
            const { data, error } = await supabase.from('RaiseComplaint').select('*');
            if (error) throw error;
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    useEffect(() => {
        fetchComplaints(); // Fetch complaints on mount
    }, []);

    return (
        <ComplaintContext.Provider value={{ complaints, setComplaints }}>
            {children}
        </ComplaintContext.Provider>
    );
};

// Custom hook to use ComplaintContext
export const useComplaintProvider = () => {
    return useContext(ComplaintContext);
};
