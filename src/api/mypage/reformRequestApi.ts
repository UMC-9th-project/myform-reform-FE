import { api } from '@/api/axios'

export interface ReformRequestItem {
  reformRequestId: string;
  title: string;
  minBudget: number;
  maxBudget: number;
  thumbnail: string;
}

export interface GetMyRequestsResponse {
  requestData: ReformRequestItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

// params 타입 정의
interface GetMyReformRequestsParams {
  cursor?: string;
  limit?: number;
  order?: 'asc' | 'desc';
}

export const getMyReformRequests = async (
  cursor?: string,
  limit = 20,
  order: 'asc' | 'desc' = 'desc'
) => {
  const params: GetMyReformRequestsParams = { limit, order };
  if (cursor) {
    params.cursor = cursor;
  }

  const { data } = await api.get<{ success: GetMyRequestsResponse }>('/profile/requests', { params });
  return data.success;
};
