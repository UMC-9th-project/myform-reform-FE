import { useQuery } from '@tanstack/react-query';
import { getMarketList } from '../../../api/market';
import { getReformRequestList } from '../../../api/order/reformRequest';
import { getReformProposalList } from '../../../api/order/reformProposal';
import type { SearchResponse } from '../../../types/api/search';

interface UseSearchDataParams {
  qFromUrl: string;
  hasQuery: boolean;
}

export function useSearchData({
  qFromUrl,
  hasQuery,
}: UseSearchDataParams) {
  const { data: marketListData, isLoading: isMarketListLoading } = useQuery({
    queryKey: ['marketList', 'popular', 1],
    queryFn: () => getMarketList({
      sort: 'popular',
      page: 1,
      limit: 100, 
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  const marketSearchData: SearchResponse | undefined = marketListData?.success ? {
    resultType: 'SUCCESS',
    error: null,
    success: {
      results: (marketListData.success.items || []).map((item) => ({
        id: item.item_id,
        type: 'ITEM' as const,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        star: item.star,
        review_count: item.review_count,
        owner_nickname: item.owner_nickname,
        is_wished: item.is_wished,
      })),
      nextCursor: null,
      hasNextPage: false,
      totalCount: marketListData.success.total_count || 0,
    },
  } : undefined;

  const isMarketSearchLoading = isMarketListLoading;

  const { data: requestListData, isLoading: isRequestListLoading } = useQuery({
    queryKey: ['requestList', 'POPULAR', 1],
    queryFn: () => getReformRequestList({
      sortBy: 'POPULAR',
      page: 1,
      limit: 1000, 
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  const requestSearchData: SearchResponse | undefined = requestListData ? {
    resultType: 'SUCCESS',
    error: null,
    success: {
      results: (requestListData.success || []).map((item) => ({
        id: item.reformRequestId,
        type: 'REQUEST' as const,
        title: item.title,
        thumbnail: item.thumbnail,
        minBudget: item.minBudget,
        maxBudget: item.maxBudget,
        is_wished: false,
      })),
      nextCursor: null,
      hasNextPage: false,
      totalCount: requestListData.success?.length || 0,
    },
  } : undefined;

  const isRequestSearchLoading = isRequestListLoading;

  const { data: proposalListData, isLoading: isProposalListLoading } = useQuery({
    queryKey: ['proposalList', 'POPULAR', 1],
    queryFn: () => getReformProposalList({
      sortBy: 'POPULAR',
      page: 1, 
      limit: 1000,
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  const proposalSearchData = proposalListData ? {
    resultType: 'SUCCESS',
    error: null,
    success: {
      results: (proposalListData.success || []).map((item) => ({
        id: item.reformProposalId,
        type: 'PROPOSAL' as const,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        avgStar: item.avgStar,
        reviewCount: item.reviewCount,
        ownerName: item.ownerName,
        is_wished: item.isWished,
      })),
      nextCursor: null,
      hasNextPage: false,
      totalCount: proposalListData.success?.length || 0,
    },
  } : undefined;

  const isProposalSearchLoading = isProposalListLoading;

  return {
    marketSearchData,
    isMarketSearchLoading,
    requestSearchData,
    isRequestSearchLoading,
    proposalSearchData,
    isProposalSearchLoading,
  };
}
