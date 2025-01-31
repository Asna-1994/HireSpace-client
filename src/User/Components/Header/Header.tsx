
import  { FC, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from '../../../services/socket';
import { RootState } from "../../../redux/store";
import { FaHome, FaInfoCircle, FaPhoneAlt, FaSignInAlt, FaUserPlus, FaUserCircle, FaBriefcase, FaEnvelope } from "react-icons/fa";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { logout } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import UserProfileDropdown from "../../../Shared/Components/userProfileDropdown/UserProfileDropdown";


interface UnreadCounts {
  [key: string]: number;
}

interface UnreadCountsPayload {
  counts: UnreadCounts;
}

interface PendingRequestsPayload {
  count: number;
  userId: string;
}

const Header: FC = () => {
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // useEffect(() => {
  //   if (socket) {
  //     socket.emit('getUnreadCount', { userId: user?._id }); 
  
  //     socket.on('unreadCounts', ({ totalUnreadChats }) => {
  //       setUnreadChatsCount(totalUnreadChats); 
  //     });
  
  //     return () => {
  //       socket.off('unreadCounts');
  //     };
  //   }
  // }, [user?._id]);

  useEffect(() => {
    if (socket && user?._id) {
      // Initial fetch of counts
      socket.emit('getUnreadCount', { userId: user._id });
      socket.emit('getPendingRequestsCount', { userId: user._id });
  
      // Listen for unread message updates
      socket.on('unreadCounts', (data: { counts: UnreadCounts }) => {
        if (data.counts) {
          const totalUnread = Object.values(data.counts).reduce((sum, count) => sum + count, 0);
          setUnreadChatsCount(totalUnread || 0); // Ensure we set 0 if no unread messages
        } else {
          setUnreadChatsCount(0);
        }
      });
  
      // Listen for pending requests updates
      socket.on('pendingRequestsCount', (data: { count: number }) => {
        setPendingRequestsCount(data.count || 0); // Ensure we set 0 if no pending requests
      });
  
      // Listen for new messages
      socket.on('message', (message: any) => {
        if (message.receiverId === user._id && message.status === 'unread') {
          // Immediately request updated count when receiving a new message
          socket.emit('getUnreadCount', { userId: user._id });
        }
      });
  
      // Listen for message read status changes
      socket.on('messageRead', () => {
        // Update counts when a message is read
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


  const NavItem = ({ to, icon, label,  badgeCount, onClick }: { to: string; icon: JSX.Element; label: string;  badgeCount?: number; onClick?: () => void }) => (
  //   <NavLink
  //   to={to}
  //   onClick={onClick}
  //   className="relative flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
  // >
  //   <div className="text-lg relative">
  //     {icon}
  //     {unreadChatsCount > 0 && <span className="badge">{unreadChatsCount}</span>}
  //   </div>
  //   <span className="text-sm">{label}</span>
  // </NavLink>
  <NavLink
    to={to}
    onClick={onClick}
    className="relative flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
  >
    <div className="text-lg relative">
      {icon}
      {badgeCount !== undefined && badgeCount > 0 && ( // Changed this condition
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </div>
    <span className="text-sm">{label}</span>
  </NavLink>
  );
  

  return (
    <header className="bg-black text-white shadow-md px-4">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to={`/user/home/${user?._id}`} className="text-2xl font-bold text-white hover:text-gray-300">
          HireSpace
        </Link>
        <nav className="hidden md:flex space-x-3 items-center">
          {isAuthenticated && user ? (
            <>
              <NavItem to={`/user/home/${user._id}`} icon={<FaHome />} label="Home" />
              <NavItem to={`/user/all-job-applications/${user._id}`} icon={<FaInfoCircle />} label="My Applications" />
              <NavItem to={`/user/messages/${user._id}`} icon={<FaEnvelope/>} label="Messages"     badgeCount={unreadChatsCount} />
              <NavItem to={`/user/user-connections/${user._id}`} icon={<FaSignInAlt />} label="Connections"  badgeCount={pendingRequestsCount}/>
              <NavItem to="/user/view-job-posts" icon={<FaBriefcase />} label="Jobs" />
            </>
          ) : (
            <>
              <NavItem to="/" icon={<FaHome />} label="Home" />
              <NavItem to="/about" icon={<FaInfoCircle />} label="About" />
              <NavItem to="/contact" icon={<FaPhoneAlt />} label="Contact" />
              <NavItem to="/user/login" icon={<FaSignInAlt />} label="Login" />
              <NavItem to="/user/signup" icon={<FaUserPlus />} label="Sign Up" />
            </>
          )}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
       <UserProfileDropdown user={user} handleLogout={handleLogout}/>
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
         
             <NavItem  to="/profile"  icon={user?.profilePhoto ? <img src={user.profilePhoto.url} alt="Profile" /> : <FaUserCircle />}  label={user?.userName || "Profile"} 
/>
              <NavItem to={`/user/home/${user?._id}`} icon={<FaHome />} label="Home" onClick={() => setMenuOpen(false)} />
              <NavItem to={`/user/all-job-applications/${user?._id}`} icon={<FaInfoCircle />} label="My Applications" onClick={() => setMenuOpen(false)} />
              <NavItem to={`/user/messages/${user?._id}`} icon={<FaPhoneAlt />} label="Messages"     badgeCount={unreadChatsCount} onClick={() => setMenuOpen(false)} />
              <NavItem to={`/user/user-connections/${user?._id}`} icon={<FaSignInAlt />} label="Connections" />
              <NavItem to="/user/view-job-posts" icon={<FaUserPlus />} label="Job Posts" />
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
              <NavItem to="/user/login" icon={<FaSignInAlt />} label="Login" />
              <NavItem to="/user/signup" icon={<FaUserPlus />} label="Sign Up" />
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;

