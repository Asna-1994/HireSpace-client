import React from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const PaymentSuccess: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Payment Successful 🎉
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Thank you for upgrading! Your premium subscription is now active.
          </p>
          <Link
            to={`/user/home/${user?._id}`}
            className="block w-full text-center py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link to="/support" className="text-blue-500 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
