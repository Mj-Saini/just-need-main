/* eslint-disable react/prop-types */

import { UserIcon } from "../../assets/icon/Icon";

function NotificationPopUp({ onCancel }) {
  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 h-[460px] w-[445px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 relative">
          <div className="flex justify-end items-center">
            <button onClick={onCancel} className="mb-2" aria-label="Close">
              &#10005;
            </button>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-black text-xl font-semibold">Notification</h1>
            <p className="bg-[#798FFF1A] text-[#798FFF] py-[5px] px-2.5 rounded-[40px]">
              3 New
            </p>
          </div>
          <div className="flex mt-5 gap-2.5  pb-[18px] border-b-[1px] border-[#E8E8E8]">
            <UserIcon />
            <div className="flex justify-between w-full">
              <div>
                <p className="text-black text-sm font-normal max-w-[300px]">
                  It is a long established fact that a reader will be when
                  looking at its layout.
                </p>
                <p className="text-[#ADA4A5] font-normal text-sm mt-[5px]">
                  7 Mar 2024 (12:12 AM)
                </p>
              </div>
              <div className="h-2 w-2 rounded-[50%] bg-[#FF0000] mt-1"></div>
            </div>
          </div>
          <div className="flex mt-5 gap-2.5  pb-[18px] border-b-[1px] border-[#E8E8E8]">
            <UserIcon />
            <div className="flex justify-between w-full">
              <div>
                <p className="text-black text-sm font-normal max-w-[300px]">
                  It is a long established fact that a reader will be when
                  looking at its layout.
                </p>
                <p className="text-[#ADA4A5] font-normal text-sm mt-[5px]">
                  7 Mar 2024 (12:12 AM)
                </p>
              </div>
              <div className="h-2 w-2 rounded-[50%] bg-[#FF0000] mt-1"></div>
            </div>
          </div>
          <div className="flex mt-5 gap-2.5 pb-[18px] border-b-[1px] border-[#E8E8E8]">
            <UserIcon />
            <div className="flex justify-between w-full">
              <div>
                <p className="text-black text-sm font-normal max-w-[300px]">
                  It is a long established fact that a reader will be when
                  looking at its layout.
                </p>
                <p className="text-[#ADA4A5] font-normal text-sm mt-[5px]">
                  7 Mar 2024 (12:12 AM)
                </p>
              </div>
              <div className="h-2 w-2 rounded-[50%] bg-[#FF0000] mt-1"></div>
            </div>
          </div>
          <div className="flex mt-5 gap-2.5">
            <UserIcon />
            <div className="flex justify-between w-full">
              <div>
                <p className="text-black text-sm font-normal max-w-[300px]">
                  It is a long established fact that a reader will be when
                  looking at its layout.
                </p>
                <p className="text-[#ADA4A5] font-normal text-sm mt-[5px]">
                  7 Mar 2024 (12:12 AM)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationPopUp;
