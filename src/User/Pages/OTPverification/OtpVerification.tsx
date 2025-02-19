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
      toast.error(error);
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
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
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

export default OtpVerification;
