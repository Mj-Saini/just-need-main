/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import avatar from "../assets/Images/Png/dummyimage.jpg";
import ActionUserPupUp from "./Popups/ActionUserPupUp";
import { Link, useLocation } from "react-router-dom";
import UsersFilterPopUp from "../Components/Popups/UsersFilterPopUp";
import { CiSearch, CiFilter } from "react-icons/ci";
import {
  SpikendCirclChat,
  SpikStartCirclChat,
  ArrowIconRigth,
  ArrowIconLeft,
  DeleteIcon,
  DownArrow,
  FilterSvg,
} from ".././assets/icon/Icons";
import { supabase } from "../store/supabaseCreateClient";
import { toast } from "react-toastify";
import { useCustomerContext } from "../store/CustomerContext";
import { DeleteRedIcon, EyeIcon } from "../assets/icon/Icon";
import BlockedUserPopups from "./Popups/BlockedUserPopups";

const CustomerData = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [mainCheckbox, setMainCheckbox] = useState(false);
  const [selectItem, setSelectItem] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [filterPopupsvg, setFilterPopupSvg] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["name", "email"]);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search Name, Email");
  const [selectAll, setSelectAll] = useState(false);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [userActiveTabs, setuserActiveTabs] = useState("userlist");


  const formatDate = (milliseconds) => {
    const date = new Date(milliseconds);
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

  const { users, setUsers, loading, fetchUsers } = useCustomerContext();
  const [filteredUsers, setFilteredUsers] = useState(users);
  // Show all users except blocked and Rider in userlist, and only pending in pendingRequest
  let filteredData = [];
  if (userActiveTabs === "userlist") {
    filteredData = users?.filter(user => 
      user?.accountStatus?.isBlocked !== true && 
      user?.userType !== "Rider"
    )?.filter((customer) => {
      if (selectedFilters.length === 0) {
        return (customer.firstName + " " + customer.lastName)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return selectedFilters.some((filter) => {
        switch (filter) {
          case "name":
            return (customer.firstName + " " + customer.lastName)
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "email":
            return customer.useremail
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "address":
            return customer?.address?.some((addr) =>
              `${addr.city}/${addr.state}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          case "mobile":
            return customer.mobile_number
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          default:
            return false;
        }
      });
    });
  } else if (userActiveTabs === "pendingRequest") {
    filteredData = users?.filter(user => 
      user?.userType === "Seller" && 
      user?.businessDetail?.status === "Pending"
    )?.filter((customer) => {
      if (selectedFilters.length === 0) {
        return (customer.firstName + " " + customer.lastName)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return selectedFilters.some((filter) => {
        switch (filter) {
          case "name":
            return (customer.firstName + " " + customer.lastName)
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "email":
            return customer.useremail
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "address":
            return customer?.address?.some((addr) =>
              `${addr.city}/${addr.state}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          case "mobile":
            return customer.mobile_number
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          default:
            return false;
        }
      });
    });
  }


  const [paginatedData, setPaginatedData] = useState([]);
  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  useEffect(() => {
    setPaginatedData(filteredData.slice(startIndex, endIndex)); // 🔹 Update when filteredData or pagination changes
  }, [startIndex, endIndex]);
  // Main checkbox handler
  const handleMainCheckboxChange = () => {
    const newCheckedState = !mainCheckbox;
    setMainCheckbox(newCheckedState);

    if (newCheckedState) {
      const currentPageIds = paginatedData.map((item) => item.id);
      setSelectItem(currentPageIds);
    } else {
      setSelectItem([]);
    }
  };
 
  // Pagination handlers
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setMainCheckbox(false);
      setSelectItem([]);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setMainCheckbox(false);
      setSelectItem([]);
    }
  };

  const handleItemsSelect = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setMainCheckbox(false);
    setSelectItem([]);
    setShowItemsDropdown(false);
  };

  function handleFilter() {
    setShowFilterPopup(!showFilterPopup);
  }

  function handleFilterPopupClose() {
    setShowFilterPopup(false);
  }

  function handlePopup() {
    setShowPopup(!showPopup);
  }

  // Delete functionality for multiple users
  const handleDeleteClick = () => {
    if (selectItem.length > 0) {
      setShowDeletePopup(true);
    } else {
      toast.info("Please select at least one user to delete.");
    }
  };

  // Delete functionality for single user via DeleteRedIcon
  const handleSingleDeleteClick = (userId) => {
    setSelectItem([userId]); // Set only the clicked user as selected
    setShowDeletePopup(true);
  };



  const handleConfirmDelete = async () => {
    try {
      const usersToDelete = users.filter((user) => selectItem.includes(user.id));
      const userIds = usersToDelete.map((user) => user.id);
      const businessIdsToDelete = usersToDelete
        .map((user) => user.businessDetail?.businessId)
        .filter(Boolean);

      // Step 1: Delete Business Details
      if (businessIdsToDelete.length > 0) {
        const { error: businessError } = await supabase
          .from("BusinessDetailsView")
          .delete()
          .in("businessId", businessIdsToDelete);
        if (businessError) throw businessError;
      }

      // Step 2: Delete Chatrooms
      const { error: chatroomError } = await supabase
        .from("Chatrooms")
        .delete()
        .in("userId", userIds);
      if (chatroomError) throw chatroomError;

      // Step 3: Delete ChatMessages
      const { error: messagesError } = await supabase
        .from("ChatMessages")
        .delete()
        .or(`senderId.in.(${userIds.join(",")}),receiverId.in.(${userIds.join(",")})`);
      if (messagesError) throw messagesError;

      // Step 4: Delete Service Listings
      const { error: listingsError } = await supabase
        .from("ServiceListings")
        .delete()
        .in("userId", userIds); // or use user_detail.id depending on schema
      if (listingsError) throw listingsError;

      // Step 5: Delete Complaints
      const { error: complaintsError } = await supabase
        .from("RaiseComplaint")
        .delete()
        .or(`complainBy.in.(${userIds.join(",")}),complainOn.in.(${userIds.join(",")})`);
      if (complaintsError) throw complaintsError;

      // Step 6: Delete Users
      const { error: userError } = await supabase
        .from("Users")
        .delete()
        .in("id", userIds);
      if (userError) throw userError;

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectItem.includes(user.id))
      );
      setSelectItem([]);
      setMainCheckbox(false);
      setShowDeletePopup(false);

      toast.success("Successfully deleted users and all related data.");
    } catch (err) {
      console.error("Error deleting users and related data:", err);
      toast.error("Failed to delete users. Please try again.");
    }
  };



  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectItem([]);
  };

  const dropdownRef = useRef(null);
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const toggleItemsDropdown = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(
        spaceBelow < 150 && spaceAbove > spaceBelow ? "top" : "bottom"
      );
    }
    setShowItemsDropdown((prev) => !prev);
  };

  // Handle "Select All" checkbox change
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedFilters(["name", "email", "address", "mobile"]);
      setSearchPlaceholder("Search Name, Email, Address, Mobile");
    } else {
      setSelectedFilters(["name", "email"]); // Default to name and email
      setSearchPlaceholder("Search Name, Email");
    }
  };

  // Handle individual filter checkbox change
  const handleFilterCheckboxChange = (field) => {
    const updatedFilters = selectedFilters.includes(field)
      ? selectedFilters.filter((f) => f !== field)
      : [...selectedFilters, field];
    
    // Ensure at least name and email are always selected
    if (updatedFilters.length === 0) {
      updatedFilters.push("name", "email");
    } else if (!updatedFilters.includes("name")) {
      updatedFilters.push("name");
    } else if (!updatedFilters.includes("email")) {
      updatedFilters.push("email");
    }
    
    setSelectedFilters(updatedFilters);

    // Update "Select All" state
    const allFilters = ["name", "email", "address", "mobile"];
    setSelectAll(allFilters.every((f) => updatedFilters.includes(f)));

    // Update placeholder based on selected filters
    setSearchPlaceholder(
      `Search ${updatedFilters
        .map((f) => f.charAt(0).toUpperCase() + f.slice(1))
        .join(", ")}`
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowItemsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showActionButtons = selectItem.length >= 2;


  const applyFilters = (filters) => {
    console.log(filters)
    let updatedUsers = users;

    // Filter by User Type (Seller / Consumer)
    if (filters.selectedUserType) {
      updatedUsers = updatedUsers.filter(user => {
        if (filters.selectedUserType === "Seller") {
          return user.userType === "Seller";
        } else if (filters.selectedUserType === "Consumer") {
          return user.userType !== "Seller" && user.userType !== "Rider";
        }
        return true;
      });
    }

    // Profile Status (isSellerOnline)
    if (typeof filters.selectedProfileStatus === "boolean") {
      updatedUsers = updatedUsers.filter(user => user.isSellerOnline === filters.selectedProfileStatus);
    }

    // Filter by Business Status ("Approved" / "Pending")
    if (filters.selectedBusinessStatus) {
      updatedUsers = updatedUsers.filter(user => {
        return user.businessDetail?.status === filters.selectedBusinessStatus;
      });
    }

 // Filter by Subscription Status ("free" / "paid")
if (filters.selectedSubscriptionStatus) {
  updatedUsers = updatedUsers.filter(user => {
    const isSubscribed = user.subscription?.isSubscribe;

    if (filters.selectedSubscriptionStatus === "paid") {
      return isSubscribed === true;
    } else if (filters.selectedSubscriptionStatus === "free") {
      return !isSubscribed;
    }

    return true;
  });
}

    // Final updates
    setFilteredUsers(updatedUsers);
    setCurrentPage(1);
    setPaginatedData(updatedUsers.slice(0, itemsPerPage));
  };


const pendingBusinessUsers = users.filter(user => 
  user.userType === "Seller" && 
  user.businessDetail?.status === "Pending"
);


 
  const handleUnblockUser = async (userId) => {
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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
              ...user,
              accountStatus: {
                isBlocked: false,
                reason: null,
                timestamp: Date.now(),
              },
            }
            : user
        )
      );
      toast.success("User unblocked successfully!");

    } catch (err) {
      toast.error("Failed to unblock user");
      console.error(err);
    }
  };



  return (
    <div className="bg-[#FFFFFF] p-5 rounded-[10px]">
      <div className="flex justify-between items-center mt-[15px]">
        <div className="flex items-center gap-6">
          <button onClick={()=>setuserActiveTabs('userlist')} className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${userActiveTabs === 'userlist' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}>
            Users List
          </button>
          <button onClick={()=>setuserActiveTabs('pendingRequest')} className={`text-base xl:text-[20px] font-medium text-[#fff] py-2 px-4 rounded-[10px] bg-[#0832DE] ${userActiveTabs === 'pendingRequest' ? 'bg-[#0832DE]' : 'bg-[#6C4DEF]'}`}>
           Pending Request
          </button>
          {showActionButtons && (
            <>
              <button
                className="border border-[#F1F1F1] text-[#00000099] py-[7px] px-[20px] rounded-[10px] flex items-center gap-2"
                onClick={handleDeleteClick}
              >
                <span>
                  <DeleteIcon />
                </span>
                Delete
              </button>
              <button className="border border-[#F1F1F1] text-[#00000099] py-[7px] px-[20px] rounded-[10px] flex items-center gap-2">
                My Action
                <span>
                  <DownArrow />
                </span>
              </button>
            </>
          )}
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
          {/* <button
            onClick={() => setFilterPopupSvg(!filterPopupsvg)}
            className="mx-5 w-[40px] h-[40px] bg-[#F1F1F1] flex items-center justify-center rounded-[10px]"
          >
            <FilterSvg />
          </button> */}

          <button
            className="bg-[#0832DE] text-white px-[15px] py-2 rounded-[10px] flex items-center"
            onClick={handleFilter}
          >
            <span>
              <CiFilter className="w-[24px] h-[24px] me-[12px]" />
            </span>
            Filter
          </button>
          <button
            className="bg-[#0832DE] text-white px-[15px] py-2 rounded-[10px] flex items-center"
            onClick={() => setShowBlockedOnly(true)}
          >

            Block list
          </button>
        </div>
      </div>
      
      {userActiveTabs === "userlist" &&
        <div className="overflow-x-auto  mt-5">
          <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
            <thead>
              <tr className="py-[8px]">
                {/* <th className="px-[19px] py-[8px] md:px-[24px]">
                <input
                  className="w-[16px] h-[16px]"
                  type="checkbox"
                  checked={mainCheckbox}
                  onChange={handleMainCheckboxChange}
                />
              </th> */}
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Full Name
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Email
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                  Mobile
                </th>
                   <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Business Profile
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[250px]">
                  Address
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
                  User Type
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                  Created At
                </th>
                {/* <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                Updated At
              </th> */}
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Is Seller Online
                </th>
             
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base  bg-white">
                  Action
                </th>
              </tr>
              <tr>
                <td colSpan="12">
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
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedData?.filter(user => user.userType !== 'Rider').map((customer) => {
                  return (
                    <tr key={customer.id}>
                      {/* <td className="px-[19px] md:px-[24px]">
                      <input
                        className="w-[16px] h-[16px]"
                        type="checkbox"
                        onChange={checkHandler}
                        checked={selectItem.includes(customer.id)}
                        value={customer.id}
                      />
                    </td> */}
                      <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
                        <Link
                          className="flex gap-2"
                          to={`/dashboard/usersList/userDetails/${customer.id}`}
                        >
                          <img
                            src={customer.image || avatar}
                            alt="avatar"
                            className="!w-8 h-8 aspect-[1/1] rounded-full object-cover img_user"
                          />
                          {customer.firstName} {customer.lastName}
                        </Link>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {customer.useremail}
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {customer.mobile_number}
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          {customer.userType === "Seller" ? (
                            <span
                              className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${!customer?.businessDetail?.status
                                ? "bg-gray-100 text-gray-500"
                                : customer.businessDetail.status === "Pending"
                                  ? "bg-[#6C4DEF1A] text-[#6C4DEF]"
                                  : customer.businessDetail.status === "Rejected"
                                    ? "bg-[#FF00001A] text-[#F02600]"
                                    : customer.businessDetail.status === "Approved"
                                      ? "bg-[#00800012] text-[#008000]"
                                      : "bg-gray-100 text-gray-500"
                                }`}
                            >
                              {customer?.businessDetail?.status || "N/A"}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
                        {customer.address.city}/{customer.address.state}
                      </td>
                      <td
                        className={`px-[19px] text-sm font-normal truncate ${customer.userType == "Seller"
                          ? "bg-[#0000FF12] text-[#0000FF] rounded-[90px]"
                          : "text-[#FFA500] bg-[#FFA50024] rounded-[90px]"
                          }`}
                      >
                        <div className="flex justify-center">
                          <span>
                            {customer?.userType === "Seller" ? "Seller" : "Consumer"}
                          </span>
                        </div>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {formatDate(customer.created_at)}
                      </td>
                      {/* <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                      {formatDate(customer.updated_at)}
                    </td> */}
                      <td>
                        <div className="flex justify-center items-center">
                          <span
                            className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${customer?.userType !== "Seller"
                              ? "text-[#9ca3af]" // not seller = gray
                              : customer?.isSellerOnline
                                ? "text-[#008000] bg-[#00800012]" // online = green
                                : "text-[#FF0000] bg-[#ff000012]" // offline = red
                              }`}
                          >
                            {customer?.userType !== "Seller"
                              ? "-"
                              : customer?.isSellerOnline
                                ? "Online"
                                : "Offline"}
                          </span>

                        </div>
                      </td>
                      
                      <td className="px-[19px] md:px-[24px] text-center bg-white">
                        <Link to={`/dashboard/usersList/userDetails/${customer.id}`}>
                          <button className="text-2xl font-medium">
                            <EyeIcon />
                          </button></Link>
                        {/* <button
                        className="text-2xl font-medium ms-[6px]"
                        onClick={() => handleSingleDeleteClick(customer.id)}
                      >
                        <DeleteRedIcon />
                      </button> */}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>}
      {userActiveTabs === "pendingRequest" &&
        <div className="overflow-x-auto  mt-5">
          <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
            <thead>
              <tr className="py-[8px]">
               
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Full Name
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Email
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                  Mobile
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Business Profile
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[250px]">
                  Address
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[100px]">
                  User Type
                </th>
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                  Created At
                </th>
               
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                  Is Seller Online
                </th>
               
                <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base  bg-white">
                  Action
                </th>
              </tr>
              <tr>
                <td colSpan="12">
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
              ) : pendingBusinessUsers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                pendingBusinessUsers?.map((customer) => {

                  return (
                    <tr key={customer.id}>
                    
                      <td className="px-[19px] md:px-[24px] text-[#6C4DEF] flex items-center gap-2 min-w-[160px]">
                        <Link
                          className="flex gap-2"
                          to={`/dashboard/usersList/userDetails/${customer.id}`}
                        >
                          <img
                            src={customer.image || avatar}
                            alt="avatar"
                            className="!w-8 h-8 aspect-[1/1] rounded-full object-cover img_user"
                          />
                          {customer.firstName} {customer.lastName}
                        </Link>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {customer.useremail}
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {customer.mobile_number}
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          {customer.userType === "Seller" ? (
                            <span
                              className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${!customer?.businessDetail?.status
                                ? "bg-gray-100 text-gray-500"
                                : customer.businessDetail.status === "Pending"
                                  ? "bg-[#6C4DEF1A] text-[#6C4DEF]"
                                  : customer.businessDetail.status === "Rejected"
                                    ? "bg-[#FF00001A] text-[#F02600]"
                                    : customer.businessDetail.status === "Approved"
                                      ? "bg-[#00800012] text-[#008000]"
                                      : "bg-gray-100 text-gray-500"
                                }`}
                            >
                              {customer?.businessDetail?.status || "N/A"}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
                        {customer.address.city}/{customer.address.state}
                      </td>
                      <td
                        className={`px-[19px] text-sm font-normal truncate ${customer.userType === "Seller"
                          ? "bg-[#0000FF12] text-[#0000FF] rounded-[90px]"
                          : "text-[#FFA500] bg-[#FFA50024] rounded-[90px]"
                          }`}
                      >
                        <div className="flex justify-center">
                          <span>
                            {customer.userType === "Seller" ? "Seller" : "Consumer"}
                          </span>
                        </div>
                      </td>
                      <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                        {formatDate(customer.created_at)}
                      </td>
                   
                      <td>
                        <div className="flex justify-center items-center">
                          <span
                            className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${customer?.userType !== "Seller"
                              ? "text-[#9ca3af]" // not seller = gray
                              : customer?.isSellerOnline
                                ? "text-[#008000] bg-[#00800012]" // online = green
                                : "text-[#FF0000] bg-[#ff000012]" // offline = red
                              }`}
                          >
                            {customer?.userType !== "Seller"
                              ? "-"
                              : customer?.isSellerOnline
                                ? "Online"
                                : "Offline"}
                          </span>

                        </div>
                      </td>
                     
                      <td className="px-[19px] md:px-[24px] text-center bg-white">
                        <Link to={`/dashboard/usersList/userDetails/${customer.id}`}>
                          <button className="text-2xl font-medium">
                            <EyeIcon />
                          </button></Link>
                        {/* <button
                        className="text-2xl font-medium ms-[6px]"
                        onClick={() => handleSingleDeleteClick(customer.id)}
                      >
                        <DeleteRedIcon />
                      </button> */}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>}
      
      <div className="p-4 bg-white rounded-[10px]">
        <div className="flex justify-end">
          <div className="flex items-center">
            <h2 className="me-3">Items per page:</h2>
            <div className="relative">
              <div
                className="relative border-[1px] py-1 w-[70px] rounded-[10px] flex justify-center items-center cursor-pointer me-9"
                onClick={toggleItemsDropdown}
                ref={dropdownRef}
              >
                <h2 className="pe-3 text-sm font-medium">{itemsPerPage}</h2>
                <span>▼</span>
                {showItemsDropdown && (
                  <div
                    className={`absolute ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
                      } bg-white border rounded shadow-lg w-full z-10`}
                  >
                    {[10, 20, 50, 100].map((item) => (
                      <button
                        key={item}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemsSelect(item);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="pe-3 text-sm font-medium">
              {startIndex + 1}-{endIndex}
            </h2>
            <span className="pe-5">of {filteredData.length}</span>
            <div className="pe-7 flex">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                <SpikStartCirclChat />
              </button>
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="ps-5"
              >
                <ArrowIconLeft />
              </button>
            </div>
            <div className="pe-3 flex">
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                <ArrowIconRigth />
              </button>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="ps-5"
              >
                <SpikendCirclChat />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[10px] shadow-lg w-[400px]">
            <h2 className="text-lg font-medium mb-4">Confirm Delete Users</h2>
            <p className="mb-6">
              Are you sure you want to delete the user
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="border border-[#F1F1F1] text-[#00000099] py-2 px-4 rounded-[10px]"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-[10px]"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && <ActionUserPupUp handlePopup={handlePopup} />}

      {showFilterPopup && (
        <UsersFilterPopUp
          handleFilter={handleFilter}
          handleFilterPopupClose={handleFilterPopupClose}
          applyFilters={applyFilters}
        />
      )}

      {filterPopupsvg && (
        <div
          onClick={() => setFilterPopupSvg(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-[10px] shadow-lg w-[300px]"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="text-base font-normal leading-[140%]">
                  Select All
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="name"
                  onChange={() => handleFilterCheckboxChange("name")}
                  checked={selectedFilters.includes("name")}
                />
                <label
                  htmlFor="name"
                  className="text-base font-normal leading-[140%]"
                >
                  Name
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="email"
                  onChange={() => handleFilterCheckboxChange("email")}
                  checked={selectedFilters.includes("email")}
                />
                <label
                  htmlFor="email"
                  className="text-base font-normal leading-[140%]"
                >
                  Email
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="address"
                  onChange={() => handleFilterCheckboxChange("address")}
                  checked={selectedFilters.includes("address")}
                />
                <label
                  htmlFor="address"
                  className="text-base font-normal leading-[140%]"
                >
                  Address
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mobile"
                  onChange={() => handleFilterCheckboxChange("mobile")}
                  checked={selectedFilters.includes("mobile")}
                />
                <label
                  htmlFor="mobile"
                  className="text-base font-normal leading-[140%]"
                >
                  Mobile
                </label>
              </div>
              <div
                onClick={() => setFilterPopupSvg(false)}
                className="flex justify-end"
              >
                <button className="bg-[#0832DE] text-white px-[15px] py-2 rounded-[10px] flex items-center capitalize">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBlockedOnly && (
        <BlockedUserPopups
          blockedUsers={users.filter(user => user?.accountStatus?.isBlocked === true && user?.userType !== "Rider")}
          onClose={() => setShowBlockedOnly(false)}
          onUnblock={handleUnblockUser}
        />
      )}
    </div>
  );
};

export default CustomerData;