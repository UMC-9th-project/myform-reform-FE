import type { ReformRequestListItem } from './reformRequest';
import type { ReformProposalListItem } from './reformProposal';

/** GET /reform - 주문제작 페이지 목록 조회 응답 success payload */
export interface ReformPageListPayload {
  /** 새로 등록된 요청 목록 */
  recentRequests: ReformRequestListItem[];
  /** 리폼러 주문제작(제안) 목록 */
  proposals: ReformProposalListItem[];
}

export interface GetReformPageListResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: ReformPageListPayload | null;
}
