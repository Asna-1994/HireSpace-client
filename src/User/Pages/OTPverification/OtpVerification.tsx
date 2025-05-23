import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendOtp, verifyOtp } from '../../../services/user/authServices';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [otpExpiryFromUser, setOtpExpiry] = useState<string | null>(null);

  const location = useLocation();
  const { user } = location.state || {};
  const { email, otpExpiry } = user || {};

  const navigate = useNavigate();

  useEffect(() => {
    // Function to calculate and set the timer
    const calculateTimer = () => {
      const expiry = otpExpiryFromUser || otpExpiry;
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
      return () => clearInterval(interval);
    }
  }, [otpExpiry, otpExpiryFromUser]);

  const handleResendOtp = async () => {
    try {
      const data = await resendOtp(email)
      const user = data.data.user;

      if (data.success) {
        const newOtpExpiry = user?.otpExpiry;
        setOtpExpiry(newOtpExpiry);
        localStorage.setItem('otpExpiry', newOtpExpiry);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleOtpVerification = async (
    event: React.FormEvent
  ): Promise<void> => {
    event.preventDefault();
    try {
      const otpExpiryDate = otpExpiryFromUser || otpExpiry;
      if (otpExpiryDate && Date.now() > new Date(otpExpiryDate).getTime()) {
        toast.error('OTP has expired. Please request a new one.');
        return;
      }
      const data = await verifyOtp(email, otp)
      if (data.success) {
        toast.success(data.message);
        setOtpExpiry(null); 
        localStorage.removeItem('otpExpiry');
        navigate('/user/login');
      } else {
        console.log(data)
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-3 text-2xl font-bold text-center text-gray-800">
            OTP Verification
          </h2>

          <h2 className="mb-4 text-lg text-center text-gray-700">
            OTP has been sent to <span className="font-semibold">{email}</span>
          </h2>
          <h2 className="mb-6 text-sm text-center text-gray-600">
            Your OTP will expire after{' '}
            <span className="font-semibold">{timer} seconds</span>
          </h2>

          <form
            onSubmit={handleOtpVerification}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter OTP"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>

          <button
            type="button"
            onClick={handleResendOtp}
            className="w-full px-4 py-2 mt-4 text-white transition duration-300 bg-blue-900 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={timer > 0}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
