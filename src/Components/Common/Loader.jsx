import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen z-50 relative">
      <div className="loader w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
