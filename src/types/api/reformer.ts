/** 리폼러 키워드 검색 요청 파라미터 */
export interface ReformerSearchParams {
  keyword: string;
  cursor?: string;
}

/** 리폼러 검색 결과 개별 리폼러 */
export interface ReformerSearchItem {
  owner_id: string;
  nickname: string;
  keywords: string[];
  bio: string;
  profile_photo: string;
  avg_star: number;
  review_count: number;
  trade_count: number;
}

/** 리폼러 키워드 검색 응답 */
export interface ReformerSearchResponse {
  reformers: ReformerSearchItem[];
  nextCursor: string;
  hasNextPage: boolean;
  totalCount: number;
}

/** 전체 리폼러 탐색 요청 파라미터 */
export interface ReformerListParams {
  /** 정렬 기준: name | rating | trades */
  sort?: 'name' | 'rating' | 'trades';
  /** 다음 페이지를 위한 커서 (옵션) */
  cursor?: string;
}

/** 전체 리폼러 탐색 응답 */
export interface ReformerListResponse {
  reformers: ReformerSearchItem[];
  nextCursor: string;
  hasNextPage: boolean;
  perPage: number;
  totalCount: number;
}

/** 전체 피드 탐색 파라미터 */
export interface ReformerFeedParams {
  /** 다음 페이지를 위한 커서 (옵션) */
  cursor?: string;
}

/** 전체 피드 탐색 - 피드 썸네일 항목 */
export interface ReformerFeedItem {
  feed_id: string;
  photo_url: string;
  is_multi_photo: boolean;
}

/** 전체 피드 탐색 응답 */
export interface ReformerFeedResponse {
  feeds: ReformerFeedItem[];
  nextCursor: string;
  hasNextPage: boolean;
}

/** 피드 내 전체 사진 조회 파라미터 */
export interface ReformerFeedPhotosParams {
  feed_id: string;
}

/** 피드 내 사진 항목 */
export interface ReformerFeedPhotoItem {
  photo_order: number;
  url: string;
}

/** 피드 내 전체 사진 조회 응답 */
export interface ReformerFeedPhotosResponse {
  feed_id: string;
  photos: ReformerFeedPhotoItem[];
}

/** 리폼러 홈 - 최근 피드 사진 항목 */
export interface ReformerRecentFeedPhoto {
  feed_id: string;
  content: string;
}

/** 리폼러 홈 응답 */
export interface ReformerHomeResponse {
  topReformers: ReformerSearchItem[];
  recentFeedPhotos: ReformerRecentFeedPhoto[];
}
