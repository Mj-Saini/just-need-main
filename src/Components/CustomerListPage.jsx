import React from "react";
import CustomerData from "./CustomerData";

function CustomerListPage({ mapData }) {
  return (
    <>
      <div className="p-[15px] bg-white rounded-[10px] shadow-md">
        <p className="font-medium text-[28px]">Customers List</p>
        <p className="font-normal text-base opacity-[70%] mb-[15px]">
          Plan, prioritize, and accomplish your tasks with ease.
        </p>
        <CustomerData mapData={mapData} />
      </div>
    </>
  );
}

export default CustomerListPage;
