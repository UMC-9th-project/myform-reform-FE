import { create } from 'zustand';

export interface Message {
  id: number;
  type: 'text' | 'image' | 'quotation' | 'payment' | 'require' | 'payFinish';
  senderRole: 'REFORMER' | 'USER';
  text?: string;
  imageUrls?: string[];
  time: string;
  isRead?: boolean;

  price?: number;
  delivery?:number;
  days?:number;

  // payFinish 전용 필드
  orderNumber?: string;
  paymentMethod?: string;
  paymentDetail?: string;
  date?: string;
  receiverName?: string;
  phone?: string;
  address?: string;
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
