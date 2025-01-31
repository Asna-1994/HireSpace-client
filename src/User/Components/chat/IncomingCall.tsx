import React from "react";
import { BiPhone, BiPhoneOff } from "react-icons/bi";
import { BsCameraVideo, BsTelephoneX } from "react-icons/bs"; // Import missing icons

interface IncomingCallProps {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsCameraVideo className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Incoming Video Call</h2>
          <p className="text-gray-600 mb-6">{callerName} is calling...</p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onAccept}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center"
            >
              <BsCameraVideo className="mr-2" />
              Accept
            </button>
            <button
              onClick={onReject}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center"
            >
              <BsTelephoneX className="mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
