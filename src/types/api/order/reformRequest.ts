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
  /** 수정 시 폼 pre-fill용 (상세 API에서 내려주는 경우) */
  category?: { major: string; sub: string };
}

export interface GetReformRequestDetailResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformRequestDetail | null;
}

/** POST /reform/request - 리폼 요청서 작성 요청 (API 스펙) */
export interface CreateReformRequestRequest {
  title: string;
  contents: string;
  minBudget: number;
  maxBudget: number;
  dueDate: string; // ISO date string (e.g. 2026-02-07T17:43:26.362Z)
  category: { major: string; sub: string };
  images: string[]; // 이미지 URL 배열
}

export interface CreateReformRequestResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  /** 생성 성공 시 요청서 ID (문자열) */
  success: string | null;
}

/** PUT/PATCH /reform/request/:id - 리폼 요청서 수정 (요청 body는 작성과 동일) */
export type UpdateReformRequestRequest = CreateReformRequestRequest;

export interface UpdateReformRequestResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: string | null;
}

