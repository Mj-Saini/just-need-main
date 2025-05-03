/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BlackCloseIcon,
  ChatIcon,
  NotificationIcon,
  SearchIcon,
} from "../../assets/icon/Icon";
import AdminImage from "../../assets/png/AdminImage.png";
import { ArrowIcon } from "../../assets/icon/Icons";
import NotificationPopUp from "../Popups/NotificationPopUp";
import ScrollNotify from "../Popups/ScrollNotify";
import { useUserContext } from "../../store/UserContext";
import { useComplaintProvider } from "../../store/RaiseComplaintData";


function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [chatPopup, setchatPopup] = useState(false);
  const searchRef = useRef(null);

  const toggleSearchInput = () => setIsInputVisible((prev) => !prev);

  const { userName } = useUserContext();

  const { complaints } = useComplaintProvider()

  const getComplaintUsername = () => {
    if (location.pathname.includes("/dashboard/complaints/complaintsDetails/")) {
      const complaintId = location.pathname.split("/").pop(); // Get the last segment of the URL (the complaint ID)
      const complaint = complaints.find((c) => c.id === complaintId);
      if (complaint && complaint.userdetails) {
        return `${complaint.userdetails.firstName} ${complaint.userdetails.lastName}`;
      }
    }
    return "";
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const goBack = () => {
    if (location.pathname.startsWith("/dashboard/setting/")) {
      navigate("/dashboard/setting");
    } else if (location.pathname.includes("/dashboard/usersList/userDetails/")) {
      navigate(-1);
    } else if (location.pathname.includes("/dashboard/complaints/complaintsDetails/")) {
      navigate("/dashboard/complaints");
    } else if (location.pathname.includes("/dashboard/listings/")) {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };


  const showArrowButton =
    location.pathname.includes("/dashboard/usersList/userDetails/") ||
    location.pathname.includes("/dashboard/listings/") ||
    location.pathname.startsWith("/dashboard/setting/") ||
    location.pathname.includes("/dashboard/complaints/complaintsDetails/");

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 xl:gap-5">
        <div className="flex items-center">
          {showArrowButton && (
            <div className="flex items-center justify-center me-[15px]">
              <button onClick={goBack}>
                <ArrowIcon />
              </button>
            </div>
          )}
          <div>
            <p className="font-medium text-lg xl:text-[22px] capitalize">
              {location.pathname.startsWith("/dashboard/setting/") ? (
                <span className="text-[#00000099]">
                  Setting /
                  <span className="text-black ms-1">
                    {location.pathname.replace("/dashboard/setting/", "").replace("&", " & ")}
                  </span>
                </span>
              ) : location.pathname.includes("/dashboard/usersList/userDetails/") ? (
                `User's Details / ${userName}`
              ) : location.pathname.includes("/dashboard/listings/") ? (
                "Listings Details"
              ) : location.pathname.includes("/dashboard/complaints/complaintsDetails/") ? (
                `Complaint Details / ${getComplaintUsername()}`
              ) : (
                location.pathname
                  .replace("/dashboard/", "")
                  .replace("/", " ")
                  .replace("&", " & ")
                  .replace("usersList", "Users List")
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 xl:gap-4">
          <div
            ref={searchRef}
            className={`flex items-center h-[40px] rounded-[50px] bg-[#F1F1F1] ${isInputVisible ? "w-[185px] lg:max-w-[330px] xl:w-[330px]" : "max-w-[40px]"
              } transition-all duration-300`}
          >
            <div
              onClick={toggleSearchInput}
              className="cursor-pointer w-[40px] flex items-center justify-center"
            >
              <SearchIcon />
            </div>
            {isInputVisible && (
              <input
                type="text"
                placeholder="Search task"
                className="w-full outline-none bg-[#F1F1F1] text-base placeholder:text-base placeholder:font-normal font-normal placeholder:text-[#00000080] rounded-[10px]"
              />
            )}
            {isInputVisible && (
              <div onClick={toggleSearchInput} className="px-3">
                <BlackCloseIcon />
              </div>
            )}
          </div>
          <button onClick={setchatPopup}>
            <ChatIcon />
          </button>
          <button onClick={setNotificationPopUp}>
            <NotificationIcon />
          </button>
          <div className="flex items-center">
            <img className="w-[40px]" src={AdminImage} alt="Admin" />
            <div className="ms-2.5">
              <p className="font-normal text-sm xl:text-base text-[#171717] leading-[20px]">
                Super Admin
              </p>
              <p className="font-normal text-sm xl:text-base text-[#17171799] leading-[20px]">
                superadmin@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {notificationPopUp && <NotificationPopUp onCancel={() => setNotificationPopUp(false)} />}
      {chatPopup && <ScrollNotify onCancel={() => setchatPopup(false)} />}
    </div>
  );
}

export default TopBar;
