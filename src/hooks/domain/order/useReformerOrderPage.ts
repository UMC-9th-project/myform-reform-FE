import { useQuery, useQueries } from '@tanstack/react-query';
import { getReformRequestList } from '../../../api/order/reformRequest';
import { getReformProposalList } from '../../../api/order/reformProposal';
import { getProfile } from '../../../api/profile/user';
import type { ReformRequestListItem } from '../../../types/api/order/reformRequest';
import type { ReformProposalListItem } from '../../../types/api/order/reformProposal';

export const useReformerOrderPage = () => {
  const {
    data: reformRequestListResponse,
    isLoading: isNewRequestsLoading,
    isError: isNewRequestsError,
  } = useQuery({
    queryKey: ['reform-request-list-preview', 'reformer'],
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

  const newRequests: ReformRequestListItem[] =
    reformRequestListResponse?.success ?? [];

  const {
    data: reformProposalListResponse,
    isLoading: isProposalsLoading,
    isError: isProposalsError,
  } = useQuery({
    queryKey: ['reform-proposal-list-preview', 'reformer'],
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
    reformProposalListResponse?.success ?? [];

  // 제안별로 닉네임(ownerName)으로 GET /profile/{id} 호출해 별점·리뷰 수 조회
  const profileResults = useQueries({
    queries: proposals.map((p) => ({
      queryKey: ['profile', 'by-nickname', p.ownerName],
      queryFn: () => getProfile(p.ownerName),
      enabled: !!p.ownerName,
      staleTime: 1000 * 60,
    })),
  });

  const proposalsWithProfile: ReformProposalListItem[] = proposals.map((p, i) => {
    const profileRes = profileResults[i]?.data;
    const fromProfile =
      profileRes?.resultType === 'SUCCESS' && profileRes?.success;
    return {
      ...p,
      avgStar: fromProfile ? profileRes.success!.avgStar : p.avgStar,
      reviewCount: fromProfile ? profileRes.success!.reviewCount : p.reviewCount,
    };
  });

  return {
    newRequests,
    proposals: proposalsWithProfile,
    isNewRequestsLoading,
    isNewRequestsError,
    isProposalsLoading,
    isProposalsError,
  };
};
