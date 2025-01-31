import { FC } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaInfoCircle, FaPhoneAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const UnauthenticatedHeader: FC = () => {
  const NavItem = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
    <NavLink
      to={to}
      className="relative flex flex-col items-center text-gray-300 hover:text-white transition duration-300 space-y-1"
    >
      <div className="text-lg">{icon}</div>
      <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <nav className="flex space-x-6 items-center">
      <NavItem to="/" icon={<FaHome />} label="Home" />
      <NavItem to="/about" icon={<FaInfoCircle />} label="About" />
      <NavItem to="/contact" icon={<FaPhoneAlt />} label="Contact" />
      <NavItem to="/user/login" icon={<FaSignInAlt />} label="Login" />
      <NavItem to="/user/signup" icon={<FaUserPlus />} label="Sign Up" />
    </nav>
  );
};

export default UnauthenticatedHeader;
