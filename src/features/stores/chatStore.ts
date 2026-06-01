import { create } from 'zustand';
import { Message } from '../../types';

interface ChatState {
  messages: Message[];
  typingUsers: string[];
  addMessage: (message: Message) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (userId, isTyping) =>
    set((state) => ({
      typingUsers: isTyping
        ? [...state.typingUsers, userId]
        : state.typingUsers.filter((id) => id !== userId),
    })),
}));
