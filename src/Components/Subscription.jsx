/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SuscriptionPopUp from "./Popups/SuscriptionPopUp";
import { EditiconSubscription, Plusicon, RedDeleteIcon } from "../assets/icon/Icons";
import ConfirmDeltePopUp from "./Popups/ConfirmDeltePopUp";
import { useSubscriptionContext } from "../store/SubscriptionContext";

const Subscription = () => {
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [updateItemId, setUpdateItemId] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { plans, fetchSubscription } = useSubscriptionContext();

  useEffect(() => {
    async function getPlans() {
      const data = await fetchSubscription();
    }
    getPlans();
  }, []);

  const handlePopup = () => {
    setUpdateItemId(""); // Clear update ID for adding new plan
    setShowPopup((prev) => !prev);
  };

  const handleEditPlan = (plan) => {
    setUpdateItemId(plan.id);
    setShowPopup(true);
  };

  const handleDeleteClick = (planId) => {
    setDeleteItemId(planId);
    setDeletePopUp(true);
  };

  return (
    <div className="w-full p-[15px] bg-white rounded-[10px]">
      <div className="rounded-lg mb-5">
        {/* <div className="flex justify-end items-center">
          <button
            onClick={handlePopup}
            className="bg-[#0832DE] font-normal text-base text-white py-2 xl:py-2.5 h-[42px] px-3 xl:px-[15px] rounded-[10px] mt-3 float-right"
          >
            <div className="flex items-center">
              <span className="me-3">
                <Plusicon />
              </span>{" "}
              Add Plan
            </div>
          </button>
        </div> */}
      </div>
      <div className="flex -mx-3 flex-wrap">
        {plans?.map((item) => (
          <div key={item.id} className="w-6/12 xl:w-4/12 2xl:w-3/12 px-3 mt-3">
            <div
              style={{
                background: `linear-gradient(135deg, ${item.color}, black)`,
              }}
              className="p-5 rounded-[10px] group bg-gradient-to-br from-[#8970F2] to-[#321A95]"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-xl xl:text-[26px] font-semibold text-white uppercase">
                  {item.planName}
                </h1>
                <div className="flex items-center gap-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleEditPlan(item)}>
                    <EditiconSubscription />
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)}>
                    <RedDeleteIcon />
                  </button>
                </div>
              </div>
              <div className="border-t-[1px] border-dashed border-white my-2.5"></div>
              <p className="text-center font-normal text-[10px] xl:text-xs text-white">
                {item.cancellationPolicy}
              </p>
              <p className="text-white text-center mt-[15px] leading-none border-[1px] border-dashed border-[#FFFFFF4D] rounded-[10px] py-3">
                <sup className="text-xl font-normal relative top-[-30px] pe-3">
                  {item.currency}
                </sup>
                <span className="text-[48px] xl:text-[64px] font-semibold">
                  {item.price}
                </span>
                <sub className="text-xl font-normal">
                  /{item.durationInDays} Months
                </sub>
              </p>
              <p className="mt-[15px] text-[#FFFFFF99] text-sm xl:text-base font-normal">
                How It Works?
              </p>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>1</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white">View Seller Profiles :</span>  Get complete access to seller details.
                </p>
              </div>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>2</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white"> Chat with Sellers :</span>   Message sellers directly within the app.

                </p>
              </div>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>3</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white"> Call Sellers :</span>   Instantly connect with sellers via call.

                </p>
              </div>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>4</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white"> Switch to Seller Mode :</span>    Become a seller and list your services.

                </p>
              </div>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>5</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white">Priority Support:</span>   Get faster customer assistance.

                </p>
              </div>
              <div className="flex items-center gap-[15px] mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span>6</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-[#FFFFFF99]">
                  <span className="font-bold text-white">Exclusive Offers :</span>    Access special deals and discounts.

                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
        <SuscriptionPopUp
          updateItemId={updateItemId}
          handlePopup={handlePopup}
        />
      )}
      {deletePopUp && (
        <ConfirmDeltePopUp
          deleteId={deleteItemId}
          onCancel={() => setDeletePopUp(false)}
        />
      )}
    </div>
  );
};

export default Subscription;