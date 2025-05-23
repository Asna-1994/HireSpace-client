// import { useParams } from 'react-router-dom';
// import MessagesPage from './MessagePage';
// import ChatComponent from './ChatComponent';
// import Header from '../Header/Header';

// const ChatLayout = () => {
//   const { roomId } = useParams();

//   return (
//     <div className="flex flex-col h-screen">
//       <Header />
//       <div className="flex flex-col flex-1 md:flex-row">
//         <div
//           className={`
//           ${roomId ? 'hidden md:block' : 'block'} 
//           md:w-2/5 
//           border-r border-gray-200
//           h-full  overflow-y-auto
//         `}
//         >
//           <MessagesPage />
//         </div>

//         <div
//           className={`
//           ${!roomId ? 'hidden md:block' : 'block'}
//           flex-1 
//           h-full overflow-y-auto
//         `}
//         >
//           {roomId ? (
//             <ChatComponent />
//           ) : (
//             <div className="items-center justify-center hidden h-full md:flex bg-gray-50">
//               <div className="text-center text-gray-500">
//                 <p className="text-xl">Select a chat to start messaging</p>
//                 <p className="mt-2 text-sm">
//                   Choose from your conversations on the left
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;

import { useParams } from 'react-router-dom';
import MessagesPage from './MessagePage';
import ChatComponent from './ChatComponent';
import Header from '../Header/Header';

const ChatLayout = () => {
  const { roomId } = useParams();
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-col flex-1 overflow-hidden md:flex-row">
        <div
          className={`
          ${roomId ? 'hidden md:block' : 'block'}
           md:w-2/5
           border-r border-gray-200
           h-full overflow-y-auto
        `}
        >
          <MessagesPage />
        </div>
        
        <div
          className={`
          ${!roomId ? 'hidden md:block' : 'block'}
          flex-1
           h-full overflow-y-auto
        `}
        >
          {roomId ? (
            <ChatComponent />
          ) : (
            <div className="items-center justify-center hidden h-full md:flex bg-gray-50">
              <div className="text-center text-gray-500">
                <p className="text-xl">Select a chat to start messaging</p>
                <p className="mt-2 text-sm">
                  Choose from your conversations on the left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;

