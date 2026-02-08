export interface GetProfileResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: {
    errorCode: string;
    reason: string;
    data: string;
  } | null;
  success: {
    ownerId?: string;
    profilePhoto?: string | null;
    nickname: string;
    avgStar: number;
    avgStarRecent3m?: number;
    reviewCount: number;
    totalSaleCount: number;
    keywords: string[];
    bio: string;
  } | null;
}
