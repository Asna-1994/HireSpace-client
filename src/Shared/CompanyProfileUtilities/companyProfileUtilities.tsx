import React, { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import axiosInstance from '../../Utils/Instance/axiosInstance';
import { toast } from 'react-toastify';

interface ReportSpamModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  userId: string;
}

const ReportSpamModal: React.FC<ReportSpamModalProps> = ({
  isOpen,
  onClose,
  companyId,
  userId,
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/user/report-spam', {
        userId,
        companyId,
        reason,
        description,
      });
      if (response.data.success) {
        toast.success('Report submitted successfully');
        onClose();
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to submit report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-4">
          <FaExclamationTriangle className="text-red-500" />
          <h2 className="text-xl font-bold">Report Company</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a reason</option>
              <option value="fake_company">Fake Company</option>
              <option value="inappropriate_content">
                Inappropriate Content
              </option>
              <option value="misleading_information">
                Misleading Information
              </option>
              <option value="scam">Potential Scam</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
              placeholder="Please provide details about your report..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportSpamModal;
