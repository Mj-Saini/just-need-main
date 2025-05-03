import React from "react";
import LoginBg from "../../assets/Images/Png/loginBg.png";
import { TickImage } from "../../assets/icon/Icons";
import { useNavigate } from "react-router-dom";

const PasswordChanged = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: "cover" }}
        className="fixed inset-0 bg-opacity-50 opacity-15"
      ></div>
      <div className="flex items-center justify-center p-8 min-h-screen relative z-30">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-[500px]">
          <div className="flex justify-center">
            <TickImage />
          </div>

          <h2 className="text-xl font-semibold text-black text-center mt-6">
            Your Password has been Changed
          </h2>
          <p className="text-[#00000099] text-center text-base font-normal mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-6 py-3 bg-gradient-to-r from-[#798FFF] to-[#8EC6FF] text-white font-semibold rounded-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChanged;
