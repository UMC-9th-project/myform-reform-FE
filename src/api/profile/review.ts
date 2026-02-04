import { api } from '../axios';
import type { GetProfileReviewsResponse } from '../../types/domain/profile/review';

interface GetProfileReviewsParams {
  ownerId: string;
  limit?: number;
  cursor?: string;
}

export const getProfileReviews = async ({
  ownerId,
  limit = 15,
  cursor,
}: GetProfileReviewsParams): Promise<GetProfileReviewsResponse> => {
  const query = new URLSearchParams({ limit: limit.toString() });
  if (cursor) query.append('cursor', cursor);

  const { data } = await api.get<GetProfileReviewsResponse>(
    `/profile/${ownerId}/review`, { params: { limit } }
  );
  return data;
};
