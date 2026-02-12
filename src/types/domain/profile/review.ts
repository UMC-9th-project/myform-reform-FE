export interface ReviewItem {
  reviewId: string;
  userId: string;
  userName: string;
  userNickname: string;
  userProfilePhoto: string;
  star: number;
  createdAt: string;
  content: string;
  productId: string;
  productType: 'ITEM' | 'CUSTOM';
  productTitle: string;
  productPhoto: string;
  productPrice: number;
  photos: string[];
}

export interface GetProfileReviewsResponse {
  resultType: string;
  error: string | null;
  success: {
    reviews: ReviewItem[];
    nextCursor: string | null;
    hasNext: boolean;
  };
}