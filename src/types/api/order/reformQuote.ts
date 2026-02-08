/** 견적서 생성 요청 (POST /reform/quote) */
export interface CreateReformQuoteRequest {
  /** 대상 요청서 ID (UUID) */
  targetId: string;
  /** 견적 금액 (원) */
  price: number;
  /** 배송비 (원) */
  delivery: number;
  /** 상세 내용 */
  contents: string;
  /** 이미지 URL 목록 */
  images: string[];
  /** 예상 작업 기간 (일) */
  expectedWorking: number;
}

/** 견적서 생성 성공 응답 */
export interface CreateReformQuoteSuccess {
  order_id: string;
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
