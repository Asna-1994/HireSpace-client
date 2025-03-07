


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connectSocket, socket } from '../../../services/socket';
import { Message } from '../../../Utils/Interfaces/interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';
import { BsCameraVideo } from 'react-icons/bs';
import VideoCall from './VideoCall';
import useVideoCall from '../../../CustomHooks/user/useVideoCall';
import ringTone from '../../../assets/sounds/marimba_soft.mp3';
import { toast } from 'react-toastify';


let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

const ChatComponent: React.FC = () => {
  const location = useLocation();
  const { receiver } = location.state || {};

  const { roomId, receiverId, receiverName } = useParams<{
    roomId: string;
    receiverId: string;
    receiverName: string;
  }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [callerName, setCallerName] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isCaller, setIsCaller] = useState(false);
  const dispatch = useDispatch();
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [remoteDescription, setRemoteDescription] =
    useState<RTCSessionDescriptionInit | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isRingtonePlaying, setIsRingtonePlaying] = useState(false);
  const {
    getLocalMedia,
    createPeerConnection,
    peerConnection,
    localStream,
    remoteStream,
    setRemoteStream,
    setLocalStream,
    setPeerConnection,
    checkMediaDevices
  } = useVideoCall(roomId!, isCaller, callerId, receiverId!);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          
    
          fetch(ringTone)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext!.decodeAudioData(arrayBuffer))
            .then(buffer => {
              audioBuffer = buffer;
            })
            .catch(error => console.error('Error loading audio:', error));
        } catch (e) {
          console.error('Web Audio API is not supported in this browser', e);
        }
      }
      

      document.removeEventListener('click', initAudioContext);
      document.removeEventListener('keydown', initAudioContext);
      setHasUserInteracted(true);
    };
    

    document.addEventListener('click', initAudioContext);
    document.addEventListener('keydown', initAudioContext);
    
    return () => {
      document.removeEventListener('click', initAudioContext);
      document.removeEventListener('keydown', initAudioContext);
      

      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);


  const playRingtone = useCallback(() => {
    if (isRingtonePlaying) return;
    
    setIsRingtonePlaying(true);
    

    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          console.log('Ringtone playing via HTML Audio');
        })
        .catch(error => {
          console.log('Could not play audio via HTML Audio:', error);
          

          if (audioContext && audioBuffer) {
            try {
         
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.loop = true;
              source.connect(audioContext.destination);
              source.start();
              
          
              (window as any).currentRingtoneSource = source;
              console.log('Ringtone playing via Web Audio API');
            } catch (e) {
              console.error('Failed to play ringtone with Web Audio API:', e);
              
  
              toast.info("Incoming call! Please interact with the page to hear ringtone.", {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          } else {
      
            toast.info("Incoming call! Click anywhere to enable audio.", {
              position: "top-center",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
    }
  }, [isRingtonePlaying]);


  const stopRingtone = useCallback(() => {
    setIsRingtonePlaying(false);
    

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    

    if ((window as any).currentRingtoneSource) {
      try {
        (window as any).currentRingtoneSource.stop();
        (window as any).currentRingtoneSource.disconnect();
        (window as any).currentRingtoneSource = null;
      } catch (e) {
        console.error('Error stopping Web Audio source:', e);
      }
    }
    

    toast.dismiss();
  }, []);




  const cleanupCall = useCallback(() => {
    if (peerConnection) {
  
      peerConnection.close();
      setPeerConnection(null);
    }
    
    if (localStream) {

      localStream.getTracks().forEach((track) => {
        track.stop();
        localStream.removeTrack(track);
      });
      setLocalStream(null);
    }
    
    if (remoteStream) {
      // Also clean up remote stream tracks
      remoteStream.getTracks().forEach((track) => {
        track.stop();
        remoteStream.removeTrack(track);
      });
      setRemoteStream(null);
    }
    
    // Reset all call-related states
    setIsVideoCallActive(false);
    setIsCaller(false);
    setIncomingCall(false);
    setRemoteDescription(null); // Important to reset this too
    stopRingtone();
  }, [peerConnection, localStream, remoteStream, stopRingtone]);


  const handleAcceptCall = useCallback(async () => {
    try {
      stopRingtone();

      if (!remoteDescription) {
        console.error('No remote description available.');
        return;
      }
      const devicesAvailable = await checkMediaDevices();
      if (!devicesAvailable){
        console.log('no device available ')
        return
      }
      
      // Get media first
      const stream = await getLocalMedia();
      if (!stream) {
        console.error('Failed to get local media stream');
        return;
      }

      // Create peer connection with the stream
      const pc = await createPeerConnection(stream);
      if (!pc) {
        console.error('Failed to create peer connection');
        return;
      }

      console.log('Setting remote description from stored offer');
      await pc.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      console.log('Creating answer');
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('Sending answer');
      socket.emit('signal', {
        roomId,
        signalData: { type: 'answer', answer },
        senderId: user?._id,
        receiverId: callerId,
      });

      setIsVideoCallActive(true);
      setIncomingCall(false);
      setIsCaller(false);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  }, [
    remoteDescription,
    roomId,
    callerId,
    user?._id,
    getLocalMedia,
    createPeerConnection,
    stopRingtone
  ]);

  const handleRejectCall = () => {
    stopRingtone();

    socket.emit('rejectCall', {
      roomId,
      callerId,
      receiverName : user?.userName,
      receiverId: user?._id,
    });
    setIncomingCall(false);
  };


  
  useEffect(() => {
    if (socket) {
      socket.on('incomingCall', ({ roomId, callerId, callerName }) => {
        console.log('Incoming call received:');
        setIncomingCall(true);
        setCallerId(callerId);
        setCallerName(callerName);

    
        playRingtone();
      
        toast.info(`Incoming call from ${callerName}`, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('incomingCall');
      }
    };
  }, [socket, playRingtone]);

  useEffect(() => {
    const handleSignal = async (data: any) => {
      const { signalData, senderId } = data;

      // Handle offer without a peer connection by storing it for later
      if (signalData.type === 'offer') {
        console.log('Received offer, storing for when call is accepted');
        setRemoteDescription(signalData.offer);
        return;
      }

      // For other signal types, we need a peer connection
      if (!peerConnection) {
        console.log(
          'No peer connection available for signal:',
          signalData.type
        );
        return;
      }

      try {
        switch (signalData.type) {
          case 'answer':
            console.log('Received answer');
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(signalData.answer)
            );
            break;

          case 'candidate':
            console.log('Received ICE candidate');
            if (peerConnection.remoteDescription) {
              await peerConnection.addIceCandidate(
                new RTCIceCandidate(signalData.candidate)
              );
            } else {
              console.log('Skipping ICE candidate - no remote description yet');
            }
            break;

          default:
            console.error('Unknown signal type:', signalData.type);
        }
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    };

    socket.on('signal', handleSignal);

    return () => {
      socket.off('signal', handleSignal);
    };
  }, [peerConnection, roomId, callerId, user?._id]);

  useEffect(() => {
    if (socket) {
      socket.on('callEnded', () => {
        cleanupCall();
        toast.info("Call Ended.", {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('callEnded');
      }
    };
  }, [peerConnection, localStream, cleanupCall]);
  
  useEffect(() => {
    if (roomId) {
      if (!socket.connected) {
        connectSocket();
      }

      if (socket && user?._id) {
        socket.emit('registerUser', user._id);
      }

      socket.emit('joinChat', { senderId: user?._id, receiverId });

      const unreadMessages = messages.filter(
        (msg) => msg.status !== 'read' && msg.senderId !== user?._id
      );
      unreadMessages.forEach((message) => {
        if (message && message._id) {
          socket.emit('readMessage', { messageId: message._id, roomId });
        } else {
          console.warn('Attempted to mark message without ID as read');
        }
      });
socket.on('chatHistory', ({ roomId: joinedRoomId, chatHistory }) => {


      if (joinedRoomId === roomId) {
        const sortedMessages = [...chatHistory].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        setMessages(sortedMessages);
        scrollToBottom();

        chatHistory.forEach((message : Message) => {
          if (message.status !== 'read' && message.senderId !== user?._id && message._id) {
            socket.emit('readMessage', { messageId: message._id, roomId });
          }
        });
        

        socket.emit('getUnreadCount', { userId: user?._id });
      }
    });


socket.on('message', (message: Message) => {
  setMessages((prev) => [...prev, message]);
  scrollToBottom();

  if (message.senderId !== user?._id && message._id) {
    socket.emit('readMessage', { messageId: message._id, roomId });
    

    socket.emit('getUnreadCount', { userId: user?._id });
  }
});

      socket.on('messageRead', ({ messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      });

      socket.on('callAccepted', ({ receiverId, answer }) => {
        console.log('Call accepted by:', receiverId);
        if (user?._id !== receiverId) {
          setIsVideoCallActive(true);
        }
      });

      socket.on('callRejected', ({ receiverId, receiverName }) => {
        toast.info(`Call Rejected by ${ receiverName}`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        });
        setIsVideoCallActive(false);
        setIsCaller(false);
      });

      return () => {
        socket.off('chatHistory');
        socket.off('message');
        socket.off('messageRead');
        socket.off('callAccepted');
        socket.off('callRejected');
      };
    }
  }, [roomId, user?._id, cleanupCall]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message: Message = {
        roomId: roomId || '',
        senderId: user?._id || '',
        receiverId: receiverId || '',
        content: newMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      };

      setNewMessage('');

      socket.emit('message', message, (error: any) => {
        if (error) {
          console.error('Error sending message:', error);
        }
      });
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, userId: user?._id });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageDate = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year:
          messageDate.getFullYear() !== today.getFullYear()
            ? 'numeric'
            : undefined,
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const handleInitiateCall = async () => {
    try {
      const stream = await getLocalMedia();
      console.log('local media', stream)
      if (!stream)
      {
        console.error("Failed to get local media stream");
        return;
      }
  

      console.log("Stream video tracks:", stream.getVideoTracks().length);
      console.log("First video track enabled:", stream.getVideoTracks()[0]?.enabled);
      const pc = await createPeerConnection(stream);
      if (!pc) return;

      // Create an offer
      const offer = await pc.createOffer();
      console.log('Offer created:');
      await pc.setLocalDescription(offer);

      socket.emit('signal', {
        roomId,
        signalData: { type: 'offer', offer },
        senderId: user?._id,
        receiverId: receiverId,
      });
      console.log('Offer send from caller ');
      socket.emit('initiateVideoCall', {
        roomId,
        callerId: user?._id,
        callerName: user?.userName,
        receiverId,
        receiverName: receiver.userName,
      });

      setIsVideoCallActive(true);
      setIsCaller(true);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const handleEndCall = () => {
    cleanupCall();
    socket.emit('endCall', { roomId, callerId: user?._id, receiverId });
    setIsVideoCallActive(false);
    setIsCaller(false);
    setIncomingCall(false);
  };
  
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 overflow-hidden">
          <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Chat Header */}
            <div className="flex justify-between px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center space-x-4">
                {receiver?.profilePhoto?.url ? (
                  <img
                    src={receiver?.profilePhoto?.url}
                    alt={receiver?.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full">
                    {receiver?.userName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {receiver.userName}
                  </h2>
                  <p className="text-sm text-gray-500">{receiver.tagLine}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={handleInitiateCall}
                  className="p-2 rounded-full bg-black text-white hover:bg-blue-600"
                >
                  <BsCameraVideo size={24} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
              <div className="space-y-6">
                {Object.entries(groupMessagesByDate(messages)).map(
                  ([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex justify-center">
                        <span className="px-4 py-1 bg-gray-200 rounded-full text-sm text-gray-600">
                          {date}
                        </span>
                      </div>
                      {dateMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex flex-col ${message.senderId === user?._id ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-end gap-2 group">
                              <div
                                className={`relative px-4 py-2 rounded-2xl max-w-md break-words ${
                                  message.senderId === user?._id
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                              >
                                {message.content}
                              </div>
                              {message.senderId === user?._id && (
                                <div className="flex items-center space-x-1">
                                  <AiOutlineCheckCircle
                                    size={16}
                                    className={`transition-all duration-200 ${
                                      message.status === 'read'
                                        ? 'text-blue-500'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoSendSharp size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={ringTone} preload="auto" loop muted={false} />
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full animate-scaleIn">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Incoming call from {callerName}
            </h3>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                {callerName ? (
                  <span className="text-4xl font-bold text-blue-500">
                    {callerName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <BsCameraVideo size={32} className="text-blue-500" />
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRejectCall}
                className="px-6 py-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptCall}
                className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {isVideoCallActive && (
        <VideoCall
          receiverName={receiver.userName}
          callerName={isCaller ? user?.userName : receiver.userName}
          isCaller={isCaller}
          localStream={localStream}
          remoteStream={remoteStream}
          handleEndCall={handleEndCall}
        />
      )}
    </>
  );
};

export default ChatComponent;