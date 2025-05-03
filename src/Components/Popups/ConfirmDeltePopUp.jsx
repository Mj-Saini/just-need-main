/* eslint-disable react/prop-types */
import { useSubscriptionContext } from "../../store/SubscriptionContext";

const ConfirmDeltePopUp = ({ deleteId, onCancel }) => {
  const { deletePlan } = useSubscriptionContext();

  const handleConfirmDelete = async () => {
    const result = await deletePlan(deleteId);
    if (result.success) {
      onCancel(); // Close popup on success
    } else {
      console.error("Failed to delete plan:", result.error);
    }
  };

  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 w-[300px] m-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          <p className="text-lg font-normal text-black text-center mb-4">
            Are you sure you want to delete this plan?
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmDelete}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-[10px] font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full py-2 px-4 bg-gray-200 text-black rounded-[10px] font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeltePopUp;