import { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import { validateFile } from '../../../Utils/helperFunctions/fileValidation';
import Modal from 'react-modal';
import Header from '../../Components/Header/Header';
import { deleteResume, getUserResume, uploadResume } from '../../../services/user/userProfileService';

const UploadResume = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { user } = useSelector(
    (state: RootState) => state.auth
  );


  useEffect(() => {
    const getResume = async () => {
      try {
        const data = await getUserResume(user?._id as string)
        if (data.success) {
          console.log(data.data.jobSeekerProfile.resume.url);
          setPreviewUrl(data.data.jobSeekerProfile.resume.url);
        } else {
          console.log(data.message);
        }
      } catch (err: any) {
        console.log(err);
      }
    };
    getResume();
  }, []);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          'Invalid file type. Please upload a .doc, .docx, or .pdf file.'
        );
        return;
      }

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
    if (!selectedFile) {
      toast.error('Please Select file to upload');
      return;
    }

    //    const allowedTypes = ["application/pdf","image/jpeg", "image/png","application/pdf"];
    const maxFileSize = 5 * 1024 * 1024;
    const validationError = validateFile(
      selectedFile,
      allowedTypes,
      maxFileSize
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
       const data = await uploadResume(user?._id as string, selectedFile)
      if (data.success) {
        toast.success(data.message);
        setPreviewUrl(data.data.jobSeekerProfile.resume.url);
        setIsUploading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    setModalIsOpen(false);
    try {
      const data = await deleteResume(user?._id as string)
      if (data.success) {
        toast.success('Deleted successfully');
        setPreviewUrl(null);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        <p>Are you sure you want to delete this resume?</p>
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

      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Upload Resume
          </h2>

          <div className="relative flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            {previewUrl ? (
              <div className="relative">
                {selectedFile?.type === 'application/pdf' ||
                previewUrl?.endsWith('.pdf') ? (
                  <iframe
                    src={previewUrl}
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
                <p className="text-gray-500 text-sm">No Resume uploaded</p>
              </div>
            )}
          </div>

          {previewUrl && !isUploading && user?._id && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => openModal()}
                className="py-1 px-3 text-white text-sm bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
              >
                Delete Resume
              </button>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
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
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadResume;
