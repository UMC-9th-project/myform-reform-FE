import { api } from '../axios';
import type {
  GetReformRequestListParams,
  GetReformRequestListResponse,
  GetReformRequestDetailResponse,
} from '../../types/api/order/reformRequest';

/** 요청서 목록 조회 */
export const getReformRequestList = async (
  params: GetReformRequestListParams
): Promise<GetReformRequestListResponse> => {
  const response = await api.get<GetReformRequestListResponse>('/reform/request', {
    params: {
      ...params,
      page: params.page ?? 1,
      limit: params.limit ?? 15,
    },
  });

  return response.data;
};

/** 요청서 상세 조회 */
export const getReformRequestDetail = async (
  id: string
): Promise<GetReformRequestDetailResponse> => {
  const response = await api.get<GetReformRequestDetailResponse>(`/reform/request/${id}`);
  return response.data;
};

