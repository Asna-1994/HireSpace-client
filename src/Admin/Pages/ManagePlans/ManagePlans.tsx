
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import { Plans } from '../../../Utils/Interfaces/interface';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReusableTable from '../../ReusableComponents/ReusableTable';

Modal.setAppElement('#root');

const ManagePlans = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanData, setSelectedPlanData] = useState<Plans | null>(null);
  const [formData, setFormData] = useState({
    planType: '',
    price: 0,
    durationInDays: 0,
    features: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [plans, setPlans] = useState<Plans[] | []>([]);

  const fetchPlans = async (searchTerm?: string) => {
    try {
      const response = await axiosInstance.get('/plans/all-plans', {
        params: { page, limit, search: searchTerm },
      });
      setPlans(response.data.data.plans);
      setTotalPages(response.data.data.totalPages);
    } catch (error: any) {
      toast.error('Failed to fetch plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, limit, searchTerm]);

  const openModal = (planId: string | null = null) => {
    if (planId) {
      const plan = plans?.find((plan) => plan._id === planId);
      if (plan) {
        setSelectedPlanId(planId);
        setSelectedPlanData(plan);
        setFormData({
          planType: plan.planType,
          price: plan.price,
          durationInDays: plan.durationInDays,
          features: plan.features || [],
        });
      }
    } else {
      setSelectedPlanId(null);
      setFormData({ planType: '', price: 0, durationInDays: 0, features: [] });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setConfirmationModalIsOpen(false);
    setSelectedPlanId(null);
    setSelectedPlanData(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchPlans(searchTerm);
      } else {
        fetchPlans();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/plans/create', formData, {
        params: { planId: selectedPlanId },
      });
      if (response.data.success) {
        toast.success(
          selectedPlanId ? 'Plan Updated successfully!' : 'Plan Created'
        );
        fetchPlans();
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/plans/delete/${selectedPlanId}`
      );
      if (response.data.success) {
        toast.success('Plan deleted successfully.');
        fetchPlans();
      }
      closeModal();
    } catch (error: any) {
      toast.error('Failed to delete plan. Please try again.');
    }
  };

  const columns = [
    { header: 'Plan Type', accessor: 'planType' },
    { header: 'Amount(₹)', accessor: 'price' },
    { header: 'Duration in Days', accessor: 'durationInDays' },
    { header: 'Features', accessor: 'features' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (item: Plans) => (
        <div className="flex">
          <button
            onClick={() => openModal(item._id)}
            className="text-white text-sm w-6 flex justify-center ml-2 hover:bg-green-500 border bg-green-700 py-1 rounded-md"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setSelectedPlanId(item._id!);
              setConfirmationModalIsOpen(true);
            }}
            className="text-white text-sm flex justify-center w-6 ml-2 hover:bg-red-500 border bg-red-700 py-1 rounded-md"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        isOpen={confirmationModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Plan Confirmation"
        className="bg-white p-6 rounded shadow-md w-11/12 max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this plan?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create/Edit Plan"
        className="bg-white p-6 rounded shadow-md w-11/12 max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">
          {selectedPlanId ? 'Edit Plan' : 'Create New Plan'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Plan Type
            </label>
            <input
              type="text"
              name="planType"
              value={formData.planType}
              onChange={handleFormChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Duration (in Days)
            </label>
            <input
              type="number"
              name="durationInDays"
              value={formData.durationInDays}
              onChange={handleFormChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Features
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleFormChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <div className="fixed top-0 w-full z-50 ">
        <AdminHeader />
      </div>
      <div className="flex flex-col lg:flex-row h-auto bg-gray-100 min-h-screen mt-16">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow lg:ml-64 p-4 lg:p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Manage Plans</h2>
            <input
              type="text"
              placeholder="Search Plans..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mt-2 sm:mt-0 px-4 py-2 border rounded-md w-full sm:w-auto"
            />
            <button
              onClick={() => openModal()}
              className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-700"
            >
              Add New Plan
            </button>
          </div>
          <ReusableTable columns={columns} data={plans} />
        </div>
      </div>
    </>
  );
};

export default ManagePlans;
