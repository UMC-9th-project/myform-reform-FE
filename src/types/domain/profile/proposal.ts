export interface SaleCategory {
  major: string;
  sub: string;
}

export interface ProfileProposalItem {
  proposalId: string;
  photo: string | null;
  isWished: boolean;
  title: string;
  price: number;
  avgStar: number | null;
  reviewCount: number | null;
  sellerName: string;
  category: SaleCategory;
}

export interface GetProfileProposalsResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: {
    proposals: ProfileProposalItem[];
    nextCursor: string | null;
    hasNext: boolean;
  } | null;
}

export interface GetProfileProposalsParams {
  ownerId: string;
  cursor?: string;
  limit?: number;
}

export interface GetProfileByIdResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: {
    profilePhoto: string | null;
    nickname: string;
    avgStar: number;
    reviewCount: number;
    totalSaleCount: number;
    keywords: string[];
    bio: string;
  } | null;
}

