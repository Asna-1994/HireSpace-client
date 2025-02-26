import { NavLink } from "react-router-dom";

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

  export default NavItem