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

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [callTimer, setCallTimer] = useState(0);

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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-auto p-4 relative h-full flex flex-col">
        {/* Status bar */}
        <div className="bg-gray-800 text-white p-2 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}
            ></div>
            <span>{connectionStatus}</span>
          </div>
          <div className="text-center font-mono">{formatTime(callTimer)}</div>
          <div>
            {isCaller ? `Call with ${receiverName}` : `Call with ${callerName}`}
          </div>
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
          {/* <div className="absolute bottom-4 right-4 w-1/4 max-w-xs">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg shadow-lg border-2 border-white"
            />
          </div> */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-xs" style={{zIndex: 10}}>
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
