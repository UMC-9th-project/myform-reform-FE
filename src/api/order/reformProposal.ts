import { api } from '../axios';
import type {
  GetReformProposalListParams,
  GetReformProposalListResponse,
  GetReformProposalDetailResponse,
} from '../../types/api/order/reformProposal';

/** 제안서 목록 조회 */
export const getReformProposalList = async (
  params: GetReformProposalListParams
): Promise<GetReformProposalListResponse> => {
  const response = await api.get<GetReformProposalListResponse>('/reform/proposal', {
    params: {
      ...params,
      page: params.page ?? 1,
      limit: params.limit ?? 15,
    },
  });

  return response.data;
};

/** 제안서 상세 조회 */
export const getReformProposalDetail = async (
  id: string
): Promise<GetReformProposalDetailResponse> => {
  const response = await api.get<GetReformProposalDetailResponse>(`/reform/proposal/${id}`);
  return response.data;
};

