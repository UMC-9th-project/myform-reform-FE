import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useSearchQueryParams } from '../../useSearchParams';
import { useSearchData } from './useSearchData';
import { getProfile } from '../../../api/profile/user';
import type { SearchItem } from '../../../types/api/search';
import type { MarketCardItem } from '../../../components/common/card/MarketCard';

const ITEMS_PER_PAGE = 15;

type SearchTab = 'market' | 'request' | 'proposal';

const getTabFromUrl = (searchParams: URLSearchParams): SearchTab => {
  const tabParam = searchParams.get('tab');
  if (tabParam === 'market' || tabParam === 'request' || tabParam === 'proposal') {
    return tabParam;
  }
  return 'market';
};

export const useSearchPage = () => {
  const { qFromUrl, pageFromUrl, hasQuery, searchParams, setSearchParams } = useSearchQueryParams();
  
  const [searchValue, setSearchValue] = useState(qFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [activeTab, setActiveTab] = useState<SearchTab>(getTabFromUrl(searchParams));
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const [hasAutoSwitchedTab, setHasAutoSwitchedTab] = useState(false);

  useEffect(() => {
    setSearchValue(qFromUrl);
    const page = parseInt(searchParams.get('page') || '1', 10);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl, searchParams]);

  useEffect(() => {
    const tabFromUrl = getTabFromUrl(searchParams);
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setHasAutoSwitchedTab(false);
  }, [qFromUrl]);

  useEffect(() => {
    if (hasQuery) {
      setMinLoadingTimePassed(false);
      const timer = setTimeout(() => {
        setMinLoadingTimePassed(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setMinLoadingTimePassed(true);
    }
  }, [qFromUrl, activeTab, hasQuery]);

  const {
    marketSearchData,
    isMarketSearchLoading,
    requestSearchData,
    isRequestSearchLoading,
    proposalSearchData,
    isProposalSearchLoading,
  } = useSearchData({
    qFromUrl,
    hasQuery,
  });

  const getCurrentIsLoading = useCallback(() => {
    if (!hasQuery) {
      return false;
    }
    
    if (!minLoadingTimePassed) {
      return true;
    }
    
    switch (activeTab) {
      case 'market':
        return isMarketSearchLoading;
      case 'request':
        return isRequestSearchLoading;
      case 'proposal':
        return isProposalSearchLoading;
      default:
        return false;
    }
  }, [hasQuery, minLoadingTimePassed, activeTab, isMarketSearchLoading, isRequestSearchLoading, isProposalSearchLoading]);

  const marketItems: MarketCardItem[] = useMemo(() => {
    if (!hasQuery || !marketSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (marketSearchData.success.results && Array.isArray(marketSearchData.success.results) && marketSearchData.success.results.length > 0) {
      return marketSearchData.success.results
        .filter((item: SearchItem) => {
          const itemTitle = (item.title || '').toLowerCase();
          const itemContent = (item.content || '').toLowerCase();
          return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
        })
        .map((item: SearchItem) => {
        const price = item.price !== undefined && item.price !== null ? item.price : 0;
        
        return {
          item_id: item.id,
          thumbnail: item.imageUrl || item.thumbnail || '',
          title: item.title,
          price,
          star: item.avgStar || item.star || 0,
          review_count: item.reviewCount || item.review_count || 0,
          owner_nickname: item.authorName || item.owner_nickname || item.ownerName || '',
          is_wished: item.isLiked || item.is_wished || false,
        };
      });
    }
    
    return [];
  }, [marketSearchData, hasQuery, qFromUrl]);

  const requestItems = useMemo(() => {
    if (!hasQuery || isRequestSearchLoading || !requestSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (requestSearchData.success.results && Array.isArray(requestSearchData.success.results) && requestSearchData.success.results.length > 0) {
      return requestSearchData.success.results
        .filter((item: SearchItem) => {
          const itemTitle = (item.title || '').toLowerCase();
          const itemContent = (item.content || '').toLowerCase();
          return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
        })
        .map((item: SearchItem, index: number) => {
        let priceRange = '';
        
        if (item.priceRange && item.priceRange.trim() !== '') {
          priceRange = item.priceRange;
        } 
        else if (
          (item.minBudget !== undefined && item.minBudget !== null) || 
          (item.maxBudget !== undefined && item.maxBudget !== null)
        ) {
          const hasMinBudget = item.minBudget !== undefined && item.minBudget !== null;
          const hasMaxBudget = item.maxBudget !== undefined && item.maxBudget !== null;
          
          if (hasMinBudget && hasMaxBudget && item.minBudget !== undefined && item.maxBudget !== undefined) {
            priceRange = `${item.minBudget.toLocaleString('ko-KR')}원~${item.maxBudget.toLocaleString('ko-KR')}원`;
          } 
          else if (hasMinBudget && item.minBudget !== undefined) {
            priceRange = `${item.minBudget.toLocaleString('ko-KR')}원~`;
          }
          else if (hasMaxBudget && item.maxBudget !== undefined) {
            priceRange = `~${item.maxBudget.toLocaleString('ko-KR')}원`;
          }
        } 
        else if (item.price !== undefined && item.price !== null) {
          priceRange = `${item.price.toLocaleString('ko-KR')}원`;
        }
        
        return {
          key: index + 1,
          id: item.id,
          imgSrc: item.imageUrl || item.thumbnail || '',
          title: item.title,
          priceRange: priceRange || undefined,
          isWished: item.is_wished || false,
        };
      });
    }
    
    return [];
  }, [requestSearchData, hasQuery, isRequestSearchLoading, qFromUrl]);

  const filteredProposals = useMemo(() => {
    if (!hasQuery || !proposalSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (proposalSearchData.success.results && Array.isArray(proposalSearchData.success.results) && proposalSearchData.success.results.length > 0) {
      return proposalSearchData.success.results.filter((item: SearchItem) => {
        const itemTitle = (item.title || '').toLowerCase();
        const itemContent = (item.content || '').toLowerCase();
        return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
      });
    }
    
    return [];
  }, [proposalSearchData, hasQuery, qFromUrl]);

  const profileResults = useQueries({
    queries: filteredProposals.map((item: SearchItem) => {
      const ownerName = item.ownerName || item.authorName || item.nickname || item.owner_nickname || '';
      return {
        queryKey: ['profile', 'by-nickname', ownerName],
        queryFn: () => getProfile(ownerName),
        enabled: !!ownerName,
        staleTime: 1000 * 60,
      };
    }),
  });

  const proposalItems = useMemo(() => {
    if (filteredProposals.length === 0) {
      return [];
    }
    
    return filteredProposals.map((item: SearchItem, index: number) => {
      const imgSrc = item.imageUrl || item.thumbnail || '';
      
      const price = item.price !== undefined && item.price !== null 
        ? `${item.price.toLocaleString('ko-KR')}원` 
        : '';
      
      const profileRes = profileResults[index]?.data;
      const fromProfile = profileRes?.resultType === 'SUCCESS' && profileRes?.success;
      const rating = fromProfile 
        ? (profileRes.success!.avgStar ?? item.avgStar ?? item.rating ?? item.star ?? 0)
        : (item.avgStar ?? item.rating ?? item.star ?? 0);
      
      const reviewCount = fromProfile
        ? (profileRes.success!.reviewCount ?? item.reviewCount ?? item.review_count ?? 0)
        : (item.reviewCount ?? item.review_count ?? 0);
      
      return {
        key: index + 1,
        id: item.id || '',
        imgSrc,
        title: item.title || '',
        price,
        rating,
        reviewCountText: item.reviewCountText || `(${reviewCount})`,
        nickname: item.authorName || item.nickname || item.owner_nickname || item.ownerName || '',
        isWished: item.is_wished || false,
      };
    });
  }, [filteredProposals, profileResults]);

  const marketCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    return marketItems.length;
  }, [hasQuery, marketItems.length]);

  const requestCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    return requestItems.length;
  }, [hasQuery, requestItems.length]);

  const proposalCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    return proposalItems.length;
  }, [hasQuery, proposalItems]);

  const handleTabChange = useCallback((tab: SearchTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', tab);
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  useEffect(() => {
    if (!hasQuery || hasAutoSwitchedTab) {
      return;
    }

    if (!minLoadingTimePassed || isMarketSearchLoading || isRequestSearchLoading || isProposalSearchLoading) {
      return;
    }

    const counts = [
      { tab: 'market' as SearchTab, count: marketCount },
      { tab: 'request' as SearchTab, count: requestCount },
      { tab: 'proposal' as SearchTab, count: proposalCount },
    ];

    const maxCountTab = counts.reduce((max, current) => 
      current.count > max.count ? current : max
    );

    if (maxCountTab.count > 0 && activeTab !== maxCountTab.tab) {
      handleTabChange(maxCountTab.tab);
      setHasAutoSwitchedTab(true);
    } else if (maxCountTab.count === 0) {
      setHasAutoSwitchedTab(true);
    }
  }, [marketCount, requestCount, proposalCount, hasQuery, minLoadingTimePassed, isMarketSearchLoading, isRequestSearchLoading, isProposalSearchLoading, activeTab, handleTabChange, hasAutoSwitchedTab]);

  const totalPages = useMemo(() => {
    let count = 0;
    switch (activeTab) {
      case 'market':
        count = marketCount;
        break;
      case 'request':
        count = requestCount;
        break;
      case 'proposal':
        count = proposalCount;
        break;
    }
    return Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
  }, [activeTab, marketCount, requestCount, proposalCount]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const isLoading = getCurrentIsLoading();
  
  const hasResults = useMemo(() => {
    if (isLoading) {
      return true;
    }
    
    switch (activeTab) {
      case 'market':
        return marketItems.length > 0;
      case 'request':
        return requestItems.length > 0;
      case 'proposal':
        return proposalItems.length > 0;
      default:
        return false;
    }
  }, [activeTab, marketItems.length, requestItems.length, proposalItems, isLoading]);

  return {
    searchValue,
    currentPage,
    activeTab,
    marketItems,
    requestItems,
    proposalItems,
    marketCount,
    requestCount,
    proposalCount,
    totalPages,
    isLoading,
    hasResults,
    hasQuery,
    handleTabChange,
    handlePageChange,
  };
};
