/** 단일 피드 */
export interface Feed {
  feedId: string;
  images: string[];
  isPinned: boolean;
}

/** 피드 목록 성공 응답 */
export interface FeedListSuccess {
  feeds: Feed[];
  nextCursor: string | null;
  hasNext: boolean;
}

/** 피드 목록 API 전체 응답 */
export interface FeedListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: unknown | null;
  success: FeedListSuccess | null;
}

// 피드 등록 요청
export interface CreateFeedRequest {
  imageUrls: string[];
  isPinned?: boolean;
}

// 피드 등록 응답
export interface CreateFeedResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | {
    reason: string;
  };
  success: {
    feedId: string;
  };
}
