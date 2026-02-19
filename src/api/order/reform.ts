import { api } from '../axios';
import type { GetReformPageListResponse } from '../../types/api/order/reform';

/** 주문제작 페이지 목록 조회 (GET /reform) */
export const getReformPageList = async (): Promise<GetReformPageListResponse> => {
  const response = await api.get<GetReformPageListResponse>('/reform');
  return response.data;
};
