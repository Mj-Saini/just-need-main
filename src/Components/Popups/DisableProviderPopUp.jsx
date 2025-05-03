import React, { useState } from "react";
import { PopupsArrowBlock } from "../../assets/icon/Icons";
import { StatusCloseIcon } from "../../assets/icon/Icons";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";

function DisableProviderPopUp({ handlePopupDisable, userId }) {
  // Added userId prop
  const [popUpData, setPopUpData] = useState({
    status: "Block", // Set default value
    reason: "",
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setPopUpData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleUpdate = async () => {
    // Check if reason is empty
    if (!popUpData.reason.trim()) {
      toast.info("Please write a reason");
      setError("Please write a reason");
      return;
    }

    try {
      // Determine the new account status
      const newStatus = popUpData.status === "Block" ? "inactive" : "active";

      // Update the users table in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({
          accountStatus: newStatus,
          // Optionally store the reason too
        })
        .eq("id", userId); // Assuming userId identifies the user

      if (error) throw error;

      toast.success("Update successful:", popUpData);
      setSubmittedData(popUpData);
      handlePopupDisable(false);
      setError(null);
      // Optionally close the popup after successful update
      // handlePopupDisable();
    } catch (error) {
      toast.error("Error updating status:", error.message);
      setError("Failed to update status. Please try again.");
    }
  };

  return (
    <>
      <div
        onClick={() => handlePopupDisable()}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 h-[368px] w-[448px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
          <button
            className="absolute right-[25px]"
            onClick={() => handlePopupDisable()}
          >
            <StatusCloseIcon />
          </button>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-base font-normal text-gray-700 mb-2.5 mt-2.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={popUpData.status}
                onChange={handleOnChange}
                className="w-full px-[20px] pr-[40px] py-[13px] bg-[#F2F2F2] rounded-[7px] font-normal text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Block">Block</option>
                <option value="Unblock">Unblock</option>
              </select>
              <span className="absolute right-[13px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                <PopupsArrowBlock />
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block font-normal text-base mb-2.5"
            >
              Reason
            </label>
            <textarea
              name="reason"
              onChange={handleOnChange}
              value={popUpData.reason}
              placeholder="type here.."
              className={`w-full h-28 px-3 py-2 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                error ? "border-red-500" : "border-none"
              }`}
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-[#0832DE] text-base text-white font-medium py-2.5 h-[42px] rounded-[10px] hover:bg-[#0621b5] transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </>
  );
}

export default DisableProviderPopUp;
