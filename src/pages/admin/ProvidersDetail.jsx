import React, { useState } from "react";
import { BackArrowIcon, DisalbleIcon } from "../../assets/icon/Icon";
import GalleryImg1 from "../../assets/png/galleryImg1.png";
import MechanicImage from "../../assets/png/mechanicImage.png";
import { useParams } from "react-router-dom";

function ProvidersDetail() {
  const {id}=useParams()
  const [showPopup, setShowPopup] = useState(false);
  const [popUpData, setPopUpData] = useState({
    status: "",
    reason: "",
  });

  function handlePopup() {
    setShowPopup(!showPopup);
  }

  const handleOnChange = (e) => {
    const {name, value} = e.target;
    setPopUpData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate =()=>{
    console.log(popUpData)
  }
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackArrowIcon />
          <h3 className="font-medium text-[28px] text-black ms-4">
            Providers Details
          </h3>
        </div>
        <div>
          <button
            onClick={handlePopup}
            className="bg-[#0832DE] font-normal text-base text-white py-3 px-[15px] rounded-[10px] mt-3 float-right flex"
          >
            <span className="me-3">
              <DisalbleIcon />
            </span>{" "}
            Disable Provider
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[10px] p-4 mt-4">
        <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
          Personal details
        </p>
        <div className="flex items-center mt-4 gap-5">
          <div>
            <img
              className="w-[90px]"
              src={MechanicImage}
              alt="image of provider"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg text-[#000000] leading-[22px]">
              John Leo
            </h3>
            <h4 className="font-normal text-base text-[#000000B2] mt-1 leading-[20px]">
              Mechanic
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Mobile Number:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">
              + 91 89979 87908
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Email:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">
              johnleo12@gmail.com
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Address:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">
              Hisar Haryana B street 352
            </h3>
          </div>
        </div>
        <p className="font-medium text-lg leading-[22px] mt-[30px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
          Business details
        </p>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Business Name:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">
              John Car Solutions
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Service Name:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">Mechanic</h3>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[140px]">
            <h3 className="text-base font-medium leading-[20px] text-black">
              Categories:
            </h3>
          </div>
          <div className="px-[30px]">
            <h3 className="font-normal text-base text-[#000000B2]">
              1.Oil Change 2.Parts Repai 3.Tyre Change 4.Denting & Repair 5.AC
              Service
            </h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[10px] p-4 mt-3">
        <p className="font-medium text-lg leading-[22px] text-black pb-2.5 border-b-[0.5px] border-dashed border-[#00000066]">
          Gallery
        </p>
        <div className="flex flex-row flex-wrap -mx-3">
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
            return (
              <div key={index} className="w-[20%] px-3 mt-4">
                <div>
                  <img
                    className="w-full"
                    src={GalleryImg1}
                    alt="image of provider"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showPopup && (
        <>
          <div
            onClick={()=>handlePopup()}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 h-[368px] w-[448px] m-auto">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
              <button
                onClick={handlePopup}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close"
              >
                &#10005;
              </button>

              <div className="mb-6">
                <label
                  htmlFor="status"
                  className="block text-base font-normal text-gray-700 mb-2.5"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  onChange={handleOnChange}
                  value={popUpData.status}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Block">Block</option>
                  <option value="Unblock ">Unblock</option>
                </select>
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
                  className="w-full h-28 px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <button onClick={handleUpdate} className="w-full bg-[#0832DE] text-base text-white font-medium py-3 rounded-[10px]">
                Update Status
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProvidersDetail;
