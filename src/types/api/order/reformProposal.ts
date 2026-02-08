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

/** GET /reform/proposal/{id} 응답의 profile 객체 */
export interface ReformProposalDetailProfile {
  bio: string;
  keywords: string[];
  /** API 응답에 toatalSaleCount 오타 존재 가능 */
  totalSaleCount?: number;
  toatalSaleCount?: number;
  reviewCount: number;
  avgStarRecent3m: number;
  avgStar: number;
  ownerProfile: string;
  ownerName: string;
}

export interface ReformProposalDetail {
  isOwner: boolean;
  /** 게시글 작성자 ID (프론트엔드 fallback용, API에서 제공 시 사용) */
  ownerId?: string;
  reformProposalId: string;
  title: string;
  content: string;
  price: number;
  delivery: number;
  expectedWorking: number;
  ownerName: string;
  ownerProfile: string;
  images: ReformProposalImage[];
  /** 제안서 상세 API에 포함된 리폼러 프로필 (별점, 후기수 등) */
  profile?: ReformProposalDetailProfile;
}

export interface GetReformProposalDetailResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformProposalDetail | null;
}

