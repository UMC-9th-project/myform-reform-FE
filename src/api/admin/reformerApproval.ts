import { api } from '../axios';
import type {
  GetReformerApprovalListParams,
  GetReformerApprovalListResponse,
  UpdateReformerStatusParams,
  UpdateReformerStatusResponse,
} from '../../types/api/admin/reformerApproval';

/** 리폼러 승인 목록 조회 */
export const getReformerApprovalList = async (
  params: GetReformerApprovalListParams
): Promise<GetReformerApprovalListResponse> => {
  const queryParams: Record<string, unknown> = {
    status: params.status,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    order: params.order ?? 'desc',
  };

  const response = await api.get<GetReformerApprovalListResponse>('/users/reformers', {
    params: queryParams,
  });

  return response.data;
};

/** 리폼러 상태 업데이트 */
export const updateReformerStatus = async (
  params: UpdateReformerStatusParams
): Promise<UpdateReformerStatusResponse> => {
  const response = await api.patch<UpdateReformerStatusResponse>(
    `/users/reformer/${params.reformerId}/status`,
    {
      status: params.status,
    }
  );

  return response.data;
};
