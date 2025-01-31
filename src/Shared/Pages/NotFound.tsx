import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center">
          <div className="mt-12">
        {/* <img
          src="https://cdn.vectorstock.com/i/1000v/92/66/error-404-page-not-found-text-oops-vector-34149266.jpg"
          alt=""
          className="w-44 object-cover rounded-lg shadow-lg"
        /> */}
      </div>
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-purple-600 animate-pulse">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Oops! The page you're looking for isn't here.
        </p>
        <p className="text-md text-gray-500 mt-2">
          It might have been moved or deleted. Try checking the URL or go back home.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-8 py-3 bg-purple-600 text-white text-lg font-medium rounded shadow-md hover:bg-purple-700 transform hover:-translate-y-1 transition-all"
        >
          Go Back Home
        </Link>
      </div>

    </div>
  );
};

export default NotFound;
