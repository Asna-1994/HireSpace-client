import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import AdminHeader from "../../Components/Header/AdminHeader";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar/SideBar";
import { Company } from "../../../Utils/Interfaces/interface";
import Footer from "../../../User/Components/Footer/Footer";

Modal.setAppElement("#root");

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [verifyModalIsOpen, setVerifyModalIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
 const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  const fetchCompanies = async (query: string = '') => {
    try {
      const response = await axiosInstance.get(`/admin/all-companies`, {
        params: { search: query, page, limit },
      });
      const { companies, totalPages, currentPage } = response.data.data;
      setCompanies(companies);
      setTotalPages(totalPages)
      setPage(currentPage)
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      console.error(err);
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
      const response = await axiosInstance.patch(
        `/admin/block-or-unblock-company/${selectedCompanyId}/${selectedAction}`
      );
      if (response.data.success) {
        toast.success(
          `Company successfully ${selectedAction === "block" ? "blocked" : "unblocked"}`
        );
        fetchCompanies();
      }
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message);
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
      const res = await axiosInstance.patch(`/admin/${companyId}/verify-company`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCompanies();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
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

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Block Company Confirmation"
        className="bg-white p-6 rounded shadow-md w-11/12 max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p>Are you sure you want to {selectedAction === "block" ? "block" : "unblock"} this company?</p>
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

      <Modal
        isOpen={verifyModalIsOpen}
        onRequestClose={closeVerifyModal}
        contentLabel="Company Details"
        className="bg-white p-6 rounded shadow-md w-11/12 max-w-lg mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        {selectedCompany ? (
          <div>
            <h2 className="text-xl text-center font-bold mb-4">{selectedCompany.companyName}</h2>
            <p><strong>Email:</strong> {selectedCompany.email}</p>
            <p><strong>Industry:</strong> {selectedCompany.industry}</p>
            <p><strong>Address:</strong> {selectedCompany.address}</p>
            <p><strong>Phone:</strong> {selectedCompany.phone}</p>
            {selectedCompany.establishedDate ? (
              <p>
                <strong>Founded:</strong> {new Date(selectedCompany.establishedDate).toLocaleDateString()}
              </p>
            ) : (
              <p>
                <strong>Founded:</strong> Date not available
              </p>
            )}
            {selectedCompany.verificationDocument ? (
              <div className="mt-4">
                <h3 className="font-semibold">Document:</h3>
                {selectedCompany.verificationDocument.url?.endsWith(".pdf") ? (
                  <iframe
                    src={selectedCompany.verificationDocument.url}
                    title="PDF Preview"
                    className="w-full h-64 border rounded-md"
                  />
                ) : (
                  <img
                    src={selectedCompany.verificationDocument.url}
                    alt="Uploaded Document"
                    className="w-96 object-cover rounded-md"
                  />
                )}
              </div>
            ) : (
              <p className="mt-4">No documents uploaded.</p>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeVerifyModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => verifyCompany(selectedCompany._id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {selectedCompany.isVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      <div className="fixed top-0 w-full z-50">
        <AdminHeader />
      </div>
      <div className="flex flex-col lg:flex-row h-auto bg-gray-100 min-h-screen mt-16">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>
        <div className="flex-grow lg:ml-64 p-4 lg:p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Company List</h2>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mt-2 sm:mt-0 px-4 py-2 border rounded-md w-full sm:w-auto"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Sl. No</th>
                  <th className="px-4 py-2 text-left">Company Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Industry</th>
                  <th className="px-4 py-2 text-left">Verification</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={company._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{company.companyName}</td>
                    <td className="px-4 py-2">{company.email}</td>
                    <td className="px-4 py-2">{company.industry}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openVerifyModal(company)}
                        className="text-white flex justify-center text-sm w-20 hover:bg-purple-400 border bg-purple-700 px-4 py-1 rounded-md"
                      >
                        {company.isVerified ? "Verified" : "Verify"}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openModal(company._id, company.isBlocked ? "unblock" : "block")}
                        className="text-white text-sm w-20 hover:bg-blue-500 border bg-blue-700 px-3 py-1 rounded-md"
                      >
                        {company.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default CompanyList;
