// useVideoCall.tsx
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const useVideoCall = (
  roomId: string,
  isCaller: boolean,
  callerId: string,
  receiverId: string
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const getLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  };

  const createPeerConnection = async (stream: MediaStream | null = null) => {
    // Use the passed stream or the current localStream
    const mediaStream = stream || localStream;
    
    if (!mediaStream) {
      console.error('No media stream available');
      return null;
    }
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN server if available for reliable connections
      ],
    });
    
    // Add all tracks from local stream to peer connection
    mediaStream.getTracks().forEach(track => {
      pc.addTrack(track, mediaStream);
    });
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const targetId = isCaller ? receiverId : callerId;
        socket.emit('signal', {
          roomId,
          signalData: { type: 'candidate', candidate: event.candidate },
          senderId: user?._id,
          receiverId: targetId,
        });
      }
    };
    
    // Handle incoming tracks (remote stream)
    pc.ontrack = (event) => {
      console.log('Received remote track', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };
    
    setPeerConnection(pc);
    return pc;
  };
  

  
  return {
    getLocalMedia,
    createPeerConnection,
    peerConnection,
    localStream,
    remoteStream,
    setRemoteStream,
    setLocalStream,
    setPeerConnection,

  };
};

export default useVideoCall;