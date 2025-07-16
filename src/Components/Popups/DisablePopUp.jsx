
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { BlackDisableIcon } from "../../assets/icon/Icon";

function DisablePopUp({
  onConfirm,
  onCancel,
  isActive,
  confirmText, // e.g., "Approve" or "Reject"
  icon, // new prop: React component or image URL
}) {
  // If no confirmText, fallback to Enable/Disable
  const defaultAction = isActive ? "Disable" : "Enable";
  const action = confirmText ? confirmText : defaultAction;

  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 h-[224px] w-[400px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
          <div className="w-full flex flex-col items-center justify-center">
            {icon ? (
              typeof icon === 'string' ? (
                <img src={icon} alt="action icon" className="w-16 h-16  object-contain" />
              ) : (
                icon
              )
            ) : (
              <BlackDisableIcon />
            )}
            <p className="mt-[15px] text-black text-sm font-normal text-center">
              Are you sure you want to {action.toLowerCase()} this request?
            </p>
            <div className="flex items-center gap-3 mt-[15px]">
              <button
                onClick={onCancel}
                className="text-base font-normal text-black px-6 py-2.5 h-[42px] bg-[#EDEDED] rounded-[10px]"
              >
                No, Cancel
              </button>
              <button
                onClick={onConfirm}
                className="text-base font-normal text-white px-6 py-2.5 h-[42px] bg-[#0832DE] rounded-[10px]"
              >
                Yes, {action}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisablePopUp;
