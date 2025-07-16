import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MechanicImage from "../../assets/png/user-profile-icon.png";
import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
import DenialReasonPopUp from "../../Components/Popups/DenialReasonPopUp";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";
import { DisableRedicon, EnableRedIcon } from "../../assets/icon/Icons";

function RiderDetails() {
  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [user, setUser] = useState(null); // user object for block/unblock
  const [showPopupDisable, setShowPopupDisable] = useState(false);
  const [showDenialPopup, setShowDenialPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handlePopupDisable = () => {
    setShowPopupDisable(!showPopupDisable);
  };

  // Use user.accountStatus for block/unblock
  const isBlocked = user?.accountStatus?.isBlocked === true;

  const handleApprove = async () => {
    try {
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
      }
    } catch (err) {
      console.error("Error approving rider:", err);
      toast.error("Something went wrong");
    }
  };

  const handleDeny = () => {
    setShowDenialPopup(true);
  };

  const handleDenialClose = () => {
    setShowDenialPopup(false);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!rider) return <div className="flex justify-center items-center h-64">Rider not found</div>;



  return (
    <div className="px-4">
      {/* Block/Unblock Button - always visible */}
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
      </div>

        {/* Full width blue container with profile picture */}
        <div className="bg-[#6C4DEF] px-[30px] py-5 rounded-[10px] w-full flex ">
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
            </div>
          </div>
             {/* Rider Details Section */}
        <div className=" w-4/5">
          <div className="bg-[#F1F1F1] rounded-[10px] p-[15px] pb-7">
            <div className="flex items-center justify-between">
              <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
                Rider Details
              </p>

              {/* Approve/Deny buttons for pending riders or status display for others */}
              {rider?.status === "Pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
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
                    className={`px-3 py-2 rounded-[10px] text-sm font-medium ${
                      rider?.status === "Approved"
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
          handleClose={handleDenialClose}
          userId={rider?.userId}
          type="rider"
          itemId={rider?.userId}
          currentStatus={rider?.status}
          refetchData={fetchRiderData}
        />
      )}
    </div>
  );
}

export default RiderDetails;
