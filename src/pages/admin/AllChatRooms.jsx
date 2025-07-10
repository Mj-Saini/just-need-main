


/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { UserIcon } from "../../assets/icon/Icons";
import { supabase } from "../../store/supabaseCreateClient";

const AllChatRooms = ({ handleChatSelect,getUserInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [activeButton, setActiveButton] = useState("All");

  // Fetch chat rooms from Supabase, ordered by latest message time
  const fetchChatRooms = async () => {
    const { data, error } = await supabase
      .from("AdminChatRooms")
      .select("*")
      .order("lastMessageCreatedAt", { ascending: false }); // Most recent first

    if (error) {
      console.error("Error fetching chat rooms:", error);
    } else {
      setChatRooms(data || []);
    }
  };

useEffect(() => {
  fetchChatRooms(); // Initial fetch

  const channel = supabase
    .channel("admin-chat-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "AdminChatMessages" },
      (payload) => {
        console.log("🔄 Change in messages table:", payload);
        fetchChatRooms(); // Refresh chat room list when a message is inserted/updated
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel); // Clean up
  };
}, []);

  // Format timestamp to HH:MM
  const extractTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Search filter
  const filteredChatData = chatRooms.filter((chat) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (chat.userName?.toLowerCase() || "").includes(lowerCaseQuery) ||
      (chat.lastMessage?.toLowerCase() || "").includes(lowerCaseQuery)
    );
  });

  getUserInfo(chatRooms )

  return (
    <>
      {/* Search Bar */}
      <div className="flex items-center sticky top-0 px-4 bg-white z-10 border border-opacity-30 border-gray-800 rounded-lg">
        <UserIcon />
        <input
          type="text"
          placeholder="People, Groups and Messages"
          className="w-full outline-none bg-white ms-2.5 h-[40px] text-sm placeholder:text-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="border rounded-md mt-3 border-gray-300 h-[40px] bg-gray-100">
        <div className="flex text-center">
          {["All", "Read", "Unread"].map((btn) => (
            <button
              key={btn}
              className={`flex-1 font-normal text-sm rounded-[7px] h-[40px] cursor-pointer ${
                activeButton === btn
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => setActiveButton(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Room List */}
      {filteredChatData.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatSelect(chat)}
          className="flex items-center mt-4 w-full ps-3 pe-5 hover:bg-purple-100 py-1 cursor-pointer rounded-lg"
        >
          {/* Avatar */}
          <div className="w-[40px] h-[40px] flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {chat.userImage ? (
              <img
                src={chat.userImage}
                alt="Chat"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>

          {/* Chat Info */}
          <div className="flex justify-between w-full ps-4">
            <div className="w-8/12 flex flex-col justify-center">
              <h2 className="font-medium text-sm text-black capitalize">
                {chat.userName}
              </h2>
              <p className="font-normal text-sm text-gray-600 pt-1 truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
            <div className="w-3/12 text-right flex flex-col justify-center">
              <p className="font-normal text-[10px] whitespace-nowrap">
                {extractTime(chat.lastMessageCreatedAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllChatRooms;

