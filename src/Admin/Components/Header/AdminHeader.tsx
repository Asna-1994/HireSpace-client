// import { FC, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { logout } from '../../../redux/slices/authSlice';
// import { toast } from 'react-toastify';
// import { FaHome, FaUser, FaUserCircle } from 'react-icons/fa';
// import { HiMenuAlt3, HiX } from 'react-icons/hi';
// import { logoutUser } from '../../../services/user/authServices';
// import NavItem from '../../ReusableComponents/Navitem';

// const AdminHeader: FC = () => {
//   const { user, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const data = await logoutUser();
//       dispatch(logout());
//       navigate('/');
//       toast.success(data.message);
//     } catch (err: any) {
//       toast.error(err);
//     }
//   };

//   return (
//     <header className="flex items-center w-full px-6 shadow bg-gradient-to-r from-indigo-600 to-purple-600">
//       <div className="container flex items-center justify-between px-6 py-4 mx-auto">
//         <Link
//           to={`/user-home/${user?._id}`}
//           className="text-2xl font-bold text-white hover:text-gray-200"
//         >
//           HireSpace
//         </Link>

//         {isAuthenticated && (
//           <nav className="items-center hidden space-x-6 md:flex">
//             <NavLink
//               to={`/admin/home/${user?._id}`}
//               className="text-white transition duration-300 hover:text-gray-200"
//             >
//               Home
//             </NavLink>
//             <div className="relative">
//               <button
//                 className="flex items-center space-x-2 focus:outline-none"
//                 onClick={() => setProfileMenuOpen(!profileMenuOpen)}
//               >
//                 {user?.profilePhoto?.url ? (
//                   <img
//                     src={user?.profilePhoto?.url}
//                     className="w-10 h-10 rounded-full"
//                   ></img>
//                 ) : (
//                   <FaUserCircle className="w-8 h-8 text-white" />
//                 )}

//                 <span className="text-white">{user?.userName || 'Admin'}</span>
//               </button>
//               {profileMenuOpen && (
//                 <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg">
//                   <Link
//                     to={`/admin/edit-profile/${user?._id}`}
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     onClick={() => setProfileMenuOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </nav>
//         )}

//         <button
//           className="md:hidden focus:outline-none"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? (
//             <HiX className="w-8 h-8 text-white" />
//           ) : (
//             <HiMenuAlt3 className="w-8 h-8 text-white" />
//           )}
//         </button>
//       </div>

//       {menuOpen && (
//         <nav className="px-6 py-4 space-y-4 bg-indigo-600 md:hidden">
//           <NavItem
//             to={`/admin/home/${user?._id}`}
//             icon={<FaHome />}
//             label="Home"
//             onClick={() => setMenuOpen(false)}
//           />
//           <NavItem
//             to={`/admin/edit-profile/${user?._id}`}
//             icon={<FaUser />}
//             label="Profile"
//             onClick={() => setMenuOpen(false)}
//           />

//           <button
//             className="block w-full text-left text-white hover:text-gray-200"
//             onClick={() => {
//               setMenuOpen(false);
//               handleLogout();
//             }}
//           >
//             Logout
//           </button>
//         </nav>
//       )}
//     </header>
//   );
// };

// export default AdminHeader;
import { FC, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { logout } from '../../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaHome, FaUser, FaUserCircle } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { logoutUser } from '../../../services/user/authServices';
import NavItem from '../../ReusableComponents/Navitem';

const AdminHeader: FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const data = await logoutUser();
      dispatch(logout());
      navigate('/');
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="z-50 w-full shadow bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link
          to={`/user-home/${user?._id}`}
          className="text-xl font-bold text-white transition md:text-2xl hover:text-gray-200"
        >
          HireSpace
        </Link>

        {isAuthenticated && (
          <nav className="items-center hidden space-x-6 md:flex">
            <NavLink
              to={`/admin/home/${user?._id}`}
              className={({ isActive }) => 
                `text-white hover:text-gray-200 transition duration-300 ${
                  isActive ? 'font-semibold border-b-2 border-white pb-1' : ''
                }`
              }
            >
              Home
            </NavLink>
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {user?.profilePhoto?.url ? (
                  <img
                    src={user.profilePhoto.url}
                    alt="Profile"
                    className="object-cover w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-white w-7 h-7" />
                )}
                <span className="text-white">{user?.userName || 'Admin'}</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                  <Link
                    to={`/admin/edit-profile/${user?._id}`}
                    className="block px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100"
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
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <HiX className="text-white w-7 h-7" />
          ) : (
            <HiMenuAlt3 className="text-white w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={menuRef} className="z-50 bg-indigo-600 md:hidden">
          <nav className="px-4 py-3 space-y-3 border-t border-indigo-500">
            <NavItem
              to={`/admin/home/${user?._id}`}
              icon={<FaHome size={16} />}
              label="Home"
              onClick={() => setMenuOpen(false)}
            />
            <NavItem
              to={`/admin/edit-profile/${user?._id}`}
              icon={<FaUser size={16} />}
              label="Profile"
              onClick={() => setMenuOpen(false)}
            />
            <button
              className="flex items-center w-full py-2 text-white transition hover:text-gray-200"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              <span className="mr-3">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;