import { api } from '@/api/axios';
import type { ReformProposalDetailResponse } from '@/types/domain/mypage/reformProposal';

export const getReformProposalDetail = async (id: string) => {
  const res = await api.get<ReformProposalDetailResponse>(
    `/reform/proposal/${id}`
  );

  return res.data.success;
};
