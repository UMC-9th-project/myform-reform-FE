import { api } from '@/api/axios';

// ChatRequestPayload는 flat 구조로 정의
export interface ChatRequestPayload {
  chatRoomId: string;
  title: string;
  content: string;
  minBudget: number;
  maxBudget: number;
  image: string[];
}

export const createChatRequest = async (payload: ChatRequestPayload) => {
  return api.post('/chat/request', payload); 
};

