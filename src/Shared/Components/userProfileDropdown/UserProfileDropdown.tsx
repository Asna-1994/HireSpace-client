

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPills } from 'react-icons/fa';
import {
  FaCrown,
  FaEdit,
  FaCertificate,
  FaSignOutAlt,
  FaGraduationCap,
  FaBriefcase,
  FaFileUpload,
  FaSave,
} from 'react-icons/fa';
import { User } from '../../../Utils/Interfaces/interface';

interface UserProfileDropdownProps {
  user: User;
  handleLogout?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  handleLogout,
}) => {
  const [userProfileDropdownOpen, setUserProfileDropdownOpen] = useState(false);

  const toggleUserProfileDropdown = () => {
    setUserProfileDropdownOpen((prev) => !prev);
  };

  const dropdownOptions = [
    // { to: `/user/settings/${user._id}`, label: 'User Settings', icon: FaCrown },
    {
      to: `/user/edit-basic-details/${user._id}`,
      label: 'Edit Profile',
      icon: FaEdit,
    },
    {
      to: `/user/add-education/${user._id}`,
      label: 'Add Education',
      icon: FaGraduationCap,
    },
    {
      to: `/user/add-work-experience/${user._id}`,
      label: 'Add Work Experience',
      icon: FaBriefcase,
    },
    { to: `/user/add-skills/${user._id}`, label: 'Add Skills', icon: FaPills },
    {
      to: `/user/add-certificates/${user._id}`,
      label: 'Add Certificates',
      icon: FaCertificate,
    },
    {
      to: `/user/upload-resume/${user._id}`,
      label: 'Upload Resume',
      icon: FaFileUpload,
    },
    { to: `/user/saved-jobs/${user._id}`, label: 'Saved Jobs', icon: FaSave },
    {
      to: `/user/${user._id}/try-premium`,
      label: 'Try Premium',
      icon: FaCrown,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={toggleUserProfileDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {/* Profile photo or initials */}
        {user.profilePhoto?.url ? (
          <img
            src={user.profilePhoto.url}
            alt="User Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white text-sm sm:text-base font-bold">
            {user?.userName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </button>

      {userProfileDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-56 sm:w-64 bg-white text-black rounded shadow-lg border border-gray-300 z-10"
          role="menu"
          aria-label="User Dropdown Menu"
        >
          <div className="py-3 px-4">
            {/* User Details */}
            <Link
              to={`/user/view-profile/${user._id}`}
              onClick={() => setUserProfileDropdownOpen(false)}
            >
              <div className="flex items-center space-x-3 mb-3">
                {/* User Avatar */}
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-lg font-bold">
                  {user?.userName.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg flex items-center space-x-2">
                    <span>{user?.userName}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {user?.email}
                  </p>
                  {user?.isPremium && (
                    <span className="mt-1 inline-block bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full font-semibold">
                      Premium
                    </span>
                  )}
                  {user.companyId && (
                    <p className="text-xs text-gray-400">
                      {user?.userRole === 'companyAdmin' ? 'Admin' : 'Member'}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            <hr className="border-gray-300 mb-2" />

            {/* Dropdown Links */}
            {dropdownOptions.map(({ to, label, icon: Icon }, index) => (
              <Link
                key={index}
                to={to}
                onClick={() => setUserProfileDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                <Icon className="mr-3 text-gray-600" />
                {label}
              </Link>
            ))}

            {/* Logout Button */}
            {handleLogout && (
              <button
                onClick={() => {
                  setUserProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                <FaSignOutAlt className="mr-3 text-gray-600" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
