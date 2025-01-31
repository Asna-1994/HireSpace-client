import { FC } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignInAlt, FaBriefcase, FaEnvelope } from "react-icons/fa";
import UserProfileDropdown from "../../../Shared/Components/userProfileDropdown/UserProfileDropdown";

interface AuthenticatedHeaderProps {
  user: any; // Replace with actual user type
  unreadChatsCount: number;
  handleLogout: () => void;
}

const AuthenticatedHeader: FC<AuthenticatedHeaderProps> = ({ user, unreadChatsCount, handleLogout }) => {
  const NavItem = ({ to, icon, label, badgeCount }: { to: string; icon: JSX.Element; label: string; badgeCount?: number }) => (
    <NavLink
      to={to}
      className="relative flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
    >
      <div className="text-lg relative">
        {icon}
        {/* {badgeCount > 0 && <span className="badge">{badgeCount}</span>} */}
      </div>
      <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <nav className="flex space-x-6 items-center">
      <NavItem to={`/user/home/${user._id}`} icon={<FaHome />} label="Home" />
      <NavItem to={`/user/all-job-applications/${user._id}`} icon={<FaInfoCircle />} label="My Applications" />
      <NavItem to={`/user/messages/${user._id}`} icon={<FaEnvelope />} label="Messages" badgeCount={unreadChatsCount} />
      <NavItem to="/user/view-job-posts" icon={<FaBriefcase />} label="Jobs" />
      <UserProfileDropdown user={user} handleLogout={handleLogout} />
    </nav>
  );
};

export default AuthenticatedHeader;
