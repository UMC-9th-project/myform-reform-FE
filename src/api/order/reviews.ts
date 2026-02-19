import { api } from '../axios';
import type {
  GetReformerReviewsParams,
  GetReformerReviewsResponse,
} from '../../types/api/reviews';

/** 리폼러 전체 리뷰 목록 조회 - GET /reviews/reformer/{reformerId} */
export const getReformerReviews = async (
  reformerId: string,
  params?: GetReformerReviewsParams
): Promise<GetReformerReviewsResponse> => {
  const { data } = await api.get<GetReformerReviewsResponse>(
    `/reviews/reformer/${encodeURIComponent(reformerId)}`,
    {
      params: {
        limit: params?.limit ?? 10,
        ...(params?.cursor && { cursor: params.cursor }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
      },
    }
  );
  return data;
};
