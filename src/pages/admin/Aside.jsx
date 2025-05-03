/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Arrowicon, UserIcon } from "../../assets/icon/Icons";
import { UpArrowGreen } from "../../assets/icon/Icon";
import Charts from "../../Components/Charts";
import Piechart from "../../Components/Common/Piechart";
import blur from "../../assets/Images/Png/blur.png";
import { cardData, customersDataList } from "../../Components/Common/Helper";
import CustomerData from "../../Components/CustomerData";
import RevenueGraph from "../../assets/png/revenueGraph.png";
import Users from "./Users";

function Aside() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(selectedMonth.getFullYear(), monthIndex);
    setSelectedMonth(newDate);
    setIsCalendarOpen(false);
  };

  const handleYearChange = (increment) => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear() + increment, prev.getMonth())
    );
  };
  return (
    <>
      <div className="px-[14px] bg-white rounded-[10px] ">
        <div className="flex flex-wrap mt-[16px] -mx-2 ">
          {cardData.map((card, index) => (
            <div key={index} className="w-full sm:w-[50%] xl:w-[25%] px-2 mb-4">
              <div className="relative z-[20] cursor-pointer h-full border-[#0000001A] rounded-[10px] px-[20px] py-[24px] hover:shadow-lg border-[1px] bg-[white] hover:bg-[#6C4DEF] hover:text-white group duration-500">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium text-black group-hover:text-white">
                    {card.title}
                  </p>
                  {index === 3 ? (
                    <div className="relative ">
                      <button
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="font-normal text-xs text-[#6C4DEF] group-hover:text-white"
                      >
                        {months[selectedMonth.getMonth()]}
                      </button>
                      {isCalendarOpen && (
                        <div
                          className="absolute top-[100%] right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-[176px] h-[133px] p-2 z-50"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "4px",
                          }}
                        >
                          <div className="col-span-4 flex justify-between items-center mb-2">
                            <button
                              onClick={() => handleYearChange(-1)}
                              className="text-sm text-gray-500 hover:text-black"
                            >
                              &lt;
                            </button>
                            <p className="text-xs font-normal text-black">
                              {selectedMonth.getFullYear()}
                            </p>
                            <button
                              onClick={() => handleYearChange(1)}
                              className="text-sm text-gray-500  hover:text-black"
                            >
                              &gt;
                            </button>
                          </div>
                          {months.map((month, i) => (
                            <button
                              key={month}
                              onClick={() => handleMonthClick(i)}
                              className={` p-1 rounded-md text-xs font-normal ${i === selectedMonth.getMonth()
                                  ? "text-[#6C4DEF]"
                                  : "text-black"
                                }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-[28px] w-[28px] rounded-full border border-black group-hover:bg-[white] group-hover:border-none flex items-center justify-center">
                      <Arrowicon />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-[15px]">
                  <p className="text-[50px] font-medium">{card.count}</p>
                  <div className="w-6/12">
                    {index === 3 ? (
                      <img
                        className="w-full"
                        src={RevenueGraph}
                        alt="graph image"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center mt-[12px]">
                  {index === 3 ? (
                    <p className="text-[12px] font-normal flex items-center gap-1.5">
                      ₹1658.00{" "}
                      <span>
                        <UpArrowGreen />
                      </span>
                    </p>
                  ) : (
                    <div className="border group-hover:bg-[transparent] group-hover:border-white border-black items-center justify-center flex w-[27px] h-[19px] rounded-[5px] py-2 px-4 opacity-[70%]">
                      <p className="text-[12px] font-normal">{card.increase}</p>
                    </div>
                  )}
                  <p className="text-[12px] font-normal leading-[15px] ms-[10px]">
                    {card.description}
                  </p>
                </div>
                {/* Absolute div to show on hover */}
                <img
                  className="absolute z-[10] start-[0px] bottom-[20px] "
                  src={blur}
                  alt="blur"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap  justify-between mt-[15px] gap-y-[15px] pb-6">
          {/* Overall Performance Section */}
          <div className="w-full lg:w-[75%]">
            <div className=" bg-[white] rounded-[15px] px-[13px] py-[15px] ">
              <p className="font-medium text-[18px] text-center">
                Users Requisition Performance
              </p>
              <Charts />
            </div>
          </div>

          {/* Popular Services Section */}
          <div className="w-full lg:w-[25%] ps-4 ">
            <div className=" bg-white rounded-[10px] px-[13px] py-[15px] h-full border-[#0000001A] border-[1px]">
              <p className="font-medium text-[18px] text-center">
                Popular Services
              </p>
              <div className="flex items-center justify-center my-[22px]">
                <Piechart />
              </div>

              {/* Service Details */}
              <div className="w-[60%] xl:w-4/5 lg:w-full mx-auto">
                <div className="flex items-center justify-between gap-10 mt-[15px]">
                  <div className="flex items-center">
                    <div className="h-[14px] w-[14px] rounded-full bg-[#2B4DED]"></div>
                    <p className="text-[12px] font-medium ms-[10px] opacity-[50%]">
                      Car Washing
                    </p>
                  </div>
                  <p className="text-[12px] font-medium opacity-[90%]">60%</p>
                </div>
                <div className="flex items-center justify-between gap-10 mt-[15px]">
                  <div className="flex items-center">
                    <div className="h-[14px] w-[14px] rounded-full bg-[#FF9E69]"></div>
                    <p className="text-[12px] font-medium ms-[10px] opacity-[50%]">
                      Plumbing
                    </p>
                  </div>
                  <p className="text-[12px] font-medium opacity-[90%]">20%</p>
                </div>
                <div className="flex items-center justify-between gap-10 mt-[15px]">
                  <div className="flex items-center">
                    <div className="h-[14px] w-[14px] rounded-full bg-[#FFD1A7]"></div>
                    <p className="text-[12px] font-medium ms-[10px] opacity-[50%]">
                      Carpainter
                    </p>
                  </div>
                  <p className="text-[12px] font-medium opacity-[90%]">15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-4 px-[14px] bg-white rounded-[10px]">
        <CustomerData />
      </div>
    </>
  );
}

export default Aside;
