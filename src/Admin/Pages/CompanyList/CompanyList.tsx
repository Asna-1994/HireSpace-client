
// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import { toast } from 'react-toastify';
// import AdminHeader from '../../Components/Header/AdminHeader';
// import SideBar from '../../Components/SideBar/SideBar';
// import ReusableTable from '../../ReusableComponents/ReusableTable';
// import { Company } from '../../../Utils/Interfaces/interface';
// import { blockOrUnblock, companyVerification, getAllCompanies } from '../../../services/admin/companyServices';

// Modal.setAppElement('#root');

// const CompanyList = () => {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [verifyModalIsOpen, setVerifyModalIsOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [totalPages, setTotalPages] = useState<number>(0);
//   const [page, setPage] = useState<number>(1);
//   const [limit, setLimit] = useState<number>(10);
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
//     null
//   );
//   const [selectedAction, setSelectedAction] = useState<string>('');
//   const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>('');


//   const fetchCompanies = async (query: string = '') => {
//     try {
//       const data = await getAllCompanies(query, page, limit)
//       const { companies, totalPages, currentPage } = data.data;
//       setCompanies(companies);
//       setTotalPages(totalPages);
//       setPage(currentPage);
//     } catch (err: any) {
//       toast.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, [page, limit]);

//   const handleAction = async () => {
//     if (!selectedCompanyId) return;
//     try {
//       const data = await blockOrUnblock(selectedCompanyId, selectedAction)
//       if (data.success) {
//         toast.success(
//           `Company successfully ${selectedAction === 'block' ? 'blocked' : 'unblocked'}`
//         );
//         fetchCompanies();
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

//   const openVerifyModal = (company: Company) => {
//     setSelectedCompany(company);
//     setVerifyModalIsOpen(true);
//   };

//   const closeVerifyModal = () => {
//     setVerifyModalIsOpen(false);
//     setSelectedCompany(null);
//   };

//   const verifyCompany = async (companyId: string) => {
//     try {
//       const data = await companyVerification(companyId)
//       if (data.success) {
//         toast.success(data.message);
//         fetchCompanies();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err: any) {
//       toast.error(err);
//     }
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchTerm) {
//         fetchCompanies(searchTerm);
//       } else {
//         fetchCompanies();
//       }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   const columns = [
//     { header: 'Company Name', accessor: 'companyName' },
//     { header: 'Email', accessor: 'email' },
//     { header: 'Industry', accessor: 'industry' },
//     {
//       header: 'Verification',
//       accessor: 'isVerified',
//       render: (company: Company) => (
//         <button
//           onClick={() => openVerifyModal(company)}
//           className="flex justify-center w-20 px-4 py-1 text-sm text-white bg-purple-700 border rounded-md hover:bg-purple-400"
//         >
//           {company.isVerified ? 'Verified' : 'Verify'}
//         </button>
//       )
//     },
//     {
//       header: 'Actions',
//       accessor: 'isBlocked',
//       render: (company: Company) => (
//         <button
//           onClick={() => openModal(company._id, company.isBlocked ? 'unblock' : 'block')}
//           className="w-20 px-3 py-1 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-500"
//         >
//           {company.isBlocked ? 'Unblock' : 'Block'}
//         </button>
//       )
//     }
//   ];

//   return (
//     <>
//       <div className="fixed top-0 z-50 w-full">
//         <AdminHeader />
//       </div>
//       <div className="flex flex-col h-auto min-h-screen mt-16 bg-gray-100 lg:flex-row">
//         <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
//           <SideBar />
//         </div>
//         <div className="flex-grow p-4 bg-white rounded-lg shadow-md lg:ml-64 lg:p-6">
//           <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
//             <h2 className="text-xl font-bold sm:text-2xl">Company List</h2>
//             <input
//               type="text"
//               placeholder="Search companies..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="w-full px-4 py-2 mt-2 border rounded-md sm:mt-0 sm:w-auto"
//             />
//           </div>

//           {/* Reusable Table */}
//           <ReusableTable columns={columns} data={companies} />

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

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Block Company Confirmation"
//         className="w-11/12 max-w-sm p-6 mx-auto bg-white rounded shadow-md"
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

//       <Modal
//         isOpen={verifyModalIsOpen}
//         onRequestClose={closeVerifyModal}
//         contentLabel="Company Details"
//         className="w-11/12 max-w-lg p-6 mx-auto bg-white rounded shadow-md"
//         overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
//       >
//         {selectedCompany ? (
//           <div>
//             <h2 className="mb-4 text-xl font-bold text-center">
//               {selectedCompany.companyName}
//             </h2>
//             <p>
//               <strong>Email:</strong> {selectedCompany.email}
//             </p>
//             <p>
//               <strong>Industry:</strong> {selectedCompany.industry}
//             </p>
//             <p>
//               <strong>Address:</strong> {selectedCompany.address}
//             </p>
//             <p>
//               <strong>Phone:</strong> {selectedCompany.phone}
//             </p>
//             {selectedCompany.establishedDate ? (
//               <p>
//                 <strong>Founded:</strong>{' '}
//                 {new Date(selectedCompany.establishedDate).toLocaleDateString()}
//               </p>
//             ) : (
//               <p>
//                 <strong>Founded:</strong> Date not available
//               </p>
//             )}
//             {selectedCompany.verificationDocument ? (
//               <div className="mt-4">
//                 <h3 className="font-semibold">Document:</h3>
//                 {selectedCompany.verificationDocument.url?.endsWith('.pdf') ? (
//                   <iframe
//                     src={selectedCompany.verificationDocument.url}
//                     title="PDF Preview"
//                     className="w-full h-64 border rounded-md"
//                   />
//                 ) : (
//                   <img
//                     src={selectedCompany.verificationDocument.url}
//                     alt="Uploaded Document"
//                     className="object-cover rounded-md w-96"
//                   />
//                 )}
//               </div>
//             ) : (
//               <p className="mt-4">No documents uploaded.</p>
//             )}
//             <div className="flex justify-end mt-6 space-x-4">
//               <button
//                 onClick={closeVerifyModal}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => verifyCompany(selectedCompany._id)}
//                 className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
//               >
//                 {selectedCompany.isVerified ? 'Verified' : 'Verify'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>Loading...</div>
//         )}
//       </Modal>

//     </>
//   );
// };

// export default CompanyList;

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import ReusableTable from '../../ReusableComponents/ReusableTable';
import { Company } from '../../../Utils/Interfaces/interface';
import { blockOrUnblock, companyVerification, getAllCompanies } from '../../../services/admin/companyServices';

Modal.setAppElement('#root');

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [verifyModalIsOpen, setVerifyModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
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

  const fetchCompanies = async (query: string = '') => {
    try {
      const data = await getAllCompanies(query, page, limit)
      const { companies, totalPages, currentPage } = data.data;
      setCompanies(companies);
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, limit]);

  const handleAction = async () => {
    if (!selectedCompanyId) return;
    try {
      const data = await blockOrUnblock(selectedCompanyId, selectedAction)
      if (data.success) {
        toast.success(
          `Company successfully ${selectedAction === 'block' ? 'blocked' : 'unblocked'}`
        );
  
               setCompanies(preCom => 
          preCom.map(company => 
            company._id === selectedCompanyId 
              ? { ...company, isBlocked: selectedAction === 'block' } 
              : company
          )
        );
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

  const openVerifyModal = (company: Company) => {
    setSelectedCompany(company);
    setVerifyModalIsOpen(true);
  };

  const closeVerifyModal = () => {
    setVerifyModalIsOpen(false);
    setSelectedCompany(null);
  };

  const verifyCompany = async (companyId: string) => {
    try {
      const data = await companyVerification(companyId)
      if (data.success) {
        toast.success(data.message);
        fetchCompanies();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchCompanies(searchTerm);
      } else {
        fetchCompanies();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Mobile view renders a card-based layout for each company
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {companies.map((company, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800">{company.companyName}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm"><span className="font-medium">Email:</span> {company.email}</p>
              <p className="text-sm"><span className="font-medium">Industry:</span> {company.industry}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4 sm:flex-row">
              <button
                onClick={() => openVerifyModal(company)}
                className="w-full px-4 py-2 text-sm text-white bg-purple-700 border rounded-md hover:bg-purple-400 sm:w-auto"
              >
                {company.isVerified ? 'Verified' : 'Verify'}
              </button>
              <button
                onClick={() => openModal(company._id, company.isBlocked ? 'unblock' : 'block')}
                className="w-full px-4 py-2 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-500 sm:w-auto"
              >
                {company.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    { header: 'Company Name', accessor: 'companyName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Industry', accessor: 'industry' },
    {
      header: 'Verification',
      accessor: 'isVerified',
      render: (company: Company) => (
        <button
          onClick={() => openVerifyModal(company)}
          className="flex justify-center w-20 px-4 py-1 text-sm text-white bg-purple-700 border rounded-md hover:bg-purple-400"
        >
          {company.isVerified ? 'Verified' : 'Verify'}
        </button>
      )
    },
    {
      header: 'Actions',
      accessor: 'isBlocked',
      render: (company: Company) => (
        <button
          onClick={() => openModal(company._id, company.isBlocked ? 'unblock' : 'block')}
          className="w-20 px-3 py-1 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-500"
        >
          {company.isBlocked ? 'Unblock' : 'Block'}
        </button>
      )
    }
  ];

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <AdminHeader />
      </div>
      <div className="flex flex-col h-auto min-h-screen mt-16 bg-gray-100 lg:flex-row">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow p-4 bg-white rounded-lg shadow-md lg:ml-64 lg:p-6">
          <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
            <h2 className="text-xl font-bold sm:text-2xl">Company List</h2>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 mt-2 border rounded-md sm:mt-0 sm:w-auto"
            />
          </div>

          {/* Conditionally render table or cards based on screen size */}
          <div className="overflow-x-auto">
            {isMobileView ? renderMobileView() : <ReusableTable columns={columns} data={companies} />}
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Block Company Confirmation"
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

      <Modal
        isOpen={verifyModalIsOpen}
        onRequestClose={closeVerifyModal}
        contentLabel="Company Details"
         className="w-11/12 max-w-lg p-6 mx-auto mt-20 bg-white rounded shadow-md max-h-[90vh] overflow-y-auto"
  overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center overflow-hidden"
        // className="w-11/12 max-w-lg p-6 mx-auto overflow-y-auto bg-white rounded shadow-md"
        // overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        {selectedCompany ? (
          <div>
            <h2 className="mb-4 text-xl font-bold text-center">
              {selectedCompany.companyName}
            </h2>
            <p>
              <strong>Email:</strong> {selectedCompany.email}
            </p>
            <p>
              <strong>Industry:</strong> {selectedCompany.industry}
            </p>
            <p>
              <strong>Address:</strong> {selectedCompany.address}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCompany.phone}
            </p>
            {selectedCompany.establishedDate ? (
              <p>
                <strong>Founded:</strong>{' '}
                {new Date(selectedCompany.establishedDate).toLocaleDateString()}
              </p>
            ) : (
              <p>
                <strong>Founded:</strong> Date not available
              </p>
            )}
            {selectedCompany.verificationDocument ? (
              <div className="mt-4">
                <h3 className="font-semibold">Document:</h3>
                {selectedCompany.verificationDocument.url?.endsWith('.pdf') ? (
                  <iframe
                    src={selectedCompany.verificationDocument.url}
                    title="PDF Preview"
                    className="w-full h-64 border rounded-md"
                  />
                ) : (
                  <img
                    src={selectedCompany.verificationDocument.url}
                    alt="Uploaded Document"
                    className="object-cover w-full rounded-md max-w-96"
                  />
                )}
              </div>
            ) : (
              <p className="mt-4">No documents uploaded.</p>
            )}
            <div className="flex flex-col justify-end mt-6 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                onClick={closeVerifyModal}
                className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={() => verifyCompany(selectedCompany._id)}
                className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 sm:w-auto"
              >
                {selectedCompany.isVerified ? 'Verified' : 'Verify'}
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
    </>
  );
};

export default CompanyList;