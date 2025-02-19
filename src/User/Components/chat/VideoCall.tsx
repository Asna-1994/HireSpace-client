// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
// import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
// import { MdCallEnd } from 'react-icons/md';
// import { toast } from 'react-toastify';

// interface VideoCallProps {
//   roomId: string;
//   receiverId: string;
//   receiverName: string;
//   callerId: string;
//   callerName: string;
//   onEndCall: () => void;
//   isCaller?: boolean;
//   isVideoCallActive: boolean;
//   setIsVideoCallActive: (active: boolean) => void;
//   setIsCaller: (isCaller: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({
//   roomId,
//   receiverId,
//   receiverName,
//   callerId,
//   callerName,
//   onEndCall,
//   isCaller = true,
//   isVideoCallActive,
//   setIsVideoCallActive,
//   setIsCaller,
// }) => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [callStatus, setCallStatus] = useState<
//     | 'waiting'
//     | 'call ended'
//     | 'initiating'
//     | 'connecting'
//     | 'connected'
//     | 'failed'
//   >('waiting');
//   const [error, setError] = useState<string | null>(null);
//   const [isReconnecting, setIsReconnecting] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
//   const { user } = useSelector((state: RootState) => state.auth);

//   const ICE_SERVERS = [
//     { urls: 'stun:stun.l.google.com:19302' },
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },

//   ];

//   const createPeerConnection = async () => {
//     try {
//       const pc = new RTCPeerConnection({
//         iceServers: ICE_SERVERS,
//         iceCandidatePoolSize: 10,
//       });

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit('ice-candidate', {
//             candidate: event.candidate,
//             senderId: user?._id,
//             receiverId: isCaller ? receiverId : callerId,
//             roomId,
//           });
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         console.log('ICE Connection State:', pc.iceConnectionState);
//         if (
//           pc.iceConnectionState === 'failed' ||
//           pc.iceConnectionState === 'disconnected'
//         ) {
//           setIsReconnecting(true);
//           handleReconnection();
//         } else if (pc.iceConnectionState === 'connected') {
//           setIsReconnecting(false);
//           setCallStatus('connected');
//         }
//       };

//       pc.ontrack = (event) => {
//         if (event.streams[0]) {
//           console.log('Received remote track:', event.track.kind);
//           setRemoteStream(event.streams[0]);

//           // Directly set the stream to avoid React state timing issues
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//             remoteVideoRef.current
//               .play()
//               .catch((err) => console.error('Play error:', err));
//           }
//         }
//       };

//       return pc;
//     } catch (error) {
//       console.error('Error creating peer connection:', error);
//       throw new Error('Failed to create peer connection');
//     }
//   };

//   const startLocalStream = async () => {
//     try {
//       const existingStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = existingStream;
//       }

//       setLocalStream(existingStream);
//       return existingStream;
//     } catch (error: any) {
//       console.error('Media access error:', error);
//       let errorMessage = 'Cannot access camera or microphone';

//       if (
//         error.name === 'NotAllowedError' ||
//         error.name === 'PermissionDeniedError'
//       ) {
//         errorMessage =
//           'Please grant camera and microphone permissions and try again';
//       } else if (
//         error.name === 'NotFoundError' ||
//         error.name === 'DevicesNotFoundError'
//       ) {
//         errorMessage =
//           'Camera or microphone not found. Please check your device connections';
//       } else if (
//         error.name === 'NotReadableError' ||
//         error.name === 'TrackStartError'
//       ) {
//         errorMessage =
//           'Camera or microphone is already in use by another application';
//       }

//       throw new Error(errorMessage);
//     }
//   };

//   const handleReconnection = async () => {
//     try {
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//       }

//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;

//       if (localStream) {
//         localStream.getTracks().forEach((track) => {
//           pc.addTrack(track, localStream);
//         });
//       }

//       if (isCaller) {
//         const offer = await pc.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: true,
//         });
//         await pc.setLocalDescription(offer);
//         socket.emit('videoSignal', {
//           roomId,
//           callerId: user?._id,
//           receiverId,
//           type: 'offer',
//           data: offer,
//         });
//       }
//     } catch (error) {
//       console.error('Reconnection failed:', error);
//       setError('Connection failed. Please try again.');
//     }
//   };

//   const initializeCall = async () => {
//     try {
//       setCallStatus('initiating');
//       const stream = await startLocalStream();
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;

//       stream.getTracks().forEach((track) => {
//         pc.addTrack(track, stream);
//       });

//       if (isCaller) {
//         const offer = await pc.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: true,
//         });
//         await pc.setLocalDescription(offer);
//         socket.emit('videoSignal', {
//           roomId,
//           callerId: user?._id,
//           receiverId,
//           type: 'offer',
//           data: offer,
//         });
//       }

//       setCallStatus('connecting');
//     } catch (error: any) {
//       console.error('Call initialization error:', error);
//       setError(error.message);
//       cleanup();
//     }
//   };

//   const handleVideoSignal = async (signal: any) => {
//     try {
//       const pc = peerConnectionRef.current;
//       if (!pc) return;

//       if (signal.type === 'offer') {
//         await pc.setRemoteDescription(new RTCSessionDescription(signal.data));

//         // Process any queued ICE candidates
//         while (iceCandidatesQueue.current.length) {
//           const candidate = iceCandidatesQueue.current.shift();
//           if (candidate) {
//             await pc.addIceCandidate(candidate);
//           }
//         }

//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         socket.emit('videoSignal', {
//           roomId,
//           callerId,
//           receiverId,
//           type: 'answer',
//           data: answer,
//         });
//       } else if (signal.type === 'answer') {
//         await pc.setRemoteDescription(new RTCSessionDescription(signal.data));

//         // Process any queued ICE candidates
//         while (iceCandidatesQueue.current.length) {
//           const candidate = iceCandidatesQueue.current.shift();
//           if (candidate) {
//             await pc.addIceCandidate(candidate);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error handling video signal:', error);
//       setError('Connection error occurred');
//     }
//   };

//   const cleanup = () => {
//     // Stop all tracks in both streams
//     if (localStream) {
//       localStream.getTracks().forEach((track) => {
//         track.stop();
//         track.enabled = false;
//       });
//       setLocalStream(null);
//     }

//     if (remoteStream) {
//       remoteStream.getTracks().forEach((track) => {
//         track.stop();
//         track.enabled = false;
//       });
//       setRemoteStream(null);
//     }

//     // Clear video elements
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     // Close and cleanup peer connection
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     // Reset all states
//     setCallStatus('call ended');
//     setIsVideoEnabled(true);
//     setIsAudioEnabled(true);
//     setError(null);
//     setIsReconnecting(false);
//     iceCandidatesQueue.current = [];

//     // Request permission cleanup
//     navigator.mediaDevices
//       .getUserMedia({ audio: true, video: true })
//       .then((stream) => {
//         stream.getTracks().forEach((track) => {
//           track.stop();
//           track.enabled = false;
//         });
//       })
//       .catch(() => {});

//     console.log('Cleanup completed');
//   };

//   useEffect(() => {
//     if (!user?._id) {
//       setError('User ID not found');
//       return;
//     }

//     if (!socket.connected) {
//       socket.connect();
//     }

//     socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
//       if (isVideoCallActive && rejectedReceiverId === receiverId) {
//         setIsVideoCallActive(false);
//         setIsCaller(false);
//         toast.error(`Call rejected by ${receiverName}`);
//         cleanup();
//       }
//     });

//     socket.on('videoSignal', handleVideoSignal);

//     socket.on('callEnded', () => {
//       cleanup();
//       onEndCall();
//       setCallStatus('call ended');
//     });

//     socket.on("ice-candidate", async ({ candidate, senderId }) => {
//       try {
//         const pc = peerConnectionRef.current;
//         const iceCandidate = new RTCIceCandidate(candidate);

//         if (pc && pc.remoteDescription && pc.remoteDescription.type) {
//           await pc.addIceCandidate(iceCandidate);
//         } else {
//           // Queue the candidate if remote description is not set yet
//           iceCandidatesQueue.current.push(iceCandidate);
//         }
//       } catch (error) {
//         console.error("Error adding ICE candidate:", error);
//       }
//     });

//     // In VideoCall component, update the ice candidate handling:


//     initializeCall();

//     if (!isCaller) {
//       socket.emit('acceptCall', {
//         roomId,
//         callerId,
//         receiverId: user?._id,
//       });
//     }

//     // Cleanup function
//     return () => {
//       socket.off('videoSignal');
//       socket.off('callEnded');
//       socket.off('ice-candidate');
//       socket.off('callRejected');
//       cleanup();
//     };
//   }, []);

//   const toggleVideo = () => {
//     if (localStream) {
//       localStream.getVideoTracks().forEach((track) => {
//         track.enabled = !isVideoEnabled;
//       });
//       setIsVideoEnabled(!isVideoEnabled);
//     }
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !isAudioEnabled;
//       });
//       setIsAudioEnabled(!isAudioEnabled);
//     }
//   };

//   const endCall = () => {
//     socket.emit('endCall', {
//       roomId,
//       callerId: user?._id,
//       receiverId: isCaller ? receiverId : callerId,
//     });
//     cleanup();
//     onEndCall();
//     setIsVideoCallActive(false);
//     setIsCaller(false);
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
//           {error ? (
//             <div className="text-center p-4">
//               <p className="text-red-500">{error}</p>
//               <button
//                 onClick={onEndCall}
//                 className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="text-center mb-4">
//                 <span className="text-gray-600">
//                   {isReconnecting && 'Reconnecting...'}
//                   {!isReconnecting && (
//                     <>
//                       {callStatus === 'waiting' && `Calling ${receiverName}...`}
//                       {callStatus === 'initiating' && 'Starting call...'}
//                       {callStatus === 'connecting' && 'Connecting...'}
//                       {callStatus === 'connected' &&
//                         `Connected with ${isCaller ? receiverName : callerName}`}
//                       {callStatus === 'failed' && 'Connection failed'}
//                     </>
//                   )}
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="relative">
//                   <video
//                     ref={localVideoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-64 bg-black rounded-lg object-cover"
//                   />
//                   <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
//                     You
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <video
//                     ref={remoteVideoRef}
//                     autoPlay
//                     playsInline
//                     className="w-full h-64 bg-black rounded-lg object-cover"
//                   />
//                   <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
//                     {isCaller ? receiverName : callerName}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex justify-center space-x-4 mt-6">
//                 <button
//                   onClick={toggleVideo}
//                   className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
//                   title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
//                 >
//                   {isVideoEnabled ? (
//                     <BsCameraVideo size={24} />
//                   ) : (
//                     <BsCameraVideoOff size={24} />
//                   )}
//                 </button>
//                 <button
//                   onClick={toggleAudio}
//                   className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
//                   title={
//                     isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'
//                   }
//                 >
//                   {isAudioEnabled ? (
//                     <BiMicrophone size={24} />
//                   ) : (
//                     <BiMicrophoneOff size={24} />
//                   )}
//                 </button>
//                 <button
//                   onClick={endCall}
//                   className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
//                   title="End call"
//                 >
//                   <MdCallEnd size={24} />
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
// export default VideoCall;



import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../../services/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import { toast } from 'react-toastify';

interface VideoCallProps {
  roomId: string;
  receiverId: string;
  receiverName: string;
  callerId: string;
  callerName: string;
  onEndCall: () => void;
  isCaller?: boolean;
  isVideoCallActive: boolean;
  setIsVideoCallActive: (active: boolean) => void;
  setIsCaller: (isCaller: boolean) => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  roomId,
  receiverId,
  receiverName,
  callerId,
  callerName,
  onEndCall,
  isCaller = true,
  isVideoCallActive,
  setIsVideoCallActive,
  setIsCaller,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'waiting' | 'initiating' | 'connecting' | 'connected' | 'failed' | 'ended'>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const reconnectionAttempts = useRef(0);
  const { user } = useSelector((state: RootState) => state.auth);

  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ];

  const createPeerConnection = async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceCandidatePoolSize: 10,
        iceTransportPolicy: 'all',
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            senderId: user?._id,
            receiverId: isCaller ? receiverId : callerId,
            roomId,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE Connection State:', pc.iceConnectionState);
        
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          if (reconnectionAttempts.current < 3) {
            setIsReconnecting(true);
            reconnectionAttempts.current += 1;
            handleReconnection();
          } else {
            setError('Connection failed after multiple attempts. Please try again.');
            endCall();
          }
        } else if (pc.iceConnectionState === 'connected') {
          setIsReconnecting(false);
          setCallStatus('connected');
          reconnectionAttempts.current = 0;
        }
      };

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw new Error('Failed to create peer connection');
    }
  };

  const startLocalStream = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error('Media access error:', error);
      const errorMessage = getMediaErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  const getMediaErrorMessage = (error: any): string => {
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'Please grant camera and microphone permissions and try again';
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return 'Camera or microphone not found. Please check your device connections';
      case 'NotReadableError':
      case 'TrackStartError':
        return 'Camera or microphone is already in use by another application';
      default:
        return 'Cannot access camera or microphone';
    }
  };

  const handleReconnection = async () => {
    try {
      cleanup(false);
      await initializeCall();
    } catch (error) {
      console.error('Reconnection failed:', error);
      setError('Connection failed. Please try again.');
      endCall();
    }
  };

  const initializeCall = async () => {
    try {
      setCallStatus('initiating');
      const stream = await startLocalStream();
      const pc = await createPeerConnection();
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      if (isCaller) {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        socket.emit('videoSignal', {
          roomId,
          callerId: user?._id,
          receiverId,
          type: 'offer',
          data: offer,
        });
      }

      setCallStatus('connecting');
    } catch (error: any) {
      console.error('Call initialization error:', error);
      setError(error.message);
      cleanup(true);
    }
  };

  const handleVideoSignal = async (signal: any) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        await processIceCandidatesQueue();

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('videoSignal', {
          roomId,
          callerId,
          receiverId,
          type: 'answer',
          data: answer,
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        await processIceCandidatesQueue();
      }
    } catch (error) {
      console.error('Error handling video signal:', error);
      setError('Connection error occurred');
    }
  };

  const processIceCandidatesQueue = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    while (iceCandidatesQueue.current.length) {
      const candidate = iceCandidatesQueue.current.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding queued ICE candidate:', error);
        }
      }
    }
  };

  const cleanup = (fullCleanup: boolean = true) => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
      setRemoteStream(null);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (fullCleanup) {
      setCallStatus('ended');
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setError(null);
      setIsReconnecting(false);
      reconnectionAttempts.current = 0;
    }

    iceCandidatesQueue.current = [];
  };

  useEffect(() => {
    if (!user?._id) {
      setError('User ID not found');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleCallRejected = ({ receiverId: rejectedReceiverId }: { receiverId: string }) => {
      if (isVideoCallActive && rejectedReceiverId === receiverId) {
        setIsVideoCallActive(false);
        setIsCaller(false);
        toast.error(`Call rejected by ${receiverName}`);
        cleanup(true);
      }
    };

    const handleIceCandidate = async ({ candidate, senderId }: { candidate: RTCIceCandidate; senderId: string }) => {
      try {
        const pc = peerConnectionRef.current;
        const iceCandidate = new RTCIceCandidate(candidate);

        if (pc?.remoteDescription?.type) {
          await pc.addIceCandidate(iceCandidate);
        } else {
          iceCandidatesQueue.current.push(iceCandidate);
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    const handleCallEnded = () => {
      cleanup(true);
      onEndCall();
      setCallStatus('ended');
    };

    socket.on('callRejected', handleCallRejected);
    socket.on('videoSignal', handleVideoSignal);
    socket.on('callEnded', handleCallEnded);
    socket.on('ice-candidate', handleIceCandidate);

    initializeCall();

    if (!isCaller) {
      socket.emit('acceptCall', {
        roomId,
        callerId,
        receiverId: user?._id,
      });
    }

    return () => {
      socket.off('videoSignal');
      socket.off('callEnded');
      socket.off('ice-candidate');
      socket.off('callRejected');
      cleanup(true);
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endCall = () => {
    socket.emit('endCall', {
      roomId,
      callerId: user?._id,
      receiverId: isCaller ? receiverId : callerId,
    });
    cleanup(true);
    onEndCall();
    setIsVideoCallActive(false);
    setIsCaller(false);
  };

    return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
          {error ? (
            <div className="text-center p-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={onEndCall}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <span className="text-gray-600">
                  {isReconnecting && 'Reconnecting...'}
                  {!isReconnecting && (
                    <>
                      {callStatus === 'waiting' && `Calling ${receiverName}...`}
                      {callStatus === 'initiating' && 'Starting call...'}
                      {callStatus === 'connecting' && 'Connecting...'}
                      {callStatus === 'connected' &&
                        `Connected with ${isCaller ? receiverName : callerName}`}
                      {callStatus === 'failed' && 'Connection failed'}
                    </>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 bg-black rounded-lg object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    You
                  </span>
                </div>
                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 bg-black rounded-lg object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {isCaller ? receiverName : callerName}
                  </span>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={toggleVideo}
                  className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                  title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoEnabled ? (
                    <BsCameraVideo size={24} />
                  ) : (
                    <BsCameraVideoOff size={24} />
                  )}
                </button>
                <button
                  onClick={toggleAudio}
                  className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                  title={
                    isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'
                  }
                >
                  {isAudioEnabled ? (
                    <BiMicrophone size={24} />
                  ) : (
                    <BiMicrophoneOff size={24} />
                  )}
                </button>
                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="End call"
                >
                  <MdCallEnd size={24} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default VideoCall;
