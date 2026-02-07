import type { ReformProposalDetail } from '../../api/order/reformProposal';

export type ProposalEditImageItem =
  | { type: 'url'; url: string }
  | { type: 'file'; file: File };

export interface ProposalEditFormProps {
  id: string;
  initialData: ReformProposalDetail;
  onSuccess: () => void;
}

export const getInitialProposalEditImages = (
  detail: ReformProposalDetail
): ProposalEditImageItem[] =>
  [...detail.images]
    .sort((a, b) => a.photo_order - b.photo_order)
    .map((img) => ({ type: 'url' as const, url: img.photo }));
