
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

    //   stream.getVideoTracks().forEach(track => {
    //     console.log("Video track enabled:", track.enabled);
    //     track.enabled = true;
    //   });
      setLocalStream(stream);
      return stream;
    } catch (error : any) {
      console.error('Error accessing media devices:', error);
  

      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        console.log('Retrying to access media devices...');
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        return getLocalMedia();
      }
  
      return null;
    }
  };

  // const getLocalMedia = async (): Promise<MediaStream | null> => {
  //       const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
  //     if (permissions.state === 'denied') {
  //       console.error('Media device permissions are denied.');
  //       return null;
  //     }
  //   try {
  //     // Try to get audio first
  //     const audioStream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: false,
  //     });
      
  //     console.log('Audio stream obtained with tracks:', audioStream.getAudioTracks().length);
      
  //     // Then get video
  //     const videoStream = await navigator.mediaDevices.getUserMedia({
  //       audio: false,
  //       video: true,
  //     });
      
  //     console.log('Video stream obtained with tracks:', videoStream.getVideoTracks().length);
      
  //     // Combine the streams
  //     const combinedStream = new MediaStream();
  //     audioStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
  //     videoStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      
  //     setLocalStream(combinedStream);
  //     return combinedStream;
  //   } catch (error) {
  //     console.error('Error accessing media devices:', error);
  //     return null;
  //   }
  // };

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

    const mediaStream = stream || localStream;
    
    if (!mediaStream) {
      console.error('No media stream available');
      return null;
    }
    
    // const pc = new RTCPeerConnection({
    //     iceServers: [
    //       { urls: 'stun:stun.l.google.com:19302' },
    //       { urls: 'stun:stun1.l.google.com:19302' },
    //       { urls: 'stun:stun2.l.google.com:19302' },
    //       {
    //         urls: 'turn:relay.metered.ca:80',
    //         username: 'open',
    //         credential: 'open',
    //       },
    //       {
    //         urls: 'turn:relay.metered.ca:443',
    //         username: 'open',
    //         credential: 'open'
    //     },
    //     ],
    //     iceCandidatePoolSize: 10
    //   });
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:bn-turn2.xirsys.com"]
        },
        {
          username: "TstkFU9F3BwhexDPcXNqjmG7RkGjIK5o8cSiuWA_JQGf0oSJRTY7GrQp7nomaBEAAAAAAGgXEaNBc25hVlQ=",
          credential: "1c888474-28b6-11f0-89ec-0242ac140004",
          urls: [
            "turn:bn-turn2.xirsys.com:80?transport=udp",
            "turn:bn-turn2.xirsys.com:3478?transport=udp",
            "turn:bn-turn2.xirsys.com:80?transport=tcp",
            "turn:bn-turn2.xirsys.com:3478?transport=tcp",
            "turns:bn-turn2.xirsys.com:443?transport=tcp",
            "turns:bn-turn2.xirsys.com:5349?transport=tcp"
          ]
        }
      ],
      iceCandidatePoolSize: 10
    });
    
    

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
    // pc.ontrack = (event) => {
    //   console.log('Received remote track', event.streams[0]);
    //   setRemoteStream(event.streams[0]);
    // };
    // pc.ontrack = (event) => {
    //   console.log('Received remote track', event.streams[0]);
      
    //   // Log specific audio track information
    //   const audioTracks = event.streams[0].getAudioTracks();
    //   console.log('Remote audio tracks:', audioTracks.length);
      
    //   audioTracks.forEach(track => {
    //     console.log('Remote audio track:', track.id, 'enabled:', track.enabled);
    //     // Ensure track is enabled
    //     track.enabled = true;
    //   });
      
    //   setRemoteStream(event.streams[0]);
    // };
    pc.ontrack = (event) => {
      console.log('Received remote track', event.streams[0]);
      
      // Create a new stream to ensure we're handling the tracks properly
      const newRemoteStream = new MediaStream();
      
      // Add all tracks from the event streams to our new stream
      event.streams.forEach(stream => {
        stream.getTracks().forEach(track => {
          console.log(`Adding remote track to stream: ${track.kind}, ${track.id}`);
          newRemoteStream.addTrack(track);
          
          // Ensure track is enabled, especially for audio
          track.enabled = true;
        });
      });
      
      // Log specific audio track information
      const audioTracks = newRemoteStream.getAudioTracks();
      console.log('Remote audio tracks:', audioTracks.length);
      
      audioTracks.forEach(track => {
        console.log('Remote audio track:', track.id, 'enabled:', track.enabled);
        // Double check track is enabled
        track.enabled = true;
      });
      
      setRemoteStream(newRemoteStream);
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