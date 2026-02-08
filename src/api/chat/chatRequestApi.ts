import { api } from '@/api/axios';
import type { ChatRequestDetailResponse} from '@/types/api/chat/chatDetail';
import type { UpdateChatRequestPayload, UpdateChatRequestResponse } from '@/types/api/chat/chatRequestEdit';

// ChatRequestPayload는 flat 구조로 정의
export interface ChatRequestPayload {
  chatRoomId: string;
  title: string;
  content: string;
  minBudget: number;
  maxBudget: number;
  image: string[];
}

export const createChatRequest = async (payload?: ChatRequestPayload) => {
  return api.post('/chat/request', payload ?? {}); 
};

export const getChatRequestDetail = async (requestId: string) => {
  const response= await api.get<ChatRequestDetailResponse>(`/chat/request/${requestId}`);
  return response.data.success;
};

export const updateChatRequest = (
  requestId: string,
  payload: UpdateChatRequestPayload
) => {
  return api.patch<UpdateChatRequestResponse>(
    `/chat/request/${requestId}`,
    payload
  );
};