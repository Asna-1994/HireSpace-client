// import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   FaUsers,
//   FaBuilding,
//   FaUserAlt,
//   FaExclamationCircle,
//   FaClipboard,
// } from 'react-icons/fa';
// import { HiOutlineHome, HiOutlineMenu } from 'react-icons/hi';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';

// const SideBar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user } = useSelector((state: RootState) => state.auth);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside
//         className={`bg-blue-800 text-white flex flex-col transform ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-transform duration-300 ease-in-out md:translate-x-0 w-64 z-50`}
//       >
//         <div className="p-4 text-2xl font-bold text-center border-b border-blue-700">
//           Admin Panel
//         </div>
//         <nav className="flex-grow">
//           <ul className="p-4 space-y-2">
//             {/* Links */}
//             <li>
//               <NavLink
//                 to={`/admin/home/${user?._id}`}
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <HiOutlineHome className="mr-3" />
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/admin/all-users"
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaUsers className="mr-3" />
//                 Users
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/admin/all-companies"
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaBuilding className="mr-3" />
//                 Companies
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/admin/all-premium-users"
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaUserAlt className="mr-3" />
//                 Premium Users
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/admin/spam-reports"
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaExclamationCircle className="mr-3" />
//                 Spam Reports
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to={`/admin/manage-plans/${user?._id}`}
//                 className="flex items-center px-4 py-2 transition rounded hover:bg-blue-700"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaClipboard className="mr-3" />
//                 Manage Plans
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}

//       {/* Toggle Button */}
//       <button
//         className="fixed z-50 p-2 text-white bg-blue-800 rounded top-4 left-4 md:hidden"
//         onClick={toggleSidebar}
//       >
//         <HiOutlineMenu size={24} />
//       </button>
//     </div>
//   );
// };

// export default SideBar;

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUsers,
  FaBuilding,
  FaUserAlt,
  FaExclamationCircle,
  FaClipboard,
} from 'react-icons/fa';
import { HiOutlineHome, HiOutlineMenu, HiX } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Close sidebar on screen resize to prevent it staying open on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed z-50 p-2 text-white bg-blue-800 rounded top-20 left-4 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white h-full fixed left-0 top-16 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-40 overflow-y-auto`}
      >
        <div className="p-4 text-xl font-bold text-center border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex-grow">
          <ul className="p-4 space-y-2">
            <li>
              <NavLink
                to={`/admin/home/${user?._id}`}
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <HiOutlineHome className="mr-3" size={18} />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-users"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <FaUsers className="mr-3" size={18} />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-companies"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <FaBuilding className="mr-3" size={18} />
                Companies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/all-premium-users"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <FaUserAlt className="mr-3" size={18} />
                Premium Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/spam-reports"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <FaExclamationCircle className="mr-3" size={18} />
                Spam Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/manage-plans/${user?._id}`}
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded transition ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <FaClipboard className="mr-3" size={18} />
                Manage Plans
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default SideBar;