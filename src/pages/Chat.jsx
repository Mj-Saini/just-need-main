/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { UserIcon } from "../assets/icon/Icons";

import Logo from "../assets/png/Frame 1000004210.png";
import {
  Icon1,
  Icon3,
  MessageSendIcon,
  PepaerClikupIcon,
  VideoCollIcon,
  SearchIconChat,
  DoteedIconChat,
  DoumentIcon,
  ImgaesIcon,
} from "../assets/icon/Icons";
import { BackArrowIcon } from "../assets/icon/Icon";
import { supabase } from "../store/supabaseCreateClient";
import AllChatRooms from "./admin/AllChatRooms";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMassages, setChatMassages] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [image, setImage] = useState(Logo);
  const [activeButton, setActiveButton] = useState("All");



  const handleChatSelect = (chat) => {
    setSelectedChat(chat); 
    setSelectedRoomId(chat.id); 
  };

  



  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedRoomId) return;

      const roomIdAsInt = parseInt(selectedRoomId, 10);
      console.log(typeof roomIdAsInt), "roomIdAsInt";

      if (isNaN(roomIdAsInt)) {
        console.error("Invalid room_id:", selectedRoomId);
        return;
      }

      let { data, error } = await supabase
        .from('ChatMessages')
        .select('*')
        .eq('id', roomIdAsInt); // Use number (bigint) here

      if (error) {
        console.error("Error fetching chat messages:", error);
      } else {
        setChatMassages(data || []);
      }
    };



    fetchChatMessages();
  }, [selectedRoomId]); // Re-run the effect whenever selectedRoomId changes


  const defaultChat = selectedChat || { message: "No messages yet" };


  const handleBackClick = () => {
    setSelectedChat(null);
  };

  const extractTime = (dateTime) => {
    if (!dateTime) return ""; 
    const timePart = dateTime.split(", ")[1];
    return timePart || "";
  };

  const [Tudo, setTudo] = useState(false);
  const ClickMe = () => {
    setTudo(!Tudo);
  };



  const openLocalFile = (event, type) => {
    const file = event.target.files[0];

    if (!file) return; // Do nothing if no file is selected

    const fileURL = URL.createObjectURL(file);
    setImage(fileURL);

    if (type === "document") {
      window.open(fileURL, "_blank");
    } else if (type === "image") {
      window.open(fileURL, "_blank");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-white rounded-[10px]">
      {/* Left sidebar - Chat List */}
      <div
        className={`pe-4 rounded-lg overflow-y-auto custom-scrollbar w-full lg:w-[35%] lg:h-[80vh] ${
          selectedChat ? "hidden lg:block" : "block"
        }`}
      >
        <AllChatRooms handleChatSelect={handleChatSelect} />
      </div>
  
      <div
        className={`border rounded-lg w-full lg:w-[65%] md:h-[60vh] relative lg:h-[80vh] overflow-x-auto custom-scrollbar flex flex-col ${
          selectedChat ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex justify-between sticky top-0 z-10 items-center bg-gray-300 py-3">
          <div className="flex">
            <button
              onClick={handleBackClick}
              className="text-blue-500 font-medium text-sm lg:hidden ps-3"
            >
              <BackArrowIcon />
            </button>
            <div className="flex items-center ps-3">
              {selectedChat?.otherUserImage ? (
                <img
                  src={selectedChat?.otherUserImage}
                  alt={selectedChat?.otherUserName || "anonymous"}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <UserIcon className="w-10 h-10 text-gray-500 mr-3" /> // Fallback SVG icon
              )}
              <h2 className="font-bold text-lg ms-2 capitalize">
                {selectedChat?.otherUserName || "anonymous"}
              </h2>
            </div>

          </div>
          <div className="flex items-center">
            <a href="">
              <VideoCollIcon />
            </a>
            <a className="pe-3 ps-3" href="">
              <SearchIconChat />
            </a>
            <a className="pe-5" href="">
              <DoteedIconChat />
            </a>
          </div>
        </div>
        <div className="flex-grow mb-3 pr-2 custom-scrollbar ps-2 flex flex-col space-y-3">
          {chatMassages.length > 0 ? (
            chatMassages.map((chat, index) => (
              <div key={index} className="flex mb-3 pr-2 mt-3">
                <div className="bg-gray-300 p-2 px-4 max-w-[60%] text-black rounded-t-xl rounded-br-xl relative">
                  <p className="font-normal text-sm pb-1">
                    {chat.message || ""}
                  </p>
                  <p className="absolute bottom-0 right-3 text-[10px] text-black pt-4">
                    {extractTime(chat.time) || ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages to display</p>  // Placeholder for empty chat
          )}
        </div>

      

        {/* Message Input Area */}
        <div className="flex items-center gap-3 sticky top-full bg-white py-4 px-5">
          <div className="flex-grow bg-gray-300 rounded-full px-4">
            <input
              type="text"
              placeholder="Enter your message"
              className="w-full outline-none bg-transparent py-4 placeholder:text-black text-sm"
            />
          </div>

          <span className="relative" onClick={ClickMe}>
            <PepaerClikupIcon className="cursor-pointer" />
            {Tudo && (
              <div className="right-0 top-[-200%] bg-white absolute border-[1px] rounded-t-xl rounded-tl-xl rounded-bl-xl p-3 z-10 w-[200px]">
                <label className="flex items-center pb-3 cursor-pointer">
                  <DoumentIcon />
                  <h2 className="font-medium text-base ps-2">Document</h2>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => openLocalFile(e, "document")}
                  />
                </label>
                <div className="border-[1px] w-[100px] border-black"></div>
                <label className="flex items-center pt-2 cursor-pointer">
                  <ImgaesIcon />
                  <h2 className="font-medium text-base ps-3">Image</h2>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => openLocalFile(e, "image")}
                  />
                </label>
              </div>
            )}
          </span>
          <MessageSendIcon className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
