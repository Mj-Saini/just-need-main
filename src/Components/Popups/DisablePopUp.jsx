import React from "react";
import { BlackDisableIcon } from "../../assets/icon/Icon";

function DisablePopUp({ onConfirm, onCancel, isActive, confirmText = "Yes" }) {
  const actionText = isActive ? "Disable" : "Enable"; // Toggle text based on isActive

  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 h-[224px] w-[400px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
          <div className="w-full flex flex-col items-center justify-center">
            <BlackDisableIcon />
            <p className="mt-[15px] text-black text-sm font-normal">
              Are you sure, You want to {actionText.toLowerCase()} the service?
            </p>
            <div className="flex items-center gap-3 mt-[15px]">
              <button
                onClick={onCancel}
                className="text-base font-normal text-black px-11 py-2.5 h-[42px] bg-[#EDEDED] rounded-[10px]"
              >
                No, Cancel
              </button>
              <button
                onClick={onConfirm}
                className="text-base font-normal text-white px-11 py-2.5 h-[42px] bg-[#0832DE] rounded-[10px]"
              >
                Yes, {actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisablePopUp;
