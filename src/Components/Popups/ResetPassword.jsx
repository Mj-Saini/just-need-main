import React, { useState } from "react";
import LoginBg from "../../assets/Images/Png/loginBg.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../store/supabaseCreateClient";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "justneed://reset-password", // Change this to your actual reset page
    });

    if (error) {
      toast.error(error.message); // Display error message
    } else {
      toast.success("Password reset email sent! Check your inbox.");
      setTimeout(() => navigate("/emailVerification"), 2000); // Navigate after a short delay
    }
  };

  return (
    <div>
      {/* Background Image */}
      <div
        style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: "cover" }}
        className="fixed inset-0 bg-opacity-50 opacity-15"
      ></div>

      {/* Reset Password Form */}
      <div className="flex items-center justify-center p-8 min-h-screen relative z-30">
        <div className="bg-white relative p-8 rounded-3xl shadow-lg w-[500px]">
          <h2 className="text-xl font-semibold text-black text-center">
            Reset Password
          </h2>
          <p className="text-[#00000099] text-center text-base font-normal mt-2">
            Enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleResetPassword} className="mt-6">
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full mt-6 py-3 bg-gradient-to-r from-[#798FFF] to-[#8EC6FF] text-white font-semibold rounded-full"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
