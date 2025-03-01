
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import ReusableTable from '../../ReusableComponents/ReusableTable';
import { User } from '../../../Utils/Interfaces/interface';
import { blockOrUnblockUser, getPremiumUsers } from '../../../services/admin/userService';

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

  const fetchUsers = async (query = '') => {
    try {
      const data = await getPremiumUsers(query, page, limit);
      const { users, totalPages, currentPage } = data.data;
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
        fetchUsers();
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
//close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserId(null);
    setSelectedAction('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const columns = [
  
    { header: 'Name', accessor: 'userName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'userRole' },
    { header: 'Plan', accessor: 'appPlan.planType' },
    { header: 'Start Date', accessor: '', render: (item: any) => item.appPlan?.startDate ? new Date(item.appPlan.startDate).toLocaleDateString() : 'N/A' },
    { header: 'End Date', accessor: '', render: (item: any) => item.appPlan?.endDate ? new Date(item.appPlan.endDate).toLocaleDateString() : 'N/A' },
    {
      header: 'Actions',
      accessor: '',
      render: (item: any) => (
        <button
          onClick={() => openModal(item._id, item.isBlocked ? 'unblock' : 'block')}
          className="text-white text-sm w-20 hover:underline border bg-blue-700 px-3 py-1 rounded-md"
        >
          {item.isBlocked ? 'Unblock' : 'Block'}
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
        className="bg-white p-6 rounded shadow-md max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p>
          Are you sure you want to {selectedAction === 'block' ? 'block' : 'unblock'} this user?
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {selectedAction === 'block' ? 'Block' : 'Unblock'}
          </button>
        </div>
      </Modal>
      <div className="fixed top-0 w-full z-50">
        <AdminHeader />
      </div>
      <div className="flex flex-col lg:flex-row h-auto bg-gray-100 min-h-screen mt-16">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow mt-16 md:mt-0 md:ml-64 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-2 md:mb-0">Premium Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md w-full md:w-auto"
            />
          </div>
          <ReusableTable columns={columns} data={users} />
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumUserList;
