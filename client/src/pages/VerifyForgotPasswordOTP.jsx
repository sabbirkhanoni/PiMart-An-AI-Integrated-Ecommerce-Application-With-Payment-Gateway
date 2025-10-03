import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxioxToastError';
import {useNavigate } from 'react-router-dom';
import logo from "../assets/logo-no-background.png";
import { useLocation } from 'react-router-dom';

function VerifyForgotPasswordOTP() {

  const [data, setData] = useState(["", "", "", "", "", ""]);

  //which help me to redirect to login page after successful registration
  const navigate = useNavigate();

   //check all the filds are filled then change the color of the Create Account button
   const validValueOfEveryInput = data.every((item) => item);

   //input cursor move to next input field for taking OTP
   const inputRef = useRef([])

   //accept the email from forgot password page
  const location = useLocation();

  //check user have email with nevigating url from forgot password page or not
  //if not then redirect to verify-forgot-password-otp page is not allowed
  
  useEffect(() => {
    if(!location?.state?.email){
      navigate('/forgot-password')
    }
  }, [location, navigate])

  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send the data to the backend using Custom Axios
    try{
    const response = await Axios({
      ...SummaryApi.verifyForgotPasswordOtp,
      data : {
        email : location?.state?.email,
        otp : data.join("")
      }
    })

    if(response.data.error){
      toast.error(response.data.message)
    }

    if(response.data.success){
      toast.success(response.data.message)
      navigate("/reset-password", {
        state: {
          data : response.data,
          email : location?.state?.email
        }
      });
      setData(["", "", "", "", "", ""])
    }


    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="mt-[-130px] min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-2 pb-5 flex items-center justify-center min-h-screen">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
                <p className="text-gray-600">Join our community PIMART</p>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Continue with verified OTP</span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <div className="relative">
                    <label htmlFor="otp" className="">Enter OTP</label>
                    <div className='flex gap-2 items-center justify-between'>
                      {
                        data.map((item, index) => {
                            return (
                              <input
                              key={"otp" + index}
                              maxLength={1}
                              ref = {(ref)=>{
                                inputRef.current[index] = ref;
                                return ref
                              }}
                              className="bg-blue-50 w-full max-w-16 p-2 border rounded-3xl outline-none focus: border-blue-300 text-center font-semibold"
                              type="text"
                              id="otp"
                              value={data[index]}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (isNaN(value)) {
                                  return;
                                }
                                const newData = [...data];
                                newData[index] = value;
                                setData(newData);

                                if(value && index < 5){
                                  inputRef.current[index+1].focus();
                                }
                              }}
                            />
                            )
                        })

                      }
                    </div>
                    
                  </div>

                </div>

                <button disabled={!validValueOfEveryInput}
                  type="submit"
                  className= {` ${validValueOfEveryInput ? "from-blue-500 via-indigo-600 to-purple-600 text-white" : "bg-blue-300 hover:bg-blue-400"} w-full bg-gradient-to-r py-3 px-4 rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
                >
                  Verify OTP
                </button>
              </form>

              <button 
                  type="cancel"
                  className= "from-blue-500 via-indigo-600 to-purple-600 text-white bg-blue-300 hover:bg-blue-400 w-full bg-gradient-to-r py-3 px-4 rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-4"
                >
                  Cancel
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyForgotPasswordOTP