
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { socket } from '../../../services/socket';
import VideoCall from './VideoCall';
import { toast } from 'react-toastify';

interface CallNotification {
  roomId: string;
  callerId: string;
  callerName: string;
  receiverId: string;
}

const SocketManager: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [incomingCall, setIncomingCall] = useState<CallNotification | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isCaller, setIsCaller] = useState(false);

  useEffect(() => {
    if (user?._id && !socket.connected) {
      socket.connect();

      // Handle incoming call notification
      socket.on('incomingCall', (callData: CallNotification) => {
        if (callData.receiverId === user._id) {
          setIncomingCall(callData);
          // Show notification using system notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Incoming call from ${callData.callerName}`, {
              body: 'Click to answer',
              icon: '/your-app-icon.png'
            });
          }
          // Also show toast notification
          toast.info(
            <div>
              <p>Incoming call from {callData.callerName}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded"
                  onClick={() => acceptCall(callData)}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded"
                  onClick={() => rejectCall(callData)}
                >
                  Reject
                </button>
              </div>
            </div>,
            {
              autoClose: false,
              closeOnClick: false,
              draggable: false
            }
          );
        }
      });

      // Handle call ended remotely
      socket.on('callEnded', () => {
        setIsVideoCallActive(false);
        setIsCaller(false);
        setIncomingCall(null);
        toast.info('Call ended');
      });
    }

    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('incomingCall');
      socket.off('callEnded');
    };
  }, [user?._id]);

  const acceptCall = (callData: CallNotification) => {
    setIncomingCall(null);
    setIsVideoCallActive(true);
    setIsCaller(false);
    toast.dismiss();
  };

  const rejectCall = (callData: CallNotification) => {
    socket.emit('rejectCall', {
      roomId: callData.roomId,
      callerId: callData.callerId,
      receiverId: user?._id
    });
    setIncomingCall(null);
    toast.dismiss();
  };

  const handleEndCall = () => {
    setIsVideoCallActive(false);
    setIsCaller(false);
    setIncomingCall(null);
  };

  return (
    <>
      {isVideoCallActive && incomingCall && (
        <VideoCall
          roomId={incomingCall.roomId}
          callerId={incomingCall.callerId}
          callerName={incomingCall.callerName}
          receiverId={user?._id || ''}
          receiverName={user?.userName || ''}
          onEndCall={handleEndCall}
          isCaller={isCaller}
          isVideoCallActive={isVideoCallActive}
          setIsVideoCallActive={setIsVideoCallActive}
          setIsCaller={setIsCaller}
        />
      )}
    </>
  );
};

export default SocketManager;