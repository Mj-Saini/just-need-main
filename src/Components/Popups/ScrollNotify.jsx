/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

function ScrollNotify({ onCancel }) {
    const messages = [
        {
            id: 1,
            name: "Robert Fox",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 2,
            name: "Kristin Watson",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 3,
            name: "Marvin McKinney",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            id: 4,
            name: "Jenny Wilson",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            id: 5,
            name: "Jenny Wilson",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            id: 6,
            name: "Jenny Wilson",
            message: "Me: Lorem ipsum let go a meeting",
            time: "1 week",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
    ];

    return (
        <div onClick={onCancel} className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50">
            <div className="max-w-sm bg-white rounded-lg shadow-lg p-4 w-[441px] overflow-hidden ">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl text-[#1D1617] font-semibold">Inbox</h2>
                    <Link to={"/dashboard/chat"} className="text-[#798FFF] font-medium text-sm">
                        See All In Inbox
                    </Link>
                </div>
                <div className=" h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollRemove mt-5">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="flex items-start gap-3 py-3 border-b last:border-none"
                        >
                            {msg.avatar && (
                                <img
                                    src={msg.avatar}
                                    alt={msg.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-base text-[#1D1617]">
                                    {msg.name}
                                </p>
                                <p className="text-[#1D1617] opacity-70 font-normal text-base">{msg.message}</p>
                                <p className="text-[#ADA4A5] text-sm font-normal mt-1">{msg.time}</p>
                            </div>
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-1"></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ScrollNotify;