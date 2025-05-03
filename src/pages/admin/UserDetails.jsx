/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import MechanicImage from "../../assets/Images/Png/dummyimage.jpg";
import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
import disable_img from "../../assets/png/disable_img.png";
import enable_img from "../../assets/png/enable_img.png";
import { useListingContext } from "../../store/ListingContext";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";
import { truncateText } from "../../utility/wordTruncate";
import { useCustomerContext } from "../../store/CustomerContext";
import { useUserContext } from "../../store/UserContext";
import { RightSvg } from "../../assets/icon/Icon";

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPopupDisable, setShowPopupDisable] = useState(false);
  const [listings, setListings] = useState([]);
  const [approveUsers, setUpproveUsers] = useState(false);

  const { users, loading, setLoading } = useCustomerContext();
  const { fetchlisting } = useListingContext();

  const { setUserName } = useUserContext()


  // Fetch user details and listings
  useEffect(() => {
    const fetchData = async () => {
      if (users && users.length > 0) {
        const foundUser = users.find((user) => user.id === id);
        if (foundUser) {
          setUser(foundUser);
          if (setUser) {
            setUserName(foundUser?.firstName)
          }

          const listingVal = await fetchlisting();
          const filteredListings = listingVal?.filter(
            (item) => item?.user_detail?.id === id
          );
          setListings(filteredListings || []);
        } else {
          console.error("User not found");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [users, id, setLoading, fetchlisting]);




  // Handle disable/enable provider popup
  const handlePopupDisable = () => {
    setShowPopupDisable(!showPopupDisable);
  };

  // Handle block/unblock listing
  const handleBlock = async (e, listing) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      const updatedBlockStatus = {
        isBlocked: !listing.blockStatus.isBlocked,
        reason: listing.blockStatus.reason || "",
        blockedBy: listing.blockStatus.blockedBy || "admin",
      };

      const { data, error } = await supabase
        .from("service_listings")
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
        toast.success("Update successful");
      } else {
        console.error("Error updating block status:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isActive = user.accountStatus === "active";


  // const userDenied = async () => {
  //   const confirmDelete = window.confirm("Are you sure you want to deny this user?");
  //   if (!confirmDelete) return;

  //   const { error } = await supabase
  //     .from("users")
  //     .delete()
  //     .eq("id", user.id);

  //   if (!error) {
  //     toast.success("User denied and removed successfully");
  //     setUser(null);
  //   } else {
  //     console.error("Error deleting user:", error);
  //     toast.error("Failed to deny user. Please try again.");
  //   }
  // };


  const userDenied = async () => {
    const confirmDeny = window.confirm("Are you sure you want to deny this user?");
    if (!confirmDeny) return;

    const { error } = await supabase
      .from("users")
      .update({ "businessDetail.status": "Rejected" })
      .eq("id", user.id);

    if (!error) {
      toast.success("User denied successfully");
      // Optionally update local user state if needed
      setUser(prev => ({
        ...prev,
        businessDetail: {
          ...prev.businessDetail,
          status: "Rejected"
        }
      }));
    } else {
      console.error("Error denying user:", error);
      toast.error("Failed to deny user. Please try again.");
    }
  };


  const approveUser = async () => {
    const confirmApprove = window.confirm("Are you sure you want to approve this user?");
    if (!confirmApprove) return;

    if (!user || !user.businessDetail.businessId) {
      toast.error("User data not found or invalid Business ID");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Businessdetailsview')
        .update({ status: 'Approved' })
        .eq('businessId', user.businessDetail.businessId)
        .select();

      if (error) {
        toast.error("Failed to update business status");
      } else {
        toast.success("Business status updated successfully");

        // ✅ Approve के बाद तुरंत UI अपडेट करें
        setUser((prevUser) => ({
          ...prevUser,
          businessDetail: { ...prevUser.businessDetail, status: 'Approved' }
        }));
      }
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
      toast.error("An unexpected error occurred.");
    }
  };



  return (
    <div className="px-4">
      <div className="flex items-center justify-center">
  

        {user.IsSeller ? (
          user.businessDetail.status === "Approved" ? (
            // ✅ Seller Approved => Show Block/Enable Button
            <button
              onClick={handlePopupDisable}
              className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
            >
              {isActive ? (
                <>
                  <DisableRedicon />
                  <span className="text-black font-normal text-base">Block Provider</span>
                </>
              ) : (
                <>
                  <EnableRedIcon />
                  <span className="text-black font-normal text-base">Enable Provider</span>
                </>
              )}
            </button>
          ) : (
            // ❌ Seller NOT Approved => Show Approve/Deny Buttons
            <div className="flex gap-4">
              <button
                  onClick={approveUser}
                className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-green-500 text-white"
              >
                Approve
              </button>
              <button
                  onClick={userDenied}
                className="flex items-center gap-3 py-2.5 h-[42px] px-4 xl:px-[15px] rounded-[10px] bg-red-500 text-white"
              >
                Deny
              </button>
            </div>
          )
        ) : (
          // 🔹 Normal User => Show Block/Enable Button
          <button
            onClick={handlePopupDisable}
            className="flex items-center gap-3 py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px]"
          >
            {isActive ? (
              <>
                <DisableRedicon />
                <span className="text-black font-normal text-base">Block Provider</span>
              </>
            ) : (
              <>
                <EnableRedIcon />
                <span className="text-black font-normal text-base">Enable Provider</span>
              </>
            )}
          </button>
        )}



      </div>


      <div className="xl:flex mt-[30px]">
        <div className="w-full lg:w-7/12 xl:w-[399px] xl:pe-2.5 lg:flex">
          <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] flex-grow flex">
            <div className="flex items-center">
              <div className="pe-5 border-e-[1px] border-[#FFFFFF66]">
                <img
                  className="w-[78px] h-[78px] rounded-full object-cover"
                  src={user?.image || MechanicImage}
                  alt="user"
                />
                <h1 className="font-medium lg:text-base xl:text-lg text-white mt-2.5 text-center">
                  {user?.firstName}
                </h1>
                <h2 className="text-sm font-normal text-white mt-1 text-center">
                  {user?.category}
                </h2>
              </div>
              <div className="ps-5">
                <div className="flex gap-2.5 items-center">
                  <PhoneIcon />
                  <h3 className="text-sm font-normal text-white">
                    {user?.mobile_number}
                  </h3>
                </div>
                <div className="flex gap-2.5 items-center mt-2.5">
                  <EmailIcon />
                  <h3 className="text-sm font-normal text-white">
                    {user?.useremail}
                  </h3>
                </div>
                <div className="flex gap-2.5 items-center mt-2.5">
                  <LocationIcon />
                  <h3 className="text-sm font-normal text-white">
                    <h3 className="text-sm font-normal text-white">
                      {user?.address?.city && user?.address?.state
                        ? `${user.address.city} ${user.address.state}`
                        : "N/A"}
                    </h3>

                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user?.IsSeller && (
          <div className="w-full lg:w-7/12 xl:w-[646px] xl:ps-2.5 mt-3 xl:mt-0 flex">
            <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7 flex-grow flex flex-col">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                Business details
              </p>
              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Business Name:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {user?.businessDetail?.businessName}
                  </h2>
                </div>
              </div>
              <div className="flex items-center mt-3 xl:mt-[15px]">
                <div className="w-4/12">
                  <h2 className="font-medium text-sm xl:text-base text-black">
                    Service Name:
                  </h2>
                </div>
                <div className="w-10/12">
                  <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                    {user?.businessDetail?.description}
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
                    {user?.businessDetail?.categories?.map((item, index) => (
                      <span key={index}>
                        {item.categoryName}
                        {index < user.businessDetail.categories.length - 1 && ', '}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {user?.IsSeller && (
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

      {showPopupDisable && (
        <DisableProviderPopUp
          handlePopupDisable={handlePopupDisable}
          userId={id}
        />
      )}
    </div>
  );
}

export default UserDetails;