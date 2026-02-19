import { api } from '@/api/axios';

export interface MyReviewItem {
    reviewId: string;
    userId: string;
    userName: string;
    userNickname: string;
    userProfilePhoto: string;
    star: number;
    createdAt: string;
    content: string;
    orderId: string;
    price: number;
    deliveryFee: number;
    finalPrice: string;
    orderTitle: string;
    orderThumbnail: string;
    targetType: 'PROPOSAL' | 'ITEM' | string;
    targetId: string;
    reviewPhotos: string[];
}

export interface GetMyReviewsResponse {
    cursor: string | null;
    hasNext: boolean;
    data: MyReviewItem[];
}

interface GetMyReviewsParams {
    cursor?: string;
    limit?: number;
    order?: 'asc' | 'desc';
}

export const getMyReviews = async ({
  cursor,
  limit = 20,
  order = 'desc',
}: GetMyReviewsParams): Promise<GetMyReviewsResponse> => {
  const params: GetMyReviewsParams = { limit, order };
  if (cursor) params.cursor = cursor;

  const { data } = await api.get<{ success: GetMyReviewsResponse }>('/reviews/me', { params });
  return data.success;
};

export interface CreateReviewRequest {
  star: number;
  content: string;
  photos?: string[];
}

export interface CreateReviewResponse {
  review_id: string;
  user_id: string;
  order_id: string;
  star: number;
  content: string;
  created_at: string;
  review_photo: string[];
}

export const createReview = async (
  orderId: string,
  payload: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const { data } = await api.post(`/orders/${orderId}/review`, payload);
  return data.success;
};

export const deleteReview = async (reviewId: string) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};