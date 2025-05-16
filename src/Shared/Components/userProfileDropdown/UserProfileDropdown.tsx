

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
            className="object-cover w-10 h-10 rounded-full sm:w-12 sm:h-12"
          />
        ) : (
          <span className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-blue-500 rounded-full sm:w-12 sm:h-12 sm:text-base">
            {user?.userName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </button>

      {userProfileDropdownOpen && (
        <div
          className="absolute right-0 z-10 w-56 mt-2 text-black bg-white border border-gray-300 rounded shadow-lg sm:w-64"
          role="menu"
          aria-label="User Dropdown Menu"
        >
          <div className="px-4 py-3">
            {/* User Details */}
            <Link
              to={`/user/view-profile/${user._id}`}
              onClick={() => setUserProfileDropdownOpen(false)}
            >
              <div className="flex items-center mb-3 space-x-3">
                {/* User Avatar */}
                <span className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-gray-800 rounded-full">
                  {user?.userName.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="flex items-center space-x-2 text-base font-bold sm:text-lg">
                    <span>{user?.userName}</span>
                  </h3>
                  <p className="text-xs text-gray-500 sm:text-sm">
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

            <hr className="mb-2 border-gray-300" />

            {/* Dropdown Links */}
            {dropdownOptions.map(({ to, label, icon: Icon }, index) => (
              <Link
                key={index}
                to={to}
                onClick={() => setUserProfileDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-xs transition-colors sm:text-sm hover:bg-gray-100"
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
                className="flex items-center w-full px-4 py-2 text-xs text-left transition-colors sm:text-sm hover:bg-gray-100"
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
