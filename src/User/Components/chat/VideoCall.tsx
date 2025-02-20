import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../../services/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import { toast } from 'react-toastify';

interface ICECandidate {
  candidate: string;
  sdpMid: string;
  sdpMLineIndex: number;
}


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
  const [callStatus, setCallStatus] = useState<
    | 'waiting'
    | 'call ended'
    | 'initiating'
    | 'connecting'
    | 'connected'
    | 'failed'
  >('waiting');
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const ICE_SERVERS = [
    // Public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.sipgate.net' },
 
    
    // Public TURN servers (some may require authentication)
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },

  ];
  

  const createPeerConnection = async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceCandidatePoolSize: 10,
      });


      pc.onicecandidate = (event) => {
        // Skip empty candidates
        if (event.candidate && event.candidate.candidate) {
          console.log("Emitting ICE candidate:", event.candidate);
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            senderId: user?._id,
            receiverId: isCaller ? receiverId : callerId,
            roomId,
          });
        } else {
          console.log("Skipping empty ICE candidate or gathering completed");
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE Connection State:', pc.iceConnectionState);
        if (
          pc.iceConnectionState === 'failed' ||
          pc.iceConnectionState === 'disconnected'
        ) {
          setIsReconnecting(true);
          handleReconnection();
        } else if (pc.iceConnectionState === 'connected') {
          setIsReconnecting(false);
          setCallStatus('connected');
        }
      };


      

      pc.ontrack = (event) => {
        if (event.streams[0]) {
          console.log('Received remote track:', event.track.kind);
          setRemoteStream(event.streams[0]);

          // Directly set the stream to avoid React state timing issues
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current
              .play()
              .catch((err) => console.error('Play error:', err));
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
      const existingStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = existingStream;
      }

      setLocalStream(existingStream);
      return existingStream;
    } catch (error: any) {
      console.error('Media access error:', error);
      let errorMessage = 'Cannot access camera or microphone';

      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        errorMessage =
          'Please grant camera and microphone permissions and try again';
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        errorMessage =
          'Camera or microphone not found. Please check your device connections';
      } else if (
        error.name === 'NotReadableError' ||
        error.name === 'TrackStartError'
      ) {
        errorMessage =
          'Camera or microphone is already in use by another application';
      }

      throw new Error(errorMessage);
    }
  };

  const handleReconnection = async () => {
    try {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      const pc = await createPeerConnection();
      peerConnectionRef.current = pc;

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

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
    } catch (error) {
      console.error('Reconnection failed:', error);
      setError('Connection failed. Please try again.');
    }
  };

  // const initializeCall = async () => {
  //   try {
  //     console.log(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
  //     setCallStatus('initiating');
      
  //     const pc = await createPeerConnection();
  //     peerConnectionRef.current = pc;
  //     console.log('Peer connection created');
  
  //     const stream = await startLocalStream();
  //     console.log('Local stream obtained');
  
  //     stream.getTracks().forEach((track) => {
  //       if (pc.signalingState !== 'closed') {
  //         pc.addTrack(track, stream);
  //       }
  //     });
  
  //     if (isCaller) {
  //       console.log('Creating offer...');
  //       const offer = await pc.createOffer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       });
  //       console.log('Setting local description (offer)');
  //       await pc.setLocalDescription(offer);
        
  //       console.log('Sending offer signal to:', receiverId);
  //       socket.emit('videoSignal', {
  //         roomId,
  //         callerId: user?._id,
  //         receiverId,
  //         type: 'offer',
  //         data: offer,
  //       });
  //     }
  
  //     setCallStatus('connecting');
  //   } catch (error: any) {
  //     console.error('Call initialization error:', error);
  //     setError(error.message);
  //     cleanup();
  //   }
  // };

  // const handleIceCandidate = async (candidate: RTCIceCandidate) => {
  //   try {
  //     console.log('Handling ICE candidate');
  //     const pc = peerConnectionRef.current;
  //     if (!pc) {
  //       console.log('No peer connection, queuing candidate');
  //       iceCandidatesQueue.current.push(candidate);
  //       return;
  //     }
  
  //     if (pc.remoteDescription && pc.remoteDescription.type) {
  //       console.log('Remote description set, adding candidate immediately');
  //       await pc.addIceCandidate(candidate);
  //     } else {
  //       console.log('Remote description not set, queuing candidate');
  //       iceCandidatesQueue.current.push(candidate);
  //     }
  //   } catch (error) {
  //     console.error('Error handling ICE candidate:', error);
  //   }
  // };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      console.log('Handling ICE candidate:', candidate);
      const pc = peerConnectionRef.current;
      
      // Skip empty candidates
      if (!candidate.candidate) {
        console.log('Skipping empty candidate');
        return;
      }
  
      if (!pc) {
        console.log('No peer connection, queuing candidate');
        iceCandidatesQueue.current.push(candidate);
        return;
      }
  
      if (pc.remoteDescription && pc.remoteDescription.type) {
        console.log('Remote description set, adding candidate immediately');
        await pc.addIceCandidate(candidate);
      } else {
        console.log('Remote description not set, queuing candidate');
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };
  const initializeCall = async () => {
    try {
      console.log(`Initializing call as ${isCaller ? 'caller' : 'receiver'}`);
      setCallStatus('initiating');
      
      const pc = await createPeerConnection();
      peerConnectionRef.current = pc;
      console.log('Peer connection created');
  
      const stream = await startLocalStream();
      console.log('Local stream obtained');
  
      stream.getTracks().forEach((track) => {
        if (pc.signalingState !== 'closed') {
          pc.addTrack(track, stream);
        }
      });
  
      if (isCaller) {
        console.log('Creating offer...');
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        console.log('Setting local description (offer)');
        await pc.setLocalDescription(offer);
        
        console.log('Sending offer');
        socket.emit('offer', {
          offer,
          roomId,
          receiverId
        });
      }
  
      setCallStatus('connecting');
    } catch (error: any) {
      console.error('Call initialization error:', error);
      setError(error.message);
      cleanup();
    }
  };
  // In VideoCall component:




  const cleanup = () => {
    // Stop all tracks in both streams
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      setRemoteStream(null);
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Close and cleanup peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset all states
    setCallStatus('call ended');
    setIsVideoEnabled(false);
    setIsAudioEnabled(false);
    setError(null);
    setIsReconnecting(false);
    iceCandidatesQueue.current = [];

    // Request permission cleanup
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: false })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      })
      .catch(() => {});

    console.log('Cleanup completed');
  };

  useEffect(() => {
    if (!user?._id) {
      setError('User ID not found');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

  // if (localStream) {
  //   localStream.getAudioTracks().forEach((track) => {
  //     track.enabled = isAudioEnabled;
  //   });
  // }

    socket.on('callRejected', ({ receiverId: rejectedReceiverId }) => {
      if (isVideoCallActive && rejectedReceiverId === receiverId) {
        setIsVideoCallActive(false);
        setIsCaller(false);
        toast.error(`Call rejected by ${receiverName}`);
        cleanup();
      }
    });


    socket.on('ice-candidate-received', ({ candidateId, receiverId }) => {
      console.log('ICE candidate received acknowledgment:', { candidateId, receiverId });
    });
  
    // Handle incoming offer
// Update the offer handling to process queued candidates
socket.on('offer', async (offer) => {
  try {
    console.log('Received offer');
    const pc = peerConnectionRef.current;
    if (!pc) throw new Error('No peer connection available');

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    // Process any queued ICE candidates after setting remote description
    console.log(`Processing ${iceCandidatesQueue.current.length} queued candidates`);
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      if (candidate && candidate.candidate) {
        console.log('Processing queued candidate:', candidate);
        await pc.addIceCandidate(candidate);
      }
    }
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socket.emit('answer', {
      answer,
      roomId,
      callerId
    });
  } catch (error) {
    console.error('Error handling offer:', error);
  }
});


    
socket.on('answer', async (answer) => {
  try {
    console.log('Received answer');
    const pc = peerConnectionRef.current;
    if (!pc) throw new Error('No peer connection available');

    await pc.setRemoteDescription(new RTCSessionDescription(answer));

    // Process any queued ICE candidates after setting remote description
    console.log(`Processing ${iceCandidatesQueue.current.length} queued candidates`);
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      if (candidate && candidate.candidate) {
        console.log('Processing queued candidate:', candidate);
        await pc.addIceCandidate(candidate);
      }
    }
  } catch (error) {
    console.error('Error handling answer:', error);
  }
});

    socket.on('callEnded', () => {
      cleanup();
      onEndCall();
      setCallStatus('call ended');
    });


    socket.on('ice-candidate', async ({ candidate, senderId }) => {
      console.log('Received ICE candidate from:', senderId, candidate);
      if (!candidate || !candidate.candidate) {
        console.log('Skipping empty ICE candidate');
        return;
      }
      
      try {
        const iceCandidate = new RTCIceCandidate(candidate);
        await handleIceCandidate(iceCandidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });

    // initializeCall();

    if (!isCaller) {
      socket.emit('acceptCall', {
        roomId,
        callerId,
        receiverId: user?._id,
      });
    }

    initializeCall().catch(error => {
      console.error('Failed to initialize call:', error);
      setError('Failed to initialize call');
    });
    return () => {
      // socket.off('videoSignal');
      socket.off('callEnded');
      socket.off('ice-candidate');
      socket.off('callRejected');
      socket.off('offer');
      socket.off('answer');

      socket.off('ice-candidate-received');
      cleanup();
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
    cleanup();
    onEndCall();
    setIsVideoCallActive(false);
    setIsCaller(false);
  };

  return (
    <>
       <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-6xl mx-auto p-4">
        <div className="relative h-full rounded-lg overflow-hidden">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              // muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
            <button
              onClick={toggleAudio}
              className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isAudioEnabled ? (
                <BsMic className="w-6 h-6 text-white" />
              ) : (
                <BsMicMute className="w-6 h-6 text-red-500" />
              )}
            </button>
            
            <button
              onClick={endCall}
              className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <MdCallEnd className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={toggleVideo}
              className="p-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              {isVideoEnabled ? (
                <BsCameraVideo className="w-6 h-6 text-white" />
              ) : (
                <BsCameraVideoOff className="w-6 h-6 text-red-500" />
              )}
            </button>
          </div>

          {/* Caller/Receiver Name */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <p className="text-white">
              {isCaller ? receiverName : callerName}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default VideoCall;
