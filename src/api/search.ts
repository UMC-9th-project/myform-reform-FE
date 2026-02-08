import { api } from './axios';
import type { SearchParams, SearchResponse } from '../types/api/search';

/** 검색 API */
export const search = async (params: SearchParams): Promise<SearchResponse> => {
  const { type, query, cursor } = params;
  const queryParams: Record<string, string> = {
    type,
    query,
  };
  if (cursor) {
    queryParams.cursor = cursor;
  }

  const response = await api.get<SearchResponse>('/search', {
    params: queryParams,
  });

  return response.data;
};
