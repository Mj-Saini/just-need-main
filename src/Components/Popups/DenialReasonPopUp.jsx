/* eslint-disable react/prop-types */
import { useState } from "react";
import { StatusCloseIcon } from "../../assets/icon/Icons";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";

function DenialReasonPopUp({ 
  handleClose, 
  userId, 
  type, // "business", "rider", or "listing"
  itemId, // businessId, riderId, or listingId
  refetchData,
  setUsers 
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setError(null);
  };

  const getTitle = () => {
    switch (type) {
      case "business":
        return "Deny Business";
      case "rider":
        return "Deny Rider";
      case "listing":
        return "Deny Listing";
      default:
        return "Deny";
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "business":
        return "Type reason for denying this business...";
      case "rider":
        return "Type reason for denying this rider...";
      case "listing":
        return "Type reason for denying this listing...";
      default:
        return "Type reason for denial...";
    }
  };

  const handleDeny = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for denial");
      toast.info("Please provide a reason for denial");
      return;
    }

    setLoading(true);
    try {
      let updateData = {
        status: "Rejected",
        rejectedReason: reason
      };

      let tableName = "";
      let idField = "";

      switch (type) {
        case "business":
          tableName = "BusinessDetailsView";
          idField = "businessId";
          break;
        case "rider":
          tableName = "RiderDetailsView";
          idField = "userId";
          break;
        case "listing":
          tableName = "ServiceListings";
          idField = "id";
          updateData = {
            ...updateData,
            blockStatus: {
              isBlocked: true,
              reason: reason,
              blockedBy: "admin",
              blockedAt: new Date().toISOString()
            }
          };
          break;
        default:
          throw new Error("Invalid type");
      }

      const { error: supabaseError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq(idField, itemId)
        .select();

      if (supabaseError) throw supabaseError;

      // Update local state if setUsers is provided
      if (setUsers && type === "business") {
        setUsers((prevUsers) =>
          Array.isArray(prevUsers)
            ? prevUsers.map((u) =>
                u.id === userId
                  ? {
                      ...u,
                      businessDetail: {
                        ...u.businessDetail,
                        status: "Rejected",
                        rejectedReason: reason
                      }
                    }
                  : u
              )
            : prevUsers
        );
      }

      toast.success(`${getTitle()} successful!`);
      
      if (refetchData) {
        await refetchData();
      }
      
      handleClose();
    } catch (error) {
      console.error("Error denying:", error);
      toast.error("Failed to deny. Please try again.");
      setError("Failed to deny. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 h-[400px] w-[448px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
          <button className="absolute right-[25px] top-[25px]" onClick={handleClose}>
            <StatusCloseIcon />
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {getTitle()}
            </h2>
            <p className="text-gray-600 text-sm">
              Please provide a reason for denying this {type}.
            </p>
          </div>

          <div className="mb-6">
            <label className="block font-normal text-base mb-2.5">
              Reason for Denial
            </label>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              placeholder={getPlaceholder()}
              className={`w-full h-32 px-3 py-2 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                error ? "border-red-500" : "border-none"
              }`}
              disabled={loading}
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 h-[42px] rounded-[10px] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeny}
              disabled={loading}
              className="flex-1 bg-red-600 text-white font-medium py-2.5 h-[42px] rounded-[10px] hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Denying..." : "Deny"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DenialReasonPopUp; 