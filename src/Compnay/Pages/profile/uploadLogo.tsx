import { useEffect, useState } from 'react';
import CompanyHeader from '../../Components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import { validateFile } from '../../../Utils/helperFunctions/fileValidation';
import { companyUpdate } from '../../../redux/slices/authSlice';
import Modal from 'react-modal';
import { deleteCompanyLogo, uploadCompanyLogo } from '../../../services/company/profileService';


const UploadLogo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const { company } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (company?.companyLogo) {
      setPreviewUrl(company.companyLogo?.url);
    }
  }, [company?.companyLogo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true); // Start upload
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const validationError = validateFile(
      selectedFile,
      allowedTypes,
      maxFileSize
    );
    // const validationError = validateFileForLogoAndProfile(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append('companyLogo', selectedFile);

    try {
      const data = await uploadCompanyLogo(selectedFile, company?._id!)
      if (data.success) {
        toast.success(data.message);
        dispatch(companyUpdate(data.data.company));
        setIsUploading(false); // Upload completed
        console.log('Response data:', data.data);
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error: any) {
      toast.error(error);
      setIsUploading(false); // Reset upload state on error
    }
  };

  const handleDeleteLogoFromProfile = async () => {
    try {
const data = await deleteCompanyLogo(selectedCompanyId!)
      if (data.success) {
        toast.success(data.message);
        dispatch(companyUpdate(data.data.company));
        console.log(data)
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setModalIsOpen(false);
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
        contentLabel="Block User Confirmation"
        className="max-w-sm p-6 mx-auto bg-white rounded shadow-md"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="mb-4 text-lg font-bold">Confirm Action</h2>
        <p>Are you sure you want to delete this Logo?</p>
        <div className="flex justify-end mt-4 space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteLogoFromProfile}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
      <CompanyHeader />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">
            Upload Company Logo
          </h2>

          <div className="relative flex items-center justify-center p-6 mb-4 border-2 border-gray-300 border-dashed rounded-lg">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Uploaded Logo"
                  className="object-cover w-40 h-40 rounded-md"
                />
                {/* Show the close button only during upload */}
                {isUploading ? (
                  <button
                    onClick={handleDelete}
                    className="absolute p-2 text-sm text-white transition duration-300 bg-red-600 rounded-full -top-2 -right-2 hover:bg-red-700"
                    aria-label="Delete Logo"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/150?text=Upload+Logo"
                  alt="Placeholder"
                  className="object-cover w-40 h-40 mb-2 rounded-md"
                />
                <p className="text-sm text-gray-500">No logo uploaded</p>
              </div>
            )}
          </div>

          {/* Delete Logo button outside the image container */}
          {previewUrl && !isUploading && company?._id && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => openModal(company?._id)}
                className="px-3 py-1 text-sm text-white transition duration-300 bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Logo
              </button>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-600 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`w-full py-2 px-6 text-white rounded-md shadow-md transition duration-300 ${
                selectedFile
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-l'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Upload Logo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadLogo;
