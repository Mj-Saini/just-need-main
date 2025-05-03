import React, { useState } from "react";
import LoginBg from "../../assets/Images/Png/loginBg.png";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLock,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const CreatePassword = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = () => {
    if (newPassword === confirmPassword) {
      navigate("/passwordchanged");
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: "cover" }}
        className="fixed inset-0 bg-opacity-50 opacity-15"
      ></div>
      <div className="flex items-center justify-center p-8 min-h-screen relative z-30">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-[500px]">
          <h2 className="text-xl font-semibold text-black text-center">
            Create a New Password
          </h2>
          <p className="text-[#00000099] text-center text-base font-normal mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <AiOutlineLock className="absolute left-1 top-12 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "password" : "text"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-6 py-3 border rounded-lg mt-6"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-12 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className="relative">
              <AiOutlineLock className="absolute left-1 top-10 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-3 border rounded-lg mt-4"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-10 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
          <button
            className="w-full mt-6 py-3 bg-gradient-to-r from-[#798FFF] to-[#8EC6FF] text-white font-semibold rounded-full"
            onClick={handleResetPassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
