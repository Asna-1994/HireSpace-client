import { FC, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {socket } from '../../../services/socket';
import { RootState } from '../../../redux/store';
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBriefcase,
  FaEnvelope,
} from 'react-icons/fa';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import UserProfileDropdown from '../../../Shared/Components/userProfileDropdown/UserProfileDropdown';
import { logoutUser } from '../../../services/user/authServices';

interface UnreadCounts {
  [key: string]: number;
}

const Header: FC = () => {
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [menuOpen, setMenuOpen] = useState(false);
  // New state for toggling mobile user profile dropdown
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] =
    useState(false);
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

  useEffect(() => {
    if (socket && user?._id) {
      // Initial fetch of counts
      socket.emit('getUnreadCount', { userId: user._id });
      socket.emit('getPendingRequestsCount', { userId: user._id });

      // Listen for unread message updates
      socket.on('unreadCounts', (data: { counts: UnreadCounts }) => {
        if (data.counts) {
          const totalUnread = Object.values(data.counts).reduce(
            (sum, count) => sum + count,
            0
          );
          setUnreadChatsCount(totalUnread || 0);
        } else {
          setUnreadChatsCount(0);
        }
      });

      // Listen for pending requests updates
      socket.on('pendingRequestsCount', (data: { count: number }) => {
        setPendingRequestsCount(data.count || 0);
      });

      // Listen for new messages
      socket.on('message', (message: any) => {
        if (message.receiverId === user._id && message.status === 'unread') {
          socket.emit('getUnreadCount', { userId: user._id });
        }
      });

      // Listen for message read status changes
      socket.on('messageRead', () => {
        socket.emit('getUnreadCount', { userId: user._id });
      });

      return () => {
        socket.off('unreadCounts');
        socket.off('pendingRequestsCount');
        socket.off('message');
        socket.off('messageRead');
      };
    }
  }, [user?._id]);


  const NavItem = ({
    to,
    icon,
    label,
    badgeCount,
    onClick,
  }: {
    to: string;
    icon: JSX.Element;
    label: string;
    badgeCount?: number;
    onClick?: () => void;
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className="relative flex flex-col items-center space-y-1 text-gray-300 transition duration-300 hover:text-white"
    >
      <div className="relative text-lg">
        {icon}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs sm:text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </div>
      <span className="text-xs sm:text-sm">{label}</span>
    </NavLink>
  );

  return (
    <header className="px-4 text-white bg-black shadow-md">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <Link
          to={`/user/home`}
          className="text-2xl font-bold text-white hover:text-gray-300"
        >
          HireSpace
        </Link>

        {/* Desktop Navigation */}
        <nav className="items-center hidden space-x-4 md:flex">
          {isAuthenticated && user ? (
            <>
              <NavItem
                to={`/user/home`}
                icon={<FaHome />}
                label="Home"
              />
              <NavItem
                to={`/user/all-job-applications/${user._id}`}
                icon={<FaInfoCircle />}
                label="My Applications"
              />
              <NavItem
                to={`/user/messages`}
                icon={<FaEnvelope />}
                label="Messages"
                badgeCount={unreadChatsCount}
              />
              <NavItem
                to={`/user/user-connections/${user._id}`}
                icon={<FaSignInAlt />}
                label="Connections"
                badgeCount={pendingRequestsCount}
              />
              <NavItem
                to="/user/view-job-posts"
                icon={<FaBriefcase />}
                label="Jobs"
              />
            </>
          ) : (
            <>
              <NavItem to="/" icon={<FaHome />} label="Home" />
              <NavItem to="/about" icon={<FaInfoCircle />} label="About" />
              <NavItem to="/contact" icon={<FaPhoneAlt />} label="Contact" />
              <NavItem to="/user/login" icon={<FaSignInAlt />} label="Login" />
              <NavItem
                to="/user/signup"
                icon={<FaUserPlus />}
                label="Sign Up"
              />
            </>
          )}
        </nav>

        {/* Desktop User Profile / CTA */}
        <div className="items-center hidden space-x-4 md:flex">
          {isAuthenticated && user ? (
            <UserProfileDropdown user={user} handleLogout={handleLogout} />
          ) : (
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle mobile menu"
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
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="px-6 py-4 space-y-4 text-white bg-gray-800 md:hidden">
          {isAuthenticated && user ? (
            <>
              {/* Mobile Profile Display with Dropdown Toggle */}
              <div className="relative">
                <button
                  onClick={() => setMobileProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <span className="text-sm font-semibold">Profile</span>
                </button>
                {mobileProfileDropdownOpen && (
                  <div className="mt-2">
                    {/* You may want to adjust the positioning/styling for mobile */}
                    <UserProfileDropdown
                      user={user}
                      handleLogout={handleLogout}
                    />
                  </div>
                )}
              </div>

              <NavItem
                to={`/user/home`}
                icon={<FaHome />}
                label="Home"
                onClick={() => {
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
              />
              <NavItem
                to={`/user/all-job-applications/${user._id}`}
                icon={<FaInfoCircle />}
                label="My Applications"
                onClick={() => {
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
              />
              <NavItem
                to={`/user/messages`}
                icon={<FaPhoneAlt />}
                label="Messages"
                badgeCount={unreadChatsCount}
                onClick={() => {
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
              />
              <NavItem
                to={`/user/user-connections/${user._id}`}
                icon={<FaSignInAlt />}
                label="Connections"
                badgeCount={pendingRequestsCount}
                onClick={() => {
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
              />
              <NavItem
                to="/user/view-job-posts"
                icon={<FaBriefcase />}
                label="Job Posts"
                onClick={() => {
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
              />
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                  setMobileProfileDropdownOpen(false);
                }}
                className="flex items-center space-x-2 text-xs text-gray-300 transition duration-300 hover:text-white"
              >
                <FaSignInAlt className="w-5 h-5" />
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
                to="/user/login"
                icon={<FaSignInAlt />}
                label="Login"
                onClick={() => setMenuOpen(false)}
              />
              <NavItem
                to="/user/signup"
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

export default Header;
