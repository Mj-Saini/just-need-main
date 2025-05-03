import React, { useState } from 'react';
import { PopupsArrowBlock } from '../../assets/icon/Icons';

function ActionUserPupUp({ handlePopup }) {
  const [status, setStatus] = useState('Block');
  return (
    <>
      <div
        onClick={handlePopup}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 w-[448px] h-[370px] m-auto">
        <div className="w-full h-full bg-white rounded-lg shadow-lg p-[15px] relative">
          <button
            onClick={handlePopup}
            className="absolute top-[15px] right-[15px] text-gray-600 hover:text-black"
            aria-label="Close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0001 14.1216L17.3031 19.4246C17.5845 19.706 17.9661 19.8641 18.3641 19.8641C18.762 19.8641 19.1437 19.706 19.4251 19.4246C19.7065 19.1432 19.8646 18.7616 19.8646 18.3636C19.8646 17.9657 19.7065 17.584 19.4251 17.3026L14.1201 11.9996L19.4241 6.69662C19.5634 6.55729 19.6738 6.39189 19.7492 6.20987C19.8245 6.02785 19.8633 5.83277 19.8632 5.63577C19.8632 5.43877 19.8243 5.24371 19.7489 5.06172C19.6735 4.87974 19.5629 4.71439 19.4236 4.57512C19.2843 4.43586 19.1189 4.3254 18.9368 4.25005C18.7548 4.1747 18.5597 4.13595 18.3627 4.13599C18.1657 4.13604 17.9707 4.17489 17.7887 4.25032C17.6067 4.32575 17.4414 4.43629 17.3021 4.57562L12.0001 9.87862L6.69709 4.57562C6.55879 4.43229 6.39333 4.31794 6.21036 4.23924C6.02739 4.16055 5.83058 4.11907 5.63141 4.11725C5.43224 4.11543 5.23471 4.15329 5.05033 4.22862C4.86595 4.30395 4.69842 4.41526 4.55752 4.55603C4.41661 4.6968 4.30515 4.86422 4.22964 5.04853C4.15414 5.23284 4.11609 5.43034 4.11773 5.62951C4.11936 5.82868 4.16065 6.02553 4.23917 6.20857C4.3177 6.39161 4.43189 6.55718 4.57509 6.69562L9.88009 11.9996L4.57609 17.3036C4.43289 17.4421 4.3187 17.6076 4.24017 17.7907C4.16165 17.9737 4.12036 18.1706 4.11873 18.3697C4.11709 18.5689 4.15514 18.7664 4.23064 18.9507C4.30615 19.135 4.41761 19.3024 4.55852 19.4432C4.69942 19.584 4.86695 19.6953 5.05133 19.7706C5.23571 19.846 5.43324 19.8838 5.63241 19.882C5.83158 19.8802 6.02839 19.8387 6.21136 19.76C6.39433 19.6813 6.55979 19.5669 6.69809 19.4236L12.0001 14.1216Z"
                fill="black"
              />
            </svg>
          </button>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-base font-normal text-gray-700 mb-2.5 mt-2.5">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-[20px] pr-[40px] py-[13px] bg-[#F2F2F2] rounded-[7px] font-normal text-base appearance-none">
                <option value="Block">Block</option>
                <option value="Unblock">Unblock</option>
              </select>
              <span className="absolute right-[13px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                <PopupsArrowBlock />
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reason" className="block font-normal text-base mb-2.5">
              Reason
            </label>
            <textarea
              placeholder="type here.."
              className="w-full h-28 px-5 py-2.5 bg-[#F2F2F2] rounded-[7px] resize-none"></textarea>
          </div>

          <button className="w-full bg-[#0832DE] text-base text-white font-normal py-3 rounded-[10px]">
            Update Status
          </button>
        </div>
      </div>
    </>
  );
}

export default ActionUserPupUp;
