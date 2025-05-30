


import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import ReusableTable from '../../ReusableComponents/ReusableTable';
import { User } from '../../../Utils/Interfaces/interface';
import { blockOrUnblockUser, getPremiumUsers } from '../../../services/admin/userService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function convertToDateString (date : Date){
         let dateString = '';
    
   
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
      return dateString
    
}


Modal.setAppElement('#root');

const PremiumUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // New filter states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = async (query = '', filterStartDate = '', filterEndDate = '', ) => {
    try {
      const data = await getPremiumUsers(query, page, limit, filterStartDate, filterEndDate);
      const { users, totalPages, currentPage } = data.data;
      console.log(users);
      setUsers(users);
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (err: any) {
      toast.error('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleAction = async () => {
    if (!selectedUserId) return;

    try {
      const response = await blockOrUnblockUser(selectedUserId, selectedAction);
      if (response.status === 200) {
        toast.success(
          `User successfully ${selectedAction === 'block' ? 'blocked' : 'unblocked'}`
        );
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === selectedUserId 
              ? { ...user, isBlocked: selectedAction === 'block' } 
              : user
          )
        );
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setModalIsOpen(false);
      setSelectedUserId(null);
      setSelectedAction('');
    }
  };

  const openModal = (userId: string, action: string) => {
    setSelectedUserId(userId);
    setSelectedAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserId(null);
    setSelectedAction('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  // Debounced search effect
  useEffect(() => {
    let startDateStr = ''
    let endDateStr = ''
    const delayDebounceFn = setTimeout(() => {
      if(startDate){
      startDateStr = convertToDateString(startDate)
      }
      if(endDate){
       endDateStr = convertToDateString(endDate)
      }
      fetchUsers(searchTerm, startDateStr, endDateStr);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm,startDate, endDate]);



  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800">{user.userName}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
              <p className="text-sm"><span className="font-medium">Role:</span> {user.userRole}</p>
              <p className="text-sm"><span className="font-medium">Plan:</span> {user.appPlan?.planType || 'N/A'}</p>
              <p className="text-sm"><span className="font-medium">Start Date:</span> {user.appPlan?.startDate ? new Date(user.appPlan.startDate).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm"><span className="font-medium">End Date:</span> {user.appPlan?.endDate ? new Date(user.appPlan.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => openModal(user._id, user.isBlocked ? 'unblock' : 'block')}
                className="w-full px-4 py-2 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-600"
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    { header: 'Name', accessor: 'userName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'userRole' },
    { header: 'Plan', accessor: '', render: (item: any) => item.appPlan?.planType || 'N/A' },
    { header: 'Start Date', accessor: '', render: (item: any) => item.appPlan?.startDate ? new Date(item.appPlan.startDate).toLocaleDateString() : 'N/A' },
    { header: 'End Date', accessor: '', render: (item: any) => item.appPlan?.endDate ? new Date(item.appPlan.endDate).toLocaleDateString() : 'N/A' },
    {
      header: 'Actions',
      accessor: 'isBlocked',
      render: (item: User) => (
        <button
          onClick={() => openModal(item._id, item.isBlocked ? 'unblock' : 'block')}
          className="w-20 px-3 py-1 text-sm text-white bg-blue-700 border rounded-md hover:bg-blue-600"
        >
          {item.isBlocked ? 'Unblock' : 'Block'}
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="fixed top-0 z-50 w-full">
          <AdminHeader />
        </div>

        {/* Content area with sidebar */}
        <div className="flex flex-col pt-16 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
            <SideBar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 transition-all duration-300 lg:ml-64">
            <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
              {/* Header with search and filter toggle */}
              <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
                <h2 className="text-xl font-bold sm:text-2xl">Premium Users List</h2>
                <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:mt-0">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-md"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700"
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <div className="p-4 mb-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 text-lg font-medium">Filters</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            
                                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      placeholderText="Select start date"
                      className="w-full px-4 py-2 border rounded-md"
                      dateFormat="yyyy-MM-dd"
                      isClearable
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                    />

          
                                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      placeholderText="Select end date"
                      className="w-full px-4 py-2 border rounded-md"
                      dateFormat="yyyy-MM-dd"
                      isClearable
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                    />

     
                  </div>

                  {/* Active Filters Display */}
                  {(startDate || endDate ) && (
                    <div className="mt-3">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Active Filters:</h4>
                      <div className="flex flex-wrap gap-2">
                        {startDate && (
                          <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                            Start: {new Date(startDate).toLocaleDateString()}
                          </span>
                        )}
                        {endDate && (
                          <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                            End: {new Date(endDate).toLocaleDateString()}
                          </span>
                        )}
          
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Loading indicator */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Conditionally render table or cards based on screen size */}
                  <div className="overflow-x-auto">
                    {isMobileView ? renderMobileView() : <ReusableTable columns={columns} data={users} />}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col items-center justify-between gap-4 mt-6 sm:flex-row">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="w-full px-4 py-2 text-white bg-blue-600 rounded sm:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages || totalPages === 0}
                      className="w-full px-4 py-2 text-white bg-blue-600 rounded sm:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Block user Confirmation"
          className="w-11/12 max-w-sm p-6 mx-auto bg-white rounded shadow-md"
          overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="mb-4 text-lg font-bold">Confirm Action</h2>
          <p>
            Are you sure you want to{' '}
            {selectedAction === 'block' ? 'block' : 'unblock'} this user?
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
      </div>
    </>
  );
};

export default PremiumUserList;

