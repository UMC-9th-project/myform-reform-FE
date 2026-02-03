import { api } from '../axios';
import type { FeedListResponse, CreateFeedRequest, CreateFeedResponse } from '../../types/domain/profile/feed';

interface GetFeedListParams {
  ownerId: string;
  cursor?: string;
  size?: number; // 기본 20
}

export const getFeedList = async ({
  ownerId,
  cursor,
  size = 20,
}: GetFeedListParams): Promise<FeedListResponse> => {
  const { data } = await api.get<FeedListResponse>(`profile/${ownerId}/feed`, {
    params: {
      ownerId,
      cursor,
      size,
    },
  });

  return data;
};

export const createFeed = async (
  body: CreateFeedRequest): Promise<CreateFeedResponse> => {
  const { data } = await api.post<CreateFeedResponse>(
    '/profile/feed',
    body
  );
  return data;
};