// 견적서 생성 요청 payload
export interface CreateProposalPayload {
  chatRoomId: string;
  price: number;
  delivery: number;
  expectedWorking: number;
  image: string[];
}

// 생성 응답
export interface CreateProposalResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: unknown | null;
  success: {
    id: string;        // proposalId
    createdAt: string;
  } | null;
}
