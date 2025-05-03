import { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import Logo from "../../assets/logo.png"; // Default logo image
import { toast } from "react-toastify";
import { supabase } from "../../store/supabaseCreateClient"; // Supabase client
import { DiscardIcon, UpdateIcon } from "../../assets/icon/Icon";

function SettinGeneral() {
  // State for form fields
  const [image, setImage] = useState(Logo); // Platform logo
  const [primaryColor, setPrimaryColor] = useState("#6C4DEF"); // Primary theme color
  const [secondaryColor, setSecondaryColor] = useState("#F1F1F1"); // Secondary theme color
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false); // Toggle primary color picker
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false); // Toggle secondary color picker
  const [title, setTitle] = useState(""); // Application title
  const [email, setEmail] = useState(""); // Contact email
  const [whatsapp, setWhatsapp] = useState(""); // WhatsApp number
  const [tollFree, setTollFree] = useState(""); // Toll-free number
  const [supportEmail, setSupportEmail] = useState(""); // Support email
  const [accountDeleteLink, setAccountDeleteLink] = useState(""); // Account deletion URL
  const [discardPopup, setDiscardPopup] = useState(false); // New state for discard confirmation
  const [updatePopup, setUpdatePopup] = useState(false); // New state for update confirmation

  // Refs for color picker elements to detect outside clicks
  const primaryColorPickerRef = useRef(null);
  const secondaryColorPickerRef = useRef(null);

  // Handle image file upload and preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Create temporary URL for preview
      setImage(imageURL);
    }
  };

  // Fetch existing configuration from Supabase on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from("Config").select("*"); // Fetch all config data
      if (error) throw error;
      console.log("Fetched Config Data:", data);
      if (data && data.length > 0) {
        const config = data[0]; // Use first record (modify if multiple records exist)
        setImage(config.logo || Logo); // Set logo or default
        setPrimaryColor(config.theme?.primaryColor || "#6C4DEF"); // Set primary color or default
        setSecondaryColor(config.theme?.secondaryColor || "#F1F1F1"); // Set secondary color or default
        setTitle(config.title || ""); // Set title or empty
        setEmail(config.email || ""); // Set email or empty
        setWhatsapp(config.whatsapp || ""); // Set WhatsApp or empty
        setTollFree(config.tollFree || ""); // Set toll-free or empty
        setSupportEmail(config.supportEmail || ""); // Set support email or empty
        setAccountDeleteLink(config.deletionLink || ""); // Set deletion link or empty
      }
    } catch (error) {
      toast.error("Error fetching config: " + error.message);
      console.error("Fetch Error:", error);
    }
  };

  // Update configuration in Supabase
  const handleUpdateConfirm = async () => {
    try {
      const newConfig = {
        title: title,
        email: email,
        platformlogo: image, // Note: If using Supabase Storage, replace with uploaded URL
        theme: {
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
        },
        whatsapp: whatsapp,
        tollFree: tollFree,
        deletionLink: accountDeleteLink,
        underMaintenance: false, // Static value; adjust as needed
        supportEmail: supportEmail,
      };

      // Update record in Supabase (assuming ID = 4; adjust as needed)
      const { error } = await supabase
        .from("Config")
        .update(newConfig)
        .eq("id", 4); // Replace '4' with dynamic ID if required

      if (error) throw error;

      toast.success("Data updated in Supabase successfully!");
      console.log("Updated Data:", newConfig);
      setUpdatePopup(false); // Close popup after update
    } catch (error) {
      toast.error("Error updating data: " + error.message);
      console.error("Update Error:", error);
      setUpdatePopup(false); // Close popup even on error
    }
  };

  const handleUpdate = () => {
    setUpdatePopup(true); // Show confirmation popup
  };

  // Reset all fields to their initial/default values
  const handleDiscardConfirm = () => {
    setImage(Logo); // Reset to default logo
    setPrimaryColor("#6C4DEF"); // Reset to default primary color
    setSecondaryColor("#F1F1F1"); // Reset to default secondary color
    setTitle(""); // Clear title
    setEmail(""); // Clear email
    setWhatsapp(""); // Clear WhatsApp
    setTollFree(""); // Clear toll-free number
    setSupportEmail(""); // Clear support email
    setAccountDeleteLink(""); // Clear account deletion link
    setShowPrimaryPicker(false); // Close primary color picker
    setShowSecondaryPicker(false); // Close secondary color picker
    toast.info("All fields have been reset."); // Optional: Notify user
    setDiscardPopup(false); // Close popup after discard
  };

  const handleDiscard = () => {
    setDiscardPopup(true); // Show confirmation popup
  };

  // Handle outside clicks to close color pickers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        primaryColorPickerRef.current &&
        !primaryColorPickerRef.current.contains(e.target) &&
        !e.target.closest(".chrome-picker") // Exclude clicks within the picker itself
      ) {
        setShowPrimaryPicker(false);
      }
      if (
        secondaryColorPickerRef.current &&
        !secondaryColorPickerRef.current.contains(e.target) &&
        !e.target.closest(".chrome-picker") // Exclude clicks within the picker itself
      ) {
        setShowSecondaryPicker(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick); // Cleanup on unmount
  }, []);

  return (
    <div className="p-[15px] bg-white rounded-[10px]">
      {/* Action Buttons */}
      <div className="flex items-center justify-end">
        <div>
          <button
            onClick={handleDiscard} // Trigger discard popup
            className="text-base font-normal text-black py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#F1F1F1] me-[15px]"
          >
            Discard
          </button>
          <button
            onClick={handleUpdate} // Trigger update popup
            className="text-base font-normal text-white py-2.5 h-[42px] px-[28px] rounded-[10px] bg-[#0832DE]"
          >
            Update
          </button>
        </div>
      </div>
      <div className="mt-[15px] border-t-[1px] border-[#00000033]"></div>

      {/* General Settings Section */}
      <div className="py-5 mt-[15px]">
        <div className="flex items-center flex-wrap justify-between">
          <div className="flex items-center justify-between lg:w-[48%] gap-5">
            <label
              htmlFor="title"
              className="min-w-[160px] text-base font-normal text-black"
            >
              Title:
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Application Title"
              className="py-3 h-[42px] px-[15px] w-full rounded-[10px] bg-[#F2F2F2] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] border-none"
            />
          </div>
          <div className="flex items-center justify-between lg:w-[48%] gap-5 mt-4 lg:mt-0">
            <label
              htmlFor="email"
              className="min-w-[160px] text-base font-normal text-black"
            >
              Email Address:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="py-3 h-[42px] px-[15px] w-full rounded-[10px] bg-[#F2F2F2] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] border-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center mt-[30px]">
          <p className="min-w-[160px] text-base font-normal text-black">
            Platform Logo:
          </p>
          <div className="border-[1px] border-[#00000033] rounded-[10px] w-[90px] h-[90px]">
            <img
              className="w-full h-full object-cover rounded-[10px]"
              src={image}
              alt="Platform Logo"
            />
          </div>
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-center border-[1px] border-[#00000033] rounded-[10px] bg-white ps-4 w-full justify-between xl:w-[500px]"
          >
            <input
              type="text"
              value={image}
              readOnly
              className="px-2 w-[250px] xl:w-[356px] text-sm text-gray-600 bg-white pe-4 py-3 h-[42px] outline-none border-none"
            />
            <div className="bg-[#335ACB1A] border-s-[1px] border-[#00000033] rounded-[10px] py-3 h-[42px] px-4 text-sm font-medium text-gray-700">
              Upload Image
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:items-center mt-[30px]">
          <p className="min-w-[160px] text-base font-normal text-black">
            Platform Appearance:
          </p>
          <div className="flex items-center gap-2.5 relative">
            <p className="min-w-[160px] text-base font-normal text-black">
              Primary Colour
            </p>
            <button
              className="px-[50px] lg:px-[15px] xl:px-[50px] py-3 h-[42px] rounded-[10px] text-white text-sm font-normal"
              style={{ backgroundColor: primaryColor }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling to document
                setShowPrimaryPicker(!showPrimaryPicker);
              }}
            >
              {primaryColor}
            </button>
            {showPrimaryPicker && (
              <div
                ref={primaryColorPickerRef}
                className="absolute z-10"
                style={{ top: "50px", left: "0" }} // Position below the button
              >
                <ChromePicker
                  color={primaryColor}
                  onChange={(color) => setPrimaryColor(color.hex)}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 relative">
            <p className="min-w-[160px] text-base font-normal text-black">
              Secondary Colour
            </p>
            <button
              className="px-[50px] lg:px-[15px] xl:px-[50px] py-3 h-[42px] rounded-[10px] text-black text-sm font-normal"
              style={{ backgroundColor: secondaryColor }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling to document
                setShowSecondaryPicker(!showSecondaryPicker);
              }}
            >
              {secondaryColor}
            </button>
            {showSecondaryPicker && (
              <div
                ref={secondaryColorPickerRef}
                className="absolute z-10"
                style={{ top: "50px", left: "0" }} // Position below the button
              >
                <ChromePicker
                  color={secondaryColor}
                  onChange={(color) => setSecondaryColor(color.hex)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-[15px] border-t-[1px] border-[#00000033]"></div>
      <h1 className="font-medium text-xl text-black leading-[35px]">
        Support and Assistance
      </h1>
      <p className="text-base font-normal opacity-70 text-black">
        Manage your platform Appearance
      </p>
      <div className="py-5 mt-[15px]">
        <div className="flex items-center justify-between gap-5">
          <label
            htmlFor="whatsapp"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]"
          >
            Whatsapp Support:
          </label>
          <input
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            id="whatsapp"
            name="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Enter Whatsapp Number"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="tollFree"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]"
          >
            Tollfree Number:
          </label>
          <input
            id="tollFree"
            name="tollFree"
            value={tollFree}
            onChange={(e) => setTollFree(e.target.value)}
            placeholder="Enter Tollfree Number"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="supportEmail"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]"
          >
            Support Email:
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            placeholder="support@example.com"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <label
            htmlFor="accountDeleteLink"
            className="text-base font-normal text-[#000000] min-w-[160px] xl:min-w-[260px]"
          >
            Account Deletion Link:
          </label>
          <input
            id="accountDeleteLink"
            name="accountDeleteLink"
            value={accountDeleteLink}
            onChange={(e) => setAccountDeleteLink(e.target.value)}
            placeholder="Enter Account Deletion Url"
            className="px-4 py-2.5 h-[42px] placeholder:text-sm placeholder:font-normal text-sm font-normal outline-[#0832DE] w-full border-[1px] border-[#00000033] rounded-[10px]"
          />
        </div>
      </div>

      {/* Discard Confirmation Popup */}
      {discardPopup && (
        <div
          onClick={() => setDiscardPopup(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[369px]">
            <div className="flex justify-center">
              <DiscardIcon />
            </div>
            <p className="text-black font-semibold text-xl mt-6 text-center">
              Are you sure you want to discard your changes?
            </p>
            <p className="font-normal text-base text-[#00000099] mt-3 text-center mb-10">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <div className="flex  gap-4">
              <button
                onClick={handleDiscardConfirm} // Confirm discard
                className="px-4 py-2 bg-[#0832DE] text-white rounded-lg w-full"
              >
                Discard
              </button>
              <button
                onClick={() => setDiscardPopup(false)} // Cancel discard
                className="px-4 py-2 bg-[#F1F1F1] font-normal text-base rounded-lg w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Confirmation Popup */}
      {updatePopup && (
        <div
          onClick={() => setUpdatePopup(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[369px]">
            <div className="flex justify-center">
              <UpdateIcon />
            </div>
            <p className="text-black font-semibold text-xl mt-6 text-center">
              Are you sure you want to save all changes?
            </p>
            <p className="font-normal text-base text-[#00000099] mt-3 text-center mb-10">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleUpdateConfirm} // Confirm update
                className="px-4 py-2 bg-[#0832DE] w-full text-white rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => setUpdatePopup(false)} // Cancel update
                className="px-4 w-full py-2 bg-[#F1F1F1] font-normal text-base text-black rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettinGeneral;
