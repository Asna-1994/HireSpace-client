// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
// import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
// import { MdCallEnd } from 'react-icons/md';
// import { toast } from 'react-toastify';



// interface ICECandidate {
//   candidate: string;
//   sdpMid: string;
//   sdpMLineIndex: number;
// }


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
//     // Public STUN servers
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun.sipgate.net' },
 
    
//     // Public TURN servers (some may require authentication)
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
//         // Skip empty candidates
//         if (event.candidate && event.candidate.candidate) {
//           console.log("Emitting ICE candidate:", event.candidate);
//           socket.emit("ice-candidate", {
//             candidate: event.candidate,
//             senderId: user?._id,
//             receiverId: isCaller ? receiverId : callerId,
//             roomId,
//           });
//         } else {
//           console.log("Skipping empty ICE candidate or gathering completed");
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
//         console.log('ontrack event triggered');
//         if (event.streams[0]) {
//           console.log('Received remote track:', event.track.kind);
//           setRemoteStream(event.streams[0]);
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
//         localVideoRef.current.muted = true; // Mute local playback
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


//   const handleIceCandidate = async (candidate: RTCIceCandidate) => {
//     try {
//       console.log('Handling ICE candidate:', candidate);
//       const pc = peerConnectionRef.current;
      
//       // Skip empty candidates
//       if (!candidate.candidate) {
//         console.log('Skipping empty candidate');
//         return;
//       }
  
//       if (!pc) {
//         console.log('No peer connection, queuing candidate');
//         iceCandidatesQueue.current.push(candidate);
//         return;
//       }
  
//       if (pc.remoteDescription && pc.remoteDescription.type) {
//         console.log('Remote description set, adding candidate immediately');
//         await pc.addIceCandidate(candidate);
//       } else {
//         console.log('Remote description not set, queuing candidate');
//         iceCandidatesQueue.current.push(candidate);
//       }
//     } catch (error) {
//       console.error('Error handling ICE candidate:', error);
//     }
//   };
//   const initializeCall = async () => {
//     try {
//       console.log(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
//       setCallStatus('initiating');
      
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;
//       console.log('Peer connection created');
  
//       const stream = await startLocalStream();
//       console.log('Local stream obtained');
  
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== 'closed') {
//           pc.addTrack(track, stream);
//         }
//       });

      
  
//       if (isCaller) {
//         console.log('Creating offer...');
//         const offer = await pc.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: true,
//         });
//         console.log('Setting local description (offer)');
//         await pc.setLocalDescription(offer);
        
//         console.log('Sending offer');
//         socket.emit('offer', {
//           offer,
//           roomId,
//           receiverId
//         });
//       }
  
//       setCallStatus('connecting');
//     } catch (error: any) {
//       console.error('Call initialization error:', error);
//       setError(error.message);
//       cleanup();
//     }
//   };
//   // In VideoCall component:




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
//     setIsVideoEnabled(false);
//     setIsAudioEnabled(false);
//     setError(null);
//     setIsReconnecting(false);
//     iceCandidatesQueue.current = [];

//     // Request permission cleanup
//     navigator.mediaDevices
//       .getUserMedia({ audio: false, video: false })
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

//   if (localStream) {
//     localStream.getAudioTracks().forEach((track) => {
//       track.enabled = isAudioEnabled;
//     });
//   }


//     socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
//       if (isVideoCallActive && rejectedReceiverId === receiverId) {
//         setIsVideoCallActive(false);
//         setIsCaller(false);
//         toast.error(`Call rejected by ${receiverName}`);
//         cleanup();
//       }
//     });


//     socket.on('ice-candidate-received', ({ candidateId, receiverId }) => {
//       console.log('ICE candidate received acknowledgment:', { candidateId, receiverId });
//     });
  
//     // Handle incoming offer
// // Update the offer handling to process queued candidates
// socket.on('offer', async (offer) => {
//   try {
//     console.log('Received offer');
//     const pc = peerConnectionRef.current;
//     if (!pc) throw new Error('No peer connection available');

//     await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
//     // Process any queued ICE candidates after setting remote description
//     console.log(`Processing ${iceCandidatesQueue.current.length} queued candidates`);
//     while (iceCandidatesQueue.current.length > 0) {
//       const candidate = iceCandidatesQueue.current.shift();
//       if (candidate && candidate.candidate) {
//         console.log('Processing queued candidate:', candidate);
//         await pc.addIceCandidate(candidate);
//       }
//     }
    
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
    
//     socket.emit('answer', {
//       answer,
//       roomId,
//       callerId
//     });
//   } catch (error) {
//     console.error('Error handling offer:', error);
//   }
// });


    
// socket.on('answer', async (answer) => {
//   try {
//     console.log('Received answer');
//     const pc = peerConnectionRef.current;
//     if (!pc) throw new Error('No peer connection available');

//     await pc.setRemoteDescription(new RTCSessionDescription(answer));

//     // Process any queued ICE candidates after setting remote description
//     console.log(`Processing ${iceCandidatesQueue.current.length} queued candidates`);
//     while (iceCandidatesQueue.current.length > 0) {
//       const candidate = iceCandidatesQueue.current.shift();
//       if (candidate && candidate.candidate) {
//         console.log('Processing queued candidate:', candidate);
//         await pc.addIceCandidate(candidate);
//       }
//     }
//   } catch (error) {
//     console.error('Error handling answer:', error);
//   }
// });

//     socket.on('callEnded', () => {
//       cleanup();
//       onEndCall();
//       setCallStatus('call ended');
//     });


//     socket.on('ice-candidate', async ({ candidate, senderId }) => {
//       console.log('Received ICE candidate from:', senderId, candidate);
//       if (!candidate || !candidate.candidate) {
//         console.log('Skipping empty ICE candidate');
//         return;
//       }
      
//       try {
//         const iceCandidate = new RTCIceCandidate(candidate);
//         await handleIceCandidate(iceCandidate);
//       } catch (error) {
//         console.error('Error handling ICE candidate:', error);
//       }
//     });

//     if (!isCaller) {
//       socket.emit('acceptCall', {
//         roomId,
//         callerId,
//         receiverId: user?._id,
//       });
//     }

//     initializeCall().catch(error => {
//       console.error('Failed to initialize call:', error);
//       setError('Failed to initialize call');
//     });
//     return () => {
//       // socket.off('videoSignal');
//       socket.off('callEnded');
//       socket.off('ice-candidate');
//       socket.off('callRejected');
//       socket.off('offer');
//       socket.off('answer');

//       socket.off('ice-candidate-received');
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

// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
// import { MdCallEnd } from 'react-icons/md';
// import { toast } from 'react-toastify';

// interface VideoCallProps {
//   roomId: string;
//   receiverId: string;
//   receiverName: string;
//   callerId: string;
//   callerName: string;
//   isCaller?: boolean;
//   isVideoCallActive: boolean;
//   setIsVideoCallActive: (active: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({
//   roomId,
//   receiverId,
//   receiverName,
//   callerId,
//   callerName,
//   isCaller = true,
//   isVideoCallActive,
//   setIsVideoCallActive,
// }) => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [callStatus, setCallStatus] = useState<'waiting' | 'call ended' | 'initiating' | 'connecting' | 'connected' | 'failed'>('waiting');
//   const [error, setError] = useState<string | null>(null);
//   const [isReconnecting, setIsReconnecting] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
//   const cleanupRef = useRef<boolean>(false);
//   const isMountedRef = useRef<boolean>(false);
//   const hasInitializedRef = useRef<boolean>(false);
  
//   const { user } = useSelector((state: RootState) => state.auth);

//   const ICE_SERVERS = [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun.sipgate.net' },
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//   ];

//   const debugLog = (message: string, data?: any) => {
//     const timestamp = new Date().toISOString();
//     const prefix = `[VideoCall][${timestamp}]`;
//     if (data) {
//       console.log(`${prefix} ${message}`, data);
//     } else {
//       console.log(`${prefix} ${message}`);
//     }
//   };

//   const createPeerConnection = async () => {
//     try {
//       const pc = new RTCPeerConnection({
//         iceServers: ICE_SERVERS,
//         iceCandidatePoolSize: 10,
//       });
//       debugLog('Creating peer connection...');

//       pc.onicecandidate = (event) => {
//         if (event.candidate && event.candidate.candidate) {
//           debugLog('New ICE candidate:', event.candidate);
//           socket.emit("ice-candidate", {
//             candidate: event.candidate,
//             senderId: user?._id,
//             receiverId: isCaller ? receiverId : callerId,
//             roomId,
//           });
//         } else {
//           debugLog('ICE candidate gathering completed');
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         debugLog('ICE Connection State changed:', pc.iceConnectionState);
//         if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
//           if (!cleanupRef.current) {
//             debugLog('Connection failed/disconnected, attempting reconnection');
//             setIsReconnecting(true);
//             handleReconnection();
//           }
//         } else if (pc.iceConnectionState === 'connected') {
//           debugLog('ICE Connection established successfully');
//           setIsReconnecting(false);
//           setCallStatus('connected');
//         }
//       };

//       pc.ontrack = (event) => {
//         debugLog('Received remote track:', { kind: event.track.kind, id: event.track.id });
//         if (event.streams[0]) {
//           debugLog('Setting remote stream');
//           setRemoteStream(event.streams[0]);
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         }
//       };
      
//       pc.onsignalingstatechange = () => {
//         debugLog('Signaling State changed:', pc.signalingState);
//       };

//       pc.onconnectionstatechange = () => {
//         debugLog('Connection State changed:', pc.connectionState);
//       };

//       debugLog('Peer connection created successfully');

//       return pc;
//     } catch (error) {
//       console.error('Error creating peer connection:', error);
//       throw new Error('Failed to create peer connection');
//     }
//   };

//   const startLocalStream = async () => {
//     debugLog('Starting local stream...');
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting local stream start');
//       return null;
//     }
    
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       debugLog('Local stream obtained:', {
//         videoTracks: stream.getVideoTracks().length,
//         audioTracks: stream.getAudioTracks().length
//       });

//       if (localVideoRef.current && !cleanupRef.current) {
//         localVideoRef.current.srcObject = stream;
//         localVideoRef.current.muted = true;
//         debugLog('Local video element configured');
//       }

//       setLocalStream(stream);
//       return stream;
//     } catch (error: any) {
//       console.error('Media access error:', error);
//       let errorMessage = 'Cannot access camera or microphone';

//       if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
//         errorMessage = 'Please grant camera and microphone permissions and try again';
//       } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
//         errorMessage = 'Camera or microphone not found. Please check your device connections';
//       } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
//         errorMessage = 'Camera or microphone is already in use by another application';
//       }

//       throw new Error(errorMessage);
//     }
//   };

//   const handleReconnection = async () => {
//     if (cleanupRef.current) return;
    
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
//         socket.emit('offer', {
//           offer,
//           roomId,
//           receiverId
//         });
//       }
//     } catch (error) {
//       console.error('Reconnection failed:', error);
//       setError('Connection failed. Please try again.');
//     }
//   };

//   const handleIceCandidate = async (candidate: RTCIceCandidate) => {
//     debugLog('Handling ICE candidate:', candidate);
//     try {
//       if (!candidate.candidate || cleanupRef.current) {
//         debugLog('Skipping empty candidate or cleanup in progress');
//         return;
//       }

//       const pc = peerConnectionRef.current;
//       if (!pc) {
//         debugLog('No peer connection, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//         return;
//       }

//       if (pc.remoteDescription && pc.remoteDescription.type) {
//         debugLog('Adding ICE candidate immediately');
//         await pc.addIceCandidate(candidate);
//         debugLog('ICE candidate added successfully');
//       } else {
//         debugLog('Remote description not set, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//       }
//     } catch (error) {
//       debugLog('Error handling ICE candidate:', error);
//     }
//   };

//   const initializeCall = async () => {
//     if (hasInitializedRef.current) {
//       debugLog('Call already initialized, skipping');
//       return;
//     }
    
//     debugLog(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting call initialization');
//       return;
//     }
    
//     try {
//       setCallStatus('initiating');
      
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;

//       const stream = await startLocalStream();
//       if (!stream || cleanupRef.current) {
//         debugLog('No stream available or cleanup in progress');
//         return;
//       }

//       debugLog('Adding local tracks to peer connection');
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== 'closed') {
//           pc.addTrack(track, stream);
//           debugLog('Added track to peer connection:', track.kind);
//         }
//       });

//       if (isCaller) {
//         debugLog('Creating offer...');
//         const offer = await pc.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: true,
//         });
//         debugLog('Setting local description');
//         await pc.setLocalDescription(offer);
        
//         debugLog('Sending offer');
//         socket.emit('offer', {
//           offer,
//           roomId,
//           receiverId
//         });
//       }

//       setCallStatus('connecting');
//       hasInitializedRef.current = true;
//     } catch (error: any) {
//       debugLog('Call initialization error:', error);
//       setError(error.message);
//       cleanup();
//     }
//   };

//   const cleanup = () => {
//     if (cleanupRef.current) return;
//     cleanupRef.current = true;

//     if (localStream) {
//       localStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setLocalStream(null);
//     }

//     if (remoteStream) {
//       remoteStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setRemoteStream(null);
//     }

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     setCallStatus('call ended');
//     setIsVideoEnabled(false);
//     setIsAudioEnabled(false);
//     setError(null);
//     setIsReconnecting(false);
//     iceCandidatesQueue.current = [];
//     hasInitializedRef.current = false;
//   };

//   // Set up socket listeners only once
//   useEffect(() => {
//     debugLog('Setting up socket listeners...');
    
//     const setupSocketListeners = () => {
//       socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
//         if (isVideoCallActive && rejectedReceiverId === receiverId) {
//           setIsVideoCallActive(false);
//           toast.error(`Call rejected by ${receiverName}`);
//           cleanup();
//         }
//       });

//       socket.on('offer', async (offer) => {
//         try {
//           if (cleanupRef.current) return;
          
//           const pc = peerConnectionRef.current;
//           if (!pc) throw new Error('No peer connection available');
  
//           await pc.setRemoteDescription(new RTCSessionDescription(offer));
          
//           while (iceCandidatesQueue.current.length > 0) {
//             const candidate = iceCandidatesQueue.current.shift();
//             if (candidate && candidate.candidate) {
//               await pc.addIceCandidate(candidate);
//             }
//           }
          
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
          
//           socket.emit('answer', {
//             answer,
//             roomId,
//             callerId
//           });
//         } catch (error) {
//           console.error('Error handling offer:', error);
//         }
//       });
  
//       socket.on('answer', async (answer) => {
//         try {
//           if (cleanupRef.current) return;
          
//           const pc = peerConnectionRef.current;
//           if (!pc) throw new Error('No peer connection available');
  
//           await pc.setRemoteDescription(new RTCSessionDescription(answer));
  
//           while (iceCandidatesQueue.current.length > 0) {
//             const candidate = iceCandidatesQueue.current.shift();
//             if (candidate && candidate.candidate) {
//               await pc.addIceCandidate(candidate);
//             }
//           }
//         } catch (error) {
//           console.error('Error handling answer:', error);
//         }
//       });
  
//       socket.on('callEnded', () => {
//         cleanup();
//         endCall();
//       });
  
//       socket.on('ice-candidate', async ({ candidate, senderId }) => {
//         if (!candidate || !candidate.candidate || cleanupRef.current) return;
        
//         try {
//           const iceCandidate = new RTCIceCandidate(candidate);
//           await handleIceCandidate(iceCandidate);
//         } catch (error) {
//           console.error('Error handling ICE candidate:', error);
//         }
//       });
//     };

//     setupSocketListeners();

//     return () => {
//       socket.off('callRejected');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('callEnded');
//       socket.off('ice-candidate');
//       socket.off('ice-candidate-received');
//     };
//   }, []); 

//   useEffect(() => {
//     debugLog('Component mounting...');
    
//     if (isMountedRef.current) {
//       debugLog('Component already mounted, skipping initialization');
//       return;
//     }
    
//     if (!user?._id) {
//       debugLog('No user ID found');
//       setError('User ID not found');
//       return;
//     }

//     isMountedRef.current = true;
//     cleanupRef.current = false;

//     const initializeVideoCall = async () => {
//       if (!socket.connected) {
//         debugLog('Socket disconnected, reconnecting...');
//         socket.connect();
//       }

//       if (!isCaller) {
//         socket.emit('acceptCall', {
//           roomId,
//           callerId,
//           receiverId: user?._id,
//         });
//       }

//       debugLog('Starting call initialization');
//       try {
//         await initializeCall();
//       } catch (error) {
//         debugLog('Failed to initialize call:', error);
//         setError('Failed to initialize call');
//       }
//     };

//     initializeVideoCall();

//     // Cleanup function
//     return () => {
//       debugLog('Component unmounting...');
//       isMountedRef.current = false;
      
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
//     setIsVideoCallActive(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
//       <div className="relative w-full h-full max-w-6xl mx-auto p-4">
//         <div className="relative h-full rounded-lg overflow-hidden">
//           {/* Remote Video (Full Screen) */}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//           />
          
//           {/* Local Video (Picture-in-Picture) */}
//           <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Controls */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
//             <button
//               onClick={toggleAudio}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//             >
//               {isAudioEnabled ? (
//                 <BsMic className="w-6 h-6 text-white" />
//               ) : (
//                 <BsMicMute className="w-6 h-6 text-red-500" />
//               )}
//             </button>
            
//             <button
//               onClick={endCall}
//               className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
//             >
//               <MdCallEnd className="w-6 h-6 text-white" />
//             </button>
            
//             <button
//               onClick={toggleVideo}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//             >
//               {isVideoEnabled ? (
//                 <BsCameraVideo className="w-6 h-6 text-white" />
//               ) : (
//                 <BsCameraVideoOff className="w-6 h-6 text-red-500" />
//               )}
//             </button>
//           </div>

//           {/* Caller/Receiver Name */}
//           <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
//             <p className="text-white">
//               {isCaller ? receiverName : callerName}
//             </p>
//           </div>

//           {/* Status Messages */}
//           {callStatus !== 'connected' && (
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-lg text-white text-center">
//               {callStatus === 'waiting' && <p>Waiting for connection...</p>}
//               {callStatus === 'initiating' && <p>Initiating call...</p>}
//               {callStatus === 'connecting' && <p>Connecting...</p>}
//               {callStatus === 'failed' && <p>Connection failed. Please try again.</p>}
//               {callStatus === 'call ended' && <p>Call ended</p>}
//               {error && <p className="text-red-400 mt-2">{error}</p>}
//             </div>
//           )}

//           {isReconnecting && (
//             <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-70 px-4 py-2 rounded-lg text-white">
//               Reconnecting...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;


// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
// import { MdCallEnd } from 'react-icons/md';
// import { toast } from 'react-toastify';

// interface VideoCallProps {
//   roomId: string;
//   receiverId: string;
//   receiverName: string;
//   callerId: string;
//   callerName: string;
//   isCaller?: boolean;
//   isVideoCallActive: boolean;
//   setIsVideoCallActive: (active: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({
//   roomId,
//   receiverId,
//   receiverName,
//   callerId,
//   callerName,
//   isCaller = true,
//   isVideoCallActive,
//   setIsVideoCallActive,
// }) => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [callStatus, setCallStatus] = useState<'waiting' | 'call ended' | 'initiating' | 'connecting' | 'connected' | 'failed'>('waiting');
//   const [error, setError] = useState<string | null>(null);
//   const [isReconnecting, setIsReconnecting] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
//   const cleanupRef = useRef<boolean>(false);
//   const hasInitializedRef = useRef<boolean>(false);
//   const socketListenersSetupRef = useRef<boolean>(false);
  
//   const { user } = useSelector((state: RootState) => state.auth);

//   const ICE_SERVERS = [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun.sipgate.net' },
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//     // Add additional TURN servers for better connectivity
//     {
//       urls: 'turn:openrelay.metered.ca:443',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//     {
//       urls: 'turn:openrelay.metered.ca:443?transport=tcp',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     }
//   ];

//   const debugLog = (message: string, data?: any) => {
//     const timestamp = new Date().toISOString();
//     const prefix = `[VideoCall][${timestamp}]`;
//     if (data) {
//       console.log(`${prefix} ${message}`, data);
//     } else {
//       console.log(`${prefix} ${message}`);
//     }
//   };

//   const createPeerConnection = async () => {
//     try {
//       // Close any existing peer connection first
//       if (peerConnectionRef.current) {
//         debugLog('Closing existing peer connection before creating a new one');
//         peerConnectionRef.current.close();
//       }
      
//       const pc = new RTCPeerConnection({
//         iceServers: ICE_SERVERS,
//         iceCandidatePoolSize: 10,
//       });
//       debugLog('Creating peer connection...', { isCaller });

//       pc.onicecandidate = (event) => {
//         if (event.candidate && event.candidate.candidate) {
//           debugLog('New ICE candidate:', event.candidate);
//           const targetId = isCaller ? receiverId : callerId;
//           debugLog(`Sending ICE candidate to ${targetId}`, { roomId });
          
//           // Log important information for debugging
//           socket.emit("ice-candidate", {
//             candidate: event.candidate,
//             senderId: user?._id,
//             receiverId: targetId,
//           });
//         } else {
//           debugLog('ICE candidate gathering completed');
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         debugLog('ICE Connection State changed:', pc.iceConnectionState);
//         if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
//           if (!cleanupRef.current) {
//             debugLog('Connection failed/disconnected, attempting reconnection');
//             setIsReconnecting(true);
//             handleReconnection();
//           }
//         } else if (pc.iceConnectionState === 'connected') {
//           debugLog('ICE Connection established successfully');
//           setIsReconnecting(false);
//           setCallStatus('connected');
//         }
//       };

//       pc.ontrack = (event) => {
//         debugLog('Received remote track:', { kind: event.track.kind, id: event.track.id });
//         if (event.streams && event.streams[0]) {
//           debugLog('Setting remote stream');
//           setRemoteStream(event.streams[0]);
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         }
//       };
      
//       pc.onsignalingstatechange = () => {
//         debugLog('Signaling State changed:', pc.signalingState);
//       };

//       pc.onconnectionstatechange = () => {
//         debugLog('Connection State changed:', pc.connectionState);
//         if (pc.connectionState === 'connected') {
//           debugLog('Connection established successfully');
//           setCallStatus('connected');
//         } else if (pc.connectionState === 'failed') {
//           debugLog('Connection failed');
//           setCallStatus('failed');
//           if (!cleanupRef.current) {
//             setIsReconnecting(true);
//             handleReconnection();
//           }
//         }
//       };

//       debugLog('Peer connection created successfully');
//       return pc;
//     } catch (error) {
//       console.error('Error creating peer connection:', error);
//       throw new Error('Failed to create peer connection');
//     }
//   };

//   const startLocalStream = async () => {
//     debugLog('Starting local stream...');
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting local stream start');
//       return null;
//     }
    
//     // First check if we already have a local stream
//     if (localStream && localStream.active) {
//       debugLog('Using existing local stream');
//       return localStream;
//     }
    
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       debugLog('Local stream obtained:', {
//         videoTracks: stream.getVideoTracks().length,
//         audioTracks: stream.getAudioTracks().length
//       });

//       if (localVideoRef.current && !cleanupRef.current) {
//         localVideoRef.current.srcObject = stream;
//         localVideoRef.current.muted = true;
//         debugLog('Local video element configured');
//       }

//       setLocalStream(stream);
//       return stream;
//     } catch (error: any) {
//       console.error('Media access error:', error);
//       let errorMessage = 'Cannot access camera or microphone';

//       if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
//         errorMessage = 'Please grant camera and microphone permissions and try again';
//       } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
//         errorMessage = 'Camera or microphone not found. Please check your device connections';
//       } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
//         errorMessage = 'Camera or microphone is already in use by another application';
//       }

//       setError(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

//   const handleReconnection = async () => {
//     if (cleanupRef.current) return;
    
//     debugLog('Attempting to reconnect...');
//     try {
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;

//       if (localStream) {
//         localStream.getTracks().forEach((track) => {
//           pc.addTrack(track, localStream);
//         });
//       }

//       if (isCaller) {
//         debugLog('Creating reconnection offer');
//         const offer = await pc.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: true,
//         });
//         await pc.setLocalDescription(offer);
//         socket.emit('offer', {
//           offer,
//           roomId,
//           receiverId,
//           callerId: user?._id 
//         });
//       }
//     } catch (error) {
//       console.error('Reconnection failed:', error);
//       setError('Connection failed. Please try again.');
//     }
//   };

//   const handleIceCandidate = async (candidate: RTCIceCandidate) => {
//     debugLog('Handling ICE candidate:', candidate);
//     try {
//       if (!candidate.candidate || cleanupRef.current) {
//         debugLog('Skipping empty candidate or cleanup in progress');
//         return;
//       }
  
//       const pc = peerConnectionRef.current;
//       if (!pc) {
//         debugLog('No peer connection, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//         return;
//       }
  
//       // Make sure remote description exists before adding candidates
//       if (pc.remoteDescription && pc.remoteDescription.type) {
//         debugLog('Adding ICE candidate immediately');
//         try {
//           await pc.addIceCandidate(candidate);
//           debugLog('ICE candidate added successfully');
//         } catch (err) {
//           debugLog('Failed to add ICE candidate', err);
//           // Queue the candidate for later if it fails
//           iceCandidatesQueue.current.push(candidate);
//         }
//       } else {
//         debugLog('Remote description not set, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//       }
//     } catch (error) {
//       debugLog('Error handling ICE candidate:', error);
//     }
//   };
  

//   const processQueuedCandidates = async () => {
//     const pc = peerConnectionRef.current;
//     if (!pc || !pc.remoteDescription || !pc.remoteDescription.type) {
//       debugLog('Cannot process queued candidates yet - no remote description');
//       return;
//     }
    
//     debugLog(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
//     while (iceCandidatesQueue.current.length > 0) {
//       const candidate = iceCandidatesQueue.current.shift();
//       if (candidate && candidate.candidate) {
//         try {
//           await pc.addIceCandidate(candidate);
//           debugLog('Queued ICE candidate added successfully');
//         } catch (err) {
//           debugLog('Error adding queued ICE candidate:', err);
//         }
//       }
//     }
//   };

//   const initializeCall = async () => {
//     if (hasInitializedRef.current) {
//       debugLog('Call already initialized, skipping');
//       return;
//     }
    
//     debugLog(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting call initialization');
//       return;
//     }
    
//     try {
//       setCallStatus('initiating');
      
//       // Create peer connection first
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;
  
//       // Then get local stream
//       const stream = await startLocalStream();
//       if (!stream || cleanupRef.current) {
//         debugLog('No stream available or cleanup in progress');
//         return;
//       }
  
//       debugLog('Adding local tracks to peer connection');
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== 'closed') {
//           pc.addTrack(track, stream);
//           debugLog('Added track to peer connection:', track.kind);
//         }
//       });
  
//       // IMPORTANT: Only the caller creates an offer during initialization
//       if (isCaller) {
//         await createAndSendOffer(pc);
//       }
  
//       setCallStatus('connecting');
//       hasInitializedRef.current = true;
      
//       // Debugging: Add a ping/pong to check socket connection
//       socket.emit('ping', { userId: user?._id, timestamp: new Date().toISOString() });
//     } catch (error: any) {
//       debugLog('Call initialization error:', error);
//       setError(error.message);
//       cleanup();
//     }
//   };

//   const cleanup = () => {
//     if (cleanupRef.current) return;
//     cleanupRef.current = true;
//     debugLog('Starting cleanup process');

//     if (localStream) {
//       debugLog('Stopping local tracks');
//       localStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setLocalStream(null);
//     }

//     if (remoteStream) {
//       debugLog('Stopping remote tracks');
//       remoteStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setRemoteStream(null);
//     }

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     if (peerConnectionRef.current) {
//       debugLog('Closing peer connection');
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     setCallStatus('call ended');
//     setIsVideoEnabled(false);
//     setIsAudioEnabled(false);
//     setError(null);
//     setIsReconnecting(false);
//     iceCandidatesQueue.current = [];
//     hasInitializedRef.current = false;
//   };

//   // Set up socket listeners only once
//   useEffect(() => {
//     if (socketListenersSetupRef.current) {
//       debugLog('Socket listeners already set up, skipping');
//       return;
//     }
    
//     debugLog('Setting up socket listeners...');
    
//     const setupSocketListeners = () => {
//       socket.on('ping', (data) => {
//         debugLog('Ping received:', data);
//         socket.emit('pong', { userId: user?._id, timestamp: new Date().toISOString() });
//       });
      
//       socket.on('pong', (data) => {
//         debugLog('Pong received:', data);
//       });
      
//       socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
//         debugLog('Call rejected event received', { rejectedReceiverId });
//         if (isVideoCallActive && rejectedReceiverId === receiverId) {
//           setIsVideoCallActive(false);
//           toast.error(`Call rejected by ${receiverName}`);
//           cleanup();
//         }
//       });

//       socket.on('offer', async (data) => {
//         try {
//           if (cleanupRef.current) return;
//           debugLog('Offer received', data);
          
//           // Create peer connection if it doesn't exist
//           if (!peerConnectionRef.current) {
//             debugLog('No peer connection, creating one...');
//             peerConnectionRef.current = await createPeerConnection();
            
//             // Make sure we have local media
//             const stream = await startLocalStream();
//             if (stream) {
//               stream.getTracks().forEach((track) => {
//                 peerConnectionRef.current?.addTrack(track, stream);
//               });
//             }
//           }
          
//           if (!peerConnectionRef.current) {
//             throw new Error('Failed to create peer connection for offer');
//           }
          
//           // IMPORTANT: Log the signaling state before setting remote description
//           debugLog(`Signaling state before setting remote description: ${peerConnectionRef.current.signalingState}`);
          
//           // Check if we can set the remote description based on current state
//           if (peerConnectionRef.current.signalingState === 'stable' || 
//               peerConnectionRef.current.signalingState === 'have-local-offer') {
//             debugLog('Setting remote description from offer');
//             await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            
//             // Process any queued ICE candidates right after setting remote description
//             await processQueuedCandidates();
            
//             debugLog('Creating answer');
//             const answer = await peerConnectionRef.current.createAnswer();
//             debugLog('Setting local description from answer');
//             await peerConnectionRef.current.setLocalDescription(answer);
            
//             // IMPORTANT: Add a small delay before sending the answer
//             // This helps ensure the local description is fully set
//             await new Promise(resolve => setTimeout(resolve, 500));
            
//             debugLog('Sending answer', {
//               roomId, 
//               receiverId: user?._id,
//               callerId: data.callerId, // Make sure to use the callerId from the data
//             });
            
//             socket.emit('answer', {
//               answer,
//               roomId,
//               receiverId: data.callerId, // IMPORTANT: This should be the callerId
//               callerId: user?._id,      // This should be your ID
//             });
//           } else {
//             debugLog(`Cannot set remote description in current state: ${peerConnectionRef.current.signalingState}`);
//           }
//         } catch (error) {
//           console.error('Error handling offer:', error);
//           debugLog('Error handling offer:', error);
//         }
//       });
      
  
//       socket.on('answer', async (data) => {
//         try {
//           if (cleanupRef.current) return;
//           debugLog('Answer received', data);
          
//           const pc = peerConnectionRef.current;
//           if (!pc) {
//             debugLog('No peer connection for answer');
//             throw new Error('No peer connection available');
//           }
      
//           // IMPORTANT: Check signaling state before setting remote description
//           debugLog(`Signaling state before setting remote description: ${pc.signalingState}`);
          
//           if (pc.signalingState === 'have-local-offer') {
//             debugLog('Setting remote description from answer');
//             await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            
//             // Process any queued ICE candidates immediately after
//             await processQueuedCandidates();
//             debugLog('Remote description set successfully and candidates processed');
//           } else {
//             debugLog(`Cannot set remote description in current state: ${pc.signalingState}`);
//           }
//         } catch (error) {
//           console.error('Error handling answer:', error);
//           debugLog('Error handling answer:', error);
//         }
//       });
      
  
//       socket.on('callEnded', () => {
//         debugLog('Call ended event received');
//         cleanup();
//         setIsVideoCallActive(false);
//       });
  
//       socket.on('ice-candidate', async (data) => {
//         debugLog('ICE candidate received', data);
//         if (!data.candidate || !data.candidate.candidate || cleanupRef.current) {
//           debugLog('Invalid candidate or cleanup in progress');
//           return;
//         }
        
//         try {
//           const iceCandidate = new RTCIceCandidate(data.candidate);
//           await handleIceCandidate(iceCandidate);
//         } catch (error) {
//           console.error('Error handling ICE candidate:', error);
//           debugLog('Error handling ICE candidate:', error);
//         }
//       });
//     };

//     setupSocketListeners();
//     socketListenersSetupRef.current = true;

//     return () => {
//       debugLog('Removing socket listeners');
//       socket.off('callRejected');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('callEnded');
//       socket.off('ice-candidate');
//       socket.off('ping');
//       socket.off('pong');
//     };
//   }, []); 

//   useEffect(() => {
//     debugLog('Component mounting...');
    
//     if (!user?._id) {
//       debugLog('No user ID found');
//       setError('User ID not found');
//       return;
//     }

//     cleanupRef.current = false;

//     const initializeVideoCall = async () => {
//       if (!socket.connected) {
//         debugLog('Socket disconnected, reconnecting...');
//         socket.connect();
//       }

//       if (!isCaller) {
//         debugLog('Sending acceptCall event', { roomId, callerId, receiverId: user?._id });
//         socket.emit('acceptCall', {
//           roomId,
//           callerId,
//           receiverId: user?._id,
//         });
//       }

//       debugLog('Starting call initialization');
//       try {
//         await initializeCall();
//       } catch (error) {
//         debugLog('Failed to initialize call:', error);
//         setError('Failed to initialize call');
//       }
//     };

//     initializeVideoCall();

//     // Cleanup function
//     return () => {
//       debugLog('Component unmounting...');
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
//     debugLog('Ending call', { roomId, callerId: user?._id, receiverId: isCaller ? receiverId : callerId });
//     socket.emit('endCall', {
//       roomId,
//       callerId: user?._id,
//       receiverId: isCaller ? receiverId : callerId,
//     });
//     cleanup();
//     setIsVideoCallActive(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
//       <div className="relative w-full h-full max-w-6xl mx-auto p-4">
//         <div className="relative h-full rounded-lg overflow-hidden">
//           {/* Remote Video (Full Screen) */}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//           />
          
//           {/* Local Video (Picture-in-Picture) */}
//           <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Controls */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
//             <button
//               onClick={toggleAudio}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//             >
//               {isAudioEnabled ? (
//                 <BsMic className="w-6 h-6 text-white" />
//               ) : (
//                 <BsMicMute className="w-6 h-6 text-red-500" />
//               )}
//             </button>
            
//             <button
//               onClick={endCall}
//               className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
//             >
//               <MdCallEnd className="w-6 h-6 text-white" />
//             </button>
            
//             <button
//               onClick={toggleVideo}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//             >
//               {isVideoEnabled ? (
//                 <BsCameraVideo className="w-6 h-6 text-white" />
//               ) : (
//                 <BsCameraVideoOff className="w-6 h-6 text-red-500" />
//               )}
//             </button>
//           </div>

//           {/* Caller/Receiver Name */}
//           <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
//             <p className="text-white">
//               {isCaller ? receiverName : callerName}
//             </p>
//           </div>

//           {/* Status Messages */}
//           {callStatus !== 'connected' && (
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-lg text-white text-center">
//               {callStatus === 'waiting' && <p>Waiting for connection...</p>}
//               {callStatus === 'initiating' && <p>Initiating call...</p>}
//               {callStatus === 'connecting' && <p>Connecting...</p>}
//               {callStatus === 'failed' && <p>Connection failed. Please try again.</p>}
//               {callStatus === 'call ended' && <p>Call ended</p>}
//               {error && <p className="text-red-400 mt-2">{error}</p>}
//             </div>
//           )}

//           {isReconnecting && (
//             <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-70 px-4 py-2 rounded-lg text-white">
//               Reconnecting...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;


// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
// import { MdCallEnd } from 'react-icons/md';
// import { toast } from 'react-toastify';

// interface VideoCallProps {
//   roomId: string;
//   receiverId: string;
//   receiverName: string;
//   callerId: string;
//   callerName: string;
//   isCaller?: boolean;
//   isVideoCallActive: boolean;
//   setIsVideoCallActive: (active: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({
//   roomId,
//   receiverId,
//   receiverName,
//   callerId,
//   callerName,
//   isCaller = true,
//   isVideoCallActive,
//   setIsVideoCallActive,
// }) => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [callStatus, setCallStatus] = useState<'waiting' | 'call ended' | 'initiating' | 'connecting' | 'connected' | 'failed'>('waiting');
//   const [error, setError] = useState<string | null>(null);
//   const [isReconnecting, setIsReconnecting] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
//   const cleanupRef = useRef<boolean>(false);
//   const hasInitializedRef = useRef<boolean>(false);
//   const socketListenersSetupRef = useRef<boolean>(false);
  
//   const { user } = useSelector((state: RootState) => state.auth);

//   // Using a more comprehensive set of ICE servers for better connectivity
//   const ICE_SERVERS = [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun1.l.google.com:19302' },
// {
//       urls: 'turn:openrelay.metered.ca:443?transport=tcp',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     }
//   ];

//   const debugLog = (message: string, data?: any) => {
//     const timestamp = new Date().toISOString();
//     const prefix = `[VideoCall][${timestamp}]`;
//     if (data) {
//       console.log(`${prefix} ${message}`, data);
//     } else {
//       console.log(`${prefix} ${message}`);
//     }
//   };

//   const createPeerConnection = async () => {
//     try {
//       // Close any existing peer connection first
//       if (peerConnectionRef.current) {
//         debugLog('Closing existing peer connection before creating a new one');
//         peerConnectionRef.current.close();
//       }
      
//       const pc = new RTCPeerConnection({
//         iceServers: ICE_SERVERS,
//         iceCandidatePoolSize: 10,
//       });
//       debugLog('Creating peer connection...', { isCaller });

//       pc.onicecandidate = (event) => {
//         if (event.candidate && event.candidate.candidate) {
//           debugLog('New ICE candidate:', event.candidate);
//           const targetId = isCaller ? receiverId : callerId;
//           debugLog(`Sending ICE candidate to ${targetId}`, { roomId });
          
//           socket.emit("ice-candidate", {
//             candidate: event.candidate,
//             senderId: user?._id,
//             receiverId: targetId,
//           });
//         } else {
//           debugLog('ICE candidate gathering completed');
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         debugLog('ICE Connection State changed:', pc.iceConnectionState);
//         if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
//           if (!cleanupRef.current) {
//             debugLog('Connection failed/disconnected, attempting reconnection');
//             setIsReconnecting(true);
//             handleReconnection();
//           }
//         } else if (pc.iceConnectionState === 'connected') {
//           debugLog('ICE Connection established successfully');
//           setIsReconnecting(false);
//           setCallStatus('connected');
//         }
//       };

//       pc.ontrack = (event) => {
//         debugLog('Received remote track:', { kind: event.track.kind, id: event.track.id });
//         if (event.streams && event.streams[0]) {
//           debugLog('Setting remote stream');
//           setRemoteStream(event.streams[0]);
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         }
//       };
      
//       pc.onsignalingstatechange = () => {
//         debugLog('Signaling State changed:', pc.signalingState);
//       };

//       pc.onconnectionstatechange = () => {
//         debugLog('Connection State changed:', pc.connectionState);
//         if (pc.connectionState === 'connected') {
//           debugLog('Connection established successfully');
//           setCallStatus('connected');
//         } else if (pc.connectionState === 'failed') {
//           debugLog('Connection failed');
//           setCallStatus('failed');
//           if (!cleanupRef.current) {
//             setIsReconnecting(true);
//             handleReconnection();
//           }
//         }
//       };

//       debugLog('Peer connection created successfully');
//       return pc;
//     } catch (error) {
//       console.error('Error creating peer connection:', error);
//       throw new Error('Failed to create peer connection');
//     }
//   };

//   const startLocalStream = async () => {
//     debugLog('Starting local stream...');
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting local stream start');
//       return null;
//     }
    
//     // First check if we already have a local stream
//     if (localStream && localStream.active) {
//       debugLog('Using existing local stream');
//       return localStream;
//     }
    
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       debugLog('Local stream obtained:', {
//         videoTracks: stream.getVideoTracks().length,
//         audioTracks: stream.getAudioTracks().length
//       });

//       if (localVideoRef.current && !cleanupRef.current) {
//         localVideoRef.current.srcObject = stream;
//         localVideoRef.current.muted = true;
//         debugLog('Local video element configured');
//       }

//       setLocalStream(stream);
//       return stream;
//     } catch (error: any) {
//       console.error('Media access error:', error);
//       let errorMessage = 'Cannot access camera or microphone';

//       if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
//         errorMessage = 'Please grant camera and microphone permissions and try again';
//       } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
//         errorMessage = 'Camera or microphone not found. Please check your device connections';
//       } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
//         errorMessage = 'Camera or microphone is already in use by another application';
//       }

//       setError(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

//   const createAndSendOffer = async (pc: RTCPeerConnection) => {
//     try {
//       debugLog('Creating offer...');
//       const offer = await pc.createOffer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: true,
//       });
      
//       debugLog('Setting local description from offer');
//       await pc.setLocalDescription(offer);
      
//       // Wait a short delay to ensure the local description is set
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       debugLog('Sending offer', { roomId, receiverId, callerId: user?._id });
//       socket.emit('offer', {
//         offer,
//         roomId,
//         receiverId,
//         callerId: user?._id
//       });
//     } catch (error) {
//       console.error('Error creating or sending offer:', error);
//       debugLog('Error creating or sending offer:', error);
//       throw new Error('Failed to create or send offer');
//     }
//   };

//   const handleReconnection = async () => {
//     if (cleanupRef.current) return;
    
//     debugLog('Attempting to reconnect...');
//     try {
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;

//       if (localStream) {
//         localStream.getTracks().forEach((track) => {
//           pc.addTrack(track, localStream);
//         });
//       }

//       if (isCaller) {
//         await createAndSendOffer(pc);
//       }
//     } catch (error) {
//       console.error('Reconnection failed:', error);
//       setError('Connection failed. Please try again.');
//     }
//   };

//   const handleIceCandidate = async (candidate: RTCIceCandidate) => {
//     debugLog('Handling ICE candidate:', candidate);
//     try {
//       if (!candidate.candidate || cleanupRef.current) {
//         debugLog('Skipping empty candidate or cleanup in progress');
//         return;
//       }
  
//       const pc = peerConnectionRef.current;
//       if (!pc) {
//         debugLog('No peer connection, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//         return;
//       }
  
//       // Make sure remote description exists before adding candidates
//       if (pc.remoteDescription && pc.remoteDescription.type) {
//         debugLog('Adding ICE candidate immediately');
//         try {
//           await pc.addIceCandidate(candidate);
//           debugLog('ICE candidate added successfully');
//         } catch (err) {
//           debugLog('Failed to add ICE candidate', err);
//           // Queue the candidate for later if it fails
//           iceCandidatesQueue.current.push(candidate);
//         }
//       } else {
//         debugLog('Remote description not set, queueing candidate');
//         iceCandidatesQueue.current.push(candidate);
//       }
//     } catch (error) {
//       debugLog('Error handling ICE candidate:', error);
//     }
//   };
  
//   const processQueuedCandidates = async () => {
//     const pc = peerConnectionRef.current;
//     if (!pc || !pc.remoteDescription || !pc.remoteDescription.type) {
//       debugLog('Cannot process queued candidates yet - no remote description');
//       return;
//     }
    
//     debugLog(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
//     while (iceCandidatesQueue.current.length > 0) {
//       const candidate = iceCandidatesQueue.current.shift();
//       if (candidate && candidate.candidate) {
//         try {
//           await pc.addIceCandidate(candidate);
//           debugLog('Queued ICE candidate added successfully');
//         } catch (err) {
//           debugLog('Error adding queued ICE candidate:', err);
//         }
//       }
//     }
//   };

//   const initializeCall = async () => {
//     if (hasInitializedRef.current) {
//       debugLog('Call already initialized, skipping');
//       return;
//     }
    
//     debugLog(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
//     if (cleanupRef.current) {
//       debugLog('Cleanup in progress, aborting call initialization');
//       return;
//     }
    
//     try {
//       setCallStatus('initiating');
      
//       // Create peer connection first
//       const pc = await createPeerConnection();
//       peerConnectionRef.current = pc;
  
//       // Then get local stream
//       const stream = await startLocalStream();
//       if (!stream || cleanupRef.current) {
//         debugLog('No stream available or cleanup in progress');
//         return;
//       }
  
//       debugLog('Adding local tracks to peer connection');
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== 'closed') {
//           pc.addTrack(track, stream);
//           debugLog('Added track to peer connection:', track.kind);
//         }
//       });
  
//       // Only the caller creates an offer during initialization
//       if (isCaller) {
//         await createAndSendOffer(pc);
//       }
  
//       setCallStatus('connecting');
//       hasInitializedRef.current = true;
      
//       // Debugging: Add a ping/pong to check socket connection
//       socket.emit('ping', { userId: user?._id, timestamp: new Date().toISOString() });
//     } catch (error: any) {
//       debugLog('Call initialization error:', error);
//       setError(error.message);
//       cleanup();
//     }
//   };

//   const cleanup = () => {
//     if (cleanupRef.current) return;
//     cleanupRef.current = true;
//     debugLog('Starting cleanup process');

//     if (localStream) {
//       debugLog('Stopping local tracks');
//       localStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setLocalStream(null);
//     }

//     if (remoteStream) {
//       debugLog('Stopping remote tracks');
//       remoteStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//       setRemoteStream(null);
//     }

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     if (peerConnectionRef.current) {
//       debugLog('Closing peer connection');
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }

//     setCallStatus('call ended');
//     setIsVideoEnabled(false);
//     setIsAudioEnabled(false);
//     setError(null);
//     setIsReconnecting(false);
//     iceCandidatesQueue.current = [];
//     hasInitializedRef.current = false;
//   };

//   // Set up socket listeners only once
//   useEffect(() => {
//     if (socketListenersSetupRef.current) {
//       debugLog('Socket listeners already set up, skipping');
//       return;
//     }
    
//     debugLog('Setting up socket listeners...');
    
//     const handleOffer = async (data: any) => {
//       try {
//         if (cleanupRef.current) return;
//         debugLog('Offer received', data);
        
//         // Create peer connection if it doesn't exist
//         if (!peerConnectionRef.current) {
//           debugLog('No peer connection, creating one...');
//           peerConnectionRef.current = await createPeerConnection();
          
//           // Make sure we have local media
//           const stream = await startLocalStream();
//           if (stream) {
//             stream.getTracks().forEach((track) => {
//               peerConnectionRef.current?.addTrack(track, stream);
//             });
//           }
//         }
        
//         if (!peerConnectionRef.current) {
//           throw new Error('Failed to create peer connection for offer');
//         }
        
//         // Log the signaling state before setting remote description
//         debugLog(`Signaling state before setting remote description: ${peerConnectionRef.current.signalingState}`);
        
//         // Check if we can set the remote description based on current state
//         if (peerConnectionRef.current.signalingState === 'stable' || 
//             peerConnectionRef.current.signalingState === 'have-local-offer') {
//           debugLog('Setting remote description from offer');
//           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          
//           // Process any queued ICE candidates
//           await processQueuedCandidates();
          
//           debugLog('Creating answer');
//           const answer = await peerConnectionRef.current.createAnswer();
//           debugLog('Setting local description from answer');
//           await peerConnectionRef.current.setLocalDescription(answer);
          
//           // Add a small delay before sending the answer
//           await new Promise(resolve => setTimeout(resolve, 500));
          
//           debugLog('Sending answer', {
//             roomId, 
//             receiverId: data.callerId,
//             callerId: user?._id,
//           });
          
//           socket.emit('answer', {
//             answer,
//             roomId,
//             receiverId: data.callerId,
//             callerId: user?._id,
//           });
//         } else {
//           debugLog(`Cannot set remote description in current state: ${peerConnectionRef.current.signalingState}`);
//         }
//       } catch (error) {
//         console.error('Error handling offer:', error);
//         debugLog('Error handling offer:', error);
//       }
//     };

//     const handleAnswer = async (data: any) => {
//       try {
//         if (cleanupRef.current) return;
//         debugLog('Answer received', data);
        
//         const pc = peerConnectionRef.current;
//         if (!pc) {
//           debugLog('No peer connection for answer');
//           throw new Error('No peer connection available');
//         }
    
//         // Check signaling state before setting remote description
//         debugLog(`Signaling state before setting remote description: ${pc.signalingState}`);
        
//         if (pc.signalingState === 'have-local-offer') {
//           debugLog('Setting remote description from answer');
//           await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          
//           // Process any queued ICE candidates immediately after
//           await processQueuedCandidates();
//           debugLog('Remote description set successfully and candidates processed');
//         } else {
//           debugLog(`Cannot set remote description in current state: ${pc.signalingState}`);
//         }
//       } catch (error) {
//         console.error('Error handling answer:', error);
//         debugLog('Error handling answer:', error);
//       }
//     };

//     const handleIceCandidate = async (data: any) => {
//       debugLog('ICE candidate received', data);
//       if (!data.candidate || !data.candidate.candidate || cleanupRef.current) {
//         debugLog('Invalid candidate or cleanup in progress');
//         return;
//       }
      
//       try {
//         const iceCandidate = new RTCIceCandidate(data.candidate);
//         await handleIceCandidate(iceCandidate);
//       } catch (error) {
//         console.error('Error handling ICE candidate:', error);
//         debugLog('Error handling ICE candidate:', error);
//       }
//     };
    
//     const setupSocketListeners = () => {
//       socket.on('ping', (data) => {
//         debugLog('Ping received:', data);
//         socket.emit('pong', { userId: user?._id, timestamp: new Date().toISOString() });
//       });
      
//       socket.on('pong', (data) => {
//         debugLog('Pong received:', data);
//       });
      
//       socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
//         debugLog('Call rejected event received', { rejectedReceiverId });
//         if (isVideoCallActive && rejectedReceiverId === receiverId) {
//           setIsVideoCallActive(false);
//           toast.error(`Call rejected by ${receiverName}`);
//           cleanup();
//         }
//       });

//       socket.on('offer', handleOffer);
//       socket.on('answer', handleAnswer);
      
//       socket.on('callEnded', () => {
//         debugLog('Call ended event received');
//         cleanup();
//         setIsVideoCallActive(false);
//       });
  
//       socket.on('ice-candidate', handleIceCandidate);
//     };

//     setupSocketListeners();
//     socketListenersSetupRef.current = true;

//     return () => {
//       debugLog('Removing socket listeners');
//       socket.off('callRejected');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('callEnded');
//       socket.off('ice-candidate');
//       socket.off('ping');
//       socket.off('pong');
//     };
//   }, [user?._id, receiverId, receiverName, roomId, callerId, isVideoCallActive, setIsVideoCallActive]); 

//   useEffect(() => {
//     debugLog('Component mounting...');
    
//     if (!user?._id) {
//       debugLog('No user ID found');
//       setError('User ID not found');
//       return;
//     }

//     cleanupRef.current = false;

//     const initializeVideoCall = async () => {
//       if (!socket.connected) {
//         debugLog('Socket disconnected, reconnecting...');
//         socket.connect();
//       }

//       if (!isCaller) {
//         debugLog('Sending acceptCall event', { roomId, callerId, receiverId: user?._id });
//         socket.emit('acceptCall', {
//           roomId,
//           callerId,
//           receiverId: user?._id,
//         });
//       }

//       debugLog('Starting call initialization');
//       try {
//         await initializeCall();
//       } catch (error) {
//         debugLog('Failed to initialize call:', error);
//         setError('Failed to initialize call');
//       }
//     };

//     initializeVideoCall();



//     // Cleanup function
//     return () => {
//       debugLog('Component unmounting...');
//       cleanup();
//     };
//   }, [user?._id, isCaller, roomId, callerId, receiverId]); 

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
//     debugLog('Ending call', { roomId, callerId: user?._id, receiverId: isCaller ? receiverId : callerId });
//     socket.emit('endCall', {
//       roomId,
//       callerId: user?._id,
//       receiverId: isCaller ? receiverId : callerId,
//     });
//     cleanup();
//     setIsVideoCallActive(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
//       <div className="relative w-full h-full max-w-6xl mx-auto p-4">
//         <div className="relative h-full rounded-lg overflow-hidden">
//           {/* Remote Video (Full Screen) */}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className={`w-full h-full object-cover ${remoteStream ? '' : 'hidden'}`}
//           />
          
//           {/* Local Video (Picture-in-Picture) */}
//           <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Controls */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
//             <button
//               onClick={toggleAudio}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//               aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
//             >
//               {isAudioEnabled ? (
//                 <BsMic className="w-6 h-6 text-white" />
//               ) : (
//                 <BsMicMute className="w-6 h-6 text-red-500" />
//               )}
//             </button>
            
//             <button
//               onClick={endCall}
//               className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
//               aria-label="End call"
//             >
//               <MdCallEnd className="w-6 h-6 text-white" />
//             </button>
            
//             <button
//               onClick={toggleVideo}
//               className="p-3 rounded-full hover:bg-gray-700 transition-colors"
//               aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
//             >
//               {isVideoEnabled ? (
//                 <BsCameraVideo className="w-6 h-6 text-white" />
//               ) : (
//                 <BsCameraVideoOff className="w-6 h-6 text-red-500" />
//               )}
//             </button>
//           </div>

//           {/* Caller/Receiver Name */}
//           <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
//             <p className="text-white">
//               {isCaller ? receiverName : callerName}
//             </p>
//           </div>

//           {/* Status Messages */}
//           {callStatus !== 'connected' && (
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-lg text-white text-center">
//               {callStatus === 'waiting' && <p>Waiting for connection...</p>}
//               {callStatus === 'initiating' && <p>Initiating call...</p>}
//               {callStatus === 'connecting' && <p>Connecting...</p>}
//               {callStatus === 'failed' && <p>Connection failed. Please try again.</p>}
//               {callStatus === 'call ended' && <p>Call ended</p>}
//               {error && <p className="text-red-400 mt-2">{error}</p>}
//             </div>
//           )}

//           {isReconnecting && (
//             <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-70 px-4 py-2 rounded-lg text-white">
//               Reconnecting...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

// import React, { useEffect, useRef, useState } from 'react';
// import { socket } from '../../../services/socket';
// import { IoMdMic, IoMdMicOff } from 'react-icons/io';
// import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
// import { MdCallEnd } from 'react-icons/md';

// interface VideoCallProps {
//   roomId: string;
//   receiverId: string;
//   receiverName: string;
//   callerId: string;
//   callerName: string;
//   isCaller: boolean;
//   isVideoCallActive: boolean;
//   setIsVideoCallActive: (active: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({
//   roomId,
//   receiverId,
//   receiverName,
//   callerId,
//   callerName,
//   isCaller,
//   isVideoCallActive,
//   setIsVideoCallActive,
// }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
  
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
//   const [callTimer, setCallTimer] = useState<number>(0);
//   const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
//   const [isConnectionEstablished, setIsConnectionEstablished] = useState<boolean>(false);

//   // Create peer connection only once
//   const createPeerConnection = () => {
//     if (peerConnectionRef.current) {
//       console.log('Peer connection already exists, reusing it');
//       return peerConnectionRef.current;
//     }

//     try {
//       console.log('Creating new peer connection');
//       const configuration: RTCConfiguration = {
//         iceServers: [
//           { urls: 'stun:stun.l.google.com:19302' },
//           { urls: 'stun:stun1.l.google.com:19302' },
//           { urls: 'stun:stun2.l.google.com:19302' },
//         ],
//       };

//       const peerConnection = new RTCPeerConnection(configuration);
      
//       peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log('Sending ICE candidate');
//           socket.emit('ice-candidate', {
//             receiverId: isCaller ? receiverId : callerId,
//             candidate: event.candidate,
//             senderId: isCaller ? callerId : receiverId,
//           });
//         }
//       };

//       peerConnection.ontrack = (event) => {
//         console.log('Received remote track');
//         if (remoteVideoRef.current && event.streams && event.streams[0]) {
//           remoteVideoRef.current.srcObject = event.streams[0];
//           setConnectionStatus('Connected');
//           setIsConnectionEstablished(true);
//           startCallTimer();
//         }
//       };

//       peerConnection.oniceconnectionstatechange = () => {
//         console.log('ICE connection state:', peerConnection.iceConnectionState);
//         if (peerConnection.iceConnectionState === 'disconnected' || 
//             peerConnection.iceConnectionState === 'failed') {
//           setConnectionStatus('Connection lost. Trying to reconnect...');
//         } else if (peerConnection.iceConnectionState === 'connected') {
//           setConnectionStatus('Connected');
//           setIsConnectionEstablished(true);
//         }
//       };

//       peerConnectionRef.current = peerConnection;
//       return peerConnection;
//     } catch (error) {
//       console.error('Error creating peer connection:', error);
//       setConnectionStatus('Failed to create connection');
//       return null;
//     }
//   };

//   const startCallTimer = () => {
//     if (timerInterval) clearInterval(timerInterval);
//     setCallTimer(0);
//     const interval = setInterval(() => {
//       setCallTimer(prev => prev + 1);
//     }, 1000);
//     setTimerInterval(interval);
//   };

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const setupMediaStream = async () => {
//     try {
//       // If we already have a stream, reuse it
//       if (localStreamRef.current) {
//         console.log('Reusing existing media stream');
//         return localStreamRef.current;
//       }

//       console.log('Requesting media permissions');
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       localStreamRef.current = stream;
      
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       return stream;
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setConnectionStatus('Failed to access camera/microphone');
//       return null;
//     }
//   };

//   const setupCall = async () => {
//     console.log('Setting up call, isCaller:', isCaller);
    
//     try {
//       // First get our media stream
//       const stream = await setupMediaStream();
//       if (!stream) {
//         console.error('Failed to set up media stream');
//         return;
//       }

//       // Then create peer connection
//       const peerConnection = createPeerConnection();
//       if (!peerConnection) {
//         console.error('Failed to create peer connection');
//         return;
//       }

//       // Add all tracks to the peer connection
//       stream.getTracks().forEach(track => {
//         console.log('Adding track to peer connection:', track.kind);
//         peerConnection.addTrack(track, stream);
//       });

//       // Only create offer if we're the caller and only once
//       if (isCaller && !isConnectionEstablished) {
//         try {
//           console.log('Creating offer as caller');
//           const offer = await peerConnection.createOffer();
//           await peerConnection.setLocalDescription(offer);
          
//           console.log('Sending offer to receiver');
//           socket.emit('offer', {
//             offer,
//             roomId,
//             receiverId,
//             callerId,
//           });
//         } catch (error) {
//           console.error('Error creating offer:', error);
//           setConnectionStatus('Failed to create call offer');
//         }
//       }
//     } catch (error) {
//       console.error('Error in setupCall:', error);
//       setConnectionStatus('Call setup failed');
//     }
//   };

//   const handleEndCall = () => {
//     console.log('Ending call');
    
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => {
//         track.stop();
//         console.log(`Stopped ${track.kind} track`);
//       });
//       localStreamRef.current = null;
//     }
    
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//       console.log('Closed peer connection');
//     }

//     socket.emit('endCall', {
//       roomId,
//       callerId,
//       receiverId,
//     });

//     if (timerInterval) {
//       clearInterval(timerInterval);
//       setTimerInterval(null);
//     }
    
//     setIsConnectionEstablished(false);
//     setIsVideoCallActive(false);
//   };

//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       const audioTracks = localStreamRef.current.getAudioTracks();
//       audioTracks.forEach(track => {
//         track.enabled = !track.enabled;
//         console.log(`Audio ${track.enabled ? 'unmuted' : 'muted'}`);
//       });
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTracks = localStreamRef.current.getVideoTracks();
//       videoTracks.forEach(track => {
//         track.enabled = !track.enabled;
//         console.log(`Video ${track.enabled ? 'enabled' : 'disabled'}`);
//       });
//       setIsVideoOff(!isVideoOff);
//     }
//   };

//   // Handle socket events and call setup
//   useEffect(() => {
//     console.log('VideoCall component mounted, isVideoCallActive:', isVideoCallActive);
    
//     // Setup call if active
//     if (isVideoCallActive) {
//       setupCall().catch(err => {
//         console.error('Failed to setup call:', err);
//         setConnectionStatus('Call setup failed');
//       });
//     }

//     const handleOffer = async ({ offer , roomId: incomingRoomId, callerId: incomingCallerId }) => {
//       console.log('Received offer from caller', { incomingRoomId, actualRoomId: roomId });
      
//       // Check if we are the intended receiver
//       if (incomingRoomId === roomId && !isCaller) {
//         try {
//           console.log('Processing offer as receiver');
          
//           // Get media stream first
//           const stream = await setupMediaStream();
//           if (!stream) return;
          
//           // Create or get peer connection
//           const peerConnection = createPeerConnection();
//           if (!peerConnection) return;
          
//           // Add our tracks to the peer connection
//           stream.getTracks().forEach(track => {
//             peerConnection.addTrack(track, stream);
//           });
          
//           // Set remote description (the offer)
//           console.log('Setting remote description (offer)');
//           await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          
//           // Create and set the answer
//           console.log('Creating answer');
//           const answer = await peerConnection.createAnswer();
//           await peerConnection.setLocalDescription(answer);
          
//           // Send the answer back to the caller
//           console.log('Sending answer to caller');
//           socket.emit('answer', {
//             answer,
//             roomId,
//             receiverId,
//             callerId: incomingCallerId
//           });
//         } catch (error) {
//           console.error('Error processing offer:', error);
//         }
//       }
//     };
    
    

//     // Handle answer from receiver
//     const handleAnswer = async ({ answer, roomId: incomingRoomId }) => {
//       console.log('Received answer from receiver', { roomId: incomingRoomId, actualRoomId: roomId });
      
//       if (isCaller && incomingRoomId === roomId && peerConnectionRef.current) {
//         try {
//           console.log('Setting remote description (answer)');
//           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//           console.log('Remote description set successfully');
//         } catch (error) {
//           console.error('Error setting remote description:', error);
//           setConnectionStatus('Failed to establish connection');
//         }
//       }
//     };

//     // Handle ICE candidate
//     const handleIceCandidate = async ({ senderId, candidate }) => {
//       console.log('Received ICE candidate from', senderId);
      
//       if (peerConnectionRef.current) {
//         try {
//           console.log('Adding ICE candidate');
//           await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//           console.log('ICE candidate added successfully');
//         } catch (error) {
//           console.error('Error adding ICE candidate:', error);
//         }
//       } else {
//         console.warn('Received ICE candidate but peer connection is not ready');
//       }
//     };

//     // Handle call ended
//     const handleCallEnded = () => {
//       console.log('Received callEnded event');
      
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach(track => {
//           track.stop();
//           console.log(`Stopped ${track.kind} track`);
//         });
//         localStreamRef.current = null;
//       }
      
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//         peerConnectionRef.current = null;
//         console.log('Closed peer connection');
//       }
      
//       if (timerInterval) {
//         clearInterval(timerInterval);
//         setTimerInterval(null);
//       }
      
//       setIsConnectionEstablished(false);
//       setIsVideoCallActive(false);
//     };


//     socket.on('offer', handleOffer);
//     socket.on('answer', handleAnswer);
//     socket.on('ice-candidate', handleIceCandidate);
//     socket.on('callEnded', handleCallEnded);

//     // Cleanup on unmount
//     return () => {
//       console.log('VideoCall component unmounting');
      
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach(track => track.stop());
//         localStreamRef.current = null;
//       }
      
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//         peerConnectionRef.current = null;
//       }
      
//       if (timerInterval) {
//         clearInterval(timerInterval);
//         setTimerInterval(null);
//       }
      
//       // Remove socket listeners
//       socket.off('offer', handleOffer);
//       socket.off('answer', handleAnswer);
//       socket.off('ice-candidate', handleIceCandidate);
//       socket.off('callEnded', handleCallEnded);
      
//       console.log('VideoCall cleanup complete');
//     };
//   }, [isVideoCallActive, roomId, callerId, receiverId, isCaller]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
//       <div className="w-full max-w-4xl mx-auto p-4 relative h-full flex flex-col">
//         {/* Status bar */}
//         <div className="bg-gray-800 text-white p-2 rounded-t-lg flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
//             <span>{connectionStatus}</span>
//           </div>
//           <div className="text-center font-mono">{formatTime(callTimer)}</div>
//           <div>{isCaller ? `Call with ${receiverName}` : `Call with ${callerName}`}</div>
//         </div>
        
//         {/* Video container */}
//         <div className="flex-1 bg-gray-900 relative flex justify-center items-center overflow-hidden">
//           {/* Remote video (full screen) */}
//           <video 
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//           />
          
//           {/* Local video (picture-in-picture) */}
//           <div className="absolute bottom-4 right-4 w-1/4 max-w-xs">
//             <video 
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full rounded-lg shadow-lg border-2 border-white"
//             />
//           </div>
//         </div>
        
//         {/* Controls */}
//         <div className="bg-gray-800 p-4 rounded-b-lg flex justify-center space-x-6">
//           <button 
//             onClick={toggleMute}
//             className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
//           >
//             {isMuted ? <IoMdMicOff size={24} /> : <IoMdMic size={24} />}
//           </button>
          
//           <button 
//             onClick={handleEndCall}
//             className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
//           >
//             <MdCallEnd size={24} />
//           </button>
          
//           <button 
//             onClick={toggleVideo}
//             className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
//           >
//             {isVideoOff ? <BsCameraVideoOff size={24} /> : <BsCameraVideo size={24} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

import React, { useEffect, useRef, useState } from 'react';
import { IoMdCall, IoMdMic, IoMdMicOff } from 'react-icons/io';
import { MdVideocamOff, MdCallEnd } from 'react-icons/md';
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';

interface VideoCallProps {

  receiverName: string;
  callerName: string;
  isCaller: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  handleEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({

  receiverName,
  callerName,
  isCaller,
  localStream,
  remoteStream,
  handleEndCall
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [callTimer, setCallTimer] = useState(0);

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  // Set up local video
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    
    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, [localStream]);
  
  // Set up remote video
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      setConnectionStatus('Connected');
    } else {
      setConnectionStatus('Connecting...');
    }
    
    return () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [remoteStream]);

  // Toggle Mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(prev => !prev);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoOff(prev => !prev);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-auto p-4 relative h-full flex flex-col">
        {/* Status bar */}
        <div className="bg-gray-800 text-white p-2 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span>{connectionStatus}</span>
          </div>
          <div className="text-center font-mono">{formatTime(callTimer)}</div>
          <div>{isCaller ? `Call with ${receiverName}` : `Call with ${callerName}`}</div>
        </div>
        
        {/* Video container */}
        <div className="flex-1 bg-gray-900 relative flex justify-center items-center overflow-hidden">
          {/* Remote video (full screen) */}
          <video 
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-xs">
            <video 
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg shadow-lg border-2 border-white"
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4 rounded-b-lg flex justify-center space-x-6">
          <button 
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
          >
            {isMuted ? <IoMdMicOff size={24} /> : <IoMdMic size={24} />}
          </button>
          
          <button 
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <MdCallEnd size={24} />
          </button>
          
          <button 
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
          >
            {isVideoOff ? <BsCameraVideoOff size={24} /> : <BsCameraVideo size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
