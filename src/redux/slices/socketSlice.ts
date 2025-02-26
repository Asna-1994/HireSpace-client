// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Socket, io } from 'socket.io-client';

// const socket: Socket = io(import.meta.env.VITE_BACKEND_URL, {
//   transports: ['websocket'],
//   autoConnect: false,
// });

// interface SocketState {
//   connected: boolean;
//   socket: Socket;
// }

// const initialState: SocketState = {
//   connected: false,
//   socket,
// };

// const socketSlice = createSlice({
//   name: 'socket',
//   initialState,
//   reducers: {
//     connectSocket: (state) => {
//       if (!state.socket.connected) {
//         state.socket.connect();
//         state.connected = true;
//       }
//     },
//     disconnectSocket: (state) => {
//       if (state.socket.connected) {
//         state.socket.disconnect();
//         state.connected = false;
//       }
//     },
//   },
// });

// export const { connectSocket, disconnectSocket } = socketSlice.actions;
// export default socketSlice.reducer;
