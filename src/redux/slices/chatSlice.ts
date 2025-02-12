import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../Utils/Interfaces/interface";

interface ChatState {
  messages: Message[];
  roomId: string | null;
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: [],
  roomId: null,
  isTyping: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    totalUnreadChats: 0,
  },
  reducers: {
    setTotalUnreadChats: (state, action) => {
      state.totalUnreadChats = action.payload;
    },
  },
});

export const { setTotalUnreadChats } = chatSlice.actions;
export default chatSlice.reducer;
