


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
  const [previewImage, setPreviewImage] = useState(null);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false); // <-- Add chat loading state


  const currentUserInfo = chatRoomInfo.find(
    (info) => info.chatRoomId === selectedRoomId
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setSelectedRoomId(chat.chatRoomId);
    setIsChatEnded(chat.isChatEnd || false);
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
      e.preventDefault();
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
        setIsLoading(true); 
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
        setIsLoading(false); 
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


      setMessageInput("");
      setUploadImg(null);

    } catch (error) {
      setIsLoading(false); // <-- Stop loader on error
      console.error("Error in handleSendMessage:", error);
      // Show error to user
      alert('Message sending failed. Please try again.');
    }
  };



  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedRoomId) return;
      setChatLoading(true); // <-- Start chat loading
      const { data: AdminChatMessages, error } = await supabase
        .from("AdminChatMessages")
        .select("*")
        .eq("chatRoomId", selectedRoomId);

      if (error) {
        console.error("Error fetching chat messages:", error);
      } else {
        setChatMassages(AdminChatMessages || []);
      }
      setChatLoading(false); // <-- End chat loading
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


  const handleEndChat = async () => {
    if (!selectedRoomId) return;

    const confirmEnd = window.confirm(
      "Are you sure you want to end this chat? This will prevent further messages from being sent."
    );

    if (!confirmEnd) return;

    try {
      // Update the chat room to mark it as ended
      const { error: updateError } = await supabase
        .from("AdminChatRooms")
        .update({
          isChatEnd: true,
        })
        .eq("chatRoomId", selectedRoomId);

      if (updateError) throw updateError;

      // Update local state
      setIsChatEnded(true);
      setSelectedChat(prev => prev ? { ...prev, isChatEnd: true } : null);

      alert("Chat ended successfully. No new messages can be sent.");
    } catch (error) {
      console.error("Error ending chat:", error);
      alert("Failed to end chat. Please try again.");
    }
  };

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
          selectedRoomId={selectedRoomId}
        />
      </div>

      {/* Right Chat Window */}
      <div className="border rounded-lg w-full lg:w-[65%] md:h-[60vh] relative lg:h-[80vh] overflow-x-auto custom-scrollbar flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between sticky top-0 z-10 items-center bg-gray-300 p-3">
              <div className="flex">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-blue-500 font-medium text-sm lg:hidden"
                >
                  <BackArrowIcon />
                </button>
                <Link
                  to={`/dashboard/usersList/userDetails/${currentUserInfo.chatRoomId}`}
                  className="flex items-center"
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
                {isChatEnded ? (
                  <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded">
                    Chat Ended
                  </span>
                ) : (
                  <button
                    onClick={handleEndChat}
                    className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    End Chat
                  </button>
                )}

              </div>
            </div>

            {/* Message List */}
            <div className={`flex-1 overflow-y-auto mb-3 pr-2 ps-2 flex flex-col custom-scrollbar relative ${uploadImg ? "overflow-hidden" : "space-y-0 "}`}>
              {chatLoading ? (
                <div className="flex flex-1 items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
                  <span className="ml-3 text-blue-600 font-medium">Loading chat...</span>
                </div>
              ) : chatMassages.length > 0 ? (
                chatMassages.map((chat, index) => {
                  const senderId = localStorage.getItem("senderId");
                  const isSender = chat.senderId === senderId;

                  // Determine if time should be shown for this message
                  const showTime = (() => {
                    if (index === chatMassages.length - 1) return true;
                    const next = chatMassages[index + 1];
                    const sameSender = next.senderId === chat.senderId;
                    // 1 minute window (adjust as needed)
                    const sameMinute = Math.abs(new Date(next.createdAt) - new Date(chat.createdAt)) < 60000;
                    return !(sameSender && sameMinute);
                  })();

                  return (
                    <div
                      key={index}
                      className={`flex px-3 ${isSender ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div className="flex items-end max-w-[60%]">
                        {!isSender && (
                          <div className="flex items-center mb-5 me-2">
                            {chat.senderImage ? (
                              <img
                                src={chat.senderImage}
                                alt={chat.senderName || "user"}
                                className="w-6 h-6 rounded-full border-2 border-black object-cover"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full border-2 border-black object-cover">
                                <UserIcon className="text-gray-500 mr-2" />

                              </span>)}

                          </div>
                        )}
                        <div
                          className={`py-2 mb-1 text-black rounded-t-xl relative`}
                        >
                          {
                            chat.messageType === "image" ? (
                              <div className="max-w-xs pb-1.5">
                                <div className={`w-[250px] h-[200px] bg-gray-200 flex items-center justify-center rounded-lg border border-gray-300 overflow-hidden ${isSender
                                  ? "bg-blue-500 text-white rounded-bl-xl self-end"
                                  : "bg-gray-300 rounded-br-lg"
                                  }`}>
                                  <img
                                    src={chat.message}
                                    alt="Chat image"
                                    className="object-cover w-full h-full"
                                    onClick={() => setPreviewImage(chat.message)}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/fallback-image.png"; // optional fallback image
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className={`font-normal text-base p-2  min-w-20 ${isSender
                                ? "bg-blue-500 text-white rounded-l-xl rounded-t-xl self-end"
                                : "bg-[#e4e5e7] border rounded-t-lg rounded-r-lg"
                                }`}>
                                {chat.message}
                              </p>
                            )
                          }
                          {/* Show time with every message, align left for receiver, right for sender */}
                          <p className={`absolute -bottom-2 text-[10px] ${isSender ? 'right-1' : 'left-1'}`}>
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
            {previewImage && (
              <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Full Preview"
                  className="max-w-full max-h-full rounded-lg"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-5 right-5 text-white text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            )}
            {uploadImg && (
              <div className="absolute top-0 left-0 p-10 w-full h-full bg-black/70 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(uploadImg)}
                    alt="Preview"
                    className={`w-[500px] h-auto rounded-lg ${isLoading ? 'opacity-50' : ''}`}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                        <span className="text-white text-sm">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setUploadImg(null)}
                  className={`absolute top-12 right-5 text-white text-3xl z-10 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  disabled={isLoading}
                >
                  x
                </button>
              </div>
            )}


            {/* Chat Ended Message */}
            {isChatEnded && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 mx-5 mb-3 rounded">
                <p className="text-sm font-medium">This chat has been ended. No new messages can be sent.</p>
              </div>
            )}

            {/* Message Input */}
            {!isChatEnded && (
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
                <label htmlFor="fileImg" className="cursor-pointer">
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
            )}
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