/* eslint-disable react/prop-types */
import { useState } from "react";
import { DropdownIcon } from "../../assets/icon/Icon";

function UsersFilterPopUp({ handleFilterPopupClose, applyFilters   }) {
  const [filterState, setFilterState] = useState({
    showUserType: false,
    subscriptionStatus: false,
    profileStatus: false,
    businessStatus: false,
    selectedUserType: "",
    selectedStatus: "",
    selectedProfileStatus: "",
    selectedBusinessStatus: ""
  });



  const handleUserTypeChange = (type) => {
    setFilterState((prev) => ({ ...prev, selectedUserType: type }));
  };

  const handleStatusChange = (status) => {
    setFilterState((prev) => ({ ...prev, selectedStatus: status }));
  };
  const handleStatusProfileChange = (status) => {
    setFilterState((prev) => ({ ...prev, selectedProfileStatus: status }));
  };
  const handleStatusBusinessChange = (status) => {
    setFilterState((prev) => ({ ...prev, selectedBusinessStatus: status }));
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
      <div className="fixed inset-0 flex items-center justify-center z-50 w-[470px]  h-auto m-auto">
        <div className="bg-white p-4 shadow-2xl w-full rounded-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-medium">Filters</h2>
            <button className="text-lg md:text-xl" onClick={handleFilterPopupClose} aria-label="Close">
              &#10005;
            </button>
          </div>

          <div className="border-t border-dashed mt-2.5 border-gray-400"></div>

          {/* User Type Dropdown */}
          <div className="mt-3">
            <button
              className="w-full text-base font-normal text-black flex justify-between items-center"
              onClick={() => setFilterState((prev) => ({
                ...prev, showUserType: !prev.showUserType,
                subscriptionStatus: false,
                profileStatus: false,
                businessStatus: false
}))}
            >
              User Type
              <span className={`transform transition-transform duration-300 ${filterState.showUserType ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>

            <div className={`mt-2 duration-300 ${filterState.showUserType ? "h-16 " : "h-0 z-[-1] opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="consumer"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedUserType === "Consumer"}
                  onChange={() => handleUserTypeChange("Consumer")}
                />
                <label htmlFor="consumer" className="text-base text-black/60 text-normal cursor-pointer">Consumer</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="seller"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedUserType === "Seller"}
                  onChange={() => handleUserTypeChange("Seller")}
                />
                <label htmlFor="seller" className="text-base text-black/60 text-normal cursor-pointer">Seller</label>
              </div>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="mt-3">
            <button
              className="w-full text-left font-medium flex justify-between items-center z-[10]"
              onClick={() => setFilterState((prev) => ({
                ...prev, subscriptionStatus: !prev.subscriptionStatus, showUserType: false,
                profileStatus: false,
                businessStatus: false }))}
            >
              Subscription Status
              <span className={`transform transition-transform duration-300 ${filterState.subscriptionStatus ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>


            <div className={`mt-2 duration-300 ${filterState.subscriptionStatus ? "h-24 " : "h-0 z-[-1] opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="Expired"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedStatus === "Expired"}
                  onChange={() => handleStatusChange("Expired")}
                />
                <label htmlFor="Expired" className="text-base text-black/60 text-normal cursor-pointer">Expired</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="Active"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedStatus === "Active"}
                  onChange={() => handleStatusChange("Active")}
                />
                <label htmlFor="Active" className="text-base text-black/60 text-normal cursor-pointer">Active</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="Trail Users"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedStatus === "Trail Users"}
                  onChange={() => handleStatusChange("Trail Users")}
                />
                <label htmlFor="Trail Users" className="text-base text-black/60 text-normal cursor-pointer">Trail Users</label>
              </div>
            </div>

          </div>
          {/* Status Dropdown */}
          <div className="mt-3">
            <button
              className="w-full text-left font-medium flex justify-between items-center z-[10]"
              onClick={() => setFilterState((prev) => ({
                ...prev, profileStatus: !prev.profileStatus, showUserType: false,
                subscriptionStatus: false,
                businessStatus: false }))}
            >
              Profile Status
              <span className={`transform transition-transform duration-300 ${filterState.profileStatus ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>


            <div className={`mt-2 duration-300 ${filterState.profileStatus ? "h-16 " : "h-0 z-[-1] opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="proActive"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedProfileStatus === "Active"}
                  onChange={() => handleStatusProfileChange("Active")}
                />
                <label htmlFor="proActive" className="text-base text-black/60 text-normal cursor-pointer">Active</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="proInactive"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedProfileStatus === "Inactive"}
                  onChange={() => handleStatusProfileChange("Inactive")}
                />
                <label htmlFor="proInactive" className="text-base text-black/60 text-normal cursor-pointer">Inactive</label>
              </div>
            </div>

          </div>
          {/* bissness Status Dropdown */}
          <div className="mt-3">
            <button
              className="w-full text-left font-medium flex justify-between items-center relative z-[10]"
              onClick={() => setFilterState((prev) => ({
                ...prev, businessStatus: !prev.businessStatus, showUserType: false,
                subscriptionStatus: false,
                profileStatus: false }))}
            >
             Business Status
              <span className={`transform transition-transform duration-300 ${filterState.businessStatus ? "rotate-180" : ""}`}>
                <DropdownIcon />
              </span>
            </button>


            <div className={`mt-2 duration-300 ${filterState.businessStatus ? "h-16 " : "h-0 z-[-1] opacity-0"}`}>
              <div className="flex items-center space-x-2">
                <input
                  id="acbiss"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedBusinessStatus === "Active"}
                  onChange={() => handleStatusBusinessChange("Active")}
                />
                <label htmlFor="acbiss" className="text-base text-black/60 text-normal cursor-pointer">Active</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="buss"
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer accent-[#6C4DEF]"
                  checked={filterState.selectedBusinessStatus === "Inactive"}
                  onChange={() => handleStatusBusinessChange("Inactive")}
                />
                <label htmlFor="buss" className="text-base text-black/60 text-normal cursor-pointer">Inactive</label>
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4 relative z-10`">
            <button onClick={handleApplyFilters} className="bg-[#0832DE] text-white px-6 text-base font-normal py-2 rounded-[10px]">Apply</button>
            <button onClick={handleFilterPopupClose} className="bg-[#F1F1F1] text-black px-6 text-base font-normal py-2 rounded-[10px]">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersFilterPopUp;