/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { DropdownIcon } from "../../assets/icon/Icon";
import { useLocation } from "react-router-dom";
import { supabase } from "../../store/supabaseCreateClient";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const Provider_Detail = () => {
  const location = useLocation();
  const complaint = location.state?.complaint;
  const [isFullImg, setIsFullImg] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(null)
  const images = complaint?.images || []
  const [popup, setPopup] = useState(false);
  const [showImagePreviewPopUp, setShowImagePreviewPupUp] = useState(false);
  const popupRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [assignDropdown, setAssignDropDown] = useState(false);
  const [assignTo, setAssignTo] = useState("Select Assignee");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState("Processing");
  const [complaintLogs, setComplaintLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  

  // Fetch complaint logs from Supabase
  const fetchComplaintLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ComplaintLogs")
        .select("*")
        .eq("complaintid", complaint?.id)
        .order("createdAt", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setComplaintLogs(data);
        const latestLog = data[data.length - 1];
        // setStatus(latestLog.status);
        // setAssignTo(latestLog.assignTo || "Select Assignee");
        // setInstructions(latestLog.instruction || "");
      }
      
    } catch (error) {
      console.error("Error fetching complaint logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaint?.id) {
      fetchComplaintLogs();
    }
  }, [complaint?.id]);

  // Initialize history log based on complaint logs or default
  const initializeHistoryLog = () => {
    const statusOrder = ["Received", "In Review", "Action Taken", "Resolved", "Closed"];

    // Find the highest achieved status
    let highestStatusIndex = 0;
    const currentStatusIndex = statusOrder.indexOf(
      status === "Process" ? "In Review" :
        status === "Pending" ? "Action Taken" :
          status === "Done" ? "Closed" : status
    );

    if (currentStatusIndex > -1) {
      highestStatusIndex = currentStatusIndex;
    }

    // Create history log items
    return statusOrder.map((status, index) => {
      const isActive = index <= highestStatusIndex;
      const logForStatus = complaintLogs.find(log =>
        log.status === status ||
        (status === "In Review" && log.status === "Process") ||
        (status === "Action Taken" && log.status === "Pending") ||
        (status === "Closed" && log.status === "Done")
      );

      let description = logForStatus?.instruction ||
        (status === "Received" ? "Complaint logged and acknowledged." :
          status === "In Review" ? "Assigned to the concerned department for investigation." :
            status === "Action Taken" ? "Resolution steps initiated." :
              status === "Resolved" ? "Complaint successfully addressed." :
                "Confirmed resolution and feedback received.");

      return {
        status,
        description,
        active: isActive,
        createdAt: logForStatus?.createdAt
      };
    });
  };

  const [historyLog, setHistoryLog] = useState(initializeHistoryLog());

  useEffect(() => {
    setHistoryLog(initializeHistoryLog());
  }, [complaintLogs]);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
    setAssignDropDown(false);
  };

  const toggleAssignDropdown = () => {
    setAssignDropDown((prev) => !prev);
    setDropdown(false);
  };

  const handleAssignToSelect = (value) => {
    setAssignTo(value);
    setAssignDropDown(false);
  };

  const handleStatusSelect = (value) => {
    setStatus(value);
    setDropdown(false);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };


  const updateComplaintStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("RaiseComplaint")
      .update({
        status
      })
      .eq("complaintId", complaint.complaintId)
      .select();

    if (error) throw error;
    console.log("Status updated in RaiseComplaint:", data);
  } catch (err) {
    console.error("Error updating status in RaiseComplaint:", err);
  }
};

  // Save log to Supabase
  const saveComplaintLog = async (logData) => {
    try {
      const logID = crypto.randomUUID();

      // Map the UI status to database status
      const statusMap = {
        "Process": "In Review",
        "Pending": "Action Taken",
        "Done": "Closed"
      };

      const dbStatus = statusMap[logData.status] || logData.status;
console.log("Mapped DB Status:", dbStatus);

      const { data, error } = await supabase
  .from("ComplaintLogs")
  .upsert([{
    ...logData,
    status: dbStatus,
    logid: logID,
    createdAt: Date.now()
  }], { onConflict: ['complaintid', 'status', 'assignTo'] })
  .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving complaint log:", error);
      return null;
    }
  };
  const handleApply = async () => {
    if (assignTo === "Select Assignee") {
      alert("Please select an assignee.");
      return;
    }

    // Prepare the new log data
    const newLog = {
      complaintid: complaint.id,
      assignTo: assignTo,
      instruction: instructions || null,
      status: status, // Use the selected status directly
    };

    const savedLog = await saveComplaintLog(newLog);
    if (!savedLog) {
      alert("Failed to save the log. Please try again.");
      return;
    }

    updateComplaintStatus();  // make sure this runs when you click Apply
    // Update local state
    await fetchComplaintLogs();
    setAssignTo("Select Assignee");
    setInstructions("");
    setStatus(status);
    setIsOpen(false);
  };
  console.log("Applying with status:", status);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopup(false);
      }
    };

    if (popup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);

  const formatDate = (epochTime) => {
    const date = new Date(epochTime);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [showContact, setShowContact] = useState(false);

  const getDisplayStatus = (status) => {
    console.log(status,"status1")
    // First check if it's one of our UI statuses
    switch (status) {
      case "Process":
        return "Process";
      case "Pending":
        return "Pending";
      case "Done":
        return "Done";
      default:
        // Then check if it's one of the database statuses
        switch (status) {
          case "In Review":
            return "Process";
          case "Action Taken":
            return "Pending";
          case "Resolved":
          case "Closed":
            return "Done";
          default:
            return status;
        }
    }
  };
   console.log(status,"status2")
  const handleViewImage = (image) => {
    const index = images?.indexOf(image);
    setPhotoIndex(index);
    setIsFullImg(true);
  };
const currentLog = historyLog.find(log => log.active);
const nextLog = status !== currentLog?.status 
  ? { status, description: "Updated status", active: false }
  : null;

  return (
    <div>

      {isFullImg && (
        <Lightbox
          open={isFullImg}
          close={() => setIsFullImg(false)}
          index={photoIndex}
          slides={images?.map(img => ({ src: img })) || []}
          carousel={{ finite: images?.length <= 1 }}
        />
      )}
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        <div className="xl:w-7/12 w-full">
          <div className="flex justify-between">
            <div className="flex">
              <div>
                <img
                  className="w-[52px] h-[52px] rounded-[80px] object-cover"
                  src={complaint?.images[0]}
                  alt=""
                />
              </div>
              <div className="ms-3">
                <div className="flex items-center gap-[10px]">
                  <p className="font-semibold text-lg">
                    {complaint?.userdetails?.firstName} {complaint?.userdetails?.lastName}
                  </p>
                  <p className="text-[#6C4DEF] font-normal text-sm bg-[#6C4DEF1A] px-2.5 py-1 rounded-[90px]">
                    {getDisplayStatus(status)}
                  </p>
                </div>
                <p className="font-normal text-sm text-[#ADA4A5]">{complaint?.subject}</p>
              </div>
            </div>
            <div className="relative">
              <button
                className="px-[28px] py-[12px] text-[#6C4DEF] border-[#6C4DEF] border font-normal text-base rounded-[10px]"
                onClick={() => setShowContact(!showContact)}
              >
                Show Contact Detail
              </button>
              {showContact && (
                <div className="absolute top-1/2 mt-2 left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-lg p-3 rounded-md border border-gray-200 z-10">
                  <button
                    className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-lg"
                    onClick={() => setShowContact(false)}
                  >
                    ✖
                  </button>
                  <p className="font-semibold text-sm">
                    Name: {complaint?.userdetails?.firstName}
                  </p>
                  <p className="text-sm">Contact: {complaint?.userdetails?.mobile_number}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <div className="flex mt-[16px]">
                <span className="font-normal text-sm text-[#1D1617]">Complaint Id :</span>
                <span className="ml-2 text-[#1D1617] font-normal text-sm opacity-[50%]">
                  {complaint?.complaintId}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal text-sm">Date :</span>
                <span className="ml-2 text-[#1D1617] font-normal text-sm opacity-[50%]">
                  {formatDate(complaint?.created_at)}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal text-sm">Complaint Type :</span>
                <span className="ml-2 text-[#1D1617] font-normal text-sm opacity-[50%]">
                  {complaint?.complaintType}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal text-sm">Email :</span>
                <span className="ml-2 text-[#1D1617] font-normal text-sm opacity-[50%]">
                  {complaint?.userdetails?.useremail}
                </span>
              </div>
              <div className="flex mt-[16px]">
                <span className="font-normal text-sm">Service Type :</span>
                <span className="ml-2 text-[#1D1617] font-normal text-sm opacity-[50%]">
                  Plumbing
                </span>
              </div>
              <div className="flex items-center mt-[16px]">
                <span className="font-normal text-sm">Status :</span>
                <span className="ml-2 bg-[#6C4DEF1A] font-normal text-sm rounded-[90px] text-purple-700 px-2 py-0.5 border-none outline-none">
                  {getDisplayStatus(status)}
                </span>
              </div>
            </div>
          </div>
          <div className="border my-[24px]"></div>
          <div className="p-[14px] rounded-[10px] bg-[#DDDADA4D]">
            <h2 className="font-semibold text-base text-black">Complaint</h2>
            <div className="w-full opacity-40 my-3"></div>
            <p className="text-sm font-normal text-black opacity-70">
              {complaint?.description || "No description provided"}
            </p>
            <div className="flex gap-[14px] mt-2.5">
              {complaint?.images?.map((img, index) => (
                <img onClick={() => handleViewImage(img)} key={index} src={img} alt="img" className="w-20 h-20 object-cover" />
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-end mt-5">
              <button
                className="px-[15px] py-[12px] font-normal text-base rounded-[10px] bg-[#0832DE] text-white"
                onClick={() => setIsOpen(true)}
              >
                Update complaint state
              </button>
            </div>
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-[18px] rounded-[14px] shadow-[#00000040] w-[350px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium">Update complaint state</h2>
                    <button className="text-4xl font-normal" onClick={() => setIsOpen(false)}>
                      ×
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="font-normal text-base whitespace-nowrap">1. Assign to</p>
                    <div
                      onClick={toggleAssignDropdown}
                      className="flex justify-between items-center bg-[#F2F2F2] py-3 px-4 rounded-md mt-2 cursor-pointer"
                    >
                      <span className="font-normal text-base text-gray-700">{assignTo}</span>
                      <span>
                        <DropdownIcon />
                      </span>
                    </div>
                    {assignDropdown && (
                      <div className="mt-2 rounded-md bg-[#F2F2F2] overflow-hidden">
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-300"
                          onClick={() => handleAssignToSelect("Seller")}
                        >
                          Seller
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-300"
                          onClick={() => handleAssignToSelect("Admin")}
                        >
                          Admin
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-300"
                          onClick={() => handleAssignToSelect("Technical Engineer")}
                        >
                          Technical Engineer
                        </div>
                      </div>
                    )}
                    <hr className="my-2.5" />
                    <p className="font-normal text-base whitespace-nowrap">2. Instructions</p>
                    <input
                      className="font-normal text-base outline-none border-none bg-[#F2F2F2] py-3 rounded-md mt-2 px-4 w-full placeholder-gray-500"
                      type="text"
                      placeholder="Enter instructions"
                      value={instructions}
                      onChange={handleInstructionsChange}
                    />
                    <hr className="my-2.5" />
                    <p className="whitespace-nowrap">3. Status</p>
                    <div
                      onClick={toggleDropdown}
                      className="flex justify-between items-center bg-[#F2F2F2] py-3 px-4 rounded-md mt-2 cursor-pointer"
                    >
                      <span
                        className={`font-normal text-base ${status === "Processing" ? "text-gray-700" : ""
                          } ${status === "Process" ? "text-[#6C4DEF]" : ""} ${status === "Pending" ? "text-[#FFA500]" : ""
                          } ${status === "Done" ? "text-[#008000]" : ""}`}
                      >
                        {status} 
                      </span>
                      <span>
                        <DropdownIcon />
                      </span>
                    </div>
                    {dropdown && (
                      <div className="mt-2 rounded-md bg-[#F2F2F2] overflow-hidden">
                        <div
                          className="p-2 cursor-pointer hover:bg-[#6C4DEF1A] text-[#6C4DEF]"
                          onClick={() => handleStatusSelect("Process")}
                        >
                          Process
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-[#FFA50029] text-[#FFA500]"
                          onClick={() => handleStatusSelect("Pending")}
                        >
                          Pending
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-[#0080001A] text-[#008000]"
                          onClick={() => handleStatusSelect("Done")}
                        >
                          Done
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-[30px]">
                    <button
                      className="font-normal text-base px-[34px] py-2 bg-[#0832DE] text-white rounded-[10px]"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                    <button
                      className="font-normal text-base px-[34px] py-2 bg-[#F1F1F1] rounded-[10px]"
                      onClick={() => {
                        setIsOpen(false); setAssignTo("Select Assignee");
                        setInstructions("");
                        setStatus("Processing");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border"></div>
        <div className="rounded-md p-4 xl:w-4/12 w-full">
          <h2 className="font-semibold text-base mb-4">History Log</h2>
          {loading ? (
            <p>Loading history...</p>
          ) : (
            <div>
                {[currentLog, nextLog].filter(Boolean).map((log, index) => {
                return(
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 border-2 rounded-full ${log.active ? "border-[#6C4DEF]" : "border-[#6C4DEF]"}`}
                    ></div>
                    {index < historyLog.length - 1 && (
                      <div
                        className={`w-[2px] h-20 border border-dashed ${log.active && historyLog[index + 1].active
                          ? "border-[#6C4DEF]"
                          : "border-0"}`}
                      ></div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3
                      className={`font-semibold font-base ${log.active ? "text-black" : "text-black"}`}
                    >
                      {log.status}
                    </h3>
                    <p
                      className={`text-sm font-normal text-black opacity-[80%] mt-2.5 ${log.active ? "text-black" : "text-black"}`}
                    >
                      {log.description}
                    </p>
                    {log.active &&
                      complaintLogs.find((l) => l.status === log.status)?.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            complaintLogs.find((l) => l.status === log.status)?.createdAt
                          ).toLocaleString()}
                        </p>
                      )}
                  </div>
                </div>
              )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Provider_Detail;