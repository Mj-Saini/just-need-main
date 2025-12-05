// import { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import MechanicImage from "../../assets/png/user-profile-icon.png";
// import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
// import DenialReasonPopUp from "../../Components/Popups/DenialReasonPopUp";
// import { supabase } from "../../store/supabaseCreateClient";
// import { toast } from "react-toastify";
// import { DisableRedicon, EnableRedIcon } from "../../assets/icon/Icons";
// import { useCustomerContext } from "../../store/CustomerContext";
// import { useUserContext } from "../../store/UserContext";

// function RiderDetails() {
//   const navigate = useNavigate();
//   const { users } = useCustomerContext();
//   const { sendNotification } = useUserContext();
//   const { id } = useParams();
//   const [rider, setRider] = useState(null);
//   const [user, setUser] = useState(null); // user object for block/unblock
//   const [showPopupDisable, setShowPopupDisable] = useState(false);
//   const [showDenialPopup, setShowDenialPopup] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [ridingRequests, setRidingRequests] = useState([]);
//   const [message, setMessage] = useState("");
//   const [riderDetailsTab, setRiderDetailsTab] = useState("riderDetails");
//   const [deleteUserPopup, setDeleteUserPopup] = useState(false);
//   const [totalRefferAmount, setTotalRefferAmount] = useState(0)


//   // For rider history
//   const [currentPageRiderHistory, setCurrentPageRiderHistory] = useState(1);
//   const [itemsPerPageRiderHistory] = useState(10);

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

//   // Fetch rider and user data
//   const fetchRiderData = async () => {
//     setLoading(true);
//     try {
//       let { data: RiderDetailsView, error } = await supabase
//         .from('RiderDetailsView')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) {
//         console.error("Error fetching rider:", error);
//         toast.error("Failed to fetch rider details");
//       } else {
//         setRider(RiderDetailsView);
//         // Fetch user for block/unblock
//         if (RiderDetailsView?.userId) {
//           const { data: userData, error: userError } = await supabase
//             .from('Users')
//             .select('*')
//             .eq('id', RiderDetailsView.userId)
//             .single();
//           if (!userError) setUser(userData);
//         }
//       }
//     } catch (err) {
//       console.error("❌ Unexpected error:", err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRiderData();
//   }, [id]);

//   useEffect(() => {
//     if (user?.referralList?.length > 0) {
//       const total = user.referralList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
//       setTotalRefferAmount(total);
//     } else {
//       setTotalRefferAmount(0);
//     }
//   }, [user?.referralList]);

//   async function getRidingRequests() {
//     const { data, error } = await supabase
//       .from("RidingRequest")   // your table name
//       .select("*")             // fetch all columns

//     if (error) {
//       console.error("Error fetching data:", error)
//       return []
//     }

//     setRidingRequests(data);
//     return data
//   }

//   // call function
//   useEffect(() => {
//     getRidingRequests()
//   }, [])

//   const handlePopupDisable = () => {
//     setShowPopupDisable(!showPopupDisable);
//   };


//   // Use user.accountStatus for block/unblock
//   const isBlocked = user?.accountStatus?.isBlocked === true;


//   const matchingRequest = users?.find((req) => req.id === rider?.userId);

//   // console.log(id,"ididd")

//   const handleApprove = async () => {
//     const token = matchingRequest.msgToken;
//     console.log(token, "tokem")
//     try {
//       const { error } = await supabase
//         .from('RiderDetailsView')
//         .update({
//           status: "Approved"
//         })
//         .eq('userId', rider?.userId);

//       if (error) {
//         console.error("Error approving rider:", error);
//         toast.error("Failed to approve rider");
//       } else {
//         setRider(prev => ({
//           ...prev,
//           status: "Approved"
//         }));
//         toast.success("Rider approved successfully!");
//         window.dispatchEvent(new Event('rider-status-updated'));

//         sendNotification({
//           token: token,
//            userId:matchingRequest.id,
//           title: `Congratulations! Rider Approved`,
//           body: `Your rider profile has been approved successfully please go online to accept rides`,

//         });
//       }
//     } catch (err) {
//       console.error("Error approving rider:", err);
//       toast.error("Something went wrong");
//     }
//   };

//   const handleDeny = () => {
//     setShowDenialPopup(true);
//   };

//   const handleDenialClose = (wasDenied) => {
//     setShowDenialPopup(false);
//     if (wasDenied) {
//       window.dispatchEvent(new Event('rider-status-updated'));
//     }
//   };

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setIsImageModalOpen(true);
//   };

//   if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
//   if (!rider) return <div className="flex justify-center items-center h-64">Rider not found</div>;
//   // Rider history pagination
//   const totalPagesRiderHistory = Math.ceil(ridingRequests.length / itemsPerPageRiderHistory);
//   const startIndexRiderHistory = (currentPageRiderHistory - 1) * itemsPerPageRiderHistory;
//   const endIndexRiderHistory = Math.min(startIndexRiderHistory + itemsPerPageRiderHistory, ridingRequests.length);
//   const paginatedRiderHistory = ridingRequests.slice(startIndexRiderHistory, endIndexRiderHistory);

//   const handlePageChangeRiderHistory = (direction) => {
//     if (direction === "next" && currentPageRiderHistory < totalPagesRiderHistory) {
//       setCurrentPageRiderHistory(currentPageRiderHistory + 1);
//     } else if (direction === "prev" && currentPageRiderHistory > 1) {
//       setCurrentPageRiderHistory(currentPageRiderHistory - 1);
//     }
//   };




//   const handleDeleteUser = async (userId) => {
//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await fetch(
//         "https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/delete-user",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo`,
//           },
//           body: JSON.stringify({ userId }),
//         }
//       );

//       const data = await res.json();
//       if (data.success) {
//         setMessage(`✅ ${data.message}`);
//         navigate("/riders");
//         window.location.reload(); 
//       } else {
//         setMessage(`⚠️ Failed: ${data.error || "Unknown error"}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error deleting user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log(user,"users")

//   return (
//     <div className="px-4">
//       {message && (
//         <div className="mb-4 p-2 border rounded bg-gray-100 text-sm">{message}</div>
//       )}
//       {/* Block/Unblock Button - always visible */}
//       <div className="flex items-center justify-end mb-4">
//         <button
//           onClick={handlePopupDisable}
//           className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
//         >
//           {isBlocked ? (
//             <>
//               <EnableRedIcon />
//               <span className="text-black font-normal text-base">Unblock</span>
//             </>
//           ) : (
//             <>
//               <DisableRedicon />
//               <span className="text-black font-normal text-base">Block</span>
//             </>
//           )}
//         </button>
//         <button onClick={() => setDeleteUserPopup(true)} className="ms-3">
//           <span className="bg-[#d80f0f] text-white rounded-lg px-5 py-1.5 font-normal text-base">Delete</span>

//         </button>
//       </div>

//       {/* Full width blue container with profile picture */}
//       <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] w-full flex ">
//         <div className="flex items-center w-1/5">
//           <div className="pe-5 border-e-[1px] border-[#FFFFFF66] w-full flex flex-col items-center">
//             <img
//               onClick={() => openImageModal(rider.licensePhoto)}
//               className="w-[78px] h-[78px] rounded-full object-cover cursor-pointer"
//               src={rider.licensePhoto || MechanicImage}
//               alt="rider"
//             />
//             <h1 className="font-medium lg:text-base xl:text-lg text-white mt-2.5 text-center">
//               Rider
//             </h1>
//             <h2 className="text-sm font-normal text-white mt-1 text-center">
//               {rider.vehicleType}
//             </h2>
//           </div>
//         </div>
//         {/* Rider Details Section */}
//         <div className=" w-4/5">
//           <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7">
//             <div className="flex items-center justify-between">
//               <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                 Rider Details
//               </p>

//               {/* Approve/Deny buttons for pending riders or status display for others */}
//               {rider?.status === "Pending" ? (
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleApprove}
//                     className="bg-green-600 text-white px-4 py-2 rounded-[10px] hover:bg-green-700 transition-colors"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={handleDeny}
//                     className="bg-red-600 text-white px-4 py-2 rounded-[10px] hover:bg-red-700 transition-colors"
//                   >
//                     Deny
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <span
//                     className={`px-3 py-2 rounded-[10px] text-sm font-medium ${rider?.status === "Approved"
//                       ? "bg-green-100 text-green-700 border border-green-300"
//                       : rider?.status === "Rejected"
//                         ? "bg-red-100 text-red-700 border border-red-300"
//                         : "bg-gray-100 text-gray-700 border border-gray-300"
//                       }`}
//                   >
//                     {rider?.status || "Unknown"}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Rider Name:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {user?.firstName} {user?.lastName}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Email:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {user?.useremail}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Phone No:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {user?.mobile_number}
//                 </h2>
//               </div>
//             </div>
//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
               
//                     Subscription: 
                 
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {user?.subscription == null
//                     ? "N/A"
//                     : `Yes / ${user?.subscription?.plan} / ${new Date(
//                       user?.subscription?.validTill
//                     ).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}`}
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Vehicle Type:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal capitalize">
//                   {rider?.vehicleType}
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Vehicle Number:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {rider?.vehicleRegistrationNumber}
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   License Number:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {rider?.drivingLicenseNumber}
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Experience:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {rider?.drivingExperience} years
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Offer Parcel:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {rider?.offerParcel ? "Yes" : "No"}
//                 </h2>
//               </div>
//             </div>

//             <div className="flex items-center mt-3 xl:mt-[15px]">
//               <div className="w-4/12">
//                 <h2 className="font-medium text-sm xl:text-base text-black">
//                   Created At:
//                 </h2>
//               </div>
//               <div className="w-10/12">
//                 <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
//                   {formatDate(rider?.created_at)}
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>



//       </div>

//       <div className="flex items-center  gap-4 mt-10 md:mt-14">
//         <button
//           onClick={() => setRiderDetailsTab('riderDetails')}
//           className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${riderDetailsTab === 'riderDetails' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}
//         >
//           Rider Details
//         </button>
//         <button
//           onClick={() => setRiderDetailsTab('riderHistory')}
//           className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${riderDetailsTab === 'riderHistory' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}
//         >
//           Rider History
//         </button>
//       </div>

//       {riderDetailsTab === 'riderDetails' &&
//         <>
//           {/* License Photo Section */}
//           {rider?.licensePhoto && (
//             <div className="mt-[30px]">
//               <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                 License Photo
//               </p>
//               <div className="mt-4">
//                 <img
//                   onClick={() => openImageModal(rider.licensePhoto)}
//                   src={rider.licensePhoto}
//                   alt="License"
//                   className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                 />
//               </div>
//             </div>
//           )}
//           {/* Rider Photos Section */}
//           {rider?.riderPhoto && rider.riderPhoto.length > 0 && (
//             <div className="mt-[30px]">
//               <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                 Rider Photos
//               </p>
//               <div className="flex flex-wrap gap-4 mt-4">
//                 {rider.riderPhoto.map((photo, index) => (
//                   <img
//                     key={index}
//                     onClick={() => openImageModal(photo)}
//                     src={photo}
//                     alt={`Rider ${index + 1}`}
//                     className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Vehicle Photos Section */}
//           {rider?.vehiclePhoto && rider.vehiclePhoto.length > 0 && (
//             <div className="mt-[30px]">
//               <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
//                 Vehicle Photos
//               </p>
//               <div className="flex flex-wrap gap-4 mt-4">
//                 {rider.vehiclePhoto.map((photo, index) => (
//                   <img
//                     key={index}
//                     onClick={() => openImageModal(photo)}
//                     src={photo}
//                     alt={`Vehicle ${index + 1}`}
//                     className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </>}
//       {riderDetailsTab === 'riderHistory' &&
//         <>
//           <div className="overflow-x-auto mt-5">
//             <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
//               <thead>
//                 <tr className="py-[8px]">
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     S.No
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Rider Name
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Email
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Phone
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Pick Address
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
//                     Drop Address
//                   </th>
//                   {/* <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
//                    Driving License Number
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
//                   Vehicle Type
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
//                  Vehicle Registration Number
//                   </th> */}

//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
//                     Total Fare
//                   </th>
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
//                     Created At
//                   </th>
//                   {/* <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Offer Parcel
//                   </th> */}
//                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
//                     Status
//                   </th>

//                 </tr>
//                 <tr>
//                   <td colSpan="10">
//                     <div className="w-full border border-dashed border-[#00000066]"></div>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-4">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : paginatedRiderHistory.filter(
//                   (item) => item.riderId === user?.id
//                 ).length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-4">
//                       No riders found
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedRiderHistory?.filter(
//                     (item) => item.riderId === user?.id
//                   ).map((rider, index) => {
//                     console.log(rider, "rider data");
//                     return (
//                       <tr key={rider.id}>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           {index + 1}
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
//                           <Link
//                             className="flex gap-2"
//                           // to={`riderDetails/${rider.id}`}
//                           >
//                             {rider.userDetail?.firstName} {rider.userDetail?.lastName}
//                           </Link>
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           {rider.userDetail?.useremail || 'N/A'}
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           {rider.userDetail?.mobile_number || 'N/A'}
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           <span className="capitalize">{rider.pickAddress || 'N/A'}</span>
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           {rider.dropAddress || 'N/A'}
//                         </td>



//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] text-center">
//                           {rider.totalFare || 0}
//                         </td>
//                         <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
//                           {formatDate(rider.created_at)}
//                         </td>
//                         {/* <td>
//                           <div className="flex justify-center items-center">
//                             <span
//                               className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.offerParcel
//                                 ? "text-[#008000] bg-[#00800012]"
//                                 : "text-[#FF0000] bg-[#ff000012]"
//                                 }`}
//                             >
//                               {rider.isParcel ? "Yes" : "No"}
//                             </span>
//                           </div>
//                         </td> */}
//                         <td>
//                           <div className="flex justify-center items-center">
//                             <span
//                               className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.status === "Completed"
//                                 ? "bg-[#00800012] text-[#008000]"
//                                 : rider?.status === "Cancelled" ? "bg-[#F02600]/10 text-[#F02600]" : rider.status === "Approved" ? "bg-[#6C4DEF1A] text-[#6C4DEF]" : "bg-[#ffa50024] text-[#ffa500]"
//                                 }`}
//                             >
//                               {rider?.status || 'N/A'}
//                             </span>
//                           </div>
//                         </td>


//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Pagination */}
//           {paginatedRiderHistory.length > 0 && riderDetailsTab === 'riderHistory' && (
//             <div className="flex justify-between items-center mt-6">
//               <div className="text-sm text-gray-600">
//                 Showing {startIndexRiderHistory + 1} to {endIndexRiderHistory} of {ridingRequests.length} requests
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handlePageChangeRiderHistory("prev")}
//                   disabled={currentPageRiderHistory === 1}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-3 py-1">
//                   Page {currentPageRiderHistory} of {totalPagesRiderHistory}
//                 </span>
//                 <button
//                   onClick={() => handlePageChangeRiderHistory("next")}
//                   disabled={currentPageRiderHistory === totalPagesRiderHistory}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       }


//       <div className="mt-[30px]">
//         <div className="flex justify-between space-x-4 mb-4 border-b">
//           <button
        
//             className={`px-4 py-2 capitalize border-b-2 border-blue-600 text-blue-600 font-semibold `}
//           >
//             Refferal List
//           </button>
//           <button
          
//             className={`px-4 py-2 capitalize   text-blue-600 font-semibold `}
//           >
//             Total Refferal Amount : {totalRefferAmount}
//           </button>

//         </div>


//         <div className="bg-white shadow rounded-lg overflow-x-auto">



//           {user.referralList.length > 0 ? (
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refferal Code</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">plan</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
//                   <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {user.referralList.map((withdrawal, index) => {
//                   return (
//                     <tr key={withdrawal.id} className="border-t">
//                       <td className="px-4 py-2">{index + 1}</td>
//                       <td className="px-4 py-2 font-semibold">{withdrawal.name}</td>
//                       <td className="px-4 py-2">{withdrawal.referralCode}</td>
//                       <td className="px-4 py-2">{withdrawal.amount}</td>
//                       <td className="px-4 py-2">{withdrawal.isSubscribe == true ? "Premium" : "Free"}</td>
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
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//                 <p className="text-lg">No Refferal History found</p>
//             </div>
//           )}
//         </div>



//       </div>


//       {/* Image Modal */}
//       {isImageModalOpen && selectedImage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//           <div className="relative max-w-4xl max-h-screen p-4">
//             <button
//               onClick={() => {
//                 setIsImageModalOpen(false);
//                 setSelectedImage(null);
//               }}
//               className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
//             >
//               &times;
//             </button>
//             <img
//               src={selectedImage}
//               alt="Image Preview"
//               className="max-w-full max-h-screen object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {showPopupDisable && (
//         <DisableProviderPopUp
//           handlePopupDisable={handlePopupDisable}
//           userId={user?.id}
//           currentStatus={isBlocked ? "blocked" : "active"}
//           refetchUser={fetchRiderData}
//         />
//       )}

//       {showDenialPopup && (
//         <DenialReasonPopUp
//           handleClose={() => handleDenialClose(true)}
//           userId={rider?.userId}
//           type="rider"
//           itemId={rider?.userId}
//           currentStatus={rider?.status}
//           refetchData={fetchRiderData}
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

// export default RiderDetails;





import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MechanicImage from "../../assets/png/user-profile-icon.png";
import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
import DenialReasonPopUp from "../../Components/Popups/DenialReasonPopUp";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";
import { DisableRedicon, EnableRedIcon } from "../../assets/icon/Icons";
import { useCustomerContext } from "../../store/CustomerContext";
import { useUserContext } from "../../store/UserContext";
import CustomConfirmationPopup from "../../Components/Common/CustomConfirmationPopup";

function RiderDetails() {
  const navigate = useNavigate();
  const { users } = useCustomerContext();
  const { sendNotification } = useUserContext();
  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [user, setUser] = useState(null);
  const [showPopupDisable, setShowPopupDisable] = useState(false);
  const [showDenialPopup, setShowDenialPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ridingRequests, setRidingRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [riderDetailsTab, setRiderDetailsTab] = useState("riderDetails");
  const [deleteUserPopup, setDeleteUserPopup] = useState(false);
  const [totalRefferAmount, setTotalRefferAmount] = useState(0);

  // New states for custom confirmation popups
  const [showFreeProConfirm, setShowFreeProConfirm] = useState(false);
  const [showRiderApproveConfirm, setShowRiderApproveConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // For rider history
  const [currentPageRiderHistory, setCurrentPageRiderHistory] = useState(1);
  const [itemsPerPageRiderHistory] = useState(10);

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

  // Fetch rider and user data
  const fetchRiderData = async () => {
    setLoading(true);
    try {
      let { data: RiderDetailsView, error } = await supabase
        .from('RiderDetailsView')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching rider:", error);
        toast.error("Failed to fetch rider details");
      } else {
        setRider(RiderDetailsView);
        // Fetch user for block/unblock
        if (RiderDetailsView?.userId) {
          const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('*')
            .eq('id', RiderDetailsView.userId)
            .single();
          if (!userError) setUser(userData);
        }
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [id]);

  useEffect(() => {
    if (user?.referralList?.length > 0) {
      const total = user.referralList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      setTotalRefferAmount(total);
    } else {
      setTotalRefferAmount(0);
    }
  }, [user?.referralList]);

  async function getRidingRequests() {
    const { data, error } = await supabase
      .from("RidingRequest")
      .select("*")

    if (error) {
      console.error("Error fetching data:", error)
      return []
    }

    setRidingRequests(data);
    return data
  }

  useEffect(() => {
    getRidingRequests()
  }, [])

  const handlePopupDisable = () => {
    setShowPopupDisable(!showPopupDisable);
  };

  // Check if user doesn't have subscription
  const hasNoSubscription = !user?.subscription ||
    user?.subscription === null ||
    !user?.subscription?.isSubscribe ||
    user?.subscription?.plan === null;

  const isBlocked = user?.accountStatus?.isBlocked === true;

  const matchingRequest = users?.find((req) => req.id === rider?.userId);

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
        .eq("id", user?.id);

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
        if (user?.msgToken) {
          sendNotification({
            token: user.msgToken,
            userId: user.id,
            title: `🎉 Congratulations! Free Pro Subscription`,
            body: `You have received a free Pro subscription for 1 year!`,
          });
        }

        // Refresh data
        fetchRiderData();
      }
    } catch (err) {
      console.error("Error giving free subscription:", err);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
      setShowFreeProConfirm(false);
    }
  };

  // Handle rider approval
  const handleRiderApprove = () => {
    setShowRiderApproveConfirm(true);
  };

  const handleConfirmRiderApprove = async () => {
    setIsProcessing(true);
    try {
      const token = matchingRequest?.msgToken;

      const { error } = await supabase
        .from('RiderDetailsView')
        .update({
          status: "Approved"
        })
        .eq('userId', rider?.userId);

      if (error) {
        console.error("Error approving rider:", error);
        toast.error("Failed to approve rider");
      } else {
        setRider(prev => ({
          ...prev,
          status: "Approved"
        }));
        toast.success("Rider approved successfully!");
        window.dispatchEvent(new Event('rider-status-updated'));

        if (token) {
          sendNotification({
            token: token,
            userId: matchingRequest.id,
            title: `Congratulations! Rider Approved`,
            body: `Your rider profile has been approved successfully please go online to accept rides`,
          });
        }
      }
    } catch (err) {
      console.error("Error approving rider:", err);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
      setShowRiderApproveConfirm(false);
    }
  };

  const handleDeny = () => {
    setShowDenialPopup(true);
  };

  const handleDenialClose = (wasDenied) => {
    setShowDenialPopup(false);
    if (wasDenied) {
      window.dispatchEvent(new Event('rider-status-updated'));
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!rider) return <div className="flex justify-center items-center h-64">Rider not found</div>;

  // Rider history pagination
  const totalPagesRiderHistory = Math.ceil(ridingRequests.length / itemsPerPageRiderHistory);
  const startIndexRiderHistory = (currentPageRiderHistory - 1) * itemsPerPageRiderHistory;
  const endIndexRiderHistory = Math.min(startIndexRiderHistory + itemsPerPageRiderHistory, ridingRequests.length);
  const paginatedRiderHistory = ridingRequests.slice(startIndexRiderHistory, endIndexRiderHistory);

  const handlePageChangeRiderHistory = (direction) => {
    if (direction === "next" && currentPageRiderHistory < totalPagesRiderHistory) {
      setCurrentPageRiderHistory(currentPageRiderHistory + 1);
    } else if (direction === "prev" && currentPageRiderHistory > 1) {
      setCurrentPageRiderHistory(currentPageRiderHistory - 1);
    }
  };

  const handleDeleteUser = async () => {
    setIsProcessing(true);
    try {
      setMessage("");

      const res = await fetch(
        "https://qmxzutndbzkpccffzoxy.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHp1dG5kYnprcGNjZmZ6b3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc2ODYwNSwiZXhwIjoyMDU1MzQ0NjA1fQ.MH9YsqO9lwb-HzDxKdYErSiaphlKojNZmTF27Pg13Fo`,
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        navigate("/riders");
      } else {
        setMessage(`⚠️ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting user");
    } finally {
      setIsProcessing(false);
      setDeleteUserPopup(false);
    }
  };

  return (
    <div className="px-4">
      {message && (
        <div className="mb-4 p-2 border rounded bg-gray-100 text-sm">{message}</div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={handlePopupDisable}
          className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
        >
          {isBlocked ? (
            <>
              <EnableRedIcon />
              <span className="text-black font-normal text-base">Unblock</span>
            </>
          ) : (
            <>
              <DisableRedicon />
              <span className="text-black font-normal text-base">Block</span>
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

      {/* Full width blue container with profile picture */}
      <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] w-full flex">
        <div className="flex items-center w-1/5">
          <div className="pe-5 border-e-[1px] border-[#FFFFFF66] w-full flex flex-col items-center">
            <img
              onClick={() => openImageModal(rider.licensePhoto)}
              className="w-[78px] h-[78px] rounded-full object-cover cursor-pointer"
              src={rider.licensePhoto || MechanicImage}
              alt="rider"
            />
            <h1 className="font-medium lg:text-base xl:text-lg text-white mt-2.5 text-center">
              Rider
            </h1>
            <h2 className="text-sm font-normal text-white mt-1 text-center">
              {rider.vehicleType}
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
        </div>

        {/* Rider Details Section */}
        <div className="w-4/5">
          <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7">
            <div className="flex items-center justify-between">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                Rider Details
              </p>

              {/* Approve/Deny buttons for pending riders or status display for others */}
              {rider?.status === "Pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleRiderApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded-[10px] hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleDeny}
                    className="bg-red-600 text-white px-4 py-2 rounded-[10px] hover:bg-red-700 transition-colors"
                  >
                    Deny
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span
                    className={`px-3 py-2 rounded-[10px] text-sm font-medium ${rider?.status === "Approved"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : rider?.status === "Rejected"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                  >
                    {rider?.status || "Unknown"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  Rider Name:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                  {user?.firstName} {user?.lastName}
                </h2>
              </div>
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  Email:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                  {user?.useremail}
                </h2>
              </div>
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  Phone No:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                  {user?.mobile_number}
                </h2>
              </div>
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  Subscription:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                  {user?.subscription == null
                    ? "N/A"
                    : `Yes / ${user?.subscription?.plan} / ${new Date(
                      user?.subscription?.validTill
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}`}
                </h2>
              </div>
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  Vehicle Type:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal capitalize">
                  {rider?.vehicleType}
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
                  {rider?.vehicleRegistrationNumber}
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
                  {rider?.drivingLicenseNumber}
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
                  {rider?.drivingExperience} years
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
                  {rider?.offerParcel ? "Yes" : "No"}
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
                  {formatDate(rider?.created_at)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-10 md:mt-14">
        <button
          onClick={() => setRiderDetailsTab('riderDetails')}
          className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${riderDetailsTab === 'riderDetails' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}
        >
          Rider Details
        </button>
        <button
          onClick={() => setRiderDetailsTab('riderHistory')}
          className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${riderDetailsTab === 'riderHistory' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}
        >
          Rider History
        </button>
      </div>

      {riderDetailsTab === 'riderDetails' &&
        <>
          {/* License Photo Section */}
          {rider?.licensePhoto && (
            <div className="mt-[30px]">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                License Photo
              </p>
              <div className="mt-4">
                <img
                  onClick={() => openImageModal(rider.licensePhoto)}
                  src={rider.licensePhoto}
                  alt="License"
                  className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          )}
          {/* Rider Photos Section */}
          {rider?.riderPhoto && rider.riderPhoto.length > 0 && (
            <div className="mt-[30px]">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                Rider Photos
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                {rider.riderPhoto.map((photo, index) => (
                  <img
                    key={index}
                    onClick={() => openImageModal(photo)}
                    src={photo}
                    alt={`Rider ${index + 1}`}
                    className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Photos Section */}
          {rider?.vehiclePhoto && rider.vehiclePhoto.length > 0 && (
            <div className="mt-[30px]">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                Vehicle Photos
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                {rider.vehiclePhoto.map((photo, index) => (
                  <img
                    key={index}
                    onClick={() => openImageModal(photo)}
                    src={photo}
                    alt={`Vehicle ${index + 1}`}
                    className="w-64 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}
        </>}

      {riderDetailsTab === 'riderHistory' &&
        <>
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
                    Pick Address
                  </th>
                  <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                    Drop Address
                  </th>
                  <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
                    Total Fare
                  </th>
                  <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                    Created At
                  </th>
                  <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                    Status
                  </th>
                </tr>
                <tr>
                  <td colSpan="10">
                    <div className="w-full border border-dashed border-[#00000066]"></div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedRiderHistory.filter(
                  (item) => item.riderId === user?.id
                ).length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No riders found
                    </td>
                  </tr>
                ) : (
                  paginatedRiderHistory?.filter(
                    (item) => item.riderId === user?.id
                  ).map((rider, index) => {
                    return (
                      <tr key={rider.id}>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          {index + 1}
                        </td>
                        <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
                          <Link className="flex gap-2">
                            {rider.userDetail?.firstName} {rider.userDetail?.lastName}
                          </Link>
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          {rider.userDetail?.useremail || 'N/A'}
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          {rider.userDetail?.mobile_number || 'N/A'}
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          <span className="capitalize">{rider.pickAddress || 'N/A'}</span>
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          {rider.dropAddress || 'N/A'}
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] text-center">
                          {rider.totalFare || 0}
                        </td>
                        <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                          {formatDate(rider.created_at)}
                        </td>
                        <td>
                          <div className="flex justify-center items-center">
                            <span
                              className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${rider.status === "Completed"
                                  ? "bg-[#00800012] text-[#008000]"
                                  : rider?.status === "Cancelled" ? "bg-[#F02600]/10 text-[#F02600]" : rider.status === "Approved" ? "bg-[#6C4DEF1A] text-[#6C4DEF]" : "bg-[#ffa50024] text-[#ffa500]"
                                }`}
                            >
                              {rider?.status || 'N/A'}
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
          {/* Pagination */}
          {paginatedRiderHistory.length > 0 && riderDetailsTab === 'riderHistory' && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndexRiderHistory + 1} to {endIndexRiderHistory} of {ridingRequests.length} requests
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChangeRiderHistory("prev")}
                  disabled={currentPageRiderHistory === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {currentPageRiderHistory} of {totalPagesRiderHistory}
                </span>
                <button
                  onClick={() => handlePageChangeRiderHistory("next")}
                  disabled={currentPageRiderHistory === totalPagesRiderHistory}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      }

      <div className="mt-[30px]">
        <div className="flex justify-between space-x-4 mb-4 border-b">
          <button className={`px-4 py-2 capitalize border-b-2 border-blue-600 text-blue-600 font-semibold`}>
            Refferal List
          </button>
          <button className={`px-4 py-2 capitalize text-blue-600 font-semibold`}>
            Total Refferal Amount : {totalRefferAmount}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {user?.referralList?.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refferal Code</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">plan</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.referralList.map((withdrawal, index) => {
                  return (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-semibold">{withdrawal.name}</td>
                      <td className="px-4 py-2">{withdrawal.referralCode}</td>
                      <td className="px-4 py-2">{withdrawal.amount}</td>
                      <td className="px-4 py-2">{withdrawal.isSubscribe == true ? "Premium" : "Free"}</td>
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
                  )
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

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={() => {
                setIsImageModalOpen(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Image Preview"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      {/* Popups */}
      {showPopupDisable && (
        <DisableProviderPopUp
          handlePopupDisable={handlePopupDisable}
          userId={user?.id}
          currentStatus={isBlocked ? "blocked" : "active"}
          refetchUser={fetchRiderData}
        />
      )}

      {showDenialPopup && (
        <DenialReasonPopUp
          handleClose={() => handleDenialClose(true)}
          userId={rider?.userId}
          type="rider"
          itemId={rider?.userId}
          currentStatus={rider?.status}
          refetchData={fetchRiderData}
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

export default RiderDetails;