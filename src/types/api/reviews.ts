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

/** GET /reviews/target/{targetType}/{targetId}/reviews - 타겟별 리뷰 목록 조회 */

export type TargetType = 'ITEM' | 'PROPOSAL' | 'FEED' | 'REQUEST';
export type TargetReviewsSort = 'latest' | 'star_high' | 'star_low';

export interface TargetReviewItem {
  review_id: string;
  photos: string[];
  product_thumbnail: string;
  content: string;
  created_at: string;
  star: number;
  user_nickname: string;
  user_profile_image: string;
}

export interface GetTargetReviewsParams {
  page?: number;
  limit?: number;
  sort?: TargetReviewsSort;
}

export interface GetTargetReviewsResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    data?: string;
    reason?: string;
    errorCode?: string;
  };
  success: {
    reviews: TargetReviewItem[];
    total_count: number;
    avg_star: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  } | null;
}

/** GET /reviews/target/{targetType}/{targetId}/reviews/photos - 사진 후기 조회 */

export interface ReviewPhoto {
  photo_order: number;
  photo_url: string;
  review_id: string;
  photo_index: number;
}

export interface GetTargetReviewPhotosParams {
  offset?: number;
  limit?: number;
}

export interface GetTargetReviewPhotosResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    data?: string;
    reason?: string;
    errorCode?: string;
  };
  success: {
    photos: ReviewPhoto[];
    has_more: boolean;
    offset: number;
    limit: number;
    total_count: number;
  } | null;
}

/** GET /reviews/target/{targetType}/{targetId}/reviews/{reviewId} - 리뷰 상세 조회 */

export interface GetTargetReviewDetailParams {
  photoIndex?: number;
}

export interface GetTargetReviewDetailResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    data?: string;
    reason?: string;
    errorCode?: string;
  };
  success: {
    review_id: string;
    user_profile_image: string;
    user_nickname: string;
    star: number;
    created_at: string;
    content: string;
    photo_urls: string[];
    product_thumbnail: string;
    current_photo_index: number;
    total_photo_count: number;
    has_prev: boolean;
    has_next: boolean;
    prev_photo_index: number;
    next_photo_index: number;
  } | null;
}
