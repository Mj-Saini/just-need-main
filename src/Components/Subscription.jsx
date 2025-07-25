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
              // style={{
              //   background: `linear-gradient(135deg, ${item.color}, black)`,
              // }}
              className="p-5 rounded-[10px] group bg-white border border-[#ccc] !text-black"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-xl xl:text-[26px] font-semibold text-black uppercase">
                  {item.planName}
                </h1>
                {/* <button onClick={() => handleEditPlan(item)} className="">
                  <EditiconSubscription />
                </button> */}
                {/* <div className="flex items-center gap-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleDeleteClick(item.id)}>
                    <RedDeleteIcon />
                  </button>
                </div> */}
              </div>
              <div className="border-t-[1px] border-dashed border-white my-2.5"></div>
              <p className="text-center font-normal text-[10px] xl:text-xs text-black">
                {item.cancellationPolicy}
              </p>
              <p className="text-black text-center mt-[15px] leading-none border-[1px] border-dashed border-[#FFFFFF4D] rounded-[10px] py-3 bg-[#f1f1f1]">
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
              <p className="mt-[15px] text-black text-sm xl:text-base font-normal">
                How It Works?
              </p>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">1</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black">View Seller Profiles :</span>  Get complete access to seller details.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">2</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black"> Chat with Sellers :</span>   Message sellers directly within the app.

                </p>
              </div>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">3</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black"> Call Sellers :</span>   Instantly connect with sellers via call.

                </p>
              </div>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">4</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black"> Switch to Seller Mode :</span>    Become a seller and list your services.

                </p>
              </div>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">5</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black">Priority Support:</span>   Get faster customer assistance.

                </p>
              </div>
              <div className="flex items-center gap-2 mt-[15px]">
                <div className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">
                  <span className="rounded-[50px] text-white h-[24px] !w-[24px] bg-[#382488] text-sm font-normal flex items-center justify-center">6</span>
                </div>
                <p className="text-xs lg:text-sm font-normal text-black">
                  <span className="font-bold text-black">Exclusive Offers :</span>    Access special deals and discounts.

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