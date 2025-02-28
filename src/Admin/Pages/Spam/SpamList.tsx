
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
          className="text-white text-sm w-20 hover:underline border bg-blue-700 px-3 py-1 rounded-md"
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
        className="bg-white p-6 rounded shadow-md max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p>
          Are you sure you want to{' '}
          {selectedAction === 'block' ? 'block' : 'unblock'} this company?
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
      <div className="fixed top-0 w-full z-50 ">
        <AdminHeader />
      </div>
      <div className="flex pt-16 h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow ml-64 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Spam Reports</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          {/* Reusable Table */}
          <ReusableTable columns={columns} data={spams} />
          {/* Pagination */}
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

export default SpamList;
