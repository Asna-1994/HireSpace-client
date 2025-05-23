import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { applyForJob } from '../../../services/user/jobServices';

interface ApplyModalProps {
  jobPostId: string;
  userId: string;
  companyId: string;
  onClose: () => void;
}

export interface CoverLetter {
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

  const [coverLetter, setCoverLetter] = useState<CoverLetter>({
    salutation: '',
    body: '',
    closing: '',
  });

  const handleApply = async () => {
    try {
const data = await applyForJob(coverLetter, userId, jobPostId, companyId )
      if (data.success) {
        toast.success('Successfully Applied');
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg sm:p-8">
        <button
          className="absolute text-xl text-gray-600 top-2 right-2 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="mb-4 text-xl font-semibold">Add Cover Letter</h2>

        <div>
          <input
            type="text"
            placeholder="Salutation"
            value={coverLetter.salutation}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, salutation: e.target.value })
            }
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
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
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
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
