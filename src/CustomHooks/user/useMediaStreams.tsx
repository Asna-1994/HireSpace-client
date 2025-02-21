// useMediaStream.tsx
import { useEffect, useState } from 'react';

const useMediaStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Media access error:', error);
      throw new Error('Cannot access camera or microphone');
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsVideoEnabled((prev) => !prev);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsAudioEnabled((prev) => !prev);
    }
  };

  return {
    localStream,
    startLocalStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
  };
};

export default useMediaStream;
