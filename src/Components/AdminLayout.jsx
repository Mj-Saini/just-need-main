/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./Common/SideBar";
import TopBar from "./Common/TopBar";

function AdminLayout() {
  return (
    <div className="flex bg-[#f1f1f1] p-4 gap-4 h-screen overflow-hidden">
      <div className="max-w-[200px] xl:max-w-[270px]  h-screen pb-4 pl-1">
        <SideBar />
      </div>
      <div className="w-[calc(100vw-250px)] xl:w-[calc(100vw-320px)]  scrollRemove ">
        <div className="sticky top-0 z-30 bg-white px-4 pt-5 pb-[15px] rounded-[10px]">
          <TopBar />
        </div>
        <div className="h-[calc(100vh-115px)] flex flex-col mt-4 pb-5 overflow-auto scrollRemove ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
