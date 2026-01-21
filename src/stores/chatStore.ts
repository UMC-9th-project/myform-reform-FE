import { create } from 'zustand';

export interface Message {
  id: number;
  type: 'text' | 'image' | 'quotation' | 'payment';
  senderRole: 'REFORMER' | 'USER';
  text?: string;
  imageUrls?: string[];
  time: string;
  isRead?: boolean;

  price?: number;
  delivery?:number;
  days?:number;
}

interface ChatState {
  messages: Message[];
  sendMessage: (msg: Message) => void;
  resetMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  resetMessages: () => set({ messages: [] }),
}));
