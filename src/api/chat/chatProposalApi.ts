import { api } from '@/api/axios';
import type {
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
