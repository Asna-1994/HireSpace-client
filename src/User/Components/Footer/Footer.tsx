import React, { FC } from 'react';



const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
    
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h5 className="text-2xl font-bold">HireSpace</h5>
            <p className="text-gray-400 mt-2">
              &copy; {new Date().getFullYear()} HireSpace. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-col md:flex-row mb-4 md:mb-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 px-4 py-2"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 px-4 py-2"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 px-4 py-2"
            >
              Sitemap
            </a>
          </nav>

  
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 2a2 2 0 00-2 2v2h-2v4h2v12h4V10h3l1-4h-4V4a1 1 0 011-1h2V2h-2a2 2 0 00-2 2v2h-2v4h2v12h4V10h3l1-4h-4V4a1 1 0 011-1h2V2h-2"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M23 3a10.1 10.1 0 01-2.88.788A4.99 4.99 0 0022.437 1.4a10.08 10.08 0 01-3.125 1.2A4.957 4.957 0 0016.616 0a4.92 4.92 0 00-4.922 4.922c0 .385.043.76.126 1.117A13.98 13.98 0 011.671 2.724a4.92 4.92 0 001.524 6.556A4.93 4.93 0 01.96 8.62v.062a4.916 4.916 0 003.946 4.8 4.922 4.922 0 01-2.22.085A4.91 4.91 0 005.57 14.24a4.916 4.916 0 01-2.17.082 4.92 4.92 0 004.606 3.417A9.88 9.88 0 010 19.29a13.938 13.938 0 007.548 2.21c9.055 0 14.019-7.5 14.019-14.018 0-.213-.006-.426-.014-.637A10.03 10.03 0 0023 3z"
                />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8a6 6 0 11-12 0 6 6 0 0112 0zM3 10c0-2.5 2-4.5 4.5-4.5S12 7.5 12 10s-2 4.5-4.5 4.5S3 12.5 3 10zm9 0c0-.55-.45-1-1-1s-1 .45-1 1 1 .5 1 1 .45-1 1-1zm5-2a2 2 0 112 2 2 2 0 01-2-2zm-6 9h6v-4h-2v3h-4v-3h-2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
