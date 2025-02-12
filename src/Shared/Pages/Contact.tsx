import React from "react";
import Header from "../../User/Components/Header/Header";

const Contact: React.FC = () => {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-black-700 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 mb-6">
            We're here to help. Drop us a message, and we'll get back to you as
            soon as possible.
          </p>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="name"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="email"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Type your message here"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
