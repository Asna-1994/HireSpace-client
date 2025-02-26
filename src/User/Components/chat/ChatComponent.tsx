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
// import { connectSocket } from '../../../redux/slices/socketSlice';
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
  // const { socket, connected } = useSelector((state: RootState) => state.socket);
  const [callerName, setCallerName] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isCaller, setIsCaller] = useState(false);
const dispatch = useDispatch()
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [remoteDescription, setRemoteDescription] = useState<RTCSessionDescriptionInit | null>(null);

const {   getLocalMedia,
  createPeerConnection,
  peerConnection,
  localStream,
  remoteStream,
  setRemoteStream,
  setLocalStream,
  setPeerConnection,

} = useVideoCall(roomId!,isCaller, callerId, receiverId!)



const cleanupCall = useCallback(() => {
  if (peerConnection) {
    peerConnection.close();
    setPeerConnection(null);
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
  }
  setRemoteStream(null);
  setIsVideoCallActive(false);
  setIsCaller(false);
  setIncomingCall(false);
}, [peerConnection, localStream]);


//   const handleAcceptCall = useCallback(() => {

    
//     console.log('Accepting call, creating peer connection...');
//     setIsVideoCallActive(true);
//     setIncomingCall(false);
//     setIsCaller(false);
    
//     socket.emit('acceptCall', {
//       roomId,
//       callerId,
//       receiverId: user?._id,
//       answer: true,
//     });
// }, [roomId, callerId, user?._id]);
const handleAcceptCall = useCallback(async () => {
  try {
    if (!remoteDescription) {
      console.error('No remote description available.');
      return;
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
    await pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));

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
}, [remoteDescription, roomId, callerId, user?._id, getLocalMedia, createPeerConnection]);


  const handleRejectCall = () => {
    socket.emit('rejectCall', {
      roomId,
      callerId,
      receiverId: user?._id,
    });
    setIncomingCall(false);
  };

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
        console.log('No peer connection available for signal:', signalData.type);
        return;
      }
      
      try {
        switch (signalData.type) {
          case 'answer':
            console.log('Received answer');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.answer));
            break;
            
          case 'candidate':
            console.log('Received ICE candidate');
            if (peerConnection.remoteDescription) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(signalData.candidate));
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
        if (peerConnection) {
          peerConnection.close();
          setPeerConnection(null);
        }
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
          setLocalStream(null);
        }
        setRemoteStream(null);
        setIsVideoCallActive(false);
        setIsCaller(false);
        setIncomingCall(false);
      });
    }
  
    return () => {
      if (socket) {
        socket.off('callEnded');
      }
    };
  }, [peerConnection, localStream]);

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
        socket.emit('readMessage', { messageId: message._id, roomId });
      });

      socket.on('chatHistory', ({ roomId: joinedRoomId, chatHistory }) => {
        if (joinedRoomId === roomId) {
          setMessages(chatHistory);
          scrollToBottom();

          console.log('chat history', chatHistory);
          chatHistory.forEach((message: Message) => {
            if (message.status !== 'read' && message.senderId !== user?._id) {
              socket.emit('readMessage', { messageId: message._id, roomId });
            }
          });
        }
      });

      socket.on('message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();

        if (message.senderId !== user?._id) {
          socket.emit('readMessage', { messageId: message._id, roomId });
        }
      });

      socket.on('messageRead', ({ messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      });


      socket.on('incomingCall', ({ roomId, callerId, callerName }) => {
        console.log('Incoming call received:');
        setIncomingCall(true);
        setCallerId(callerId);
        setCallerName(callerName);
      });

      socket.on('callAccepted', ({ receiverId, answer }) => {
        console.log('Call accepted by:', receiverId);
        if (user?._id !== receiverId) {
          setIsVideoCallActive(true);
        }
      });

      socket.on('callRejected', ({ receiverId }) => {
        console.log('call rejected by ', receiverId);
        setIsVideoCallActive(false);
        setIsCaller(false);
      });

      // socket.on('callEnded', () => {
      //   setIsVideoCallActive(false);
      //   setIsCaller(false);
      //   setIncomingCall(false);
      // });

      return () => {
        socket.off('chatHistory');
        socket.off('message');
        socket.off('messageRead');
        socket.off('incomingCall');
        socket.off('callAccepted');
        socket.off('callRejected');
        // socket.off('callEnded');
      };
    }
  }, [roomId, user?._id]);

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
  // const handleInitiateCall = () => {
  //   socket.emit('initiateVideoCall', {
  //     roomId,
  //     callerId: user?._id,
  //     callerName: user?.userName,
  //     receiverId,
  //     receiverName: receiver.userName,
  //   });
  //   setIsVideoCallActive(true);
  //   setIsCaller(true);
  // };
  const handleInitiateCall = async () => {
    try {
      // Get local media (video/audio stream)
      const stream = await getLocalMedia();
      if (!stream) return;
  
      // Create a peer connection
      const pc = await createPeerConnection(stream);
      if (!pc) return;
  
      // Create an offer
      const offer = await pc.createOffer();
      console.log('Offer created:', offer);
      await pc.setLocalDescription(offer);
  
      // Send the offer to the receiver
      socket.emit('signal', {
        roomId,
        signalData: { type: 'offer', offer },
        senderId: user?._id,
        receiverId: receiverId,
      });
      console.log('Offer send from caller ');
      // Notify the receiver about the incoming call
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
    cleanupCall(); // Use the new cleanup function from the hook
    socket.emit('endCall', { roomId, callerId: user?._id, receiverId });
    setIsVideoCallActive(false);
    setIsCaller(false);
    setIncomingCall(false);
  };
  return (
    <>
      {/* <div className="h-screen flex flex-col overflow-hidden"> */}
      <div className="h-screen flex flex-col overflow-hidden">
        {/* <Header /> */}
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 overflow-hidden">
          <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Chat Header */}
            <div className="flex  justify-between px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 border-b border-gray-200 rounded-t-lg">
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
                              {/* {message.senderId !== user?._id && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                          )} */}
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

      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Incoming call from {callerName}
            </h3>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAcceptCall}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={handleRejectCall}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {isVideoCallActive && (
        <VideoCall
          roomId={roomId || ''}
          receiverId={receiver._id}
          receiverName={receiver.userName}
          callerId={isCaller ? user?._id : receiver._id}
          callerName={isCaller ? user?.userName : receiver.userName}
          isCaller={isCaller}
          isVideoCallActive={isVideoCallActive}
          setIsVideoCallActive={setIsVideoCallActive} 
   
        />
      )} */}
      {isVideoCallActive && (
  <VideoCall
    receiverName={receiver.userName}
    callerName={isCaller ? user?.userName : receiver.userName}
    isCaller={isCaller}
    localStream={localStream}
    remoteStream={remoteStream}
    handleEndCall={handleEndCall} // Pass the function to end the call
  />
)}

    </>
  );
};

export default ChatComponent;
