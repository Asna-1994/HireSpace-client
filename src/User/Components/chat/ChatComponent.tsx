import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connectSocket, socket } from '../../../services/socket';
import { Message } from '../../../Utils/Interfaces/interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';
import { BsCameraVideo } from 'react-icons/bs';
import VideoCall from './VideoCall';
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

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);



  const handleAcceptCall = useCallback(() => {
    // console.log('Accepting call, creating peer connection...');
    // setState(prev => ({
    //     isVideoCallActive: true,
    //     incomingCall: false,
    //     isCaller: false
    // }));
    
    console.log('Accepting call, creating peer connection...');
    setIsVideoCallActive(true);
    setIncomingCall(false);
    setIsCaller(false);
    
    socket.emit('acceptCall', {
      roomId,
      callerId,
      receiverId: user?._id,
      answer: true,
    });
}, [roomId, callerId, user?._id]);

  const handleRejectCall = () => {
    socket.emit('rejectCall', {
      roomId,
      callerId,
      receiverId: user?._id,
    });
    setIncomingCall(false);
  };

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


      socket.on('incomingCall', (data) => {
        console.log('Incoming call received:', data);
        setIncomingCall(true);
        setCallerId(data.callerId);
        setCallerName(data.callerName);
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

      socket.on('callEnded', () => {
        setIsVideoCallActive(false);
        setIsCaller(false);
        setIncomingCall(false);
      });

      return () => {
        socket.off('chatHistory');
        socket.off('message');
        socket.off('messageRead');
        socket.off('incomingCall');
        socket.off('callAccepted');
        socket.off('callRejected');
        socket.off('callEnded');
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
  const handleInitiateCall = () => {
    socket.emit('initiateVideoCall', {
      roomId,
      callerId: user?._id,
      callerName: user?.userName,
      receiverId,
      receiverName: receiver.userName,
    });
    setIsVideoCallActive(true);
    setIsCaller(true);
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

      {isVideoCallActive && (
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
      )}

    </>
  );
};

export default ChatComponent;
