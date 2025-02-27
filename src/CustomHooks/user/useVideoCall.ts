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
  

  const getLocalMedia = async (): Promise<MediaStream | null> => {
    const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'denied') {
        console.error('Media device permissions are denied.');
        return null;
      }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return stream;
    } catch (error : any) {
      console.error('Error accessing media devices:', error);
  
      // Retry after a delay if the error is due to permission delays
      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        console.log('Retrying to access media devices...');
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        return getLocalMedia(); // Retry
      }
  
      return null;
    }
  };

  const checkMediaDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some((device) => device.kind === 'videoinput');
    const hasAudio = devices.some((device) => device.kind === 'audioinput');
  
    if (!hasVideo) {
      console.error('No video input device found.');
      alert('No camera found. Please connect a camera and try again.');
    }
    if (!hasAudio) {
      console.error('No audio input device found.');
      alert('No microphone found. Please connect a microphone and try again.');
    }
  
    return hasVideo && hasAudio;
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
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          {
            urls: 'turn:relay.metered.ca:80',
            username: 'open',
            credential: 'open',
          },
        ],
        iceCandidatePoolSize: 10
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
    
    pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          console.warn('ICE connection failed or disconnected, attempting restart');
          pc.restartIce();
        }
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
    checkMediaDevices,
    setLocalStream,
    setPeerConnection,

  };
};

export default useVideoCall;