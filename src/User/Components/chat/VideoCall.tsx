import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../../services/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';

interface VideoCallProps {
  roomId: string;
  receiverId: string;
  receiverName: string;
  callerId : string;
  callerName : string
  onEndCall: () => void;
  isCaller?: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  roomId, 
  receiverId, 
  onEndCall, 
  isCaller = true,
  receiverName 
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'waiting' | 'initiating' | 'connecting' | 'connected' | 'failed'>('waiting');
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const debugLog = (message: string, data?: any) => {
    console.log(`[VideoCall][${isCaller ? 'Caller' : 'Receiver'}][${Date.now()}] ${message}`, data || '');
  };

  const createPeerConnection = async () => {
    try {
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
          }
        ],
        iceCandidatePoolSize: 10,
        iceTransportPolicy: 'all',
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
      };
  
      const pc = new RTCPeerConnection(configuration);
      
      // Add logging for connection state changes
      pc.oniceconnectionstatechange = () => {
        debugLog('ICE Connection State:', pc.iceConnectionState);
      };
  
      pc.onicegatheringstatechange = () => {
        debugLog('ICE Gathering State:', pc.iceGatheringState);
      };
  
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          debugLog('Sending ICE candidate', event.candidate);
          socket.emit('videoSignal', {
            roomId,
            userId: user?._id,
            targetUserId: receiverId,
            type: 'ice-candidate',
            data: event.candidate,
          });
        }
      };
  
      pc.onconnectionstatechange = () => {
        debugLog('Connection state changed:', pc.connectionState);
        switch (pc.connectionState) {
          case 'connected':
            setCallStatus('connected');
            break;
          case 'disconnected':
          case 'failed':
            setCallStatus('failed');
            setError('Connection lost');
            break;
          case 'closed':
            cleanup();
            break;
        }
      };
  
      pc.ontrack = (event) => {
        debugLog('Received remote track');
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStream(event.streams[0]);
          setCallStatus('connected');
        }
      };
  
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setError('Failed to create peer connection');
      return null;
    }
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error('Error accessing media devices:', error);
      setError(
        error.name === 'NotAllowedError'
          ? 'Camera/Microphone access denied. Please check your permissions.'
          : 'Cannot access camera or microphone'
      );
      return null;
    }
  };

  const initializeCall = async () => {
    try {
      setCallStatus('initiating');
      debugLog('Initializing call as caller');
  
      const stream = await startLocalStream();
      if (!stream) {
        throw new Error('Failed to get local stream');
      }
  
      const pc = await createPeerConnection();
      if (!pc) {
        throw new Error('Failed to create peer connection');
      }
      peerConnectionRef.current = pc;
  
      stream.getTracks().forEach(track => {
        debugLog('Adding track to peer connection:', track.kind);
        pc.addTrack(track, stream);
      });
  
      // Only create and send offer if this is the caller
      if (isCaller) {
        debugLog('Creating offer');
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          iceRestart: true
        });
    
        debugLog('Setting local description');
        await pc.setLocalDescription(offer);
    
        debugLog('Sending offer to remote peer');
        socket.emit('videoSignal', {
          roomId,
          userId: user?._id,
          targetUserId: receiverId,
          type: 'offer',
          data: offer,
        });
      }
  
      setCallStatus('waiting');
    } catch (error) {
      console.error('Error initializing call:', error);
      setError('Failed to start call');
      cleanup();
    }
  };



  const handleVideoSignal = async (signal: any) => {
    try {
      debugLog('Received video signal:', signal.type);
      const pc = peerConnectionRef.current;
      if (!pc) {
        throw new Error('No peer connection available');
      }
  
      switch (signal.type) {
        case 'offer':
          debugLog('Processing offer');
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          debugLog('Sending answer');
          socket.emit('videoSignal', {
            roomId,
            userId: user?._id,
            targetUserId: signal.userId,
            type: 'answer',
            data: answer,
          });
          break;
  
        case 'answer':
          debugLog('Processing answer');
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
          break;
  
        case 'ice-candidate':
          debugLog('Processing ICE candidate');
          if (signal.data && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.data));
          }
          break;
      }
    } catch (error) {
      console.error('Error handling video signal:', error);
      setError('Connection error occurred');
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };





useEffect(() => {
    socket.on('videoSignal', handleVideoSignal);
    socket.on('callEnded', () => {
      debugLog('Call ended by remote peer');
      cleanup();
      onEndCall();
    });

    // Handle incoming call differently based on caller/receiver role
    if (isCaller) {
      initializeCall();
    } else {
      // For receiver, first accept the call
      socket.emit('acceptCall', { 
        roomId, 
        accepterId: user?._id 
      });
      // Then initialize media streams and peer connection
      initializeCall();
    }

    return () => {
      socket.off('videoSignal');
      socket.off('callEnded');
      cleanup();
    };
  }, []);



  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endCall = () => {
    socket.emit('endCall', { 
      roomId, 
      userId: user?._id,
      targetUserId: receiverId 
    });
    cleanup();
    onEndCall();
  };

  return (
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
                {callStatus === 'waiting' && `Calling ${receiverName}...`}
                {callStatus === 'initiating' && 'Starting call...'}
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'connected' && 'Connected'}
                {callStatus === 'failed' && 'Connection failed'}
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
                  {receiverName}
                </span>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={toggleVideo}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoEnabled ? <BsCameraVideo size={24} /> : <BsCameraVideoOff size={24} />}
              </button>
              <button
                onClick={toggleAudio}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
                title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {isAudioEnabled ? <BiMicrophone size={24} /> : <BiMicrophoneOff size={24} />}
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
  );
};

export default VideoCall;







