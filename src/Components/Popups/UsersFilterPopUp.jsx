// /* eslint-disable react/prop-types */
// import { useState } from "react";
// import { DropdownIcon } from "../../assets/icon/Icon";

// function UsersFilterPopUp({ handleFilterPopupClose, applyFilters }) {
//   const [filterState, setFilterState] = useState({
//     showUserType: false,
//     subscriptionStatus: false,
//     profileStatus: false,
//     businessStatus: false,
//     selectedUserType: "",
//     selectedStatus: "",
//     selectedProfileStatus: "", // will store true / false / ""
//     selectedBusinessStatus: ""
//   });

//   const handleUserTypeChange = (type) => {
//     setFilterState((prev) => ({
//       ...prev,
//       selectedUserType: prev.selectedUserType === type ? "" : type
//     }));
//   };


//   const handleStatusProfileChange = (status) => {
//     setFilterState((prev) => ({
//       ...prev,
//       selectedProfileStatus: prev.selectedProfileStatus === status ? "" : status
//     }));
//   };

//   const handleStatusBusinessChange = (status) => {
//     setFilterState((prev) => ({
//       ...prev,
//       selectedBusinessStatus: prev.selectedBusinessStatus === status ? "" : status
//     }));
//   };

//   const handleApplyFilters = () => {
//     applyFilters(filterState); // You must use isSellerOnline === selectedProfileStatus
//     handleFilterPopupClose();
//   };

//   return (
//     <>
//       <div
//         onClick={handleFilterPopupClose}
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
//       ></div>

//       <div className="fixed inset-0 flex items-center justify-center z-50 w-[470px] h-auto m-auto">
//         <div className="bg-white p-4 shadow-2xl w-full rounded-2xl">
//           {/* Header */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg md:text-xl font-medium">Filters</h2>
//             <button className="text-lg md:text-xl" onClick={handleFilterPopupClose} aria-label="Close">
//               &#10005;
//             </button>
//           </div>

//           <div className="border-t border-dashed mt-2.5 border-gray-400"></div>

//           {/* User Type */}
//           <div className="mt-3">
//             <button
//               className="w-full text-base font-normal text-black flex justify-between items-center"
//               onClick={() =>
//                 setFilterState((prev) => ({
//                   ...prev,
//                   showUserType: !prev.showUserType,
//                   subscriptionStatus: false,
//                   profileStatus: false,
//                   businessStatus: false
//                 }))
//               }
//             >
//               User Type
//               <span className={`transform transition-transform duration-300 ${filterState.showUserType ? "rotate-180" : ""}`}>
//                 <DropdownIcon />
//               </span>
//             </button>

//             <div className={`mt-2 duration-300 overflow-hidden ${filterState.showUserType ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
//               <div className="flex items-center space-x-2">
//                 <input
//                   id="consumer"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedUserType === "Consumer"}
//                   onChange={() => handleUserTypeChange("Consumer")}
//                 />
//                 <label htmlFor="consumer" className="text-base text-black/60 cursor-pointer">Consumer</label>
//               </div>
//               <div className="flex items-center space-x-2 mt-2">
//                 <input
//                   id="seller"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedUserType === "Seller"}
//                   onChange={() => handleUserTypeChange("Seller")}
//                 />
//                 <label htmlFor="seller" className="text-base text-black/60 cursor-pointer">Seller</label>
//               </div>
//             </div>
//           </div>

//           {/* Profile Status (Online / Offline as boolean) */}
//           <div className="mt-3">
//             <button
//               className="w-full text-left font-medium flex justify-between items-center"
//               onClick={() =>
//                 setFilterState((prev) => ({
//                   ...prev,
//                   profileStatus: !prev.profileStatus,
//                   showUserType: false,
//                   subscriptionStatus: false,
//                   businessStatus: false
//                 }))
//               }
//             >
//               Profile Status
//               <span className={`transform transition-transform duration-300 ${filterState.profileStatus ? "rotate-180" : ""}`}>
//                 <DropdownIcon />
//               </span>
//             </button>

//             <div className={`mt-2 duration-300 overflow-hidden ${filterState.profileStatus ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
//               <div className="flex items-center space-x-2">
//                 <input
//                   id="proOnline"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedProfileStatus === true}
//                   onChange={() => handleStatusProfileChange(true)}
//                 />
//                 <label htmlFor="proOnline" className="text-base text-black/60 cursor-pointer">Online</label>
//               </div>
//               <div className="flex items-center space-x-2 mt-2">
//                 <input
//                   id="proOffline"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedProfileStatus === false}
//                   onChange={() => handleStatusProfileChange(false)}
//                 />
//                 <label htmlFor="proOffline" className="text-base text-black/60 cursor-pointer">Offline</label>
//               </div>
//             </div>
//           </div>

//           {/* Business Status */}
//           <div className="mt-3">
//             <button
//               className="w-full text-left font-medium flex justify-between items-center"
//               onClick={() =>
//                 setFilterState((prev) => ({
//                   ...prev,
//                   businessStatus: !prev.businessStatus,
//                   showUserType: false,
//                   subscriptionStatus: false,
//                   profileStatus: false
//                 }))
//               }
//             >
//               Business Status
//               <span className={`transform transition-transform duration-300 ${filterState.businessStatus ? "rotate-180" : ""}`}>
//                 <DropdownIcon />
//               </span>
//             </button>

//             <div className={`mt-2 duration-300 overflow-hidden ${filterState.businessStatus ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
//               <div className="flex items-center space-x-2">
//                 <input
//                   id="busApproved"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedBusinessStatus === "Approved"}
//                   onChange={() => handleStatusBusinessChange("Approved")}
//                 />
//                 <label htmlFor="busApproved" className="text-base text-black/60 cursor-pointer">Approved</label>
//               </div>
//               <div className="flex items-center space-x-2 mt-2">
//                 <input
//                   id="busPending"
//                   type="checkbox"
//                   className="h-5 w-5 accent-[#6C4DEF]"
//                   checked={filterState.selectedBusinessStatus === "Pending"}
//                   onChange={() => handleStatusBusinessChange("Pending")}
//                 />
//                 <label htmlFor="busPending" className="text-base text-black/60 cursor-pointer">Pending</label>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={handleApplyFilters}
//               className="bg-[#0832DE] text-white px-6 text-base font-normal py-2 rounded-[10px]"
//             >
//               Apply
//             </button>
//             <button
//               onClick={handleFilterPopupClose}
//               className="bg-[#F1F1F1] text-black px-6 text-base font-normal py-2 rounded-[10px]"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UsersFilterPopUp;



/* eslint-disable react/prop-types */
import { useState } from "react";
import { DropdownIcon } from "../../assets/icon/Icon";

function UsersFilterPopUp({ handleFilterPopupClose, applyFilters }) {
  const [filterState, setFilterState] = useState({
    showUserType: false,
    subscriptionStatus: false,
    profileStatus: false,
    businessStatus: false,
    selectedUserType: "",
    selectedSubscriptionStatus: "", // will store "free" or "paid" or ""
    selectedBusinessStatus: ""
  });

  const handleUserTypeChange = (type) => {
    setFilterState((prev) => ({
      ...prev,
      selectedUserType: prev.selectedUserType === type ? "" : type
    }));
  };

  const handleSubscriptionStatusChange = (status) => {
    setFilterState((prev) => ({
      ...prev,
      selectedSubscriptionStatus: prev.selectedSubscriptionStatus === status ? "" : status
    }));
  };

  const handleStatusBusinessChange = (status) => {
    setFilterState((prev) => ({
      ...prev,
      selectedBusinessStatus: prev.selectedBusinessStatus === status ? "" : status
    }));
  };

  const handleApplyFilters = () => {
    applyFilters(filterState);
    handleFilterPopupClose();
  };

  return (
    <>
      <div
        onClick={handleFilterPopupClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 w-[470px] h-auto m-auto">
        <div className="bg-white p-4 shadow-2xl w-full rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-medium">Filters</h2>
            <button className="text-lg md:text-xl" onClick={handleFilterPopupClose} aria-label="Close">
              &#10005;
            </button>
          </div>

          <div className="border-t border-dashed mt-2.5 border-gray-400"></div>

          {/* User Type */}
          <div className="mt-3">
            <button
              className="w-full text-base font-normal text-black flex justify-between items-center"
              onClick={() =>
                setFilterState((prev) => ({
                  ...prev,
                  showUserType: !prev.showUserType,
                  subscriptionStatus: false,
                  businessStatus: false
                }))
              }
            >
              User Type
              <span className={`transform transition-transform duration-300 ${filterState.showUserType ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>

            <div className={`mt-2 duration-300 overflow-hidden ${filterState.showUserType ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="consumer"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedUserType === "Consumer"}
                  onChange={() => handleUserTypeChange("Consumer")}
                />
                <label htmlFor="consumer" className="text-base text-black/60 cursor-pointer">Consumer</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="seller"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedUserType === "Seller"}
                  onChange={() => handleUserTypeChange("Seller")}
                />
                <label htmlFor="seller" className="text-base text-black/60 cursor-pointer">Seller</label>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mt-3">
            <button
              className="w-full text-left font-medium flex justify-between items-center"
              onClick={() =>
                setFilterState((prev) => ({
                  ...prev,
                  subscriptionStatus: !prev.subscriptionStatus,
                  showUserType: false,
                  businessStatus: false
                }))
              }
            >
              Subscription Status
              <span className={`transform transition-transform duration-300 ${filterState.subscriptionStatus ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>

            <div className={`mt-2 duration-300 overflow-hidden ${filterState.subscriptionStatus ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="subFree"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedSubscriptionStatus === "free"}
                  onChange={() => handleSubscriptionStatusChange("free")}
                />
                <label htmlFor="subFree" className="text-base text-black/60 cursor-pointer">Free</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="subPaid"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedSubscriptionStatus === "paid"}
                  onChange={() => handleSubscriptionStatusChange("paid")}
                />
                <label htmlFor="subPaid" className="text-base text-black/60 cursor-pointer">Paid</label>
              </div>
            </div>
          </div>

          {/* Business Status */}
          <div className="mt-3">
            <button
              className="w-full text-left font-medium flex justify-between items-center"
              onClick={() =>
                setFilterState((prev) => ({
                  ...prev,
                  businessStatus: !prev.businessStatus,
                  showUserType: false,
                  subscriptionStatus: false
                }))
              }
            >
              Business Status
              <span className={`transform transition-transform duration-300 ${filterState.businessStatus ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>

            <div className={`mt-2 duration-300 overflow-hidden ${filterState.businessStatus ? "h-16 opacity-100" : "h-0 opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="busApproved"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedBusinessStatus === "Approved"}
                  onChange={() => handleStatusBusinessChange("Approved")}
                />
                <label htmlFor="busApproved" className="text-base text-black/60 cursor-pointer">Approved</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="busPending"
                  type="checkbox"
                  className="h-5 w-5 accent-[#6C4DEF]"
                  checked={filterState.selectedBusinessStatus === "Pending"}
                  onChange={() => handleStatusBusinessChange("Pending")}
                />
                <label htmlFor="busPending" className="text-base text-black/60 cursor-pointer">Pending</label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleApplyFilters}
              className="bg-[#0832DE] text-white px-6 text-base font-normal py-2 rounded-[10px]"
            >
              Apply
            </button>
            <button
              onClick={handleFilterPopupClose}
              className="bg-[#F1F1F1] text-black px-6 text-base font-normal py-2 rounded-[10px]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersFilterPopUp;