export interface GetProfileResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: {
    errorCode: string;
    reason: string;
    data: string;
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
