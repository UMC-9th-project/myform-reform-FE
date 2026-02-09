import { api } from '@/api/axios';
import type {
  ChatProposalDetail,
  CreateProposalPayload,
  CreateProposalResponse,
} from '@/types/api/chat/chatProposal';

export const createChatProposal = (
  payload: CreateProposalPayload
) => {
  return api.post<CreateProposalResponse>(
    '/chat/proposal',
    payload
  );
};

export const getChatProposalDetail = async (
  proposalId: string
): Promise<ChatProposalDetail> => {
  const { data } = await api.get(`/chat/proposal/${proposalId}`);
  return data.success;
};