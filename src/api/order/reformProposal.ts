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
  const { category, subcategory, ...rest } = params;
  const queryParams: Record<string, unknown> = {
    ...rest,
    page: params.page ?? 1,
    limit: params.limit ?? 15,
  };
  if (category != null && category !== '') queryParams.category = category;
  if (subcategory != null && subcategory !== '') queryParams.subcategory = subcategory;

  const response = await api.get<GetReformProposalListResponse>('/reform/proposal', {
    params: queryParams,
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

