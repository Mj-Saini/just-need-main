


/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { UserIcon } from "../assets/icon/Icons";
import {
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
import { Link } from "react-router-dom";

const Chat = () => {
  const messagesEndRef = React.useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMassages, setChatMassages] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatRoomInfo, setChatRoomInfo] = useState([]);
  const [uploadImg, setUploadImg] = useState(null);

  const currentUserInfo = chatRoomInfo.find(
    (info) => info.chatRoomId === selectedRoomId
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setSelectedRoomId(chat.chatRoomId);
  };

  const getUserInfo = (info) => {
    setChatRoomInfo(info);
  };

  const extractTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


const handleImgChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }

  // Validate file size (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  setUploadImg(file);
}
  const handleSendMessage = async (e) => {
  if (e) {
    e.preventDefault(); // Prevent default form behavior if called from form submit
  }

  if (!selectedRoomId) return;

  const senderId = localStorage.getItem("senderId");
  const timestamp = Date.now();

  // Skip if no content to send
  if (!messageInput.trim() && !uploadImg) {
    console.warn("No message or image to send. Skipping...");
    return;
  }

  try {
    let messageData;
    const isImageUpload = !!uploadImg;

    if (uploadImg) {
      // Upload image to just_need bucket in ChatImages folder
      const fileExt = uploadImg.name.split('.').pop();
      const fileName = `${timestamp}_${uploadImg.name}`;
      const filePath = `ChatImages/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase
        .storage
        .from('just_need')
        .upload(filePath, uploadImg, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('just_need')
        .getPublicUrl(filePath);

      // Insert image message
      const { data, error: messageError } = await supabase
        .from("AdminChatMessages")
        .insert([{
          chatRoomId: selectedRoomId,
          message: publicUrl,
          senderId: senderId,
          messageType: "image",
          createdAt: timestamp,
        }])
        .select();

      if (messageError) throw messageError;
      messageData = data;
    }

    // Only send text message if no image was uploaded
    if (!isImageUpload && messageInput.trim()) {
      const { data, error: messageError } = await supabase
        .from("AdminChatMessages")
        .insert([{
          chatRoomId: selectedRoomId,
          message: messageInput.trim(),
          senderId: senderId,
          messageType: "text",
          createdAt: timestamp,
        }])
        .select();

      if (messageError) throw messageError;
      messageData = data;
    }

    // Update chat room
    await supabase
      .from("AdminChatRooms")
      .update({
        lastMessage: isImageUpload ? "📷 Image" : messageInput.trim(),
        lastMessageCreatedAt: timestamp,
      })
      .eq("chatRoomId", selectedRoomId.toString());

    // Update state
    if (messageData) {
      setChatMassages((prev) => [...prev, ...(Array.isArray(messageData) ? messageData : [messageData])]);
    }
    
    setMessageInput("");
    setUploadImg(null);

  } catch (error) {
    console.error("Error in handleSendMessage:", error);
    // Show error to user
    alert('Message sending failed. Please try again.');
  }
};

  // const handleSendMessage = async () => {
  //   if (!selectedRoomId) return;

  //   const senderId = localStorage.getItem("senderId");
  //   const timestamp = Date.now();

  //   if (!messageInput.trim() && !uploadImg) {
  //     console.warn("No message or image to send. Skipping...");
  //     return;
  //   }

  //   try {
  //     let messageData;

  //     if (uploadImg) {
  //       // Upload image to just_need bucket in ChatImages folder
  //       const fileExt = uploadImg.name.split('.').pop();
  //       const fileName = `${timestamp}_${uploadImg.name}`; // Unique filename
  //       const filePath = `ChatImages/${fileName}`; // Path within bucket

  //       // Upload the file
  //       const { error: uploadError } = await supabase
  //         .storage
  //         .from('just_need') // Your bucket name
  //         .upload(filePath, uploadImg, {
  //           cacheControl: '3600', // Cache for 1 hour
  //           upsert: false // Don't overwrite existing files
  //         });

  //       if (uploadError) throw uploadError;

  //       // Get public URL of the uploaded image
  //       const { data: { publicUrl } } = supabase
  //         .storage
  //         .from('just_need')
  //         .getPublicUrl(filePath);

  //       // Insert image message
  //       const { data, error: messageError } = await supabase
  //         .from("AdminChatMessages")
  //         .insert([{
  //           chatRoomId: selectedRoomId,
  //           message: publicUrl,
  //           senderId: senderId,
  //           messageType: "image",
  //           createdAt: timestamp,
  //         }])
  //         .select();

  //       if (messageError) throw messageError;
  //       messageData = data;
  //       setUploadImg(null);
  //     }

  //     // Update chat room with last message info
  //     const lastMessageContent = uploadImg
  //       ? "📷 Image"
  //       : messageInput.trim();

  //     await supabase
  //       .from("AdminChatRooms")
  //       .update({
  //         lastMessage: lastMessageContent,
  //         lastMessageCreatedAt: timestamp,
  //       })
  //       .eq("chatRoomId", selectedRoomId.toString());

  //     // Update state
  //     if (messageData) {
  //       setChatMassages((prev) => [...prev, messageData[0]]);
  //     }
  //     setMessageInput("");

  //   } catch (error) {
  //     console.error("Error in handleSendMessage:", error);
  //     // You might want to show an error to the user here
  //   }
  // };


  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedRoomId) return;

      const { data: AdminChatMessages, error } = await supabase
        .from("AdminChatMessages")
        .select("*")
        .eq("chatRoomId", selectedRoomId);

      if (error) {
        console.error("Error fetching chat messages:", error);
      } else {
        setChatMassages(AdminChatMessages || []);
      }
    };

    fetchChatMessages();
  }, [selectedRoomId]);

  useEffect(() => {
    if (!selectedRoomId) return;

    const channel = supabase
      .channel(`chatroom-${selectedRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "AdminChatMessages",
          filter: `chatRoomId=eq.${selectedRoomId}`,
        },
        (payload) => {
          setChatMassages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatMassages]);

  useEffect(() => {
    return () => {
      if (uploadImg) {
        URL.revokeObjectURL(uploadImg);
      }
    };
  }, [uploadImg]);
  console.log(uploadImg)

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-white rounded-[10px]">
      {/* Left Sidebar */}
      <div
        className={`pe-4 rounded-lg overflow-y-auto custom-scrollbar w-full lg:w-[35%] lg:h-[80vh] ${selectedChat ? "hidden lg:block" : "block"
          }`}
      >
        <AllChatRooms
          handleChatSelect={handleChatSelect}
          getUserInfo={getUserInfo}
        />
      </div>

      {/* Right Chat Window */}
      <div className="border rounded-lg w-full lg:w-[65%] md:h-[60vh] relative lg:h-[80vh] overflow-x-auto custom-scrollbar flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between sticky top-0 z-10 items-center bg-gray-300 py-3">
              <div className="flex">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-blue-500 font-medium text-sm lg:hidden ps-3"
                >
                  <BackArrowIcon />
                </button>
                <Link
                  to={`/dashboard/usersList/userDetails/${currentUserInfo.chatRoomId}`}
                  className="flex items-center ps-3"
                >
                  {currentUserInfo?.userImage ? (
                    <img
                      src={currentUserInfo?.userImage}
                      alt={currentUserInfo?.userName || "anonymous"}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 text-gray-500 mr-3" />
                  )}
                  <h2 className="font-bold text-lg ms-2 capitalize">
                    {currentUserInfo?.userName}
                  </h2>
                </Link>
              </div>
              <div className="flex items-center">
                <a className="pe-3 ps-3" href="#">
                  <SearchIconChat />
                </a>
                <a className="pe-5" href="#">
                  <DoteedIconChat />
                </a>
              </div>
            </div>

            {/* Message List */}
            <div className={`flex-1 overflow-y-auto mb-3 pr-2 ps-2 flex flex-col custom-scrollbar relative ${uploadImg ? "overflow-hidden" : "space-y-3 "}`}>
              {chatMassages.length > 0 ? (
                chatMassages.map((chat, index) => {
                  const senderId = localStorage.getItem("senderId");
                  const isSender = chat.senderId === senderId;

                  return (
                    <div
                      key={index}
                      className={`flex mb-3 px-3 mt-3 ${isSender ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div className="flex flex-col items-start max-w-[60%]">
                        {!isSender && (
                          <div className="flex items-center mb-1">
                            {chat.senderImage ? (
                              <img
                                src={chat.senderImage}
                                alt={chat.senderName || "user"}
                                className="w-6 h-6 rounded-full object-cover mr-2"
                              />
                            ) : (
                              <UserIcon className="w-6 h-6 text-gray-500 mr-2" />
                            )}
                            <span className="text-xs font-semibold text-gray-700 capitalize">
                              {chat.senderName || "anonymous"}
                            </span>
                          </div>
                        )}
                        <div
                          className={`p-2 text-black rounded-t-xl relative min-w-20 ${isSender
                              ? "bg-blue-500 text-white rounded-bl-xl self-end"
                              : "bg-gray-300 rounded-br-lg"
                            }`}
                        >
                          {
                            chat.messageType === "image" ? (
                              <div className="max-w-xs pb-2.5">
                                <img
                                  src={chat.message}
                                  alt="Chat image"
                                  className="max-w-full h-auto rounded-lg border border-gray-200"
                                />
                              </div>
                            ) : (
                              <p className="font-normal text-base pb-1">
                                {chat.message}
                              </p>
                            )
                          }
                          <p className="absolute bottom-0 right-3 text-[10px] pt-4">
                            {extractTime(chat.createdAt)}
                          </p>
                        </div>
                        
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 pt-5">
                  No messages to display
                </p>
              )}
              <div ref={messagesEndRef} />
              
            </div>
{uploadImg && (
                <div className="absolute top-0 left-0 p-10 w-full h-full bg-black/70 flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(uploadImg)}
                    alt="Preview"
                    className="w-[500px] h-auto rounded-lg"
                  />
                  <button onClick={() => setUploadImg(null)} className="absolute top-3 right-5 text-white text-3xl z-10">
                    x
                  </button>

                </div>
              )}


            {/* Message Input */}
        {/* Message Input */}
<form onSubmit={handleSendMessage} className="flex items-center gap-3 sticky top-full bg-white py-4 px-5">
  <div className="flex-grow bg-gray-300 rounded-full px-4">
    <input
      type="text"
      placeholder="Enter your message"
      className="w-full outline-none bg-transparent py-4 placeholder:text-black text-sm"
      value={messageInput}
      onChange={(e) => setMessageInput(e.target.value)}
    />
  </div>
  <label htmlFor="fileImg">
    <input 
      id="fileImg" 
      hidden 
      type="file" 
      accept="image/*" 
      onChange={handleImgChange} 
    />
    <span className="relative">
      <PepaerClikupIcon className="cursor-pointer" />
    </span>
  </label>
  <button type="submit" className="cursor-pointer">
    <MessageSendIcon />
  </button>
</form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 bg-[#f7eeee] text-xl font-medium">
            Select a chat to start conversation 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;