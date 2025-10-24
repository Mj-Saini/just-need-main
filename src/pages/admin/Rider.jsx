// 'use client';
// import { useState, useEffect } from 'react';
// import { CiSearch, CiFilter } from 'react-icons/ci';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import { supabase } from '../../store/supabaseCreateClient';
// import BlockedUserPopups from '../../Components/Popups/BlockedUserPopups';
// import { toast } from 'react-toastify';
// import { useCustomerContext } from '../../store/CustomerContext';
// import avatar from "../../assets/Images/Png/dummyimage.jpg";
// // import { useUserContext } from '../../store/UserContext';




// const Rider = () => {
//     const location = useLocation();
//     const { riders, setRiders, loading  } = useCustomerContext();
//     const [searchTerm, setSearchTerm] = useState("");
//     // For rider list
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [showFilterPopup, setShowFilterPopup] = useState(false);
//     const [selectedFilters] = useState(["name"]);
//     const [searchPlaceholder] = useState("Search by name, email, or ID");
//     const [showBlockedOnly, setShowBlockedOnly] = useState(false);


//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate();
//         const month = date.toLocaleString("default", { month: "short" });
//         const year = date.getFullYear();
//         const hours = date.getHours();
//         const minutes = date.getMinutes();
//         const ampm = hours >= 12 ? "PM" : "AM";
//         const formattedHours = hours % 12 || 12;
//         const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//         return `${day} ${month} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
//     };




//     // Filter logic based on selected fields
//     const filteredRiders = riders?.filter((rider) => {
//         // First, exclude blocked riders from the main table
//         if (rider.user_detail?.accountStatus?.isBlocked === true) {
//             console.log("Excluding blocked rider from main table:", rider.user_detail?.firstName, rider.user_detail?.lastName);
//             return false;
//         }

//         if (selectedFilters.length === 0) {
//             const riderName = `${rider.user_detail?.firstName || ''} ${rider.user_detail?.lastName || ''}`.toLowerCase();
//             const riderEmail = rider.user_detail?.useremail?.toLowerCase() || '';
//             return riderName.includes(searchTerm.toLowerCase()) ||
//                 riderEmail.includes(searchTerm.toLowerCase()) ||
//                 rider.userId?.toLowerCase().includes(searchTerm.toLowerCase());
//         }

//         return selectedFilters.some((filter) => {
//             const riderName = `${rider.user_detail?.firstName || ''} ${rider.user_detail?.lastName || ''}`.toLowerCase();

//             switch (filter) {
//                 case "userId":
//                     return rider.userId?.toLowerCase().includes(searchTerm.toLowerCase());
//                 case "name":
//                     return riderName.includes(searchTerm.toLowerCase());
//                 case "email":
//                     return rider.user_detail?.useremail?.toLowerCase().includes(searchTerm.toLowerCase());
//                 case "vehicleType":
//                     return rider.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
//                 case "vehicleRegistrationNumber":
//                     return rider.vehicleRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
//                 case "drivingLicenseNumber":
//                     return rider.drivingLicenseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
//                 default:
//                     return false;
//             }
//         });
//     });

//     const blockedRiders = riders?.filter(rider =>
//         rider.user_detail?.accountStatus?.isBlocked === true &&
//         rider.user_detail?.userType === "Rider"
//     );


//     {/* Blocked Riders List (Blocklist) */ }
//     <div style={{ margin: "24px 0", padding: "16px", background: "#f8f8fa", borderRadius: "8px" }}>
//         <h3 style={{ marginBottom: "12px", color: "#6c4def" }}>Blocked Riders List</h3>
//         {blockedRiders && blockedRiders.length > 0 ? (
//             <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
//                 <thead>
//                     <tr style={{ background: "#ece9fc" }}>
//                         <th style={{ padding: "8px", textAlign: "left" }}>#</th>
//                         <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
//                         <th style={{ padding: "8px", textAlign: "left" }}>User ID</th>
//                         <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
//                         <th style={{ padding: "8px", textAlign: "left" }}>Reason</th>
//                         <th style={{ padding: "8px", textAlign: "left" }}>Blocked At</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {blockedRiders.map((rider, idx) => (
//                         <tr key={rider.userId} style={{ borderBottom: "1px solid #eee" }}>
//                             <td style={{ padding: "8px" }}>{idx + 1}</td>
//                             <td style={{ padding: "8px" }}>
//                                 {rider.user_detail?.firstName} {rider.user_detail?.lastName}
//                             </td>
//                             <td style={{ padding: "8px" }}>{rider.userId}</td>
//                             <td style={{ padding: "8px" }}>{rider.user_detail?.useremail}</td>
//                             <td style={{ padding: "8px" }}>
//                                 {rider.user_detail?.accountStatus?.reason || "N/A"}
//                             </td>
//                             <td style={{ padding: "8px" }}>
//                                 {rider.user_detail?.accountStatus?.timestamp
//                                     ? new Date(rider.user_detail.accountStatus.timestamp).toLocaleString()
//                                     : "N/A"}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         ) : (
//             <div style={{ color: "#888" }}>No blocked riders found.</div>
//         )}
//     </div>

//     // rider list Pagination logic
//     const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, filteredRiders.length);
//     const paginatedData = filteredRiders.slice(startIndex, endIndex);

   

//     // Reset current page when filtered data changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [filteredRiders.length]);

//     // Pagination handlers
//     const handlePageChange = (direction) => {
//         if (direction === "next" && currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         } else if (direction === "prev" && currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

  

//     // function handleFilter() {
//     //     setShowFilterPopup(!showFilterPopup);
//     // }

//     // Handle unblock rider function

//     const handleUnblockRider = async (userId) => {
//         console.log("Unblocking user:", userId);
//         try {
//             const { error } = await supabase
//                 .from("Users")
//                 .update({
//                     accountStatus: {
//                         isBlocked: false,
//                         reason: null,
//                         timestamp: Date.now(),
//                     },
//                     updated_at: Date.now(),
//                 })
//                 .eq("id", userId); // ✅ This should work since userId is correct now

//             if (error) throw error;

//             setRiders((prevUsers) =>
//                 prevUsers.map((rider) =>
//                     rider.userId === userId
//                         ? {
//                             ...rider,
//                             user_detail: {
//                                 ...rider.user_detail,
//                                 accountStatus: {
//                                     isBlocked: false,
//                                     reason: null,
//                                     timestamp: Date.now(),
//                                 },
//                             },
//                         }
//                         : rider
//                 )
//             );
//             toast.success("User unblocked successfully!");
//         } catch (err) {
//             toast.error("Failed to unblock user");
//             console.error(err);
//         }
//     };


//     useEffect(() => {
//         const handler = () => fetchRiders();
//         window.addEventListener('rider-status-updated', handler);
//         return () => {
//             window.removeEventListener('rider-status-updated', handler);
//         };
//     }, []);

   

//     return (
//         <>
//             {location.pathname === "/dashboard/rider" &&
//                 <div className="bg-[#FFFFFF] p-5 rounded-[10px]">
//                     <div className="flex justify-between items-center mt-[15px]">
//                         <div className="flex items-center gap-6">
//                             <button
                               
//                                className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#6C4DEF]`}
//                             >
//                                 Riders List
//                             </button>
                           
//                         </div>

//                         <div className="flex gap-5">
//                             <div className="flex rounded-[10px] items-center p-2 h-[42px] bg-[#F1F1F1] xl:me-[20px]">
//                                 <CiSearch className="ms-2" />
//                                 <input
//                                     type="text"
//                                     placeholder={searchPlaceholder}
//                                     className="ms-2.5 focus:outline-none focus:ring-gray-400 bg-[#F1F1F1]"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>

//                             {/* <button
//                                 className="bg-[#6C4DEF] text-white px-[15px] py-2 rounded-[10px] flex items-center"
//                                 onClick={handleFilter}
//                             >
//                                 <span>
//                                     <CiFilter className="w-[24px] h-[24px] me-[12px]" />
//                                 </span>
//                                 Filter
//                             </button> */}
//                             <button
//                                 className="bg-[#6C4DEF] text-white px-[15px] py-2 rounded-[10px] flex items-center"
//                                 onClick={() => setShowBlockedOnly(true)}
//                             >
//                                 Block list
//                             </button>
//                         </div>
//                     </div>

               
//                         <div className="overflow-x-auto mt-5">
//                         <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
//                             <thead>
//                                 <tr className="py-[8px]">
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         S.No
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Rider Name
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Email
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Phone
//                                     </th>
//                                      <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Status
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Vehicle Type
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
//                                         Vehicle Number
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[250px]">
//                                         License Number
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
//                                         Experience
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
//                                         Created At
//                                     </th>
//                                     <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                                         Offer Parcel
//                                     </th>
                                   

//                                 </tr>
//                                 <tr>
//                                     <td colSpan="10">
//                                         <div className="w-full border border-dashed border-[#00000066]"></div>
//                                     </td>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr>
//                                         <td colSpan="10" className="text-center py-4">
//                                             Loading...
//                                         </td>
//                                     </tr>
//                                 ) : paginatedData.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="10" className="text-center py-4">
//                                             No riders found
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                             paginatedData?.map((rider, index) => {
//                                         console.log(rider,"rider")
//                                         return (
//                                             <tr key={rider.id}>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {index + 1}
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
//                                                     <Link
//                                                         className="flex gap-2"
//                                                         to={`riderDetails/${rider.id}`}
//                                                     >
//                                                         <img width={32} height={32} className='!w-8 h-8 aspect-[1/1] rounded-full object-cover img_user' src={rider.user_detail.image  || avatar} alt={rider.name} />    {rider.user_detail?.firstName} {rider.user_detail?.lastName}
//                                                     </Link>
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {rider.user_detail?.useremail || 'N/A'}
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {rider.user_detail?.mobile_number || 'N/A'}
//                                                 </td>
//                                                   <td>
//                                                     <div className="flex justify-center items-center">
//                                                         <span
//                                                             className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.status === "Active"
//                                                                 ? "bg-[#0080001d] text-[#008000]"
//                                                                 : rider.status === "Rejected" ? "bg-[#F02600a] text-[#F02600]" : rider.status === "Approved" ? "bg-[#6C4DEF1A] text-[#6C4DEF]" : "bg-[#ffa50024] text-[#ffa500]"
//                                                                 }`}
//                                                         >
//                                                             {rider.status}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     <span className="capitalize">{rider.vehicleType || 'N/A'}</span>
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {rider.vehicleRegistrationNumber || 'N/A'}
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
//                                                     {rider.drivingLicenseNumber || 'N/A'}
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {rider.drivingExperience || 0} years
//                                                 </td>
//                                                 <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                                                     {formatDate(rider.created_at)}
//                                                 </td>
//                                                 <td>
//                                                     <div className="flex justify-center items-center">
//                                                         <span
//                                                             className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.offerParcel
//                                                                 ? "text-[#008000] bg-[#00800012]"
//                                                                 : "text-[#FF0000] bg-[#ff000012]"
//                                                                 }`}
//                                                         >
//                                                             {rider.offerParcel ? "Yes" : "No"}
//                                                         </span>
//                                                     </div>
//                                                 </td>
                                              

//                                             </tr>
//                                         );
//                                     })
//                                 )}
//                             </tbody>
//                         </table>
//                         </div>
//                          {/* Pagination */}
//                     {paginatedData.length > 0 && (
//                         <div className="flex justify-between items-center mt-6">
//                             <div className="text-sm text-gray-600">
//                                 Showing {startIndex + 1} to {endIndex} of {filteredRiders.length} riders
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => handlePageChange("prev")}
//                                     disabled={currentPage === 1}
//                                     className="px-3 py-1 border rounded disabled:opacity-50"
//                                 >
//                                     Previous
//                                 </button>
//                                 <span className="px-3 py-1">
//                                     Page {currentPage} of {totalPages}
//                                 </span>
//                                 <button
//                                     onClick={() => handlePageChange("next")}
//                                     disabled={currentPage === totalPages}
//                                     className="px-3 py-1 border rounded disabled:opacity-50"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     )}
                    
                  




                   

//                     {/* Blocked Riders Popup */}
//                     {showBlockedOnly && (
//                         <BlockedUserPopups
//                             blockedUsers={blockedRiders}
//                             onClose={() => setShowBlockedOnly(false)}
//                             onUnblock={handleUnblockRider}
//                         />
//                     )}
//                 </div>}
//             <Outlet />
//         </>
//     );
// };

// export default Rider;




'use client';
import { useState, useEffect } from 'react';
import { CiSearch, CiFilter } from 'react-icons/ci';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../store/supabaseCreateClient';
import BlockedUserPopups from '../../Components/Popups/BlockedUserPopups';
import { toast } from 'react-toastify';
import { useCustomerContext } from '../../store/CustomerContext';
import avatar from "../../assets/Images/Png/dummyimage.jpg";

const Rider = () => {
    const location = useLocation();
    const { riders, setRiders, loading } = useCustomerContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("ridersList"); // "ridersList" or "pending"

    // For rider list
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [selectedFilters] = useState(["name"]);
    const [searchPlaceholder] = useState("Search by name, email, or ID");
    const [showBlockedOnly, setShowBlockedOnly] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${day} ${month} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Filter riders based on active tab and search term
    const getFilteredRiders = () => {
        let filtered = riders?.filter((rider) => {
            // Always exclude blocked riders from main tables
            if (rider.user_detail?.accountStatus?.isBlocked === true) {
                return false;
            }

            // Filter by active tab
            if (activeTab === "ridersList") {
                // Show only approved/active riders
                return rider.status === "Approved" || rider.status === "Active";
            } else if (activeTab === "pending") {
                // Show only pending/rejected riders
                return rider.status === "Pending" || rider.status === "Rejected";
            }
            return true;
        });

        // Apply search filter
        if (searchTerm.trim() !== "") {
            filtered = filtered?.filter((rider) => {
                const riderName = `${rider.user_detail?.firstName || ''} ${rider.user_detail?.lastName || ''}`.toLowerCase();
                const riderEmail = rider.user_detail?.useremail?.toLowerCase() || '';

                return selectedFilters.some((filter) => {
                    switch (filter) {
                        case "userId":
                            return rider.userId?.toLowerCase().includes(searchTerm.toLowerCase());
                        case "name":
                            return riderName.includes(searchTerm.toLowerCase());
                        case "email":
                            return riderEmail.includes(searchTerm.toLowerCase());
                        case "vehicleType":
                            return rider.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
                        case "vehicleRegistrationNumber":
                            return rider.vehicleRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
                        case "drivingLicenseNumber":
                            return rider.drivingLicenseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
                        default:
                            return false;
                    }
                });
            });
        }

        return filtered || [];
    };

    const filteredRiders = getFilteredRiders();
    const blockedRiders = riders?.filter(rider =>
        rider.user_detail?.accountStatus?.isBlocked === true &&
        rider.user_detail?.userType === "Rider"
    );

    // rider list Pagination logic
    const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredRiders.length);
    const paginatedData = filteredRiders.slice(startIndex, endIndex);

    // Reset current page when filtered data changes or tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredRiders.length, activeTab]);

    // Pagination handlers
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleUnblockRider = async (userId) => {
        console.log("Unblocking user:", userId);
        try {
            const { error } = await supabase
                .from("Users")
                .update({
                    accountStatus: {
                        isBlocked: false,
                        reason: null,
                        timestamp: Date.now(),
                    },
                    updated_at: Date.now(),
                })
                .eq("id", userId);

            if (error) throw error;

            setRiders((prevUsers) =>
                prevUsers.map((rider) =>
                    rider.userId === userId
                        ? {
                            ...rider,
                            user_detail: {
                                ...rider.user_detail,
                                accountStatus: {
                                    isBlocked: false,
                                    reason: null,
                                    timestamp: Date.now(),
                                },
                            },
                        }
                        : rider
                )
            );
            toast.success("User unblocked successfully!");
        } catch (err) {
            toast.error("Failed to unblock user");
            console.error(err);
        }
    };

    useEffect(() => {
        const handler = () => fetchRiders();
        window.addEventListener('rider-status-updated', handler);
        return () => {
            window.removeEventListener('rider-status-updated', handler);
        };
    }, []);

    const renderRidersTable = () => (
        <div className="overflow-x-auto mt-5">
            <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
                <thead>
                    <tr className="py-[8px]">
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            S.No
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Rider Name
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Email
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Phone
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Status
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Vehicle Type
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                            Vehicle Number
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[250px]">
                            License Number
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
                            Experience
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                            Created At
                        </th>
                        <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                            Offer Parcel
                        </th>
                    </tr>
                    <tr>
                        <td colSpan="11">
                            <div className="w-full border border-dashed border-[#00000066]"></div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="11" className="text-center py-4">
                                Loading...
                            </td>
                        </tr>
                    ) : paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan="11" className="text-center py-4">
                                No {activeTab === "pending" ? "pending" : "approved"} riders found
                            </td>
                        </tr>
                    ) : (
                        paginatedData?.map((rider, index) => {
                            return (
                                <tr key={rider.id}>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
                                        <Link
                                            className="flex gap-2"
                                            to={`riderDetails/${rider.id}`}
                                        >
                                            <img width={32} height={32} className='!w-8 h-8 aspect-[1/1] rounded-full object-cover img_user' src={rider.user_detail.image || avatar} alt={rider.name} />
                                            {rider.user_detail?.firstName} {rider.user_detail?.lastName}
                                        </Link>
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {rider.user_detail?.useremail || 'N/A'}
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {rider.user_detail?.mobile_number || 'N/A'}
                                    </td>
                                    <td>
                                        <div className="flex justify-center items-center">
                                            <span
                                                className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.status === "Active"
                                                    ? "bg-[#0080001d] text-[#008000]"
                                                    : rider.status === "Rejected"
                                                        ? "bg-[#F02600a] text-[#F02600]"
                                                        : rider.status === "Approved"
                                                            ? "bg-[#6C4DEF1A] text-[#6C4DEF]"
                                                            : "bg-[#ffa50024] text-[#ffa500]"
                                                    }`}
                                            >
                                                {rider.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        <span className="capitalize">{rider.vehicleType || 'N/A'}</span>
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {rider.vehicleRegistrationNumber || 'N/A'}
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
                                        {rider.drivingLicenseNumber || 'N/A'}
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {rider.drivingExperience || 0} years
                                    </td>
                                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                                        {formatDate(rider.created_at)}
                                    </td>
                                    <td>
                                        <div className="flex justify-center items-center">
                                            <span
                                                className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.offerParcel
                                                    ? "text-[#008000] bg-[#00800012]"
                                                    : "text-[#FF0000] bg-[#ff000012]"
                                                    }`}
                                            >
                                                {rider.offerParcel ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            {location.pathname === "/dashboard/rider" &&
                <div className="bg-[#FFFFFF] p-5 rounded-[10px]">
                    <div className="flex justify-between items-center mt-[15px]">
                        <div className="flex items-center gap-6">
                            {/* Tabs */}
                            <div className="flex bg-gray-100 rounded-[10px] p-1">
                                <button
                                    onClick={() => setActiveTab("ridersList")}
                                    className={`text-base xl:text-[16px] font-medium py-2 px-4 rounded-[8px] transition-colors ${activeTab === "ridersList"
                                        ? "text-[#fff] bg-[#6C4DEF]"
                                        : "text-[#6C4DEF] bg-transparent"
                                        }`}
                                >
                                    Riders List
                                </button>
                                <button
                                    onClick={() => setActiveTab("pending")}
                                    className={`text-base xl:text-[16px] font-medium py-2 px-4 rounded-[8px] transition-colors ${activeTab === "pending"
                                        ? "text-[#fff] bg-[#6C4DEF]"
                                        : "text-[#6C4DEF] bg-transparent"
                                        }`}
                                >
                                    Pending
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex rounded-[10px] items-center p-2 h-[42px] bg-[#F1F1F1] xl:me-[20px]">
                                <CiSearch className="ms-2" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    className="ms-2.5 focus:outline-none focus:ring-gray-400 bg-[#F1F1F1]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button
                                className="bg-[#6C4DEF] text-white px-[15px] py-2 rounded-[10px] flex items-center"
                                onClick={() => setShowBlockedOnly(true)}
                            >
                                Block list
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    {renderRidersTable()}

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {endIndex} of {filteredRiders.length} riders
                                {activeTab === "ridersList" ? " (Approved/Active)" : " (Pending/Rejected)"}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange("prev")}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange("next")}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Blocked Riders Popup */}
                    {showBlockedOnly && (
                        <BlockedUserPopups
                            blockedUsers={blockedRiders}
                            onClose={() => setShowBlockedOnly(false)}
                            onUnblock={handleUnblockRider}
                        />
                    )}
                </div>}
            <Outlet />
        </>
    );
};

export default Rider;