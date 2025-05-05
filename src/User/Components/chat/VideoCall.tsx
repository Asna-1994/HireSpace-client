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
  handleEndCall,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [callTimer, setCallTimer] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };




useEffect(() => {
  console.log("Local stream in VideoCall:", localStream ? "exists" : "null");
  console.log("Local video ref:", localVideoRef.current ? "exists" : "null");
  
  if (localStream && localVideoRef.current) {
    console.log("Setting local video source object");
    localVideoRef.current.srcObject = localStream;
    
    // Add this check
    localVideoRef.current.onloadedmetadata = () => {
      console.log("Local video metadata loaded, starting playback");
      localVideoRef.current?.play().catch(e => console.error("Error playing local video:", e));
    };
  }

  return () => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };
}, [localStream]);

  // Set up remote video
  // useEffect(() => {
  //   if (remoteStream && remoteVideoRef.current) {
  //     remoteVideoRef.current.srcObject = remoteStream;
  //     remoteVideoRef.current.muted = false; 
  //     remoteVideoRef.current.volume = 1.0;  //
  //     setConnectionStatus('Connected');
  //   } else {
  //     setConnectionStatus('Connecting...');
  //   }

  //   return () => {
  //     if (remoteVideoRef.current) {
  //       remoteVideoRef.current.srcObject = null;
  //     }
  //   };
  // }, [remoteStream]);


  useEffect(() => {
    console.log("Remote stream updated:", remoteStream ? "exists" : "null");
    
    if (remoteStream && remoteVideoRef.current) {
      console.log("Setting remote video source object");
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.muted = false; // Make sure not muted
      remoteVideoRef.current.volume = 1.0;  // Set volume to max
      
      // Also add a separate audio element for the remote stream
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.volume = 1.0;
      }
      
      // Handle metadata loaded event for remote video
      remoteVideoRef.current.onloadedmetadata = () => {
        console.log("Remote video metadata loaded, starting playback");
        // Attempt to play the video
        remoteVideoRef.current?.play()
          .then(() => {
            console.log("Remote video playback started successfully");
            setConnectionStatus('Connected');
            setAudioEnabled(true);
          })
          .catch(error => {
            console.error("Error starting remote video playback:", error);
            // If autoplay is blocked, we need user interaction
            setConnectionStatus('Connected (Click to enable audio)');
          });
      };
      
      // Also try to play the audio element
      if (remoteAudioRef.current) {
        remoteAudioRef.current.onloadedmetadata = () => {
          remoteAudioRef.current?.play()
            .then(() => console.log("Remote audio playback started"))
            .catch(error => console.error("Error starting remote audio playback:", error));
        };
      }
    } else {
      setConnectionStatus('Connecting...');
    }

    // Monitor audio tracks
    if (remoteStream) {
      const audioTracks = remoteStream.getAudioTracks();
      console.log(`Remote stream has ${audioTracks.length} audio tracks`);
      
      audioTracks.forEach(track => {
        console.log(`Audio track: ${track.id}, enabled: ${track.enabled}, muted: ${track.muted}, readyState: ${track.readyState}`);
        
        // Make sure the track is enabled
        if (!track.enabled) {
          track.enabled = true;
          console.log(`Enabled audio track ${track.id}`);
        }
      });
    }

    return () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    };
  }, [remoteStream]);

  

  const enableAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.play()
        .then(() => {
          console.log("Audio enabled via user interaction");
          setAudioEnabled(true);
          setConnectionStatus('Connected');
        })
        .catch(err => console.error("Failed to enable audio:", err));
    }
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.play()
        .catch(err => console.error("Failed to play audio element:", err));
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (localStream) {
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff((prev) => !prev);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
      <div className="relative flex flex-col w-full h-full max-w-4xl p-4 mx-auto">
        {/* Status bar */}
        <div className="flex items-center justify-between p-2 text-white bg-gray-800 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}
            ></div>
            <span>{connectionStatus}</span>
            {!audioEnabled && connectionStatus.includes('Click') && (
              <button 
                onClick={enableAudio}
                className="px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Enable Audio
              </button>
            )}
          </div>
          <div className="font-mono text-center">{formatTime(callTimer)}</div>
          <div>
            {isCaller ? `Call with ${receiverName}` : `Call with ${callerName}`}
          </div>
        </div>

        {/* Video container */}
        <div className="relative flex items-center justify-center flex-1 overflow-hidden bg-gray-900">
          {/* Remote video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full"
          />

<audio ref={remoteAudioRef} autoPlay />
          {/* Local video (picture-in-picture) */}
          {/* <div className="absolute w-1/4 max-w-xs bottom-4 right-4">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full border-2 border-white rounded-lg shadow-lg"
            />
          </div> */}
          <div className="absolute w-1/4 max-w-xs bottom-4 right-4" style={{zIndex: 10}}>
  <video
    ref={localVideoRef}
    autoPlay
    playsInline
    muted
    className="w-full border-2 border-white rounded-lg shadow-lg"
  />
</div>
        </div>

        {/* Controls */}
        <div className="flex justify-center p-4 space-x-6 bg-gray-800 rounded-b-lg">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
          >
            {isMuted ? <IoMdMicOff size={24} /> : <IoMdMic size={24} />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
          >
            <MdCallEnd size={24} />
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-500 transition-colors`}
          >
            {isVideoOff ? (
              <BsCameraVideoOff size={24} />
            ) : (
              <BsCameraVideo size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
