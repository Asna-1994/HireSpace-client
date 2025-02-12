import React from "react";
import { Link } from "react-router-dom";
import Header from "../../User/Components/Header/Header";
import Footer from "../../User/Components/Footer/Footer";

const NotAuthenticated: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="h-screen container mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          You are not logged in
        </h2>
        <p className="mt-4 text-gray-600">
          Please{" "}
          <Link to="/" className="text-blue-600">
            login
          </Link>{" "}
          to view your home page.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default NotAuthenticated;
