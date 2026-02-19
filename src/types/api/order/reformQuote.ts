/** 견적서 생성 요청 (POST /chat/rooms/request) */
export interface CreateReformQuoteRequest {
  targetId: string;
  price: number;
  delivery: number;
  contents: string;
  images: string[];
  expectedWorking: number;
}

export interface CreateReformQuoteSuccess {
  id: string;
  createdAt: string;
  isNew: boolean;
}

/** 견적서 생성 API 응답 */
export interface CreateReformQuoteResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code?: string;
    message?: string;
  };
  success: CreateReformQuoteSuccess | null;
}
