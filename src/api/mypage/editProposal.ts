import { api } from '@/api/axios';
import type { EditReformProposalRequest } from '@/types/domain/mypage/editProposal';

export const editReformProposal = (
  id: string,                     // 수정할 글 id
  payload: EditReformProposalRequest
) => {
  return api.patch(`/reform/proposal/${id}`, payload);
};
