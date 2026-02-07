export type ReformProposalSortBy = 'RECENT' | 'POPULAR';

export interface GetReformProposalListParams {
  /** 정렬 기준 (필수) */
  sortBy: ReformProposalSortBy;
  /** 현재 페이지 (기본값 1) */
  page?: number;
  /** 최대 아이템 개수 (기본값 15) */
  limit?: number;
  /** 카테고리 대분류 */
  category?: string;
  /** 카테고리 소분류 */
  subcategory?: string;
}

export interface ReformProposalListItem {
  reformProposalId: string;
  thumbnail: string;
  title: string;
  price: number;
  avgStar: number;
  reviewCount: number;
  ownerName: string;
}

export interface GetReformProposalListResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformProposalListItem[] | null;
}

export interface ReformProposalImage {
  photo: string;
  photo_order: number;
}

export interface ReformProposalDetail {
  isOwner: boolean;
  reformProposalId: string;
  title: string;
  content: string;
  price: number;
  delivery: number;
  expectedWorking: number;
  ownerName: string;
  ownerProfile: string;
  images: ReformProposalImage[];
}

export interface GetReformProposalDetailResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformProposalDetail | null;
}

