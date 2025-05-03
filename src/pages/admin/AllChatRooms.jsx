/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { UserIcon } from "../../assets/icon/Icons";


import { supabase } from "../../store/supabaseCreateClient";

const AllChatRooms = ({ handleChatSelect }) => {
  
    const [searchQuery, setSearchQuery] = useState("");
    const [chatRooms, setChatRooms] = useState([]);


    const [activeButton, setActiveButton] = useState("All");

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    // Fetch chat rooms from Supabase
    const fetchChatRooms = async () => {
        let { data, error } = await supabase.from("ChatRooms").select("*");

        if (error) {
            console.error("Error fetching chat rooms:", error);
        } else {
            setChatRooms(data);
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, []);

   
    const extractTime = (dateTime) => {
        if (!dateTime) return ""; // if it's null/undefined, just return empty string
        const timePart = dateTime.split(", ")[1];
        return timePart || ""; // if no time part found, also return empty string
    };



    // Filter chat data based on search query
    const filteredChatData = chatRooms.filter((chat) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            (chat.otherUserName?.toLowerCase() || "").includes(lowerCaseQuery) ||
            (chat.message?.toLowerCase() || "").includes(lowerCaseQuery)
        );
    });


    return (

            <>
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
                {/* Chat Filter Tabs */}
                <div className="border rounded-md mt-3 border-gray-300 h-[40px] bg-gray-100">
                    <div className="flex text-center">
                        <button
                            className={`flex-1 font-normal text-sm rounded-[7px] h-[40px] cursor-pointer ${activeButton === "All"
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                                }`}
                            onClick={() => handleButtonClick("All")}
                        >
                            All
                        </button>
                        <button
                            className={`flex-1 font-normal text-sm rounded-[7px] h-[40px] cursor-pointer ${activeButton === "Read"
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                                }`}
                            onClick={() => handleButtonClick("Read")}
                        >
                            Read
                        </button>
                        <button
                            className={`flex-1 font-normal text-sm rounded-[7px] h-[40px] cursor-pointer ${activeButton === "Unread"
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                                }`}
                            onClick={() => handleButtonClick("Unread")}
                        >
                            Unread
                        </button>
                    </div>
                </div>

                {/* Chat List */}
            {filteredChatData.map((chat) => (
                    <div
                        key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                        className="flex items-center mt-4 w-full ps-3 pe-5 hover:bg-purple-100 py-1 cursor-pointer rounded-lg"
                    >
                    <div className="w-[40px] h-[40px] flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {chat.otherUserImage ? (
                            <img
                                src={chat.otherUserImage}
                                alt="Chat"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                         <UserIcon/>
                        )}
                    </div>
                    <div >

                        <div className="w-8/12 ps-4 flex flex-col justify-center">
                        <h2 className="font-medium text-sm text-black capitalize">{chat.otherUserName}</h2>
                            <p className="font-normal text-sm text-gray-600 pt-1 truncate">
                                {chat.message}
                            </p>
                        </div>
                        <div className="w-3/12 text-right flex flex-col justify-center">
                            <p className="font-normal text-[10px] whitespace-nowrap">
                                {extractTime(chat.time)}
                            </p>
                        </div>
                    </div>
                    </div>
                ))}
            </>

           
    );
};

export default AllChatRooms
