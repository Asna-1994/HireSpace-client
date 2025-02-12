import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/Instance/axiosInstance";

interface ApplyModalProps {
  jobPostId: string;
  userId: string;
  companyId: string;
  onClose: () => void;
}

interface CoverLetter {
  salutation: string;
  body: string;
  closing: string;
}

const ApplyModal: React.FC<ApplyModalProps> = ({
  jobPostId,
  userId,
  companyId,
  onClose,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [coverLetter, setCoverLetter] = useState<CoverLetter>({
    salutation: "",
    body: "",
    closing: "",
  });

  const handleApply = async () => {
    try {
      const response = await axiosInstance.post(
        `/user/apply-for-job/${userId}/${jobPostId}/${companyId}`,
        { coverLetter },
      );
      if (response.data.success) {
        toast.success("Successfully Applied");
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data.message || "An error occurred");
      console.error(err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Cover Letter</h2>

        <div>
          <input
            type="text"
            placeholder="Salutation"
            value={coverLetter.salutation}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, salutation: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <textarea
            placeholder="Cover letter body..."
            value={coverLetter.body}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, body: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md mb-4 overflow-y-auto resize-y min-h-[100px] max-h-[240px]"
          />

          <input
            type="text"
            placeholder="Closing"
            value={coverLetter.closing}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, closing: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleApply}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
