/* eslint-disable no-unused-vars */
import { useState } from "react";
import { EmailIcon, LockIcon, UnseenIcon } from "../../assets/icon/Icon";
import { useAuthContext } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginBg from "../../assets/Images/Png/loginBg.png";
import Logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";

function LoginPupUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassoword, setResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signInWithEmail } = useAuthContext();
  const navigate = useNavigate();

  function handleForgotPassword() {
    setResetPassword(!resetPassoword);
    navigate("/resetPassword");
  }

  const handleLogIn = () => {
    setLoading(true);
    signInWithEmail(email, password)  
      .then((response) => {
        if (response.success) {
          let accessToken = response.response.session.access_token;
          localStorage.setItem("logIn", "true");
          localStorage.setItem("Access-token", accessToken);
          toast.success("Login successfully!");

            navigate("/dashboard");

        } else {
          toast.error(response.response.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: "cover" }}
        className="fixed inset-0 bg-opacity-50 z-50 opacity-15"
      ></div>

      <div className="flex items-center justify-center text-black py-2 opacity-100">
        <img src={Logo} />
      </div>
      <div className="bg-[#0000001A] h-[1px] opacity-100"></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 h-[443px] w-[545px] m-auto">
        <div className="w-full max-w-md bg-[#FFFFFF99] rounded-lg shadow-lg p-5 relative">
          <div>
            <p className="text-[#1D1617] font-semibold text-[28px]">
              Login Now
            </p>
            <p className="text-base font-normal mt-4 text-[#00000099] leading-[22px]">
Welcome back! Sign in to manage your system settings and data.
            </p>
            <div className="flex items-center p-4 border-[1px] border-[#ADA4A54D] rounded-[10px] mt-8">
              <EmailIcon />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email"
                className="border-none outline-none ps-3 w-full bg-transparent"
              />
            </div>
            <div className="flex items-center p-4 border-[1px] border-[#ADA4A54D] rounded-[10px] mt-8">
              <LockIcon />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="border-none outline-none px-3 w-full bg-transparent"
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                <UnseenIcon />
              </button>
            </div>
            <div className="text-end">
              <button
                onClick={handleForgotPassword}
                className="text-sm font-normal text-[#FF0000] mt-2"
              >
                Forgot Password?
              </button>
            </div>
            <button
              onClick={handleLogIn}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#798FFF] to-[#8EC6FF] rounded-[40px] text-white mt-12 shadow-[0px_10px_22px_0px_#95ADFE4D]"
              disabled={loading}
            >
              Log In
            </button>
          </div>
        </div>
      </div>

      {/* Full-page Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </>
  );
}

export default LoginPupUp;
