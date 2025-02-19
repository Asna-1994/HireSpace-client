import { FC, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignInAlt,
  FaUserPlus,
  FaEdit,
  FaCrown,
  FaUsers,
  FaUpload,
  FaSignOutAlt,
  FaBriefcase,
} from 'react-icons/fa';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { getCompanyInitials } from '../../../Utils/helperFunctions/companyName';
import { logoutUser } from '../../../services/user/authServices';

const CompanyHeader: FC = () => {
  const { company, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const data = await logoutUser()
      dispatch(logout());
      navigate('/');
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const toggleCompanyDropdown = () => {
    setCompanyDropdownOpen((prev) => !prev);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  // Reusable NavItem for navigation links (for mobile)
  const NavItem = ({
    to,
    icon,
    label,
    onClick,
  }: {
    to: string;
    icon: JSX.Element;
    label: string;
    onClick?: () => void;
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <header className="bg-black text-white shadow-md relative">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Brand / Logo */}
        <Link
          to={`/company/home/${company?._id}`}
          className="text-2xl font-bold text-white hover:text-gray-300"
        >
          HireSpace
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {isAuthenticated && company ? (
            <>
              <NavLink
                to={`/company/home/${company._id}`}
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaHome className="text-lg" />
                <span className="text-sm">Home</span>
              </NavLink>
              <NavLink
                to={`/company/${company._id}/all-applications`}
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaInfoCircle className="text-lg" />
                <span className="text-sm">Applications</span>
              </NavLink>
              <NavLink
                to={`/company/${company._id}/view-job-posts`}
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaBriefcase className="text-lg" />
                <span className="text-sm">Jobs</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaHome className="text-lg" />
                <span className="text-sm">Home</span>
              </NavLink>
              <NavLink
                to="/about"
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaInfoCircle className="text-lg" />
                <span className="text-sm">About</span>
              </NavLink>
              <NavLink
                to="/contact"
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaPhoneAlt className="text-lg" />
                <span className="text-sm">Contact</span>
              </NavLink>
              <NavLink
                to="/company/login"
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaSignInAlt className="text-lg" />
                <span className="text-sm">Login</span>
              </NavLink>
              <NavLink
                to="/company/signin"
                className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
              >
                <FaUserPlus className="text-lg" />
                <span className="text-sm">Sign Up</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Right Section - Two Dropdowns */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {/* User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="flex flex-col items-center space-x-2 focus:outline-none"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
                  {user.userName.slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden sm:inline text-xs">
                  {user.userName}
                </span>
              </button>
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300 z-20"
                  role="menu"
                  aria-label="User Dropdown Menu"
                >
                  <div className="py-2 px-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-lg font-bold">
                        {user.userName.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h3 className="font-bold">{user.userName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {user.userRole === 'companyAdmin'
                            ? 'Admin'
                            : 'Member'}
                        </p>
                      </div>
                    </div>
                    <hr className="border-gray-300 mb-2" />
                    {[
                      {
                        to: `/user/profile/${user._id}`,
                        label: 'View Profile',
                        icon: FaCrown,
                      },
                      {
                        to: `/user/edit-basic-details/${user._id}`,
                        label: 'Edit Profile',
                        icon: FaEdit,
                      },
                    ].map(({ to, label, icon: Icon }, index) => (
                      <Link
                        key={index}
                        to={to}
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        <Icon className="mr-3 text-gray-600" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Company Profile Dropdown */}
          {isAuthenticated && company && (
            <div className="relative">
              <button
                onClick={toggleCompanyDropdown}
                className="flex flex-col items-center space-x-2 focus:outline-none"
              >
                {company.companyLogo?.url ? (
                  <img
                    src={company.companyLogo.url}
                    alt="Company Logo"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
                    {getCompanyInitials(company.companyName)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs">
                  {company.companyName}
                </span>
              </button>
              {companyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300 z-20"
                  role="menu"
                  aria-label="Company Dropdown Menu"
                >
                  <div className="py-2">
                    <Link
                      to={`/company/profile/${company._id}`}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      {company.companyLogo?.url ? (
                        <img
                          src={company.companyLogo.url}
                          alt="Company Logo"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                          {getCompanyInitials(company.companyName)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold">
                          {company.companyName}
                        </h2>
                        <h3 className="text-sm text-gray-500">
                          {company.email}
                        </h3>
                      </div>
                    </Link>
                    <hr className="border-gray-300 my-2" />
                    {[
                      {
                        to: `/company/edit-profile/${company._id}`,
                        icon: FaEdit,
                        label: 'Edit Profile',
                      },
                      {
                        to: `/company/upload-logo/${company._id}`,
                        icon: FaUpload,
                        label: 'Upload Logo',
                      },
                      {
                        to: `/company/${company._id}/add-members`,
                        icon: FaUsers,
                        label: 'Add Members',
                      },
                      {
                        to: `/company/document-upload/${company._id}`,
                        icon: FaUpload,
                        label: 'Upload Document',
                      },
                    ].map(({ to, icon: Icon, label }, index) => (
                      <Link
                        key={index}
                        to={to}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        <Icon className="mr-3 text-gray-600" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-600" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute right-6 top-4 focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-800 text-white px-6 py-4 space-y-4">
          {isAuthenticated ? (
            <>
              {/* Mobile: Show separate items for both profiles */}
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-sm font-bold">
                      {user.userName.slice(0, 2).toUpperCase()}
                    </span>
                  </button>
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300 z-20"
                      role="menu"
                      aria-label="User Dropdown Menu"
                    >
                      <div className="py-2 px-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-lg font-bold">
                            {user.userName.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <h3 className="font-bold">{user.userName}</h3>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.userRole === 'companyAdmin'
                                ? 'Admin'
                                : 'Member'}
                            </p>
                          </div>
                        </div>
                        <hr className="border-gray-300 mb-2" />
                        {[
                          {
                            to: `/user/profile/${user._id}`,
                            label: 'View Profile',
                            icon: FaCrown,
                          },
                          {
                            to: `/user/edit-basic-details/${user._id}`,
                            label: 'Edit Profile',
                            icon: FaEdit,
                          },
                        ].map(({ to, label, icon: Icon }, index) => (
                          <Link
                            key={index}
                            to={to}
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Icon className="mr-3 text-gray-600" />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && company && (
                <div className="relative">
                  <button
                    onClick={toggleCompanyDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {company.companyLogo?.url ? (
                      <img
                        src={company.companyLogo.url}
                        alt="Company Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
                        {getCompanyInitials(company.companyName)}
                      </div>
                    )}
                    <span className="hidden sm:inline">
                      {company.companyName}
                    </span>
                  </button>
                  {companyDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300 z-20"
                      role="menu"
                      aria-label="Company Dropdown Menu"
                    >
                      <div className="py-2">
                        <Link
                          to={`/company/profile/${company._id}`}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition-colors"
                          role="menuitem"
                        >
                          {company.companyLogo?.url ? (
                            <img
                              src={company.companyLogo.url}
                              alt="Company Logo"
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                              {getCompanyInitials(company.companyName)}
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-bold">
                              {company.companyName}
                            </h2>
                            <h3 className="text-sm text-gray-500">
                              {company.email}
                            </h3>
                          </div>
                        </Link>
                        <hr className="border-gray-300 my-2" />
                        {[
                          {
                            to: `/company/edit-profile/${company._id}`,
                            icon: FaEdit,
                            label: 'Edit Profile',
                          },
                          {
                            to: `/company/upload-logo/${company._id}`,
                            icon: FaUpload,
                            label: 'Upload Logo',
                          },
                          {
                            to: `/company/${company._id}/add-members`,
                            icon: FaUsers,
                            label: 'Add Members',
                          },
                          {
                            to: `/company/document-upload/${company._id}`,
                            icon: FaUpload,
                            label: 'Upload Document',
                          },
                        ].map(({ to, icon: Icon, label }, index) => (
                          <Link
                            key={index}
                            to={to}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Icon className="mr-3 text-gray-600" />
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                          role="menuitem"
                        >
                          <FaSignOutAlt className="mr-3 text-gray-600" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <NavItem
                to={`/company/home/${company?._id}`}
                icon={<FaHome />}
                label="Home"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to={`/company/${company?._id}/all-applications`}
                icon={<FaInfoCircle />}
                label="Applications"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to={`/company/${company?._id}/view-job-posts`}
                icon={<FaUserPlus />}
                label="Job Posts"
                onClick={() => setMenuOpen(false)}
              />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavItem
                to="/"
                icon={<FaHome />}
                label="Home"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to="/about"
                icon={<FaInfoCircle />}
                label="About"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to="/contact"
                icon={<FaPhoneAlt />}
                label="Contact"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to="/company/login"
                icon={<FaSignInAlt />}
                label="Login"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to="/company/signin"
                icon={<FaUserPlus />}
                label="Sign Up"
                onClick={() => setMenuOpen(false)}
              />
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default CompanyHeader;
