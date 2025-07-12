import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DisableRedicon,
  EnableRedIcon,
} from "../../assets/icon/Icons";
import MechanicImage from "../../assets/png/user-profile-icon.png";
import DisableProviderPopUp from "../../Components/Popups/DisableProviderPopUp";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";

function RiderDetails() {
  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [showPopupDisable, setShowPopupDisable] = useState(false);
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

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('RiderDetailsView')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        toast.error("Failed to update rider status");
      } else {
        setRider(prev => ({ ...prev, status: newStatus }));
        toast.success(`Rider ${newStatus.toLowerCase()} successfully`);
      }
    } catch (err) {
      console.error("Error updating rider status:", err);
      toast.error("Something went wrong");
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!rider) return <div className="flex justify-center items-center h-64">Rider not found</div>;



  return (
    <div className="px-4">
      

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

             
            </div>

            <div className="flex items-center mt-3 xl:mt-[15px]">
              <div className="w-4/12">
                <h2 className="font-medium text-sm xl:text-base text-black">
                  User ID:
                </h2>
              </div>
              <div className="w-10/12">
                <h2 className="text-[#000000B2] text-sm xl:text-base font-normal">
                  {rider?.userId}
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
          userId={id}
          currentStatus={rider?.status === "Inactive" ? "blocked" : "active"}
          refetchUser={fetchRiderData}
        />
      )}
    </div>
  );
}

export default RiderDetails;
