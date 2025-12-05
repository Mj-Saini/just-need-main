
// import { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";

// import {
//   EmailIcon,
//   LocationIcon,
//   PhoneIcon,
//   RatingStarIcon,
//   DisableRedicon,
//   EnableRedIcon,
// } from "../../assets/icon/Icons";
// import MechanicImage from "../../assets/png/user-profile-icon.png";
// import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
// import DenialReasonPopUp from "../../Components/Popups/DenialReasonPopUp";
// import disable_img from "../../assets/png/disable_img.png";
// import enable_img from "../../assets/png/enable_img.png";
// import { useListingContext } from "../../store/ListingContext";
// import { supabase } from "../../store/supabaseCreateClient";
// import { toast } from "react-toastify";
// import { truncateText } from "../../utility/wordTruncate";
// import { useCustomerContext } from "../../store/CustomerContext";
// import { useUserContext } from "../../store/UserContext";

// function UserDetails() {
//   const navigate = useNavigate();
//   const { setUsers, loading, setLoading } = useCustomerContext();
//     const { sendNotification,setUserName } = useUserContext();
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [showPopupDisable, setShowPopupDisable] = useState(false);
//   const [showDenialPopup, setShowDenialPopup] = useState(false);
//   const [denialType, setDenialType] = useState("");
//   const [listings, setListings] = useState([]);
//   const [riderDetails, setRiderDetails] = useState(null);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [userbusinessDetails, setUserBusinessDetails] = useState([]);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [activeTab, setActiveTab] = useState("withdrawals"); // Add active tab state
//   const [deleteUserPopup, setDeleteUserPopup] = useState(false);
//   const[totalRefferAmount,setTotalRefferAmount]=useState(0)

//   const { fetchlisting } = useListingContext();

  

//   const accessToken = user?.msgToken;
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
//   };

//   const fetchData = async () => {
//     setLoading(true);

//     // 🔁 Step 1: Supabase se fresh user data lo
//     const { data: freshUser, error } = await supabase
//       .from("Users")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       console.error("Error fetching user:", error);
//       setLoading(false);
//       return;
//     }

//     setUser(freshUser);
//     setUserName(freshUser?.firstName);

//     // 🔁 Step 2: Listing fetch karo
//     const listingVal = await fetchlisting();
//     const filteredListings = listingVal?.filter(
//       (item) => item?.user_detail?.id === id
//     );
//     setListings(filteredListings || []);

//     setLoading(false);
//   };

//   const fetchBusinessData = async () => {
//     setLoading(true);

//     try {
//       // Step 1: Directly get full data from BusinessDetailsView
//       const { data: businessUser, } = await supabase
//         .from("BusinessDetailsView")
//         .select("*")
//         .eq("userId", id)
//         .single();

//       // Step 2: Set user & context
//       setUserBusinessDetails(businessUser);

//       // Step 3: Listings fetch karo
//       const listingVal = await fetchlisting();
//       const filteredListings = listingVal?.filter(
//         (item) => item?.user_detail?.id === id
//       );
//       setListings(filteredListings || []);
//     } catch (err) {
//       console.error("❌ Unexpected error:", err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRiderData = async () => {
//     try {
//       const { data: riderData, error } = await supabase
//         .from('RiderDetailsView')
//         .select('*')
//         .eq('userId', id)
//         .single();

//       if (error) {
//         console.error("Error fetching rider details:", error);
//       } else {
//         setRiderDetails(riderData);
//       }
//     } catch (err) {
//       console.error("❌ Unexpected error fetching rider:", err);
//     }
//   };

//   const fetchWithdrawals = async () => {
//     try {
//       const { data: withdrawalData, error } = await supabase
//         .from('Withdraw')
//         .select('*')
//         .eq('userId', id)
//         .order('created_at', { ascending: false });

//       if (error) {
//         console.error("Error fetching withdrawals:", error);
//       } else {
//         setWithdrawals(withdrawalData || []);
//       }
//     } catch (err) {
//       console.error("❌ Unexpected error fetching withdrawals:", err);
//     }
//   };



//   // Run it on mount
//   useEffect(() => {
//     fetchData();
//     fetchBusinessData();
//     fetchRiderData();
//     fetchWithdrawals();
//   }, [id]);

//   useEffect(() => {
//     if (user?.referralList?.length > 0) {
//       const total = user.referralList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
//       setTotalRefferAmount(total);
//     } else {
//       setTotalRefferAmount(0);
//     }
//   }, [user?.referralList]);

//   // Handle disable/enable provider popup
//   const handlePopupDisable = () => {
//     setShowPopupDisable(!showPopupDisable);
//   };

//   // Handle block/unblock listing
//   const handleBlock = async (e, listing) => {
//     e.preventDefault();
    
//     // If we're blocking (not unblocking), show denial popup
//     if (!listing.blockStatus.isBlocked) {
//       setDenialType("listing");
//       setShowDenialPopup(true);
//       return;
//     }

//     // For unblocking, proceed with simple confirmation
//     const confirmUnblock = window.confirm("Are you sure you want to unblock this listing?");
//     if (confirmUnblock) {
//       const updatedBlockStatus = {
//         isBlocked: false,
//         reason: "",
//         blockedBy: "admin",
//       };

//       const { error } = await supabase
//         .from("ServiceListings")
//         .update({ blockStatus: updatedBlockStatus })
//         .eq("id", listing.id);

//       if (!error) {
//         setListings((prev) =>
//           prev.map((item) =>
//             item.id === listing.id
//               ? { ...item, blockStatus: updatedBlockStatus }
//               : item
//           )
//         );
//         toast.success("Listing unblocked successfully");
//       } else {
//         console.error("Error updating block status:", error);
//         toast.error("Something went wrong. Please try again.");
//       }
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!user) return <div>User not found</div>;

//   const isActive = user?.accountStatus?.isBlocked !== true;

//   const handleBusinessDenial = () => {
//     setDenialType("business");
//     setShowDenialPopup(true);
//   };

//   const handleRiderDenial = () => {
//     setDenialType("rider");
//     setShowDenialPopup(true);
//   };

//   const handleDenialClose = () => {
//     setShowDenialPopup(false);
//     setDenialType("");
//   };

//   const approveUser = async () => {
//     const confirmApprove = window.confirm("Are you sure you want to approve this user?");
//     if (!confirmApprove) return;

//     if (!userbusinessDetails || !userbusinessDetails?.businessId) {
//       toast.error("User data not found or invalid Business ID");
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('BusinessDetailsView')
//         .update({ status: 'Approved' })
//         .eq('businessId', userbusinessDetails.businessId)
//         .select();

//       if (error) {
//         toast.error("Failed to update business status");
//       } else {
//         toast.success("Business status updated successfully");
//         setUserBusinessDetails((prev) => ({ ...prev, status: 'Approved' }));
//         setUser((prevUser) => ({
//           ...prevUser,
//           businessDetail: { ...prevUser.businessDetail, status: 'Approved' }
//         }));
//         setUsers((prevUser) => ({
//           ...prevUser,
//           businessDetail: { ...prevUser.businessDetail, status: 'Approved' }
//         }));
//          sendNotification({
//            token: accessToken, 
//             userId:user.id,
//     title: `Congratulations! Business Approved`,
//   body: `Your business profile has been Approved successfully.`,
//   });
//       }
//     } catch (err) {
//       console.error("🚨 Unexpected Error:", err);
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   // Add this function for instant UI update after denial
//   const denyUser = async (reason) => {
//     if (!userbusinessDetails || !userbusinessDetails?.businessId) {
//       toast.error("User data not found or invalid Business ID");
         
//       return;
//     }
//     try {
//       const { error } = await supabase
//         .from('BusinessDetailsView')
//         .update({ status: 'Rejected', rejectedReason: reason })
//         .eq('businessId', userbusinessDetails.businessId)
//         .select();
//       if (error) {
//         toast.error("Failed to update business status");
//       } else {
//         toast.success("Business status updated successfully");
//         setUserBusinessDetails((prev) => ({ ...prev, status: 'Rejected', rejectedReason: reason }));
//         setUser((prevUser) => ({
//           ...prevUser,
//           businessDetail: { ...prevUser.businessDetail, status: 'Rejected', rejectedReason: reason }
//         }));
//         setUsers((prevUser) => ({
//           ...prevUser,
//           businessDetail: { ...prevUser.businessDetail, status: 'Rejected', rejectedReason: reason }
//         }));
//           sendNotification({
//             token: accessToken, 
//             userId:user.id,
//     title: `Sorry! Business Denied`,
//   body: `Your business profile has been Denied`,
//   });
//       }
//     } catch (err) {
//       console.error("🚨 Unexpected Error:", err);
//       toast.error("An unexpected error occurred.");
//     }
//   };



//   const handleRiderStatusUpdate = async (newStatus) => {
//     try {
//       const { error } = await supabase
//         .from('RiderDetailsView')
//         .update({ status: newStatus })
//         .eq('userId', id);

//       if (error) {
//         toast.error("Failed to update rider status");
//       } else {
//         setRiderDetails(prev => ({ ...prev, status: newStatus }));
//         toast.success(`Rider ${newStatus.toLowerCase()} successfully`);
        
//         // Update local state if setUsers is provided
//         if (setUsers) {
//           setUsers((prevUsers) =>
//             Array.isArray(prevUsers)
//               ? prevUsers.map((u) =>
//                   u.id === id
//                     ? {
//                         ...u,
//                         riderDetails: {
//                           ...u.riderDetails,
//                           status: newStatus
//                         }
//                       }
//                     : u
//                 )
//               : prevUsers
//           );
//         }
//         sendNotification({
//           token: accessToken, 
//           userId:user.id,
//     title: `Congratulations! Rider Approved`,
//   body: `Your rider profile has been approved successfully please go online to accept rides`,
    
//   });
//       }
//     } catch (err) {
//       console.error("Error updating rider status:", err);
//       toast.error("Something went wrong");
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     const res = await fetch("https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/delete-user", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo"
//       },
//       body: JSON.stringify({ userId }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       console.log("✅ User deleted:", data);
//       navigate("/usersList"); // 👈 redirect
//       window.location.reload(); 
//     } else {
//       console.error("❌ Delete failed:", data.error || data);
//     }
//   };




// console.log(user,"uaer")
//   return (
//     <div className="px-4">

 
//         <div className="flex items-center justify-end">
//           <button
//             onClick={handlePopupDisable}
//             className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
//           >
//             {isActive ? (
//               <>
//                 <DisableRedicon />
//                 <span className="text-black font-normal text-base">Block</span>
//               </>
//             ) : (
//               <>
//                 <EnableRedIcon />
//                 <span className="text-black font-normal text-base">Unblock</span>
//               </>
//           )}
        
            
        
//         </button>
//         <button onClick={() => setDeleteUserPopup(true)} className="ms-3">
//           <span className="bg-[#d80f0f] text-white rounded-lg px-5 py-1.5 font-normal text-base">Delete</span>

//         </button>
//         </div>

     

//       <div className="lg:flex mt-[30px]">
//         <div className="w-full md:w-7/12 lg:w-[399px] xl:pe-2.5 lg:flex">
//           <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] flex-grow flex flex-col">
//             {/* Profile Section */}
//             <div className="flex flex-col items-center mb-6">
//               <img
//                 onClick={() => setIsImageModalOpen(true)}
//                 className="w-[78px] h-[78px] rounded-full object-cover cursor-pointer"
//                 src={user?.image || MechanicImage}
//                 alt="user"
//               />
//               <h1 className="font-medium lg:text-base xl:text-lg text-white mt-2.5 text-center">
//                 {user?.firstName} {user?.lastName}
//               </h1>
//               <h2 className="text-sm font-normal text-white mt-1 text-center">
//                 {user?.category}
//               </h2>
//             </div>

//             {/* Information Tiles */}
//             <div className="grid grid-cols-1 gap-3">
//               {/* Phone Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex items-center gap-2.5">
//                   <PhoneIcon />
//                   <h3 className="text-sm font-normal text-white">
//                     {user?.mobile_number || "N/A"}
//                   </h3>
//                 </div>
//               </div>

//               {/* Email Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex items-center gap-2.5">
//                   <EmailIcon />
//                   <h3 className="text-sm font-normal text-white">
//                     {user?.useremail || "N/A"}
//                   </h3>
//                 </div>
//               </div>

//               {/* Location Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex items-center gap-2.5">
//                   <LocationIcon />
//                   <h3 className="text-sm font-normal text-white">
//                     {user?.address?.city && user?.address?.state
//                       ? `${user.address.city}, ${user.address.state}`
//                       : "N/A"}
//                   </h3>
//                 </div>
//               </div>

//               {/* Subscription Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex justify-between items-center gap-2.5">
//                   <h3 className="text-sm font-normal text-white">
//                     Subscription:  {user?.subscription == null
//                       ? "N/A"
//                       : `Yes / ${user?.subscription?.plan} / ${new Date(
//                         user?.subscription?.validTill
//                       ).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}`}
//                   </h3>
                  
//                 </div>
//               </div>

//               {/* Balance Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex items-center gap-2.5">
//                   <h3 className="text-sm font-normal text-white">
//                     Balance: ₹{user?.balance || "0"}
//                   </h3>
//                 </div>
//               </div>

//               {/* UPI Tile */}
//               <div className="bg-white bg-opacity-10 rounded-lg p-3">
//                 <div className="flex items-center gap-2.5">
//                   <h3 className="text-sm font-normal text-white">
//                     UPI: {user?.upi_id === "null" ? "N/A" : user?.upi_id || "N/A"}
//                   </h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Business Details for Seller */}
//         {user?.userType === "Seller" && (
//           <div className="w-full md:w-7/12 lg:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
//             <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
//               <div className="flex items-center justify-between">
//                 <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                   Business details
//                 </p>

//                 {userbusinessDetails?.status === "Pending" ?

//                   <div className="flex gap-4 items-center">
//                     <button
//                       onClick={approveUser}
//                       className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-green-500 text-white"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={handleBusinessDenial}
//                       className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-red-500 text-white"
//                     >
//                       Deny
//                     </button>

//                   </div> : <span
//                     className={`px-2 py-1 rounded-full text-xs ${userbusinessDetails?.status === "Approved"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                       }`}
//                   >
//                     {userbusinessDetails?.status}
//                   </span>}
//               </div>
//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Business Name:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {userbusinessDetails?.businessName}
//                   </h2>
//                 </div>
//               </div>
              
//               <div className="flex items-center mt-3">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Categories:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {/* {userbusinessDetails?.categories?.map((category) => (
//                       <span key={category.id}>
//                         {category.categoryName}
//                       </span>
//                     ))} */}
//                     {userbusinessDetails?.categories.categoryName} &nbsp;
//                    ( {userbusinessDetails?.categories.businesSubcategory.subCategoryName})

//                   </h2>
//                 </div>
//               </div>
//               {/* Business Detail Image Section */}
//               {userbusinessDetails?.businessImage && userbusinessDetails.businessImage.length > 0 && (
//                 <div className="mt-6">
//                   <h2 className="font-medium text-sm xl:text-base text-black mb-3">
//                     Business Detail Images:
//                   </h2>
//                   <div className="flex flex-wrap gap-3">
//                     {userbusinessDetails.businessImage.map((img, idx) => (
//                       <div key={idx} className="relative">
//                         <img
//                           src={img}
//                           alt={`Business Detail ${idx + 1}`}
//                           className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => setPreviewImage(img)}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/fallback-image.png";
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Business Images Section */}
//               {userbusinessDetails?.businessImages && userbusinessDetails.businessImages.length > 0 && (
//                 <div className="mt-6">
//                   <h2 className="font-medium text-sm xl:text-base text-black mb-3">
//                     Business Images:
//                   </h2>
//                   <div className="flex flex-wrap gap-3">
//                     {userbusinessDetails.businessImages.map((image, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={image}
//                           alt={`Business ${index + 1}`}
//                           className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => setPreviewImage(image)}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/fallback-image.png";
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Business Documents Section */}
//               {userbusinessDetails?.businessDocuments && userbusinessDetails.businessDocuments.length > 0 && (
//                 <div className="mt-12">
//                   <h2 className="font-medium text-sm xl:text-base text-black mb-3">
//                     Business Documents:
//                   </h2>
//                   <div className="flex flex-wrap gap-3">
//                     {userbusinessDetails.businessDocuments.map((document, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={document}
//                           alt={`Document ${index + 1}`}
//                           className="object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => setPreviewImage(document)}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/fallback-image.png";
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Rider Details for Rider */}
//         {user?.userType === "Rider" && riderDetails && (
//           <div className="w-full lg:w-7/12 xl:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
//             <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
//               <div className="flex items-center justify-between">
//                 <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                   Rider Details
//                 </p>

//                 {riderDetails?.status === "Pending" ? (
//                   <div className="flex gap-4 items-center">
//                     <button
//                       onClick={() => handleRiderStatusUpdate("Active")}
//                       className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-green-500 text-white"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={handleRiderDenial}
//                       className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-red-500 text-white"
//                     >
//                       Deny
//                     </button>
//                   </div>
//                 ) : (
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs ${
//                       riderDetails?.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : riderDetails?.status === "Inactive"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {riderDetails?.status}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Vehicle Type:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal capitalize">
//                     {riderDetails?.vehicleType}
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Vehicle Number:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {riderDetails?.vehicleRegistrationNumber}
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     License Number:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {riderDetails?.drivingLicenseNumber}
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Experience:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {riderDetails?.drivingExperience} years
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Offer Parcel:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {riderDetails?.offerParcel ? "Yes" : "No"}
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex items-center mt-3 xl:mt-[15px]">
//                 <div className="w-4/12">
//                   <h2 className="font-medium text-sm xl:text-base text-black">
//                     Created At:
//                   </h2>
//                 </div>
//                 <div className="w-10/12">
//                   <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                     {formatDate(riderDetails?.created_at)}
//                   </h2>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tabs Section */}
//       <div className="mt-[30px]">
//         <div className="flex space-x-4 mb-4 border-b">
//           <button
//             onClick={() => setActiveTab("withdrawals")}
//             className={`px-4 py-2 capitalize border-b-2 ${
//               activeTab === "withdrawals"
//                 ? 'border-blue-600 text-blue-600 font-semibold'
//                 : 'border-transparent text-gray-600 hover:text-blue-600'
//             }`}
//           >
//             Withdraw Transactions
//           </button>
//           {user?.userType === "Seller" && (
//             <button
//               onClick={() => setActiveTab("listings")}
//               className={`px-4 py-2 capitalize border-b-2 ${
//                 activeTab === "listings"
//                   ? 'border-blue-600 text-blue-600 font-semibold'
//                   : 'border-transparent text-gray-600 hover:text-blue-600'
//               }`}
//             >
//               Posted Listing
//             </button>
//           )}
//         </div>

//         {/* Withdrawal Transactions Tab */}
//         {activeTab === "withdrawals" && (
//           <div className="bg-white shadow rounded-lg overflow-x-auto">
//             {withdrawals.length > 0 ? (
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UPI ID</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {withdrawals.map((withdrawal, index) => (
//                     <tr key={withdrawal.id} className="border-t">
//                       <td className="px-4 py-2">{index + 1}</td>
//                       <td className="px-4 py-2 font-semibold">₹{withdrawal.amount}</td>
//                       <td className="px-4 py-2">{withdrawal.upi_id}</td>
//                       <td className="px-4 py-2">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             withdrawal.status === 'Pending'
//                               ? 'bg-yellow-100 text-yellow-700'
//                               : withdrawal.status === 'Approved'
//                               ? 'bg-green-100 text-green-700'
//                               : 'bg-red-100 text-red-700'
//                           }`}
//                         >
//                           {withdrawal.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 text-sm text-gray-600">
//                         {formatDate(withdrawal.created_at)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <p className="text-lg">No withdrawal transactions found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Posted Listing Tab */}
//         {activeTab === "listings" && user?.userType === "Seller" && (
//           <div className="flex flex-row flex-wrap -mx-3">
//             {listings.length > 0 ? (listings?.map((item) => (
//               <Link
//                 to={`/dashboard/listings/${item.id}`}
//                 style={{ filter: "drop-shadow(0,0,34 rgba(0,0,0,0.11))" }}
//                 className="w-6/12 mt-3 xl:mt-[15px] xl:w-3/12 px-3 filter !drop-shadow-lg"
//                 key={item.id}
//               >
//                 <div className="h-full">
//                   <div className="h-full  relative group flex flex-col">
//                     <div className="relative">
//                       <img
//                         className="w-full group-hover:opacity-70 h-[128px] object-cover"
//                         src={item.images?.[0]}
//                         alt="Listing"
//                       />
//                       <button className="absolute bg-[#6C4DEF] z-20 text-white py-[2px] px-2 rounded-tr-[20px] rounded-br-[20px] bottom-[10px] transition-opacity duration-300 text-xs">
//                         {item?.categoryName}
//                       </button>
//                     </div>

//                     <div className="p-2.5 bg-white flex-grow">
//                       <div className="flex  justify-between items-center">
//                         <p className="font-normal text-base text-black">
//                           {item.title}
//                         </p>
//                         <p className="font-normal text-[12px] text-[rgba(0, 0, 0, 0.6)]">
//                           Feb 12
//                         </p>
//                       </div>

//                       <div className="flex justify-between mt-[5px]">
//                         <div>
//                           <p className="font-semibold text-[18px]">
//                             ₹ {item.price}
//                           </p>
//                         </div>
//                         <div className="group-hover:hidden transition-opacity duration-300">
//                           <button className="py-1">
//                             {item.blockStatus.isBlocked ? (
//                               <img src={disable_img} alt="disable_img" />
//                             ) : (
//                               <span className="text-xs font-normal text-[#0DA800] hover:opacity-100 opacity-100">
//                                 <img src={enable_img} alt="enable_img" />
//                               </span>
//                             )}
//                           </button>
//                         </div>
//                         <div className="hidden py-[3px] group-hover:block  transition-opacity duration-300">
//                           <button
//                             onClick={(e) =>
//                               handleBlock(e, item.id, item.blockStatus)
//                             }
//                           >
//                             {item.blockStatus.isBlocked ? (
//                               <span className="text-sm font-normal text-[#0DA800] hover:opacity-100 opacity-100">
//                                 <p>Enable</p>
//                               </span>
//                             ) : (
//                               <span className="text-sm font-normal text-[#a81400] hover:opacity-100 opacity-100">
//                                 <p>Disable</p>
//                               </span>
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       <p className="font-normal text-[14px] text-[#00000099] mt-1">
//                         {truncateText(item.description, 100)}
//                       </p>
//                       <div className="flex items-center justify-between gap-1 mt-2">
//                         <div>
//                           <p className="font-normal text-[#00000099] text-[12px]">
//                             Hisar, Haryana
//                           </p>
//                         </div>
//                         <div className="flex gap-3 items-center bg-[#FFA5001A] rounded-[50px] py-[2px] px-[5px]">
//                           <RatingStarIcon />
//                           <h3 className="text-[#000F02] text-[10px] font-normal">
//                             {item.rating}
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))
//             ) : (
//               <p className="text-center text-gray-500 text-lg mt-5 w-full">No Data Found</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* REFFERAL LIST */}

//       <div className="mt-[30px]">
//         <div className="flex justify-between space-x-4 mb-4 border-b">
//           <button
//             onClick={() => setActiveTab("withdrawals")}
//             className={`px-4 py-2 capitalize border-b-2 border-blue-600 text-blue-600 font-semibold `}
//           >
//            Refferal List
//           </button>
//           <button
//             onClick={() => setActiveTab("withdrawals")}
//             className={`px-4 py-2 capitalize   text-blue-600 font-semibold `}
//           >
//             Total Refferal Amount : {totalRefferAmount}
//           </button>
          
//         </div>

  
//         <div className="bg-white shadow rounded-lg overflow-x-auto">
          
     

//           {user.referralList.length > 0 ? (
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refferal Code</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">plan</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                 {user.referralList.map((withdrawal, index) => {
//                   return (
//                     <tr key={withdrawal.id} className="border-t">
//                       <td className="px-4 py-2">{index + 1}</td>
//                       <td className="px-4 py-2 font-semibold">{withdrawal.name}</td>
//                       <td className="px-4 py-2">{withdrawal.referralCode}</td>
//                       <td className="px-4 py-2">{withdrawal.amount}</td>
//                       <td className="px-4 py-2">{withdrawal.isSubscribe == true ? "Premium":"Free"}</td>
//                       <td className="px-4 py-2">
//                         {withdrawal.isSubscribe
//                           ? withdrawal.amount == 50
//                             ? "6 Months"
//                             : "1 Year"
//                           : "—"}
//                       </td>
                     
//                       <td className="px-4 py-2 text-sm text-gray-600">
//                         {formatDate(withdrawal.time)}
//                       </td>
//                     </tr>
//                   )
//                 })}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <p className="text-lg">No Refferal History found</p>
//               </div>
//             )}
//           </div>
       

     
//       </div>

      
      
      
 

//       {isImageModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//           <div className="relative max-w-4xl max-h-screen p-4">
//             <button
//               onClick={() => setIsImageModalOpen(false)}
//               className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               &times;
//             </button>
//             <img
//               src={user?.image || MechanicImage}
//               alt="Profile Preview"
//               className="max-w-full max-h-screen object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {previewImage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//           <div className="relative max-w-4xl max-h-screen p-4">
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               &times;
//             </button>
//             <img
//               src={previewImage}
//               alt="Image Preview"
//               className="max-w-full max-h-screen object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {showPopupDisable && (
//         <DisableProviderPopUp
//           handlePopupDisable={handlePopupDisable}
//           userId={id}
//           currentStatus={user?.accountStatus?.isBlocked ? "blocked" : "active"}
//           refetchUser={fetchData}
//           setUsers={setUsers}
//         />
//       )}

//       {showDenialPopup && (
//         <DenialReasonPopUp
//           handleClose={handleDenialClose}
//           userId={id}
//           type={denialType}
//           itemId={denialType === "business" ? userbusinessDetails?.businessId : denialType === "listing" ? null : id}
//           currentStatus={user?.status}
//           refetchData={denialType === "business" ? fetchBusinessData : denialType === "rider" ? fetchRiderData : undefined}
//           setUsers={setUsers}
//           onApprove={approveUser}
//           onDeny={denyUser}
//         />
//       )}

//       {deleteUserPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl w-96 mx-4 p-6">
//             {/* Header with Warning Icon */}
//             <div className="flex items-center mb-4">
//               <div className="bg-red-100 p-3 rounded-full mr-3">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
//                 <p className="text-sm text-gray-500">This action cannot be undone</p>
//               </div>
//             </div>

//             {/* Warning Message */}
//             <div className="mb-6">
//               <p className="text-gray-700 mb-3">
//                 Are you sure you want to delete <span className="font-semibold"></span>?
//               </p>
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                 <p className="text-sm text-red-700 font-medium">
//                   ⚠️ This will permanently delete:
//                 </p>
//                 <ul className="text-xs text-red-600 mt-1 list-disc list-inside">
//                   <li>User profile and account</li>
//                   <li>All ride history and requests</li>
//                   <li>Chat messages and notifications</li>
//                   <li>All related records</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteUserPopup(false)}
//                 className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeleteUser(user.id)}
//                 className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
//               >
//                 Delete User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserDetails;





import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  EmailIcon,
  LocationIcon,
  PhoneIcon,
  RatingStarIcon,
  DisableRedicon,
  EnableRedIcon,
} from "../../assets/icon/Icons";
import MechanicImage from "../../assets/png/user-profile-icon.png";
import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
import DenialReasonPopUp from "../../Components/Popups/DenialReasonPopUp";
import disable_img from "../../assets/png/disable_img.png";
import enable_img from "../../assets/png/enable_img.png";
import { useListingContext } from "../../store/ListingContext";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";
import { truncateText } from "../../utility/wordTruncate";
import { useCustomerContext } from "../../store/CustomerContext";
import { useUserContext } from "../../store/UserContext";
import CustomConfirmationPopup from "../../Components/Common/CustomConfirmationPopup";

function UserDetails() {
  const navigate = useNavigate();
  const { setUsers, loading, setLoading } = useCustomerContext();
  const { sendNotification, setUserName } = useUserContext();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPopupDisable, setShowPopupDisable] = useState(false);
  const [showDenialPopup, setShowDenialPopup] = useState(false);
  const [denialType, setDenialType] = useState("");
  const [listings, setListings] = useState([]);
  const [riderDetails, setRiderDetails] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [userbusinessDetails, setUserBusinessDetails] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [deleteUserPopup, setDeleteUserPopup] = useState(false);
  const [totalRefferAmount, setTotalRefferAmount] = useState(0);

  // New states for custom confirmation popups
  const [showFreeProConfirm, setShowFreeProConfirm] = useState(false);
  const [showListingUnblockConfirm, setShowListingUnblockConfirm] = useState(false);
  const [showBusinessApproveConfirm, setShowBusinessApproveConfirm] = useState(false);
  const [showRiderApproveConfirm, setShowRiderApproveConfirm] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { fetchlisting } = useListingContext();

  const accessToken = user?.msgToken;
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

  const fetchData = async () => {
    setLoading(true);

    // 🔁 Step 1: Supabase se fresh user data lo
    const { data: freshUser, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
      return;
    }

    setUser(freshUser);
    setUserName(freshUser?.firstName);

    // 🔁 Step 2: Listing fetch karo
    const listingVal = await fetchlisting();
    const filteredListings = listingVal?.filter(
      (item) => item?.user_detail?.id === id
    );
    setListings(filteredListings || []);

    setLoading(false);
  };

  const fetchBusinessData = async () => {
    setLoading(true);

    try {
      // Step 1: Directly get full data from BusinessDetailsView
      const { data: businessUser } = await supabase
        .from("BusinessDetailsView")
        .select("*")
        .eq("userId", id)
        .single();

      // Step 2: Set user & context
      setUserBusinessDetails(businessUser);

      // Step 3: Listings fetch karo
      const listingVal = await fetchlisting();
      const filteredListings = listingVal?.filter(
        (item) => item?.user_detail?.id === id
      );
      setListings(filteredListings || []);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderData = async () => {
    try {
      const { data: riderData, error } = await supabase
        .from("RiderDetailsView")
        .select("*")
        .eq("userId", id)
        .single();

      if (error) {
        console.error("Error fetching rider details:", error);
      } else {
        setRiderDetails(riderData);
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching rider:", err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data: withdrawalData, error } = await supabase
        .from("Withdraw")
        .select("*")
        .eq("userId", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching withdrawals:", error);
      } else {
        setWithdrawals(withdrawalData || []);
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching withdrawals:", err);
    }
  };

  // Run it on mount
  useEffect(() => {
    fetchData();
    fetchBusinessData();
    fetchRiderData();
    fetchWithdrawals();
  }, [id]);

  useEffect(() => {
    if (user?.referralList?.length > 0) {
      const total = user.referralList.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0
      );
      setTotalRefferAmount(total);
    } else {
      setTotalRefferAmount(0);
    }
  }, [user?.referralList]);

  // Handle disable/enable provider popup
  const handlePopupDisable = () => {
    setShowPopupDisable(!showPopupDisable);
  };

  // Handle block/unblock listing - UPDATED
  const handleBlock = async (e, listing) => {
    e.preventDefault();

    // If we're blocking (not unblocking), show denial popup
    if (!listing.blockStatus.isBlocked) {
      setDenialType("listing");
      setShowDenialPopup(true);
      return;
    }

    // For unblocking, show custom confirmation popup
    setCurrentListing(listing);
    setShowListingUnblockConfirm(true);
  };

  // Handle listing unblock confirmation
  const handleConfirmListingUnblock = async () => {
    if (!currentListing) return;

    setIsProcessing(true);
    try {
      const updatedBlockStatus = {
        isBlocked: false,
        reason: "",
        blockedBy: "admin",
      };

      const { error } = await supabase
        .from("ServiceListings")
        .update({ blockStatus: updatedBlockStatus })
        .eq("id", currentListing.id);

      if (!error) {
        setListings((prev) =>
          prev.map((item) =>
            item.id === currentListing.id
              ? { ...item, blockStatus: updatedBlockStatus }
              : item
          )
        );
        toast.success("Listing unblocked successfully");
      } else {
        console.error("Error updating block status:", error);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
      setShowListingUnblockConfirm(false);
      setCurrentListing(null);
    }
  };

  // Handle free pro subscription
  const handleGiveFreePro = async () => {
    setShowFreeProConfirm(true);
  };

  // Handle free pro confirmation
  const handleConfirmFreePro = async () => {
    setIsProcessing(true);
    try {
      // Calculate expiry date (1 year from now)
      const currentTime = Date.now();
      const expiryTime = currentTime + 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

      const subscriptionData = {
        plan: "1 Year",
        time: currentTime,
        validTill: expiryTime,
        isSubscribe: true,
        subscribeByAdmin: true,
      };

      // Update user's subscription in the database
      const { error } = await supabase
        .from("Users")
        .update({
          subscription: subscriptionData
        })
        .eq("id", id);

      if (error) {
        toast.error("Failed to give free subscription");
        console.error("Subscription update error:", error);
      } else {
        toast.success("Free Pro subscription given successfully for 1 year!");

        // Update local state
        setUser(prev => ({
          ...prev,
          subscription: subscriptionData
        }));

        // Send notification to user
        if (accessToken) {
          sendNotification({
            token: accessToken,
            userId: user.id,
            title: `🎉 Congratulations! Free Pro Subscription`,
            body: `You have received a free Pro subscription for 1 year!`,
          });
        }

        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error("Error giving free subscription:", err);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
      setShowFreeProConfirm(false);
    }
  };

  // Check if user doesn't have subscription - updated for your data structure
  const hasNoSubscription = !user?.subscription ||
    user?.subscription === null ||
    !user?.subscription?.isSubscribe ||
    user?.subscription?.plan === null;

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isActive = user?.accountStatus?.isBlocked !== true;

  const handleBusinessDenial = () => {
    setDenialType("business");
    setShowDenialPopup(true);
  };

  const handleRiderDenial = () => {
    setDenialType("rider");
    setShowDenialPopup(true);
  };

  const handleDenialClose = () => {
    setShowDenialPopup(false);
    setDenialType("");
  };

  // Handle business approval - UPDATED
  const handleBusinessApprove = () => {
    setShowBusinessApproveConfirm(true);
  };

  const handleConfirmBusinessApprove = async () => {
    setIsProcessing(true);
    try {
      if (!userbusinessDetails || !userbusinessDetails?.businessId) {
        toast.error("User data not found or invalid Business ID");
        return;
      }

      const { error } = await supabase
        .from("BusinessDetailsView")
        .update({ status: "Approved" })
        .eq("businessId", userbusinessDetails.businessId)
        .select();

      if (error) {
        toast.error("Failed to update business status");
      } else {
        toast.success("Business status updated successfully");
        setUserBusinessDetails((prev) => ({ ...prev, status: "Approved" }));
        setUser((prevUser) => ({
          ...prevUser,
          businessDetail: { ...prevUser.businessDetail, status: "Approved" },
        }));
        setUsers((prevUser) => ({
          ...prevUser,
          businessDetail: { ...prevUser.businessDetail, status: "Approved" },
        }));
        sendNotification({
          token: accessToken,
          userId: user.id,
          title: `Congratulations! Business Approved`,
          body: `Your business profile has been Approved successfully.`,
        });
      }
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
      setShowBusinessApproveConfirm(false);
    }
  };

  // Handle rider approval - UPDATED
  const handleRiderApprove = () => {
    setShowRiderApproveConfirm(true);
  };

  const handleConfirmRiderApprove = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("RiderDetailsView")
        .update({ status: "Active" })
        .eq("userId", id);

      if (error) {
        toast.error("Failed to update rider status");
      } else {
        setRiderDetails(prev => ({ ...prev, status: "Active" }));
        toast.success(`Rider approved successfully`);

        // Update local state if setUsers is provided
        if (setUsers) {
          setUsers((prevUsers) =>
            Array.isArray(prevUsers)
              ? prevUsers.map((u) =>
                u.id === id
                  ? {
                    ...u,
                    riderDetails: {
                      ...u.riderDetails,
                      status: "Active"
                    }
                  }
                  : u
              )
              : prevUsers
          );
        }
        sendNotification({
          token: accessToken,
          userId: user.id,
          title: `Congratulations! Rider Approved`,
          body: `Your rider profile has been approved successfully please go online to accept rides`,
        });
      }
    } catch (err) {
      console.error("Error updating rider status:", err);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
      setShowRiderApproveConfirm(false);
    }
  };

  // Add this function for instant UI update after denial
  const denyUser = async (reason) => {
    if (!userbusinessDetails || !userbusinessDetails?.businessId) {
      toast.error("User data not found or invalid Business ID");

      return;
    }
    try {
      const { error } = await supabase
        .from("BusinessDetailsView")
        .update({ status: "Rejected", rejectedReason: reason })
        .eq("businessId", userbusinessDetails.businessId)
        .select();
      if (error) {
        toast.error("Failed to update business status");
      } else {
        toast.success("Business status updated successfully");
        setUserBusinessDetails((prev) => ({
          ...prev,
          status: "Rejected",
          rejectedReason: reason,
        }));
        setUser((prevUser) => ({
          ...prevUser,
          businessDetail: {
            ...prevUser.businessDetail,
            status: "Rejected",
            rejectedReason: reason,
          },
        }));
        setUsers((prevUser) => ({
          ...prevUser,
          businessDetail: {
            ...prevUser.businessDetail,
            status: "Rejected",
            rejectedReason: reason,
          },
        }));
        sendNotification({
          token: accessToken,
          userId: user.id,
          title: `Sorry! Business Denied`,
          body: `Your business profile has been Denied`,
        });
      }
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteUser = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(
        "https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        console.log("✅ User deleted:", data);
        toast.success("User deleted successfully");
        navigate("/usersList");
      } else {
        console.error("❌ Delete failed:", data.error || data);
        toast.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred while deleting user");
    } finally {
      setIsProcessing(false);
      setDeleteUserPopup(false);
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-end">
        <button
          onClick={handlePopupDisable}
          className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
        >
          {isActive ? (
            <>
              <DisableRedicon />
              <span className="text-black font-normal text-base">Block</span>
            </>
          ) : (
            <>
              <EnableRedIcon />
              <span className="text-black font-normal text-base">Unblock</span>
            </>
          )}
        </button>

        {/* Get Free Pro Button - Only show if user has no subscription */}
        {hasNoSubscription && (
          <button
            onClick={handleGiveFreePro}
            className="ms-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-5 py-2.5 font-medium text-base hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Get Free Pro
          </button>
        )}

        <button
          onClick={() => setDeleteUserPopup(true)}
          className="ms-3 flex items-center gap-2 bg-[#d80f0f] text-white rounded-lg px-5 py-2.5 font-medium text-base hover:bg-red-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete User
        </button>
      </div>

      <div className="lg:flex mt-[30px]">
        <div className="w-full md:w-7/12 lg:w-[399px] xl:pe-2.5 lg:flex">
          <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] flex-grow flex flex-col">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                onClick={() => setIsImageModalOpen(true)}
                className="w-[78px] h-[78px] rounded-full object-cover cursor-pointer"
                src={user?.image || MechanicImage}
                alt="user"
              />
              <h1 className="font-medium lg:text-base xl:text-lg text-white mt-2.5 text-center">
                {user?.firstName} {user?.lastName}
              </h1>
              <h2 className="text-sm font-normal text-white mt-1 text-center">
                {user?.category}
              </h2>
              {/* Show subscription status */}
              <div className="mt-2">
                {hasNoSubscription ? (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    No Subscription
                  </span>
                ) : (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {user?.subscription?.plan} Member
                  </span>
                )}
              </div>
            </div>

            {/* Information Tiles */}
            <div className="grid grid-cols-1 gap-3">
              {/* Phone Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <PhoneIcon />
                  <h3 className="text-sm font-normal text-white">
                    {user?.mobile_number || "N/A"}
                  </h3>
                </div>
              </div>

              {/* Email Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <EmailIcon />
                  <h3 className="text-sm font-normal text-white">
                    {user?.useremail || "N/A"}
                  </h3>
                </div>
              </div>

              {/* Location Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <LocationIcon />
                  <h3 className="text-sm font-normal text-white">
                    {user?.address?.city && user?.address?.state
                      ? `${user.address.city}, ${user.address.state}`
                      : "N/A"}
                  </h3>
                </div>
              </div>

              {/* Subscription Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex justify-between items-center gap-2.5">
                  <h3 className="text-sm font-normal text-white">
                    Subscription:{" "}
                    {user?.subscription == null
                      ? "N/A"
                      : `Yes / ${user?.subscription?.plan} / ${new Date(
                        user?.subscription?.validTill
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}`}
                  </h3>
                </div>
              </div>

              {/* Balance Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-normal text-white">
                    Balance: ₹{user?.balance || "0"}
                  </h3>
                </div>
              </div>

              {/* UPI Tile */}
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-normal text-white">
                    UPI:{" "}
                    {user?.upi_id === "null"
                      ? "N/A"
                      : user?.upi_id || "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details for Seller */}
        {user?.userType === "Seller" && (
          <div className="w-full md:w-7/12 lg:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
            <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                  Business details
                </p>

                {userbusinessDetails?.status === "Pending" ? (
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={handleBusinessApprove}
                      className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-green-500 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleBusinessDenial}
                      className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-red-500 text-white"
                    >
                      Deny
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${userbusinessDetails?.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {userbusinessDetails?.status}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Business Name:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {userbusinessDetails?.businessName}
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Categories:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {userbusinessDetails?.categories?.categoryName} &nbsp;(
                    {userbusinessDetails?.categories?.businesSubcategory
                      ?.subCategoryName ||
                      userbusinessDetails?.categories?.businessSubcategory
                        ?.subCategoryName ||
                      "N/A"}
                    )
                  </h2>
                </div>
              </div>
              {/* Business Detail Image Section */}
              {userbusinessDetails?.businessImage &&
                userbusinessDetails.businessImage.length > 0 && (
                  <div className="mt-6">
                    <h2 className="font-medium text-sm xl:text-base text-black mb-3">
                      Business Detail Images:
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {userbusinessDetails.businessImage.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`Business Detail ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPreviewImage(img)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/fallback-image.png";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Business Images Section */}
              {userbusinessDetails?.businessImages &&
                userbusinessDetails.businessImages.length > 0 && (
                  <div className="mt-6">
                    <h2 className="font-medium text-sm xl:text-base text-black mb-3">
                      Business Images:
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {userbusinessDetails.businessImages.map(
                        (image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Business ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setPreviewImage(image)}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback-image.png";
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Business Documents Section */}
              {userbusinessDetails?.businessDocuments &&
                userbusinessDetails.businessDocuments.length > 0 && (
                  <div className="mt-12">
                    <h2 className="font-medium text-sm xl:text-base text-black mb-3">
                      Business Documents:
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {userbusinessDetails.businessDocuments.map(
                        (document, index) => (
                          <div key={index} className="relative">
                            <img
                              src={document}
                              alt={`Document ${index + 1}`}
                              className="object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setPreviewImage(document)}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback-image.png";
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Rider Details for Rider */}
        {user?.userType === "Rider" && riderDetails && (
          <div className="w-full lg:w-7/12 xl:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
            <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                  Rider Details
                </p>

                {riderDetails?.status === "Pending" ? (
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={handleRiderApprove}
                      className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-green-500 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleRiderDenial}
                      className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-red-500 text-white"
                    >
                      Deny
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${riderDetails?.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : riderDetails?.status === "Inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {riderDetails?.status}
                  </span>
                )}
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Vehicle Type:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal capitalize">
                    {riderDetails?.vehicleType}
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Vehicle Number:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {riderDetails?.vehicleRegistrationNumber}
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    License Number:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {riderDetails?.drivingLicenseNumber}
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Experience:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {riderDetails?.drivingExperience} years
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Offer Parcel:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {riderDetails?.offerParcel ? "Yes" : "No"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Created At:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {formatDate(riderDetails?.created_at)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="mt-[30px]">
        <div className="flex space-x-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 capitalize border-b-2 ${activeTab === "withdrawals"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
          >
            Withdraw Transactions
          </button>
          {user?.userType === "Seller" && (
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 capitalize border-b-2 ${activeTab === "listings"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
            >
              Posted Listing
            </button>
          )}
        </div>

        {/* Withdrawal Transactions Tab */}
        {activeTab === "withdrawals" && (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            {withdrawals.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      S.No
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      UPI ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal, index) => (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-semibold">
                        ₹{withdrawal.amount}
                      </td>
                      <td className="px-4 py-2">{withdrawal.upi_id}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${withdrawal.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : withdrawal.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {formatDate(withdrawal.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No withdrawal transactions found</p>
              </div>
            )}
          </div>
        )}

        {/* Posted Listing Tab */}
        {activeTab === "listings" && user?.userType === "Seller" && (
          <div className="flex flex-row flex-wrap -mx-3">
            {listings.length > 0 ? (
              listings?.map((item) => (
                <Link
                  to={`/dashboard/listings/${item.id}`}
                  style={{ filter: "drop-shadow(0,0,34 rgba(0,0,0,0.11))" }}
                  className="w-6/12 mt-3 xl:mt-[15px] xl:w-3/12 px-3 filter !drop-shadow-lg"
                  key={item.id}
                >
                  <div className="h-full">
                    <div className="h-full  relative group flex flex-col">
                      <div className="relative">
                        <img
                          className="w-full group-hover:opacity-70 h-[128px] object-cover"
                          src={item.images?.[0]}
                          alt="Listing"
                        />
                        <button className="absolute bg-[#6C4DEF] z-20 text-white py-[2px] px-2 rounded-tr-[20px] rounded-br-[20px] bottom-[10px] transition-opacity duration-300 text-xs">
                          {item?.categoryName}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white flex-grow">
                        <div className="flex  justify-between items-center">
                          <p className="font-normal text-base text-black">
                            {item.title}
                          </p>
                          <p className="font-normal text-[12px] text-[rgba(0, 0, 0, 0.6)]">
                            Feb 12
                          </p>
                        </div>

                        <div className="flex justify-between mt-[5px]">
                          <div>
                            <p className="font-semibold text-[18px]">
                              ₹ {item.price}
                            </p>
                          </div>
                          <div className="group-hover:hidden transition-opacity duration-300">
                            <button className="py-1">
                              {item.blockStatus.isBlocked ? (
                                <img src={disable_img} alt="disable_img" />
                              ) : (
                                <span className="text-xs font-normal text-[#0DA800] hover:opacity-100 opacity-100">
                                  <img src={enable_img} alt="enable_img" />
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="hidden py-[3px] group-hover:block  transition-opacity duration-300">
                            <button
                              onClick={(e) =>
                                handleBlock(e, item.id, item.blockStatus)
                              }
                            >
                              {item.blockStatus.isBlocked ? (
                                <span className="text-sm font-normal text-[#0DA800] hover:opacity-100 opacity-100">
                                  <p>Enable</p>
                                </span>
                              ) : (
                                <span className="text-sm font-normal text-[#a81400] hover:opacity-100 opacity-100">
                                  <p>Disable</p>
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="font-normal text-[14px] text-[#00000099] mt-1">
                          {truncateText(item.description, 100)}
                        </p>
                        <div className="flex items-center justify-between gap-1 mt-2">
                          <div>
                            <p className="font-normal text-[#00000099] text-[12px]">
                              Hisar, Haryana
                            </p>
                          </div>
                          <div className="flex gap-3 items-center bg-[#FFA5001A] rounded-[50px] py-[2px] px-[5px]">
                            <RatingStarIcon />
                            <h3 className="text-[#000F02] text-[10px] font-normal">
                              {item.rating}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 text-lg mt-5 w-full">
                No Data Found
              </p>
            )}
          </div>
        )}
      </div>

      {/* REFFERAL LIST */}
      <div className="mt-[30px]">
        <div className="flex justify-between space-x-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 capitalize border-b-2 border-blue-600 text-blue-600 font-semibold`}
          >
            Refferal List
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 capitalize   text-blue-600 font-semibold`}
          >
            Total Refferal Amount : {totalRefferAmount}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {user.referralList.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Refferal Code
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    plan
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.referralList.map((withdrawal, index) => {
                  return (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-semibold">
                        {withdrawal.name}
                      </td>
                      <td className="px-4 py-2">{withdrawal.referralCode}</td>
                      <td className="px-4 py-2">{withdrawal.amount}</td>
                      <td className="px-4 py-2">
                        {withdrawal.isSubscribe == true ? "Premium" : "Free"}
                      </td>
                      <td className="px-4 py-2">
                        {withdrawal.isSubscribe
                          ? withdrawal.amount == 50
                            ? "6 Months"
                            : "1 Year"
                          : "—"}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-600">
                        {formatDate(withdrawal.time)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No Refferal History found</p>
            </div>
          )}
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              &times;
            </button>
            <img
              src={user?.image || MechanicImage}
              alt="Profile Preview"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              &times;
            </button>
            <img
              src={previewImage}
              alt="Image Preview"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      {showPopupDisable && (
        <DisableProviderPopUp
          handlePopupDisable={handlePopupDisable}
          userId={id}
          currentStatus={user?.accountStatus?.isBlocked ? "blocked" : "active"}
          refetchUser={fetchData}
          setUsers={setUsers}
        />
      )}

      {showDenialPopup && (
        <DenialReasonPopUp
          handleClose={handleDenialClose}
          userId={id}
          type={denialType}
          itemId={
            denialType === "business"
              ? userbusinessDetails?.businessId
              : denialType === "listing"
                ? null
                : id
          }
          currentStatus={user?.status}
          refetchData={
            denialType === "business"
              ? fetchBusinessData
              : denialType === "rider"
                ? fetchRiderData
                : undefined
          }
          setUsers={setUsers}
          onApprove={denialType === "business" ? handleConfirmBusinessApprove : handleConfirmRiderApprove}
          onDeny={denyUser}
        />
      )}

      {/* Custom Confirmation Popups */}
      <CustomConfirmationPopup
        isOpen={showFreeProConfirm}
        onClose={() => setShowFreeProConfirm(false)}
        onConfirm={handleConfirmFreePro}
        title="Give Free Pro Subscription"
        message={`Are you sure you want to give a free 1-year Pro subscription to ${user?.firstName} ${user?.lastName}?`}
        confirmText="Give Free Pro"
        type="success"
        isLoading={isProcessing}
      />

      <CustomConfirmationPopup
        isOpen={showListingUnblockConfirm}
        onClose={() => {
          setShowListingUnblockConfirm(false);
          setCurrentListing(null);
        }}
        onConfirm={handleConfirmListingUnblock}
        title="Unblock Listing"
        message={`Are you sure you want to unblock this listing "${currentListing?.title}"?`}
        confirmText="Unblock"
        type="info"
        isLoading={isProcessing}
      />

      <CustomConfirmationPopup
        isOpen={showBusinessApproveConfirm}
        onClose={() => setShowBusinessApproveConfirm(false)}
        onConfirm={handleConfirmBusinessApprove}
        title="Approve Business"
        message={`Are you sure you want to approve ${user?.firstName}'s business "${userbusinessDetails?.businessName}"?`}
        confirmText="Approve Business"
        type="success"
        isLoading={isProcessing}
      />

      <CustomConfirmationPopup
        isOpen={showRiderApproveConfirm}
        onClose={() => setShowRiderApproveConfirm(false)}
        onConfirm={handleConfirmRiderApprove}
        title="Approve Rider"
        message={`Are you sure you want to approve ${user?.firstName} as a rider?`}
        confirmText="Approve Rider"
        type="success"
        isLoading={isProcessing}
      />

      <CustomConfirmationPopup
        isOpen={deleteUserPopup}
        onClose={() => setDeleteUserPopup(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${user?.firstName} ${user?.lastName}? This action cannot be undone and will permanently delete all user data including:
        • User profile and account
        • All ride history and requests
        • Chat messages and notifications
        • All related records`}
        confirmText="Delete User"
        type="danger"
        isLoading={isProcessing}
      />
    </div>
  );
}

export default UserDetails;