import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket, socket } from '../../../services/socket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Header from '../Header/Header';
import { setTotalUnreadChats } from '../../../redux/slices/chatSlice';
import { truncateMessage } from '../../../Utils/helperFunctions/companyName';

interface RecentChat {
  roomId: string;
  lastMessage: string;
  createdAt: string;
  otherUser: {
    _id: string;
    userName: string;
    tagLine: string;
    profilePhoto: {
      url: string;
      publicId: string;
    };
  };
  unreadCount?: number;
}

const MessagesPage: React.FC = () => {
  const [chats, setChats] = useState<RecentChat[]>([]);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      if (!socket.connected) {
        connectSocket();
        console.log('Attempting to connect socket');
      }

      socket.on('connect', () => {
        console.log('Socket connected successfully');
      });
      if (socket && user?._id) {
        socket.emit('registerUser', user._id);
      }

      socket.emit('getRecentChats', { userId: user._id });
      console.log('Requesting recent chats for user:', user._id);
      socket.emit('getUnreadCount', { userId: user._id });

      socket.on(
        'unreadCounts',
        ({ counts }: { counts: { [roomId: string]: number } }) => {
          setChats((prevChats) =>
            prevChats.map((chat) => ({
              ...chat,
              unreadCount: counts[chat.roomId] || 0,
            }))
          );

          const totalUnreadChats = Object.values(counts).reduce(
            (total, count) => total + (count > 0 ? 1 : 0),
            0
          );
          dispatch(setTotalUnreadChats(totalUnreadChats));
        }
      );

      socket.on('recentChats', (data: { chats: RecentChat[] }) => {
        setChats(data.chats);
        console.log('Received recent chats:', data.chats);

        socket.emit('getUnreadCount', { userId: user._id });
      });

      socket.on(
        'message',
        (message: {
          senderId: string;
          roomId: string;
          content: string;
          createdAt: string;
        }) => {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.roomId === message.roomId
                ? {
                    ...chat,
                    lastMessage: message.content,
                    createdAt: message.createdAt,
                  }
                : chat
            )
          );

          // socket.emit('getUnreadCount', { userId: user._id });
          if (message.senderId !== user._id) {
            socket.emit('getUnreadCount', { userId: user._id });
          }
        }
      );

      socket.on('messageRead', ({ messageId, roomId }) => {
        socket.emit('getUnreadCount', { userId: user._id });
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      return () => {
        socket.off('recentChats');
        socket.off('unreadCounts');
        socket.off('message');
        socket.off('messageRead');
      };
    }
  }, [user, socket, dispatch]);

  const openChat = (roomId: string, receiverId: string, receiver: any) => {
    navigate(`/user/messages/chats/${roomId}/${receiverId}`, {
      state: { receiver },
    });
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Messages
        </h1>
        {chats.length > 0 ? (
          <ul className="space-y-4">
            {chats.map((chat) => (
              <li
                key={chat.roomId}
                className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow hover:bg-gray-50 cursor-pointer relative"
                onClick={() =>
                  openChat(chat.roomId, chat.otherUser._id, chat.otherUser)
                }
              >
                {chat.otherUser?.profilePhoto?.url ? (
                  <img
                    src={chat.otherUser?.profilePhoto?.url}
                    alt={chat.otherUser?.userName || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white text-xl font-semibold rounded-full">
                    {chat.otherUser?.userName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}

                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg text-gray-800">
                      {chat.otherUser.userName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(chat.createdAt).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {/* <p className="text-sm text-gray-600 truncate flex-1">
                      {chat.lastMessage}
                    </p> */}
                    <p className="text-sm text-gray-600 truncate flex-1">
  {truncateMessage(chat.lastMessage, 5)}
</p>
                    {chat.unreadCount !== undefined && chat.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-xl">No messages yet</p>
            <p className="text-sm mt-2">
              Start a conversation to see your messages here!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesPage;
