import { api } from './axios';
import type {
  ReformerSearchParams,
  ReformerSearchResponse,
  ReformerHomeResponse,
  ReformerListParams,
  ReformerListResponse,
  ReformerFeedParams,
  ReformerFeedResponse,
  ReformerFeedPhotosParams,
  ReformerFeedPhotosResponse,
} from '../types/api/reformer';

/** 리폼러 키워드 검색  */
export const getReformerSearch = async (
  params: ReformerSearchParams
): Promise<ReformerSearchResponse> => {
  const response = await api.get<ReformerSearchResponse>('/reformer/search', {
    params,
  });
  return response.data;
};

/** 리폼러 찾기 메인 */
export const getReformerHome = async (): Promise<ReformerHomeResponse> => {
  const response = await api.get<ReformerHomeResponse>('/reformer/home');
  return response.data;
};

/** 전체 리폼러 탐색 */
export const getReformerList = async (
  params?: ReformerListParams
): Promise<ReformerListResponse> => {
  const response = await api.get<ReformerListResponse>('/reformer/list', {
    params,
  });
  return response.data;
};

/** 전체 피드 탐색 (썸네일만) */
export const getReformerFeed = async (
  params?: ReformerFeedParams
): Promise<ReformerFeedResponse> => {
  const response = await api.get<ReformerFeedResponse>('/reformer/feed', {
    params,
  });
  return response.data;
};

/** 피드 내 전체 사진 조회 (feed_id 필수) */
export const getReformerFeedPhotos = async (
  params: ReformerFeedPhotosParams
): Promise<ReformerFeedPhotosResponse> => {
  const response = await api.get<ReformerFeedPhotosResponse>(
    '/reformer/feed/photos',
    { params }
  );
  return response.data;
};
