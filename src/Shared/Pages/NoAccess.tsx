import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">Access Denied</h1>
        <p className="text-base text-gray-600 mb-6">
          It seems like you don't have the necessary permissions to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate('/user-login')}
          className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NoAccess;
