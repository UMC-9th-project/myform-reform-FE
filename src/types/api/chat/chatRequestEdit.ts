// 수정 요청 payload
export interface UpdateChatRequestPayload {
  image: string[];
  title: string;
  content: string;
  minBudget: number;
  maxBudget: number;
}

// 수정 성공 응답
export interface UpdateChatRequestSuccess {
  id: string;
  updatedAt: string;
}

// 공통 API 응답
export interface UpdateChatRequestResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: unknown | null;
  success: UpdateChatRequestSuccess | null;
}
