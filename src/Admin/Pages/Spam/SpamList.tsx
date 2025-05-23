
// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import { toast } from 'react-toastify';
// import AdminHeader from '../../Components/Header/AdminHeader';
// import SideBar from '../../Components/SideBar/SideBar';
// import ReusableTable from '../../ReusableComponents/ReusableTable';
// import { blockOrUnblock } from '../../../services/admin/companyServices';
// import { getAllSpam } from '../../../services/admin/userService';

// Modal.setAppElement('#root');

// export interface Spam {
//   reportedByUser: {
//     userName: string;
//     email: string;
//     phone: string;
//   };
//   companyId: {
//     companyName: string;
//     email: string;
//     isBlocked: boolean;
//     _id: string;
//     phone: string;
//   };
//   _id: string;
//   createdAt: Date;
//   reason: string;
//   description: string;
// }

// const SpamList: React.FC = () => {
//   const [spams, setSpams] = useState<Spam[]>([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [totalPages, setTotalPages] = useState<number>(0);
//   const [page, setPage] = useState<number>(1);
//   const [limit] = useState<number>(8);
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
//   const [selectedAction, setSelectedAction] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   const fetchSpams = async (query = '') => {
//     try {
//       const data = await getAllSpam(query, page, limit);
//       const { rawSpams, totalPages, currentPage } = data.data;
//       const spams = rawSpams.map((spam: any) => spam._doc);
//       setSpams(spams);
//       setTotalPages(totalPages);
//       setPage(currentPage);
//     } catch (err: any) {
//       toast.error('Failed to fetch spam reports.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSpams();
//   }, [page, limit]);

//   const handleAction = async () => {
//     if (!selectedCompanyId) return;

//     try {
//       const data = await blockOrUnblock(selectedCompanyId, selectedAction);
//       if (data.success) {
//         toast.success(
//           `Successfully ${selectedAction === 'block' ? 'blocked' : 'unblocked'}`
//         );
//         fetchSpams();
//       }
//     } catch (error: any) {
//       toast.error(error);
//     } finally {
//       setModalIsOpen(false);
//       setSelectedCompanyId(null);
//       setSelectedAction('');
//     }
//   };

//   const openModal = (companyId: string, action: string) => {
//     setSelectedCompanyId(companyId);
//     setSelectedAction(action);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setSelectedCompanyId(null);
//     setSelectedAction('');
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchTerm) {
//         fetchSpams(searchTerm);
//       } else {
//         fetchSpams();
//       }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   // Define columns for ReusableTable
//   const columns = [
//     {
//       header: 'Reported By',
//       accessor: '',
//       render: (item: Spam) => (
//         <div className="flex flex-col">
//           <span>{item.reportedByUser.userName}</span>
//           <span>{item.reportedByUser.email}</span>
//           <span>{item.reportedByUser.phone}</span>
//         </div>
//       ),
//     },
//     {
//       header: 'Company Details',
//       accessor: '',
//       render: (item: Spam) => (
//         <div className="flex flex-col">
//           <span>{item.companyId.companyName}</span>
//           <span>{item.companyId.email}</span>
//           <span>{item.companyId.phone}</span>
//         </div>
//       ),
//     },
//     { header: 'Reason', accessor: 'reason' },
//     { header: 'Description', accessor: 'description' },
//     {
//       header: 'Date of Report',
//       accessor: '',
//       render: (item: Spam) =>
//         item.createdAt
//           ? new Date(item.createdAt).toLocaleDateString()
//           : 'N/A',
//     },
//     {
//       header: 'Actions',
//       accessor: '',
//       render: (item: Spam) => (
//         <button
//           onClick={() =>
//             openModal(
//               item.companyId._id,
//               item.companyId.isBlocked ? 'unblock' : 'block'
//             )
//           }
//           className="w-20 px-3 py-1 text-sm text-white bg-blue-700 border rounded-md hover:underline"
//         >
//           {item.companyId.isBlocked ? 'Unblock' : 'Block'}
//         </button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Block User Confirmation"
//         className="max-w-sm p-6 mx-auto bg-white rounded shadow-md"
//         overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
//       >
//         <h2 className="mb-4 text-lg font-bold">Confirm Action</h2>
//         <p>
//           Are you sure you want to{' '}
//           {selectedAction === 'block' ? 'block' : 'unblock'} this company?
//         </p>
//         <div className="flex justify-end mt-4 space-x-4">
//           <button
//             onClick={closeModal}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAction}
//             className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
//           >
//             {selectedAction === 'block' ? 'Block' : 'Unblock'}
//           </button>
//         </div>
//       </Modal>
//       <div className="fixed top-0 z-50 w-full ">
//         <AdminHeader />
//       </div>
//       <div className="flex h-screen pt-16 bg-gray-100">
//         {/* Sidebar */}
//         <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
//           <SideBar />
//         </div>
//         <div className="flex-grow p-6 ml-64 bg-white rounded-lg shadow-md">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold">Spam Reports</h2>
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="px-4 py-2 border rounded-md"
//             />
//           </div>
//           {/* Reusable Table */}
//           <ReusableTable columns={columns} data={spams} />
//           {/* Pagination */}
//           <div className="flex items-center justify-between mt-4">
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SpamList;

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import ReusableTable from '../../ReusableComponents/ReusableTable';
import { blockOrUnblock } from '../../../services/admin/companyServices';
import { getAllSpam } from '../../../services/admin/userService';

Modal.setAppElement('#root');

export interface Spam {
  reportedByUser: {
    userName: string;
    email: string;
    phone: string;
  };
  companyId: {
    companyName: string;
    email: string;
    isBlocked: boolean;
    _id: string;
    phone: string;
  };
  _id: string;
  createdAt: Date;
  reason: string;
  description: string;
}

const SpamList: React.FC = () => {
  const [spams, setSpams] = useState<Spam[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(8);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSpams = async (query = '') => {
    try {
      const data = await getAllSpam(query, page, limit);
      const { rawSpams, totalPages, currentPage } = data.data;
      const spams = rawSpams.map((spam: any) => spam._doc);
      setSpams(spams);
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (err: any) {
      toast.error('Failed to fetch spam reports.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpams();
  }, [page, limit]);

  const handleAction = async () => {
    if (!selectedCompanyId) return;

    try {
      const data = await blockOrUnblock(selectedCompanyId, selectedAction);
      if (data.success) {
        toast.success(
          `Successfully ${selectedAction === 'block' ? 'blocked' : 'unblocked'}`
        );
        fetchSpams();
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setModalIsOpen(false);
      setSelectedCompanyId(null);
      setSelectedAction('');
    }
  };

  const openModal = (companyId: string, action: string) => {
    setSelectedCompanyId(companyId);
    setSelectedAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCompanyId(null);
    setSelectedAction('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSpams(searchTerm);
      } else {
        fetchSpams();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Mobile view renders card-based layout for each spam report
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {spams.map((spam, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-800">Reported By</h3>
              <p className="text-sm">{spam.reportedByUser.userName}</p>
              <p className="text-sm">{spam.reportedByUser.email}</p>
              <p className="text-sm">{spam.reportedByUser.phone}</p>
            </div>
            
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-800">Company Details</h3>
              <p className="text-sm">{spam.companyId.companyName}</p>
              <p className="text-sm">{spam.companyId.email}</p>
              <p className="text-sm">{spam.companyId.phone}</p>
            </div>
            
            <div className="mb-3">
              <h3 className="font-bold text-gray-800 text-md">Reason</h3>
              <p className="text-sm">{spam.reason}</p>
            </div>
            
            <div className="mb-3">
              <h3 className="font-bold text-gray-800 text-md">Description</h3>
              <p className="text-sm">{spam.description}</p>
            </div>
            
            <div className="mb-3">
              <h3 className="font-bold text-gray-800 text-md">Date of Report</h3>
              <p className="text-sm">
                {spam.createdAt ? new Date(spam.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            
            <div className="flex justify-center mt-3">
              <button
                onClick={() => openModal(
                  spam.companyId._id,
                  spam.companyId.isBlocked ? 'unblock' : 'block'
                )}
                className="px-4 py-2 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-500"
              >
                {spam.companyId.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Define columns for ReusableTable
  const columns = [
    {
      header: 'Reported By',
      accessor: '',
      render: (item: Spam) => (
        <div className="flex flex-col">
          <span>{item.reportedByUser.userName}</span>
          <span>{item.reportedByUser.email}</span>
          <span>{item.reportedByUser.phone}</span>
        </div>
      ),
    },
    {
      header: 'Company Details',
      accessor: '',
      render: (item: Spam) => (
        <div className="flex flex-col">
          <span>{item.companyId.companyName}</span>
          <span>{item.companyId.email}</span>
          <span>{item.companyId.phone}</span>
        </div>
      ),
    },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Date of Report',
      accessor: '',
      render: (item: Spam) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : 'N/A',
    },
    {
      header: 'Actions',
      accessor: '',
      render: (item: Spam) => (
        <button
          onClick={() =>
            openModal(
              item.companyId._id,
              item.companyId.isBlocked ? 'unblock' : 'block'
            )
          }
          className="w-20 px-3 py-1 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-500"
        >
          {item.companyId.isBlocked ? 'Unblock' : 'Block'}
        </button>
      ),
    },
  ];

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Block User Confirmation"
        className="w-11/12 max-w-sm p-6 mx-auto bg-white rounded shadow-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="mb-4 text-lg font-bold">Confirm Action</h2>
        <p>
          Are you sure you want to{' '}
          {selectedAction === 'block' ? 'block' : 'unblock'} this company?
        </p>
        <div className="flex justify-end mt-4 space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            {selectedAction === 'block' ? 'Block' : 'Unblock'}
          </button>
        </div>
      </Modal>
      <div className="fixed top-0 z-50 w-full ">
        <AdminHeader />
      </div>
      <div className="flex flex-col h-auto min-h-screen mt-16 bg-gray-100 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow p-4 bg-white rounded-lg shadow-md lg:ml-64 lg:p-6">
          <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
            <h2 className="text-xl font-bold sm:text-2xl">Spam Reports</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 mt-2 border rounded-md sm:mt-0 sm:w-auto"
            />
          </div>
          
          {/* Conditionally render table or cards based on screen size */}
          <div className="overflow-x-auto">
            {loading ? (
             <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              isMobileView ? renderMobileView() : <ReusableTable columns={columns} data={spams} />
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-2 py-1 text-sm text-white bg-blue-600 rounded sm:px-4 sm:py-2 hover:bg-blue-700 disabled:opacity-50 sm:text-base"
            >
              Previous
            </button>
            <span className="text-sm sm:text-base">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-2 py-1 text-sm text-white bg-blue-600 rounded sm:px-4 sm:py-2 hover:bg-blue-700 disabled:opacity-50 sm:text-base"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpamList;
