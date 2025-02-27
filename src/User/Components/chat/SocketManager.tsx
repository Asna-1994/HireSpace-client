
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { connectSocket, socket } from '../../../services/socket';
// import VideoCall from './VideoCall';
// import { toast } from 'react-toastify';

// interface CallNotification {
//   roomId: string;
//   callerId: string;
//   callerName: string;
//   receiverId: string;
//   receiverName?: string;
// }

// const SocketManager: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { socket, connected } = useSelector((state: RootState) => state.socket);
//   const [incomingCall, setIncomingCall] = useState<CallNotification | null>(null);
//   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//   const [isCaller, setIsCaller] = useState(false);
//   const [activeCallData, setActiveCallData] = useState<CallNotification | null>(null);

//   useEffect(() => {
//     // Ensure socket is connected
//       if (!socket.connected) {
//         connectSocket();
//       }

//     if (socket && user?._id) {
//       // Register user to socket
//       socket.emit('registerUser', user._id);

//       // Handle incoming call notification
//       socket.on('incomingCall', (callData: CallNotification) => {
//         console.log('Global incoming call received:', callData);
//         if (callData.receiverId === user._id) {
//           setIncomingCall(callData);
          
//           // Show notification using system notification if supported
//           if ('Notification' in window && Notification.permission === 'granted') {
//             const notification = new Notification(`Incoming call from ${callData.callerName}`, {
//               body: 'Click to answer',
//               icon: '/your-app-icon.png'
//             });
            
//             notification.onclick = () => {
//               window.focus();
//               acceptCall(callData);
//             };
//           }
          
//           // Also show toast notification
//           toast.info(
//             <div>
//               <p>Incoming call from {callData.callerName}</p>
//               <div className="flex gap-2 mt-2">
//                 <button
//                   className="px-4 py-1 bg-green-500 text-white rounded"
//                   onClick={() => acceptCall(callData)}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   className="px-4 py-1 bg-red-500 text-white rounded"
//                   onClick={() => rejectCall(callData)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>,
//             {
//               autoClose: 30000, // Close after 30 seconds if no action
//               closeOnClick: false,
//               draggable: false,
//               toastId: `call-${callData.callerId}` // Prevent duplicate toasts
//             }
//           );
//         }
//       });

//       // Handle call accepted
//       socket.on('callAccepted', (data) => {
//         console.log('Call accepted:', data);
//         if (data.callerId === user._id) {
//           setIsVideoCallActive(true);
//           setIsCaller(true);
//           setActiveCallData(data);
//         }
//       });

//       // Handle call rejected
//       socket.on('callRejected', (data) => {
//         if (data.callerId === user._id) {
//           toast.info(`${data.receiverName || 'Recipient'} rejected the call`);
//           setIsVideoCallActive(false);
//           setIsCaller(false);
//           setActiveCallData(null);
//         }
//       });

//       // Handle call ended
//       socket.on('callEnded', () => {
//         setIsVideoCallActive(false);
//         setIsCaller(false);
//         setIncomingCall(null);
//         setActiveCallData(null);
//         toast.info('Call ended');
//       });
//     }

//     // Request notification permission on component mount
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }

//     return () => {
//       if (socket) {
//         socket.off('incomingCall');
//         socket.off('callAccepted');
//         socket.off('callRejected');
//         socket.off('callEnded');
//       }
//     };
//   }, [user?._id, socket, connected, dispatch]);

//   const acceptCall = (callData: CallNotification) => {
//     if (!socket) return;
    
//     console.log('Accepting call from:', callData.callerName);
    
//     socket.emit('acceptCall', {
//       roomId: callData.roomId,
//       callerId: callData.callerId,
//       callerName: callData.callerName,
//       receiverId: user?._id,
//       receiverName: user?.userName,
//       answer: true
//     });
    
//     setIncomingCall(null);
//     setIsVideoCallActive(true);
//     setIsCaller(false);
//     setActiveCallData(callData);
//     toast.dismiss(`call-${callData.callerId}`);
//   };

//   const rejectCall = (callData: CallNotification) => {
//     if (!socket) return;
    
//     socket.emit('rejectCall', {
//       roomId: callData.roomId,
//       callerId: callData.callerId,
//       receiverId: user?._id,
//       receiverName: user?.userName
//     });
    
//     setIncomingCall(null);
//     toast.dismiss(`call-${callData.callerId}`);
//   };

//   const initiateCall = (receiverId: string, receiverName: string, roomId: string) => {
//     if (!socket || !user?._id) return;
    
//     const callData = {
//       roomId,
//       callerId: user._id,
//       callerName: user.userName,
//       receiverId,
//       receiverName
//     };
    
//     socket.emit('initiateVideoCall', callData);
//     setIsCaller(true);
//     setIsVideoCallActive(true);
//     setActiveCallData(callData);
//   };

//   const endCall = () => {
//     if (!socket || !activeCallData) return;
    
//     socket.emit('endCall', {
//       roomId: activeCallData.roomId,
//       callerId: activeCallData.callerId,
//       receiverId: activeCallData.receiverId
//     });
    
//     setIsVideoCallActive(false);
//     setIsCaller(false);
//     setActiveCallData(null);
//   };

//   // Export these functions to be used in other components
//   React.useEffect(() => {
//     // Make functions available globally through window for other components to use
//     (window as any).videoCallManager = {
//       initiateCall,
//       endCall
//     };
    
//     return () => {
//       delete (window as any).videoCallManager;
//     };
//   }, [socket, user]);

//   return (
//     <>
//       {isVideoCallActive && activeCallData && (
//         <VideoCall
//           roomId={activeCallData.roomId}
//           callerId={activeCallData.callerId}
//           callerName={activeCallData.callerName}
//           receiverId={activeCallData.receiverId}
//           receiverName={activeCallData.receiverName || ''}
//           isCaller={isCaller}
//           isVideoCallActive={isVideoCallActive}
//           setIsVideoCallActive={(active) => {
//             if (!active) endCall();
//             setIsVideoCallActive(active);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default SocketManager;