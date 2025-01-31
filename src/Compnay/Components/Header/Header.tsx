import  { FC, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FaHome, FaInfoCircle, FaPhoneAlt, FaSignInAlt, FaUserPlus, FaUserCircle, FaEdit, FaCrow, FaCrown, FaUsers, FaUpload, FaSignOutAlt, FaBriefcase, FaEnvelope } from "react-icons/fa";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { logout } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import ThemeToggle from "../../../Shared/Components/ThemeToggle/ThemeToggle";
import { getCompanyInitials } from "../../../Utils/helperFunctions/companyName";

const CompanyHeader: FC = () => {
  const { company, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userProfileDropdownOpen, setUserProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/user/logout');
      dispatch(logout());
      navigate('/');
      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  const toggleUserProfileDropdown = () => {
    setUserProfileDropdownOpen(!userProfileDropdownOpen);
  };
  const NavItem = ({ to, icon, label, onClick }: { to: string; icon: JSX.Element; label: string; onClick?: () => void }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
    >
      <div className="text-lg">{icon}</div>
      <span className="text-sm">{label}</span>
    </NavLink>
  );
  

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to={`/company/home/${company?._id}`} className="text-2xl font-bold text-white hover:text-gray-300">
          HireSpace
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          {isAuthenticated && company ? (
            <>
              <NavItem to={`/company/home/${company._id}`} icon={<FaHome />} label="Home" />
              <NavItem to={`/company/${company._id}/all-applications`} icon={<FaInfoCircle />} label="Applications" />
              <NavItem to="/messages" icon={<FaEnvelope />} label="Messages" />
              {/* <NavItem to="/connections" icon={<FaSignInAlt />} label="Connections" /> */}
              <NavItem to={`/company/${company._id}/view-job-posts`} icon={<FaBriefcase />} label="Jobs" />
            </>
          ) : (
            <>
              <NavItem to="/" icon={<FaHome />} label="Home" />
              <NavItem to="/about" icon={<FaInfoCircle />} label="About" />
              <NavItem to="/contact" icon={<FaPhoneAlt />} label="Contact" />
              <NavItem to="/company/login" icon={<FaSignInAlt />} label="Login" />
              <NavItem to="/company/signin" icon={<FaUserPlus />} label="Sign Up" />
            </>
          )}
        </nav>
             <div className="hidden md:flex items-center space-x-4 relative">

              
             {user && (
  <div className="relative">
    <button
      onClick={toggleUserProfileDropdown}
      className="flex items-center space-x-2 focus:outline-none"
    >
 
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-sm font-bold">
        {user?.userName.slice(0, 2).toUpperCase()}
      </span>
    </button>
    {userProfileDropdownOpen && (
      <div
        className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300"
        role="menu"
        aria-label="User Dropdown Menu"
      >
        <div className="py-2 px-4">
      
          <div className="flex items-center space-x-2 mb-2">
          
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-lg font-bold">
              {user?.userName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h3 className="font-bold">{user?.userName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400">
                {user?.userRole === 'companyAdmin' ? 'Admin' : 'Member'}
              </p>
            </div>
          </div>
          <hr className="border-gray-300 mb-2" />

          
          {[{ to: `/company/member/profile/${user._id}`, label: "View Profile", icon: FaCrown },
            { to: `/user/edit-basic-details/${user._id}`, label: "Edit Profile", icon: FaEdit }]
            .map(({ to, label, icon: Icon }, index) => (
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

          {/* Logout Button */}
  
          {/* <button
            onClick={handleLogout}
            className="flex items-center  w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
            role="menuitem"
          >
            <FaSignOutAlt className="mr-3 text-gray-600" />   Logout   </button> */}
        
        </div>
      </div>
    )}
  </div>
)}




          {isAuthenticated ? (
            <>
              <button onClick={toggleProfileDropdown} className="flex items-center space-x-2">
                <FaUserCircle className="text-xl" />
                <span>{company?.companyName || "Profile"}</span>
              </button>
              {profileDropdownOpen && (
                    <div
                    className="absolute top-7 right-0 mt-2 w-56 bg-white text-black rounded shadow-lg border border-gray-300"
                    role="menu"
                    aria-label="Dropdown menu"
                  >
                    <div className="py-2">
                      
                      <Link
                        to={`/company/profile/${company?._id}`}
                        className="flex items-center gap-2 px-4 py-3   hover:bg-blue-400 transition-colors"
                        role="menuitem"
                      >
                        {/* <FaUserCircle className="mr-3 text-4xl text-gray-600" /> */}
                        {/* <img src={company?.companyLogo.url} className="w-12 rounded-full"></img> */}
                     {company?.companyLogo?.url ? (
                           <img
                             src={company.companyLogo.url}
                             alt="Company Logo"
                             className="mx-auto mb-4 w-10 h-10 rounded-full shadow-lg "
                           />
                         ) : (
                           <div className="mx-auto mb-4  w-10 h-10 rounded-full shadow-lg bg-blue-500 flex items-center justify-center text-xl font-bold">
                             {getCompanyInitials(company?.companyName as string)}
                           </div>
                         )}
                        <div>
                          <h2 className="text-xl font-bold">{company?.companyName}</h2>
                          <h3 className="text-sm text-gray-500">{company?.email}</h3>
                        </div>
                      </Link>
              
              
                      <hr className="border-gray-300 my-2" />
              
                    
                      {[
                        { to: `/company/edit-profile/${company?._id}`, icon: FaEdit, label: "Edit Profile" },
                        { to: `/company/upload-logo/${company?._id}`, icon: FaUpload, label: "Upload Logo" },
                        { to: "/try-premium", icon: FaCrown, label: "Try Premium" },
                        { to: `/company/${company?._id}/add-members`, icon: FaUsers, label: "Add Members" },
                        { to: `/company/document-upload/${company?._id}`, icon: FaUpload, label: "Upload Document" },
                      ].map(({ to, icon: Icon, label }, index) => (
                        <Link
                          key={index}
                          to={to}
                          className="flex items-center px-4 py-2  hover:bg-gray-100 transition-colors"
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
            </>
          ) : (
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Get Started</button>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <nav className="md:hidden bg-gray-800 text-white px-6 py-4 space-y-4">
          {isAuthenticated ? (
            <>
         
             <NavItem  to={`/company/profile/${company?._id}`}  icon={company?.companyLogo ? <img src={company.companyLogo.url} alt="Profile" /> : <FaUserCircle />}  label={company?.companyName || "Profile"} 
/>
              <NavItem to={`/company/home/${company?._id}`} icon={<FaHome />} label="Home" onClick={() => setMenuOpen(false)} />
              <NavItem to="/myapplications" icon={<FaInfoCircle />} label="Applications" onClick={() => setMenuOpen(false)} />
              <NavItem to="/messages" icon={<FaPhoneAlt />} label="Messages" onClick={() => setMenuOpen(false)} />
              {/* <NavItem to="/connections" icon={<FaSignInAlt />} label="Connections" /> */}
              <NavItem to={`/company/${company?._id}/view-job-posts`} icon={<FaUserPlus />} label="Job Posts" />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center text-gray-300 hover:text-white transition duration-300 space-x-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/" icon={<FaHome />} label="Home" onClick={() => setMenuOpen(false)} />
              <NavItem to="/about" icon={<FaInfoCircle />} label="About" onClick={() => setMenuOpen(false)} />
              <NavItem to="/contact" icon={<FaPhoneAlt />} label="Contact" />
              <NavItem to="/company/login" icon={<FaSignInAlt />} label="Login" />
              <NavItem to="/company/signin" icon={<FaUserPlus />} label="Sign Up" />
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default CompanyHeader;


