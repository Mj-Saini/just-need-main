import React, { useState } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { toast } from "react-toastify";
import Loader from "../Common/Loader"; // Ensure you have a Loader component

function LogOutPopUp({ onCancle }) {
  const { handleLogOut } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleYes = () => {
    setLoading(true);
    handleLogOut()
      .then((response) => {
        if (response.success) {
          console.log("Logout successfully!");
          toast.success("Logout successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          console.error(response.response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* Background overlay */}
      <div
        onClick={onCancle}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 h-[300px] w-[400px] m-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-5 relative">
          <div>
            <p className="font-semibold text-2xl text-center text-black">
              Come Back Soon!
            </p>
            <p className="text-base font-normal mt-4 text-[#00000099] text-center">
              Are you sure you want to Log out?
            </p>
            <div className="flex items-center justify-center gap-3 mt-[15px]">
              <button
                onClick={onCancle}
                className="text-base font-normal text-black px-11 py-2.5 h-[42px] bg-[#EDEDED] rounded-[10px]"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleYes}
                className="text-base font-normal text-white px-11 py-2.5 h-[42px] bg-[#0832DE] rounded-[10px] disabled:bg-opacity-50"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen loader while logging out */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </>
  );
}

export default LogOutPopUp;
