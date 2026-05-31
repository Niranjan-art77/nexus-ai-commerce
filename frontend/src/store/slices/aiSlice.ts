import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIState {
  chatHistory: Message[];
  isThinking: boolean;
}

const initialState: AIState = {
  chatHistory: [{ role: 'ai', content: 'Hello! I am your Neural Copilot. How can I assist you in the Multiverse today?' }],
  isThinking: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.chatHistory.push(action.payload);
    },
    setThinking(state, action: PayloadAction<boolean>) {
      state.isThinking = action.payload;
    },
  },
});

export const { addMessage, setThinking } = aiSlice.actions;
export default aiSlice.reducer;
