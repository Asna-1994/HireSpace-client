import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const PaymentFailure: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728zm-5.657 4.95L12 12l-.707.707M12 12l-.707-.707m1.414 0L12 12l.707.707m-1.414 0L12 12l-.707-.707"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Payment Failed 😞
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Unfortunately, your payment could not be processed. Please try again
            or contact support if the issue persists.
          </p>
          <Link
            to={`/user/${user?._id}/try-premium`}
            className="block w-full text-center py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg font-semibold transition-transform transform hover:scale-105"
          >
            Back to Premium Plans
          </Link>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Need help?{' '}
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

export default PaymentFailure;
