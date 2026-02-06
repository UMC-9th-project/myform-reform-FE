import { api } from '@/api/axios';

export interface MyReviewItem {
    reviewId: string;
    userId: string;
    userName: string;
    userNickname: string;
    userProfilePhoto: string;
    start: number;
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