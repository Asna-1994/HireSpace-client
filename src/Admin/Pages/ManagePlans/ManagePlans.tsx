import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import { Plans } from '../../../Utils/Interfaces/interface';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReusableTable from '../../ReusableComponents/ReusableTable';
import { deletePlans , fetchPlansFromDB} from '../../../services/admin/planService';

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
      const response =  await fetchPlansFromDB(page , limit , searchTerm)
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
      const response = await deletePlans(selectedPlanId as string)
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
            className="flex justify-center w-6 py-1 ml-2 text-sm text-white bg-green-700 border rounded-md hover:bg-green-500"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setSelectedPlanId(item._id!);
              setConfirmationModalIsOpen(true);
            }}
            className="flex justify-center w-6 py-1 ml-2 text-sm text-white bg-red-700 border rounded-md hover:bg-red-500"
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
        className="w-11/12 max-w-sm p-6 mx-auto bg-white rounded shadow-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="mb-4 text-lg font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete this plan?</p>
        <div className="flex justify-end mt-4 space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create/Edit Plan"
        className="w-11/12 max-w-sm p-6 mx-auto bg-white rounded shadow-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="mb-4 text-lg font-bold">
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
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
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
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
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
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
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
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
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
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <div className="fixed top-0 z-50 w-full ">
        <AdminHeader />
      </div>
      <div className="flex flex-col h-auto min-h-screen mt-16 bg-gray-100 lg:flex-row">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow p-4 bg-white rounded-lg shadow-md lg:ml-64 lg:p-6">
          <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
            <h2 className="text-xl font-bold sm:text-2xl">Manage Plans</h2>
            <input
              type="text"
              placeholder="Search Plans..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 mt-2 border rounded-md sm:mt-0 sm:w-auto"
            />
            <button
              onClick={() => openModal()}
              className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
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
