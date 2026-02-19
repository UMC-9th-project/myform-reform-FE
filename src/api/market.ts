import { api } from './axios';
import type { GetMarketListParams, GetMarketListResponse } from '../types/api/market';

/** 마켓 상품 목록 조회 */
export const getMarketList = async (
  params: GetMarketListParams = {}
): Promise<GetMarketListResponse> => {
  const queryParams: Record<string, unknown> = {
    sort: params.sort || 'popular',
    page: params.page || 1,
    limit: params.limit || 15,
  };
  if (params.categoryId) {
    queryParams.categoryId = params.categoryId;
  }

  const response = await api.get<GetMarketListResponse>('/market', {
    params: queryParams,
  });

  return response.data;
};
