// types/chatRequest.ts

export interface ChatRequestRequester {
  id: string;
  nickname: string;
  profileImage: string;
}

export interface ChatRequestBody {
  title: string;
  content: string;
  minBudget: number;
  maxBudget: number;
  images: string[];
}

export interface ChatRequestDetail {
  chatRequestId: string;
  messageId: string;
  requester: ChatRequestRequester;
  body: ChatRequestBody;
  createdAt: string;
}

export interface ChatRequestDetailResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: unknown | null;
  success: ChatRequestDetail | null;
}
