import { useQuery } from '@tanstack/react-query';
import { getReformRequestList } from '../../../api/order/reformRequest';
import { getReformProposalList } from '../../../api/order/reformProposal';
import type { ReformRequestListItem } from '../../../types/api/order/reformRequest';
import type { ReformProposalListItem } from '../../../types/api/order/reformProposal';

export const useOrderPage = () => {
  const {
    data: requestListResponse,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
  } = useQuery({
    queryKey: ['reform-request-list-preview', 'order'],
    queryFn: async () => {
      const data = await getReformRequestList({
        sortBy: 'RECENT',
        page: 1,
        limit: 3,
      });
      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '요청서 목록 조회 실패');
      }
      return data;
    },
    staleTime: 1000 * 30,
  });

  const recentRequests: ReformRequestListItem[] =
    requestListResponse?.success ?? [];

  const {
    data: proposalListResponse,
    isLoading: isProposalsLoading,
    isError: isProposalsError,
  } = useQuery({
    queryKey: ['reform-proposal-list-preview', 'order'],
    queryFn: async () => {
      const data = await getReformProposalList({
        sortBy: 'POPULAR',
        page: 1,
        limit: 3,
      });
      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '제안서 목록 조회 실패');
      }
      return data;
    },
    staleTime: 1000 * 30,
  });

  const proposals: ReformProposalListItem[] =
    proposalListResponse?.success ?? [];

  const isLoading = isRequestsLoading || isProposalsLoading;
  const isError = isRequestsError || isProposalsError;

  return {
    recentRequests,
    proposals,
    isLoading,
    isError,
  };
};
