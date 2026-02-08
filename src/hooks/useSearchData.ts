import { useQuery } from '@tanstack/react-query';
import { search } from '../api/search';

type SearchTab = 'market' | 'request' | 'proposal';

interface UseSearchDataParams {
  qFromUrl: string;
  activeTab: SearchTab;
  currentPage: number;
  getCursorForPage: (tab: SearchTab, page: number) => string | undefined;
  hasQuery: boolean;
}

export function useSearchData({
  qFromUrl,
  activeTab,
  currentPage,
  getCursorForPage,
  hasQuery,
}: UseSearchDataParams) {
  const { data: marketSearchData, isLoading: isMarketSearchLoading } = useQuery({
    queryKey: ['search', 'ITEM', qFromUrl, activeTab === 'market' ? currentPage : 1, activeTab === 'market'],
    queryFn: () => search({ 
      type: 'ITEM', 
      query: qFromUrl,
      cursor: activeTab === 'market' ? getCursorForPage('market', currentPage) : undefined,
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  const { data: requestSearchData, isLoading: isRequestSearchLoading } = useQuery({
    queryKey: ['search', 'REQUEST', qFromUrl, activeTab === 'request' ? currentPage : 1, activeTab === 'request'],
    queryFn: () => search({ 
      type: 'REQUEST', 
      query: qFromUrl,
      cursor: activeTab === 'request' ? getCursorForPage('request', currentPage) : undefined,
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  const { data: proposalSearchData, isLoading: isProposalSearchLoading } = useQuery({
    queryKey: ['search', 'PROPOSAL', qFromUrl, activeTab === 'proposal' ? currentPage : 1, activeTab === 'proposal'],
    queryFn: () => search({ 
      type: 'PROPOSAL', 
      query: qFromUrl,
      cursor: activeTab === 'proposal' ? getCursorForPage('proposal', currentPage) : undefined,
    }),
    enabled: hasQuery && qFromUrl.trim().length > 0,
  });

  return {
    marketSearchData,
    isMarketSearchLoading,
    requestSearchData,
    isRequestSearchLoading,
    proposalSearchData,
    isProposalSearchLoading,
  };
}
