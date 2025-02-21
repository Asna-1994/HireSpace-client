// usePeerConnection.tsx
import { useRef, useState } from 'react';
import { socket } from '../../services/socket';
const usePeerConnection = (ICE_SERVERS: RTCIceServer[], roomId: string, userId: string, isCaller: boolean, receiverId: string, callerId: string) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const createPeerConnection = async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      pc.onicecandidate = (event) => {
        if (event.candidate && event.candidate.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            senderId: userId,
            receiverId: isCaller ? receiverId : callerId,
            roomId,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          setIsReconnecting(true);
        } else if (pc.iceConnectionState === 'connected') {
          setIsReconnecting(false);
        }
      };

      pc.ontrack = (event) => {
        if (event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw new Error('Failed to create peer connection');
    }
  };

  return {
    peerConnectionRef,
    createPeerConnection,
    remoteStream,
    isReconnecting,
  };
};

export default usePeerConnection;
