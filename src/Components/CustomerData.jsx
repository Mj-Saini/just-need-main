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
  const [selectedFilters, setSelectedFilters] = useState(["name"]);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search");
  const [selectAll, setSelectAll] = useState(false);


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

  const { users, setUsers, loading } = useCustomerContext();
  const [filteredUsers, setFilteredUsers] = useState(users);
  // Filter logic based on selected fields
  const filteredData = users?.filter((customer) => {
    if (selectedFilters.length === 0) {
      return (customer.firstName + " " + customer.lastName)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()); // Default to name search when no filters
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


  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const [paginatedData, setPaginatedData] = useState([]);
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

  // Individual checkbox handler
  const checkHandler = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      const newSelectedItems = [...selectItem, value];
      setSelectItem(newSelectedItems);
      const currentPageIds = paginatedData.map((item) => item.id);
      setMainCheckbox(
        currentPageIds.every((id) => newSelectedItems.includes(id))
      );
    } else {
      const newSelectedItems = selectItem.filter((id) => id !== value);
      setSelectItem(newSelectedItems);
      setMainCheckbox(false);
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

  // Confirm delete handler (works for both single and multiple users)
  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .in("id", selectItem);

      if (error) throw error;

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectItem.includes(user.id))
      );
      setSelectItem([]);
      setMainCheckbox(false);
      setShowDeletePopup(false);
      toast.success(
        `Successfully deleted.`
      );
    } catch (err) {
      console.error("Error deleting users:", err);
      toast.error("Failed to delete users. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectItem([]); // Clear selection after canceling
  };

  const location = useLocation();
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
      setSelectedFilters([]); // Clear filters
      setSearchPlaceholder("Search Name"); // Revert to "Search Name"
    }
  };

  // Handle individual filter checkbox change
  const handleFilterCheckboxChange = (field) => {
    const updatedFilters = selectedFilters.includes(field)
      ? selectedFilters.filter((f) => f !== field)
      : [...selectedFilters, field];
    setSelectedFilters(updatedFilters);

    // Update "Select All" state
    const allFilters = ["name", "email", "address", "mobile"];
    setSelectAll(allFilters.every((f) => updatedFilters.includes(f)));

    // Update placeholder based on selected filters
    if (updatedFilters.length === 0) {
      setSearchPlaceholder("Search Name"); // Always "Search Name" when no filters
    } else {
      setSearchPlaceholder(
        `Search ${updatedFilters
          .map((f) => f.charAt(0).toUpperCase() + f.slice(1))
          .join(", ")}`
      );
    }
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
    let updatedUsers = users;
    console.log(filters, "Filters Applied");

    // **Filter by User Type (Seller / Consumer)**
    if (filters.selectedUserType) {
      updatedUsers = updatedUsers.filter(user => {
        if (filters.selectedUserType === "Seller") {
          return user.IsSeller === true;
        } else if (filters.selectedUserType === "Consumer") {
          return user.IsSeller === false;
        }
        return true;
      });
    }

    // **Filter by Profile Status**
    if (filters.profileStatus) {
      updatedUsers = updatedUsers.filter(user => user.profileStatus === filters.profileStatus);
    }

    // **Filter by Business Status**
    if (filters.businessStatus) {
      updatedUsers = updatedUsers.filter(user => user.businessDetail?.status === filters.businessStatus);
    }

    // **Filter by Subscription Status**
    if (filters.subscriptionStatus) {
      updatedUsers = updatedUsers.filter(user => user.verificationStatus === filters.subscriptionStatus);
    }

    console.log(updatedUsers, "Updated Users After Filtering");

    // **Update States**
    setFilteredUsers(updatedUsers);
    setCurrentPage(1); // Pagination reset

    // **Paginate Data**
    const startIndex = 0;
    const endIndex = Math.min(itemsPerPage, updatedUsers.length);
    setPaginatedData(updatedUsers.slice(startIndex, endIndex));
  };




  return (
    <div className="bg-[#FFFFFF] p-5 rounded-[10px]">
      <div className="flex justify-between items-center mt-[15px]">
        <div className="flex items-center gap-6">
          <h2 className="text-base xl:text-[20px] font-medium text-[#000000] opacity-70">
            Users List
          </h2>
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
        </div>
      </div>
      <div className="overflow-x-auto  mt-5">
        <table className="w-full text-left border-separate border-spacing-4 whitespace-nowrap rounded-[10px]">
          <thead>
            <tr className="py-[8px]">
              <th className="px-[19px] py-[8px] md:px-[24px]">
                <input
                  className="w-[16px] h-[16px]"
                  type="checkbox"
                  checked={mainCheckbox}
                  onChange={handleMainCheckboxChange}
                />
              </th>
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                Full Name
              </th>
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                Email
              </th>
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[150px]">
                Mobile
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
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base w-[200px]">
                Updated At
              </th>
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                Profile Status
              </th>
              <th className="px-[19px] py-[8px] md:px-[24px] font-medium text-sm md:text-base">
                Business Profile
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
              paginatedData.map((customer) => {
console.log(customer,"customer")
                return (
                  <tr key={customer.id}>
                    <td className="px-[19px] md:px-[24px]">
                      <input
                        className="w-[16px] h-[16px]"
                        type="checkbox"
                        onChange={checkHandler}
                        checked={selectItem.includes(customer.id)}
                        value={customer.id}
                      />
                    </td>
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
                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000] w-[120px] truncate">
                      {Array.isArray(customer?.address) && customer.address.length > 0
                        ? customer.address.map((item) => `${item.city}/${item.state}`).join(", ")
                        : "N/A"}

                    </td>
                    <td
                      className={`px-[19px] text-sm font-normal truncate ${customer.IsSeller == true
                        ? "bg-[#0000FF12] text-[#0000FF] rounded-[90px]"
                        : "text-[#FFA500] bg-[#FFA50024] rounded-[90px]"
                        }`}
                    >
                      <div className="flex justify-center">
                        <span>
                          {customer.IsSeller === true ? "Seller" : "Consumer"}
                        </span>
                      </div>
                    </td>
                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-[19px] md:px-[24px] text-sm font-normal text-[#000000]">
                      {formatDate(customer.updated_at)}
                    </td>
                    <td>
                      <div className="flex justify-center items-center">
                        <span
                          className={`px-[10px] py-[4px] text-sm font-normal text-center ${customer?.accountStatus?.toLowerCase() === "active"
                            ? "bg-[#00800012] text-[#008000] rounded-[90px]"
                            : "text-[#800000] rounded-[90px] bg-[#FF000012]"
                            }`}
                        >
                          {customer.accountStatus?.toLowerCase() === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center items-center">
                        {customer.IsSeller ? (
                          <span
                            className={`px-[10px] py-[4px] text-sm font-normal text-center rounded-[90px] ${!customer?.businessDetail?.status
                              ? "bg-gray-100 text-gray-500"
                              : customer.businessDetail.status === "Pending"
                                ? "bg-[#6C4DEF1A] text-[#6C4DEF]"
                                : customer.businessDetail.status === "Rejected"
                                  ? "bg-[#FF00001A] text-[#800000]"
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
                    <td className="px-[19px] md:px-[24px] text-center bg-white">
                      <Link to={`/dashboard/usersList/userDetails/${customer.id}`}>
                        <button className="text-2xl font-medium">
                          <EyeIcon />
                        </button></Link>
                      <button
                        className="text-2xl font-medium ms-[6px]"
                        onClick={() => handleSingleDeleteClick(customer.id)}
                      >
                        <DeleteRedIcon />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
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
                    {[5, 10, 15, 20].map((item) => (
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
    </div>
  );
};

export default CustomerData;