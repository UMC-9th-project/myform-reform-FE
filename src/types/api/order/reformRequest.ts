export type ReformRequestSortBy = 'RECENT' | 'POPULAR';

export interface GetReformRequestListParams {
  /** 정렬 기준 (필수) */
  sortBy: ReformRequestSortBy;
  /** 현재 페이지 (기본값 1) */
  page?: number;
  /** 최대 아이템 개수 (기본값 15) */
  limit?: number;
  /** 카테고리 대분류 */
  category?: string;
  /** 카테고리 소분류 */
  subcategory?: string;
}

export interface ReformRequestListItem {
  reformRequestId: string;
  thumbnail: string;
  title: string;
  minBudget: number;
  maxBudget: number;
}

export interface GetReformRequestListResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformRequestListItem[] | null;
}

export interface ReformRequestImage {
  photo: string;
  photo_order: number;
}

export interface ReformRequestDetail {
  isOwner: boolean;
  reformRequestId: string;
  dueDate: string; // ISO date string
  title: string;
  content: string;
  minBudget: number;
  maxBudget: number;
  name: string;
  profile: string;
  images: ReformRequestImage[];
}

export interface GetReformRequestDetailResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformRequestDetail | null;
}

