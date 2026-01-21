// mock/chatMessages.ts
export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  isRead: boolean;
}

