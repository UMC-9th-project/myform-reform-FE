/** GET /reviews/reformer/{reformerId} - 리폼러 리뷰 목록 */

export type ReformerReviewsSortBy = 'recent' | 'high_rating' | 'low_rating';

export interface ReformerReviewItem {
  reviewId: string;
  userId: string;
  userNickname: string;
  userProfilePhoto: string;
  star: number;
  createdAt: string;
  content: string;
  reviewPhotos: string[];
}

export interface GetReformerReviewsParams {
  cursor?: string;
  limit?: number;
  sortBy?: ReformerReviewsSortBy;
}

export interface GetReformerReviewsResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | { errorCode?: string; reason?: string; data?: string };
  success: {
    totalCount: number;
    avgStar: number;
    photoReviewCount: number;
    reviewPhotos: string[];
    reviews: ReformerReviewItem[];
    cursor: string;
    hasNext: boolean;
  } | null;
}
