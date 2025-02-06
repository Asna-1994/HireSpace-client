

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaUserAlt,
  FaExclamationCircle,
  FaClipboard,
} from "react-icons/fa";
import { HiOutlineHome, HiOutlineMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white flex flex-col transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 w-64 z-50`}
      >
        <div className="p-4 text-2xl font-bold text-center border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            {/* Links */}
            <li>
              <NavLink
                to={`/admin/home/${user?._id}`}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <HiOutlineHome className="mr-3" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-users"
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers className="mr-3" />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-companies"
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <FaBuilding className="mr-3" />
                Companies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-premium-users"
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUserAlt className="mr-3" />
                Premium Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/spam-reports"
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <FaExclamationCircle className="mr-3" />
                Spam Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/manage-plans/${user?._id}`}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <FaClipboard className="mr-3" />
                Manage Plans
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-800 text-white rounded md:hidden"
        onClick={toggleSidebar}
      >
        <HiOutlineMenu size={24} />
      </button>
    </div>
  );
};

export default SideBar;
