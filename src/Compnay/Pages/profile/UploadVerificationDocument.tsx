import { useEffect, useState } from 'react';
import CompanyHeader from '../../Components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { toast } from 'react-toastify';
import { validateFile } from '../../../Utils/helperFunctions/fileValidation';
import { companyUpdate } from '../../../redux/slices/authSlice';
import Modal from 'react-modal';

const UploadVerificationDocument = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const { company } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (company?.verificationDocument) {
      setPreviewUrl(company.verificationDocument?.url);
      console.log(company.verificationDocument?.url);
    }
  }, [company?.verificationDocument]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true);
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const validationError = validateFile(
      selectedFile,
      allowedTypes,
      maxFileSize
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append('verificationDocument', selectedFile);
    formData.append('documentNumber', documentNumber);

    try {
      const response = await axiosInstance.patch(
        `/company/upload-document/${company?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(companyUpdate(response.data.data.company));
        console.log(response.data.data.company);
        setIsUploading(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error uploading verification document:', error);
      toast.error(
        error.response?.data?.message || 'Error uploading verification document'
      );
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    setModalIsOpen(false);
    try {
      const res = await axiosInstance.patch(
        `/company/delete-document/${selectedCompanyId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(companyUpdate(res.data.data.company));
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error deleting verification document'
      );
      console.error(error);
    } finally {
      setSelectedCompanyId(null);
    }
  };

  const openModal = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCompanyId(null);
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Document Confirmation"
        className="bg-white p-6 rounded shadow-md max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p>Are you sure you want to delete this document?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteDocument}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <CompanyHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Upload Verification Document
          </h2>

          <div className="mb-4">
            <label
              htmlFor="documentNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Document Number
            </label>
            <input
              type="text"
              id="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Document Number"
            />
          </div>
          <div className="relative flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            {previewUrl ? (
              <div className="relative">
                {selectedFile?.type === 'application/pdf' ||
                previewUrl?.endsWith('.pdf') ? (
                  <iframe
                    src={previewUrl || company?.verificationDocument?.url}
                    title="PDF Preview"
                    className="w-full h-64 border rounded-md"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded Document"
                    className="w-40 h-40 object-cover rounded-md"
                  />
                )}

                {isUploading ? (
                  <button
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full p-2 hover:bg-red-700 transition duration-300"
                    aria-label="Delete Logo"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/150?text=Upload+Document"
                  alt="Placeholder"
                  className="w-40 h-40 object-cover rounded-md mb-2"
                />
                <p className="text-gray-500 text-sm">No document uploaded</p>
              </div>
            )}
          </div>

          {/* <div className="relative flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Uploaded Document"
                  className="w-40 h-40 object-cover rounded-md"
                />
                {isUploading ? (
                  <button
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full p-2 hover:bg-red-700 transition duration-300"
                    aria-label="Delete Document"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/150?text=Upload+Document"
                  alt="Placeholder"
                  className="w-40 h-40 object-cover rounded-md mb-2"
                />
                <p className="text-gray-500 text-sm">No document uploaded</p>
              </div>
            )}
          </div> */}

          {previewUrl && !isUploading && company?._id && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => openModal(company?._id)}
                className="py-1 px-3 text-white text-sm bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
              >
                Delete Document
              </button>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !documentNumber.trim()}
              className={`w-full py-2 px-6 text-white rounded-md shadow-md transition duration-300 ${
                selectedFile && documentNumber.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-l'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadVerificationDocument;
