import { api } from '@/api/axios';
import type {
  ChatProposalDetail,
  CreateProposalPayload,
  CreateProposalResponse,
  UpdateProposalPayload,
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

export const updateChatProposal = (proposalId: string, payload: UpdateProposalPayload) => {
  return api.patch<CreateProposalResponse>(`/chat/proposal/${proposalId}`, payload);
};