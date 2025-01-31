
// import React, { useEffect, useState } from "react";
// import Header from "../../Components/Header/Header";
// import  { AxiosResponse } from "axios";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";
// import axiosInstance from "../../../Utils/Instance/axiosInstance";
// import { ApiResponse } from "../../../Utils/Interfaces/interface";
// import CompanyHeader from "../../Components/Header/Header";



// const OtpVerificationCompany = () => {

//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(0);

//   const location  = useLocation()
//   const { user } = location.state || {}; 
//   const { email, otpExpiry } = user || {};  

//   const navigate = useNavigate()

//   const manageOtpTimer = (newOtpExpiry?: string) => {

//     const expiry = newOtpExpiry || otpExpiry || localStorage.getItem("otpExpiry");
  
//     if (expiry) {
//       const otpExpiryDate = new Date(expiry);
//       if (!isNaN(otpExpiryDate.getTime())) {
//         const remainingTime = Math.max(0, Math.floor((otpExpiryDate.getTime() - Date.now()) / 1000));
//         setTimer(remainingTime);
  
//         if (remainingTime > 0) {
//           const interval = setInterval(() => {
//             setTimer((prev) => {
//               if (prev <= 1) {
//                 clearInterval(interval);
//                 return 0;
//               }
//               return prev - 1;
//             });
//           }, 1000);
//           return () => clearInterval(interval);
//         }
//       } else {
//         console.error("Invalid OTP expiry date");
//       }
//     }
//   };
  


//   useEffect(() => {
//   manageOtpTimer()
//   }, [otpExpiry]);

//   const handleResendOtp = async () => {
//     try {
//       const response = await axiosInstance.post("/company/resend-otp", { email });
//       const user = response.data.user;
//       const newOtpExpiry = user?.otpExpiry;
  
//       if (newOtpExpiry) {
//         localStorage.setItem("otpExpiry", newOtpExpiry); 
//         manageOtpTimer(newOtpExpiry); 
//         toast.success("OTP resent successfully!");
//       } else {
//         throw new Error("OTP expiry not returned by the server");
//       }
//     } catch (error) {
//       toast.error("Failed to resend OTP. Please try again.");
//       console.error("Error resending OTP:", error);
//     }
//   };
  

//   const handleOtpVerification = async (event: React.FormEvent): Promise<void> => {
//     event.preventDefault();
//     try {
//       const response: AxiosResponse<ApiResponse> = await axiosInstance.post(
//         "/company/verify-otp",
//         { email, otp }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message);
//         localStorage.removeItem("otpExpiry"); 
//         navigate('/company/login')
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error: any) {
//         console.log(error.response?.data?.error.message)
//       toast.error(error.response?.data?.error.message || "Something went wrong");
//     }
//   };

//   return (
//     <>
//        <CompanyHeader/>
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 px-4">
//     <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
//         OTP Verification
//       </h2>

//       <h2 className="text-center text-lg text-gray-700 mb-4">
//         OTP has been sent to <span className="font-semibold">{email}</span>
//       </h2>
//       <h2 className="text-center text-sm text-gray-600 mb-6">
//         Your OTP will expire after <span className="font-semibold">{timer} seconds</span>
//       </h2>
      
//       <form onSubmit={handleOtpVerification} className="flex flex-col gap-4">
//         <input
//           type="text"
//           name="otp"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="Enter OTP"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
//         >
//           Submit
//         </button>
//       </form>

//       <button
//         type="button"
//         onClick={handleResendOtp}
//         className="mt-4 w-full bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
//         disabled={timer > 0} 
//       >
//         Resend OTP
//       </button>
//     </div>
//   </div>
//     </>
//   );
// };

// export default OtpVerificationCompany;

import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";

const OtpVerificationCompany = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpExpiryFromCompany, setOtpExpiry] = useState<string | null>(null);

  const location = useLocation();
  const { company } = location.state || {};
  const { email, otpExpiry } = company || {};

  const navigate = useNavigate();

  useEffect(() => {
 
    const calculateTimer = () => {
      const expiry = otpExpiryFromCompany || otpExpiry;
      if (expiry) {
        const expiryDate = new Date(expiry);
        if (!isNaN(expiryDate.getTime())) {
          const remainingTime = Math.max(
            0,
            Math.floor((expiryDate.getTime() - Date.now()) / 1000)
          );
          setTimer(remainingTime);
          return remainingTime;
        }
      }
      return 0;
    };

    // Set initial timer
    const initialTime = calculateTimer();
    if (initialTime > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [otpExpiry, otpExpiryFromCompany]);

  const handleResendOtp = async () => {
    try {
      const response = await axiosInstance.post("/company/resend-otp", { email });
      const company = response.data.data.company
     
if(response.data.success){
  const newOtpExpiry = company?.otpExpiry;
  setOtpExpiry(newOtpExpiry);
  localStorage.setItem("otpExpiry", newOtpExpiry); 
  toast.success(response.data.message);
} 
else {
     toast.error(response.data.message)
      }
    } catch (error : any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const handleOtpVerification = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const otpExpiryDate = otpExpiryFromCompany || otpExpiry;
      if (otpExpiryDate && Date.now() > new Date(otpExpiryDate).getTime()) {
        toast.error("OTP has expired. Please request a new one.");
        return;
      }
      const response = await axiosInstance.post("/company/verify-otp", {
        email,
        otp,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setOtpExpiry(null); // Clear OTP expiry
        localStorage.removeItem("otpExpiry"); // Remove OTP expiry
        navigate("/company/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
          <Header />
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 px-4">
           <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
               <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                OTP Verification
             </h2>
    
              <h2 className="text-center text-lg text-gray-700 mb-4">
                OTP has been sent to <span className="font-semibold">{email}</span>
              </h2>
              <h2 className="text-center text-sm text-gray-600 mb-6">
                Your OTP will expire after <span className="font-semibold">{timer} seconds</span>
              </h2>
    
              <form onSubmit={handleOtpVerification} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter OTP"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  Submit
               </button> 
               </form>
    
             <button
               type="button"
               onClick={handleResendOtp}
               className="mt-4 w-full bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
               disabled={timer > 0}
             >
               Resend OTP
             </button>
           </div>
         </div>
       </> 
 
  );
};

export default OtpVerificationCompany;



