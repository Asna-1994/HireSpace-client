

import { useParams } from 'react-router-dom';
import MessagesPage from './MessagePage';
import ChatComponent from './ChatComponent';
import Header from '../Header/Header';

const ChatLayout = () => {
  const { roomId } = useParams();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">

        <div className={`
          ${roomId ? 'hidden md:block' : 'block'} 
          md:w-2/5 
          border-r border-gray-200
          h-full
        `}>
          <MessagesPage />
        </div>

 
        <div className={`
          ${!roomId ? 'hidden md:block' : 'block'}
          flex-1 
          h-full
        `}>
          {roomId ? (
            <ChatComponent />
          ) : (
            <div className="hidden md:flex items-center justify-center h-full bg-gray-50">
              <div className="text-center text-gray-500">
                <p className="text-xl">Select a chat to start messaging</p>
                <p className="text-sm mt-2">Choose from your conversations on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;