import React, { FC, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { logout } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const AdminHeader: FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/logout");
      dispatch(logout());
      navigate("/");
      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <header className="  w-full shadow  flex items-center px-6 bg-gradient-to-r from-indigo-600 to-purple-600 ">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to={`/user-home/${user?._id}`}
          className="text-2xl font-bold text-white hover:text-gray-200"
        >
          HireSpace
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to={`/admin/home/${user?._id}`}
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Home
            </NavLink>
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {user?.profilePhoto?.url ? (
                  <img
                    src={user?.profilePhoto?.url}
                    className="w-10 h-10 rounded-full"
                  ></img>
                ) : (
                  <FaUserCircle className="w-8 h-8 text-white" />
                )}

                <span className="text-white">{user?.userName || "Admin"}</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <Link
                    to={`/admin/edit-profile/${user?._id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <HiX className="w-8 h-8 text-white" />
          ) : (
            <HiMenuAlt3 className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-indigo-600 px-6 py-4 space-y-4">
          <NavLink
            to={`/user-home/${user?._id}`}
            className="block text-white hover:text-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className="block text-white hover:text-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button
            className="block w-full text-left text-white hover:text-gray-200"
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default AdminHeader;
