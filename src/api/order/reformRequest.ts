import { api } from '../axios';
import type {
  GetReformRequestListParams,
  GetReformRequestListResponse,
  GetReformRequestDetailResponse,
  CreateReformRequestRequest,
  CreateReformRequestResponse,
  UpdateReformRequestRequest,
  UpdateReformRequestResponse,
} from '../../types/api/order/reformRequest';

/** 요청서 목록 조회 */
export const getReformRequestList = async (
  params: GetReformRequestListParams
): Promise<GetReformRequestListResponse> => {
  const { category, subcategory, ...rest } = params;
  const queryParams: Record<string, unknown> = {
    ...rest,
    page: params.page ?? 1,
    limit: params.limit ?? 15,
  };
  if (category != null && category !== '') queryParams.category = category;
  if (subcategory != null && subcategory !== '') queryParams.subcategory = subcategory;

  const response = await api.get<GetReformRequestListResponse>('/reform/request', {
    params: queryParams,
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

/** 요청서 작성 (POST /reform/request) - API 스펙: camelCase, category: { major, sub }, images: URL[] */
export const createReformRequest = async (
  payload: CreateReformRequestRequest
): Promise<CreateReformRequestResponse> => {
  const response = await api.post<CreateReformRequestResponse>(
    '/reform/request',
    payload
  );
  return response.data;
};

/** 요청서 수정 (PATCH /reform/request/:id) */
export const updateReformRequest = async (
  id: string,
  payload: UpdateReformRequestRequest
): Promise<UpdateReformRequestResponse> => {
  const response = await api.patch<UpdateReformRequestResponse>(
    `/reform/request/${id}`,
    payload
  );
  return response.data;
};

