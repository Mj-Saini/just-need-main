
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPopupDisable, setShowPopupDisable] = useState(false);
  const [showDenialPopup, setShowDenialPopup] = useState(false);
  const [denialType, setDenialType] = useState("");
  const [listings, setListings] = useState([]);
  const [riderDetails, setRiderDetails] = useState(null);

  const { setUsers, loading, setLoading } = useCustomerContext();
  const { fetchlisting } = useListingContext();

  const { setUserName } = useUserContext()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

  const [userbusinessDetails, setUserBusinessDetails] = useState([])

  const fetchBusinessData = async () => {
    setLoading(true);

    try {
      // Step 1: Directly get full data from BusinessDetailsView
      const { data: businessUser, } = await supabase
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
        .from('RiderDetailsView')
        .select('*')
        .eq('userId', id)
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

  // Run it on mount
  useEffect(() => {
    fetchData();
    fetchBusinessData();
    fetchRiderData();
  }, [id]);

  // Handle disable/enable provider popup
  const handlePopupDisable = () => {
    setShowPopupDisable(!showPopupDisable);
  };

  // Handle block/unblock listing
  const handleBlock = async (e, listing) => {
    e.preventDefault();
    
    // If we're blocking (not unblocking), show denial popup
    if (!listing.blockStatus.isBlocked) {
      setDenialType("listing");
      setShowDenialPopup(true);
      return;
    }

    // For unblocking, proceed with simple confirmation
    const confirmUnblock = window.confirm("Are you sure you want to unblock this listing?");
    if (confirmUnblock) {
      const updatedBlockStatus = {
        isBlocked: false,
        reason: "",
        blockedBy: "admin",
      };

      const { error } = await supabase
        .from("ServiceListings")
        .update({ blockStatus: updatedBlockStatus })
        .eq("id", listing.id);

      if (!error) {
        setListings((prev) =>
          prev.map((item) =>
            item.id === listing.id
              ? { ...item, blockStatus: updatedBlockStatus }
              : item
          )
        );
        toast.success("Listing unblocked successfully");
      } else {
        console.error("Error updating block status:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

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

  const approveUser = async () => {
    const confirmApprove = window.confirm("Are you sure you want to approve this user?");
    if (!confirmApprove) return;

    if (!userbusinessDetails || !userbusinessDetails?.businessId) {
      toast.error("User data not found or invalid Business ID");
      return;
    }

    try {

      const { error } = await supabase
        .from('BusinessDetailsView')
        .update({ status: 'Approved' })
        .eq('businessId', userbusinessDetails.businessId)
        .select();

      if (error) {
        toast.error("Failed to update business status");
      } else {
        toast.success("Business status updated successfully");

        setUser((prevUser) => ({
          ...prevUser,
          businessDetail: { ...prevUser.businessDetail, status: 'Approved' }
        }));
        setUsers((prevUser) => ({
          ...prevUser,
          businessDetail: { ...prevUser.businessDetail, status: 'Approved' }
        }));
      }
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRiderStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('RiderDetailsView')
        .update({ status: newStatus })
        .eq('userId', id);

      if (error) {
        toast.error("Failed to update rider status");
      } else {
        setRiderDetails(prev => ({ ...prev, status: newStatus }));
        toast.success(`Rider ${newStatus.toLowerCase()} successfully`);
        
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
                          status: newStatus
                        }
                      }
                    : u
                )
              : prevUsers
          );
        }
      }
    } catch (err) {
      console.error("Error updating rider status:", err);
      toast.error("Something went wrong");
    }
  };

  console.log(user, "user")

  return (
    <div className="px-4">

      <div className="flex items-center justify-end">

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
        </div>

      </div>

      <div className="xl:flex mt-[30px]">
        <div className="w-full lg:w-7/12 xl:w-[399px] xl:pe-2.5 lg:flex">
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
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-normal text-white">
                    Subscription: {user?.subscription === "null" ? "N/A" : "Yes"}
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
                    UPI: {user?.upi_id === "null" ? "N/A" : user?.upi_id || "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details for Seller */}
        {user?.userType === "Seller" && (
          <div className="w-full lg:w-7/12 xl:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
            <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                  Business details
                </p>

                {userbusinessDetails?.status === "Pending" ?

                  <div className="flex gap-4 items-center">
                    <button
                      onClick={approveUser}
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

                  </div> : <span
                    className={`px-2 py-1 rounded-full text-xs ${userbusinessDetails?.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {userbusinessDetails?.status}
                  </span>}
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
                    {userbusinessDetails?.categories?.map((category) => (
                      <span key={category.id}>
                        {category.categoryName}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
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
                      onClick={() => handleRiderStatusUpdate("Active")}
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
                    className={`px-2 py-1 rounded-full text-xs ${
                      riderDetails?.status === "Active"
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

      {/* Show listings only for Seller userType */}
      {user?.userType === "Seller" && (
        <>
          <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066] mt-[30px]">
            Posted Listing
          </p>

          <div className="flex flex-row flex-wrap -mx-3">
            {listings.length > 0 ? (listings?.map((item) => (
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
              <p className="text-center text-gray-500 text-lg mt-5 w-full">No Data Found</p>
            )}
          </div>
        </>
      )}

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
          itemId={denialType === "business" ? userbusinessDetails?.businessId : denialType === "listing" ? null : id}
          currentStatus={user?.status}
          refetchData={denialType === "business" ? fetchBusinessData : denialType === "rider" ? fetchRiderData : undefined}
          setUsers={setUsers}
        />
      )}
    </div>
  );
}

export default UserDetails;