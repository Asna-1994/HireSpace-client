// // useVideoCall.tsx
// import { useEffect, useState } from 'react';
// import { socket } from '../../services/socket';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';

// const useVideoCall = (
//   roomId: string,
//   isCaller: boolean,
//   callerId: string,
//   receiverId: string
// ) => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  
//   const { user } = useSelector((state: RootState) => state.auth);
  

//   const getLocalMedia = async (): Promise<MediaStream | null> => {
//     const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
//       if (permissions.state === 'denied') {
//         console.error('Media device permissions are denied.');
//         return null;
//       }
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       return stream;
//     } catch (error : any) {
//       console.error('Error accessing media devices:', error);
  
//       // Retry after a delay if the error is due to permission delays
//       if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
//         console.log('Retrying to access media devices...');
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
//         return getLocalMedia(); // Retry
//       }
  
//       return null;
//     }
//   };

//   const checkMediaDevices = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const hasVideo = devices.some((device) => device.kind === 'videoinput');
//     const hasAudio = devices.some((device) => device.kind === 'audioinput');
  
//     if (!hasVideo) {
//       console.error('No video input device found.');
//       alert('No camera found. Please connect a camera and try again.');
//     }
//     if (!hasAudio) {
//       console.error('No audio input device found.');
//       alert('No microphone found. Please connect a microphone and try again.');
//     }
  
//     return hasVideo && hasAudio;
//   };
//   const createPeerConnection = async (stream: MediaStream | null = null) => {
//     // Use the passed stream or the current localStream
//     const mediaStream = stream || localStream;
    
//     if (!mediaStream) {
//       console.error('No media stream available');
//       return null;
//     }
    
//     const pc = new RTCPeerConnection({
//         iceServers: [
//           { urls: 'stun:stun.l.google.com:19302' },
//           { urls: 'stun:stun1.l.google.com:19302' },
//           { urls: 'stun:stun2.l.google.com:19302' },
//           {
//             urls: 'turn:relay.metered.ca:80',
//             username: 'open',
//             credential: 'open',
//           },
//         ],
//         iceCandidatePoolSize: 10
//       });
      
    
//     // Add all tracks from local stream to peer connection
//     mediaStream.getTracks().forEach(track => {
//       pc.addTrack(track, mediaStream);
//     });
    
//     // Handle ICE candidates
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         const targetId = isCaller ? receiverId : callerId;
//         socket.emit('signal', {
//           roomId,
//           signalData: { type: 'candidate', candidate: event.candidate },
//           senderId: user?._id,
//           receiverId: targetId,
//         });
//       }
//     };
    
//     // Handle incoming tracks (remote stream)
//     pc.ontrack = (event) => {
//       console.log('Received remote track', event.streams[0]);
//       setRemoteStream(event.streams[0]);
//     };
    
//     pc.oniceconnectionstatechange = () => {
//         console.log('ICE connection state:', pc.iceConnectionState);
//         if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
//           console.warn('ICE connection failed or disconnected, attempting restart');
//           pc.restartIce();
//         }
//       };

//     setPeerConnection(pc);
//     return pc;
//   };
  

  
//   return {
//     getLocalMedia,
//     createPeerConnection,
//     peerConnection,
//     localStream,
//     remoteStream,
//     setRemoteStream,
//     checkMediaDevices,
//     setLocalStream,
//     setPeerConnection,

//   };
// };

// export default useVideoCall;

import { useEffect, useState, useCallback } from 'react';
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

  // Clean up function to properly stop all tracks and close connections
  const cleanupMediaAndConnection = useCallback(() => {
    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      setLocalStream(null);
    }

    // Close and reset peer connection
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    // Clear remote stream
    setRemoteStream(null);
  }, [localStream, peerConnection]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanupMediaAndConnection();
    };
  }, [cleanupMediaAndConnection]);

  const checkMediaDevices = async () => {
    try {
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
    } catch (error) {
      console.error('Error checking media devices:', error);
      return false;
    }
  };

  const getLocalMedia = async (): Promise<MediaStream | null> => {
    try {
      // First, check if we already have a stream and release it
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
        setLocalStream(null);
      }
      
      // Check permissions
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'denied') {
        console.error('Media device permissions are denied.');
        return null;
      }

      // Get new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      console.log('Local media obtained:', stream.id);
      console.log('Video tracks:', stream.getVideoTracks().length);
      console.log('Audio tracks:', stream.getAudioTracks().length);
      
      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error('Error accessing media devices:', error);
    
      // Handle specific errors
      if (error.name === 'NotAllowedError') {
        alert('Camera and microphone access was denied. Please allow access and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('Camera or microphone not found. Please check your device connections.');
      } else if (error.name === 'NotReadableError') {
        alert('Your camera or microphone is already in use by another application.');
        // Try to release any existing tracks that might be causing the conflict
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
          setLocalStream(null);
        }
      }
      
      return null;
    }
  };

  const createPeerConnection = async (stream: MediaStream | null = null) => {
    try {
      // Clean up any existing peer connection
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
      
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
        
      // Create a new remote stream to collect incoming tracks
      const newRemoteStream = new MediaStream();
      setRemoteStream(newRemoteStream);
      
      // Add all tracks from local stream to peer connection
      mediaStream.getTracks().forEach(track => {
        console.log(`Adding local ${track.kind} track to peer connection`);
        pc.addTrack(track, mediaStream);
      });
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const targetId = isCaller ? receiverId : callerId;
          console.log(`Sending ICE candidate to ${targetId}`);
          socket.emit('signal', {
            roomId,
            signalData: { type: 'candidate', candidate: event.candidate },
            senderId: user?._id,
            receiverId: targetId,
          });
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state changed:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          console.log('Peers connected successfully!');
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
          console.warn(`Connection state is ${pc.connectionState}`);
        }
      };
      
      // Handle signaling state changes
      pc.onsignalingstatechange = () => {
        console.log('Signaling state changed:', pc.signalingState);
      };
      
      // Handle ICE connection state changes
      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          console.warn('ICE connection failed or disconnected, attempting restart');
          pc.restartIce();
        }
      };
      
      // Handle incoming tracks
      pc.ontrack = (event) => {
        console.log(`Received remote ${event.track.kind} track`, event.streams[0]);
        
        // Add the track to our remote stream
        event.track.onunmute = () => {
          console.log(`Remote ${event.track.kind} track unmuted`);
        };
        
        // Add this track to our remote stream
        if (newRemoteStream) {
          newRemoteStream.addTrack(event.track);
          setRemoteStream(newRemoteStream);
        }
      };
      
      setPeerConnection(pc);
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
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
    cleanupMediaAndConnection
  };
};

export default useVideoCall;