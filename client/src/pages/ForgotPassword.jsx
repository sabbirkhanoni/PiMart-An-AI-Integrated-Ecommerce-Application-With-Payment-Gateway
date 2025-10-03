import { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxioxToastError";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-no-background.png";

function ForgotPassword() {
  const [data, setData] = useState({
    email: "",
  });

  //which help me to redirect to login page after successful registration
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the data to the backend using Custom Axios
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-forgot-password-otp", {
          state: data,
        });
        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  //check all the filds are filled then change the color of the Create Account button
  const validValueOfEveryInput = Object.values(data).every((item) => item);

  return (
    <div className=" mt-[-150px] min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="container mx-auto  px-4 pt-1 pb-2 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>

            <div className="relative">
              {/* Logo added at the top */}
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  width={80}
                  height={40}
                  alt="logo"
                  className="lg:hidden"
                />
              </div>
            </div>

            <div className="relative">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Account Recovery
                </h1>
                <p className="text-gray-600">Join our community of PIMART</p>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Continue with email
                  </span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaRegEnvelope className="w-5 h-5 animate-pulse" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 hover:bg-white/80"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email Address"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={!validValueOfEveryInput}
                  type="submit"
                  className={` ${
                    validValueOfEveryInput
                      ? "from-blue-500 via-indigo-600 to-purple-600 text-white"
                      : "bg-blue-300 hover:bg-blue-400"
                  } w-full bg-gradient-to-r py-3 px-4 rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
                >
                  Send OTP
                </button>
              </form>

              <p className="text-center text-sm mt-7 text-gray-600">
                <Link
                  to={"/login"}
                  className="text-[#1370ebfa] hover:text-blue-900 font-medium"
                >
                  Remmember Password? Want to Login?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
