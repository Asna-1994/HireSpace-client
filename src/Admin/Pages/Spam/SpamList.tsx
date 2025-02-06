import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import AdminHeader from "../../Components/Header/AdminHeader";
import SideBar from "../../Components/SideBar/SideBar";
import { User } from "../../../Utils/Interfaces/interface";
import Footer from "../../../User/Components/Footer/Footer";

Modal.setAppElement("#root");

export interface Spam {
  reportedByUser: {
    userName: string;
    email: string;
    phone : string;
  };
  companyId: {
    companyName: string;
    email: string;
    isBlocked : boolean;
_id : string;
phone : string;
  };
  _id: string;
  createdAt :Date;
  updatedAt : Date;
  reason : string;
  description : string;

}

const SpamList = () => {

  const [spams, setSpams] = useState<Spam[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchSpams = async (query = "") => {
    console.log(query);
    try {
      const response = await axiosInstance.get(`/admin/spam-reports`, {
        params: { search: query, page, limit },
      });

      const {  rawSpams, totalPages, currentPage } = response.data.data;

      // Extract data from `_doc`
      const spams = rawSpams.map((spam: any) => spam._doc);
console.log(spams)
      setSpams(spams); // Set normalized spam data
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (err: any) {
      toast.error("Failed to fetch spam reports.");
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
    console.log(selectedCompanyId);

    try {
      const response = await axiosInstance.patch(
        `/admin/block-or-unblock-company/${selectedCompanyId}/${selectedAction}`
      );

      if (response.status === 200) {
        toast.success(
          `Successfully ${
            selectedAction === "block" ? "blocked" : "unblocked"
          }`
        );
        fetchSpams();
      }
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while blocking the user"
      );
    } finally {
      setModalIsOpen(false);
      setSelectedCompanyId(null);
      setSelectedAction("");
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
    setSelectedAction("");
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
          Are you sure you want to{" "}
          {selectedAction === "block" ? "block" : "unblock"} this company?
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
            {selectedAction === "block" ? "Block" : "Unblock"}
          </button>
        </div>
      </Modal>
      <div className="fixed top-0 w-full z-50 ">
        <AdminHeader />
      </div>
      <div className="flex  pt-16 h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow ml-64  p-6 bg-white rounded-lg shadow-md">
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

          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Sl. No</th>
                <th className="px-4 py-2 text-left">Reported By</th>
                <th className="px-4 py-2 text-left">CompanyDetails</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date of Report</th>
            <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spams.map((spam, index) => (
                <tr key={spam._id} className="border-b">
                  <td className="px-4 py-2">
                    {" "}
                    {(page - 1) * limit + index + 1}
                  </td>{" "}
                  {/* Serial number */}
                  <td className="px-4 py-2"> <div className="flex flex-col">
                    <span>  {spam.reportedByUser.userName}</span>
                    <span>  {spam.reportedByUser.email}</span>
                    <span>  {spam.reportedByUser.phone}</span>
                    </div> </td>
                  <td className="px-4 py-2"> <div className="flex flex-col">
                    <span>  {spam.companyId.companyName}</span>
                    <span>  {spam.companyId.email}</span>
                    <span>  {spam.companyId.phone}</span>
                    </div> </td>
                  <td className="px-4 py-2">{spam.reason}</td>
                  <td className="px-4 py-2">{spam.description}</td>
      
                  <td className="px-4 py-2">
                    {spam.createdAt
                      ? new Date(spam.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
           
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        openModal(
                          spam.companyId._id,
                          spam.companyId.isBlocked ? "unblock" : "block"
                        )
                      }
                      className="text-white text-sm w-20 hover:underline border bg-blue-700 px-3 py-1 rounded-md"
                    >
                      {spam.companyId.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
