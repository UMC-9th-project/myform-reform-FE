import { api } from '@/api/axios';
import type { ChatRequestDetailResponse} from '@/types/api/chat/chatDetail';

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

export const getChatRequestDetail = async (requestId: string) => {
  return api.get<ChatRequestDetailResponse>(`/chat/request/${requestId}`);
};
