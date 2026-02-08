import { useState, useEffect, useMemo } from 'react';
import SearchResultEmpty from '../../components/domain/search-result/SearchResultEmpty';
import SearchResultSkeleton from '../../components/domain/search-result/SearchResultSkeleton';
import MarketCard, { type MarketCardItem } from '../../components/common/card/MarketCard';
import RequestCard from '../../components/common/card/RequestCard';
import ProposalCard from '../../components/common/card/ProposalCard';
import Pagination from '../../components/common/pagination/Pagination';
import type { SearchItem } from '../../types/api/search';
import useAuthStore from '../../stores/useAuthStore';
import { useSearchQueryParams } from '../../hooks/useSearchParams';
import { useSearchData } from '../../hooks/useSearchData';

const ITEMS_PER_PAGE = 15;

type SearchTab = 'market' | 'request' | 'proposal';

export default function Search() {
  const { qFromUrl, pageFromUrl, hasQuery, searchParams, setSearchParams } = useSearchQueryParams();
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';

  const [searchValue, setSearchValue] = useState(qFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [cursors, setCursors] = useState<Record<string, Record<number, string>>>({
    market: {},
    request: {},
    proposal: {},
  });

  useEffect(() => {
    setSearchValue(qFromUrl);
    const page = parseInt(searchParams.get('page') || '1', 10);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    // 검색어가 변경되면 cursor 초기화
    if (qFromUrl) {
      setCursors({ market: {}, request: {}, proposal: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl]);

  const [activeTab, setActiveTab] = useState<SearchTab>('market');

  // 검색 API만 사용
  const getCursorForPage = (tab: SearchTab, page: number): string | undefined => {
    if (page === 1) return undefined;
    return cursors[tab][page - 1];
  };

  const {
    marketSearchData,
    isMarketSearchLoading,
    requestSearchData,
    isRequestSearchLoading,
    proposalSearchData,
    isProposalSearchLoading,
  } = useSearchData({
    qFromUrl,
    activeTab,
    currentPage,
    getCursorForPage,
    hasQuery,
  });

  const isMarketLoading = isMarketSearchLoading;
  const isRequestLoading = isRequestSearchLoading;
  const isProposalLoading = isProposalSearchLoading;

  const getCurrentIsLoading = () => {
    if (!hasQuery) {
      return false;
    }
    switch (activeTab) {
      case 'market':
        return isMarketLoading;
      case 'request':
        return isRequestLoading;
      case 'proposal':
        return isProposalLoading;
      default:
        return false;
    }
  };

  // 마켓 아이템 변환
  const marketItems: MarketCardItem[] = useMemo(() => {
    if (!hasQuery || !marketSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (marketSearchData.success.results && Array.isArray(marketSearchData.success.results) && marketSearchData.success.results.length > 0) {
      return marketSearchData.success.results
        .filter((item: SearchItem) => {
          // title 또는 content가 검색어를 포함하는지 확인
          const itemTitle = (item.title || '').toLowerCase();
          const itemContent = (item.content || '').toLowerCase();
          return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
        })
        .map((item: SearchItem) => {
        // 가격 필드 확인 (여러 가능한 필드 체크)
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

  // 주문제작 요청 아이템 변환
  const requestItems = useMemo(() => {
    if (!hasQuery || isRequestSearchLoading || !requestSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (requestSearchData.success.results && Array.isArray(requestSearchData.success.results) && requestSearchData.success.results.length > 0) {
      return requestSearchData.success.results
        .filter((item: SearchItem) => {
          // title 또는 content가 검색어를 포함하는지 확인
          const itemTitle = (item.title || '').toLowerCase();
          const itemContent = (item.content || '').toLowerCase();
          return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
        })
        .map((item: SearchItem, index: number) => {
        // 가격 범위 계산 (여러 가능한 필드 체크)
        let priceRange = '';
        
        // 1. priceRange가 있으면 사용
        if (item.priceRange && item.priceRange.trim() !== '') {
          priceRange = item.priceRange;
        } 
        // 2. minBudget과 maxBudget 확인 (0도 유효한 값으로 처리)
        else if (
          (item.minBudget !== undefined && item.minBudget !== null) || 
          (item.maxBudget !== undefined && item.maxBudget !== null)
        ) {
          const hasMinBudget = item.minBudget !== undefined && item.minBudget !== null;
          const hasMaxBudget = item.maxBudget !== undefined && item.maxBudget !== null;
          
          // 둘 다 있으면 범위로 표시
          if (hasMinBudget && hasMaxBudget && item.minBudget !== undefined && item.maxBudget !== undefined) {
            priceRange = `${item.minBudget.toLocaleString('ko-KR')}원~${item.maxBudget.toLocaleString('ko-KR')}원`;
          } 
          // minBudget만 있으면
          else if (hasMinBudget && item.minBudget !== undefined) {
            priceRange = `${item.minBudget.toLocaleString('ko-KR')}원~`;
          }
          // maxBudget만 있으면
          else if (hasMaxBudget && item.maxBudget !== undefined) {
            priceRange = `~${item.maxBudget.toLocaleString('ko-KR')}원`;
          }
        } 
        // 3. price 필드 확인
        else if (item.price !== undefined && item.price !== null) {
          priceRange = `${item.price.toLocaleString('ko-KR')}원`;
        }
        
        const transformedItem = {
          key: index + 1,
          id: item.id,
          imgSrc: item.imageUrl || item.thumbnail || '',
          title: item.title,
          // 빈 문자열이면 undefined로 전달하여 RequestCard의 기본값 사용
          priceRange: priceRange || undefined,
        };
        
        return transformedItem;
      });
    }
    
    return [];
  }, [requestSearchData, hasQuery, isRequestSearchLoading, qFromUrl]);

  // 주문제작 제안 아이템 변환
  const proposalItems = useMemo(() => {
    if (!hasQuery || isProposalSearchLoading || !proposalSearchData?.success) {
      return [];
    }
    
    const searchQuery = qFromUrl.trim().toLowerCase();
    
    if (proposalSearchData.success.results && Array.isArray(proposalSearchData.success.results) && proposalSearchData.success.results.length > 0) {
      return proposalSearchData.success.results
        .filter((item: SearchItem) => {
          // title 또는 content가 검색어를 포함하는지 확인
          const itemTitle = (item.title || '').toLowerCase();
          const itemContent = (item.content || '').toLowerCase();
          return itemTitle.includes(searchQuery) || itemContent.includes(searchQuery);
        })
        .map((item: SearchItem, index: number) => {
        // 이미지 URL 처리 (example.com 필터링 및 기본값 설정)
        const imageUrl = item.imageUrl || item.thumbnail || '';
        const imgSrc = imageUrl && !imageUrl.startsWith('https://example.com/') 
          ? imageUrl 
          : '/crt1.jpg'; // 기본 이미지
        
        // 가격 필드 확인 (여러 가능한 필드 체크)
        const price = item.price !== undefined && item.price !== null 
          ? `${item.price.toLocaleString('ko-KR')}원` 
          : '';
        
        return {
          key: index + 1,
          id: item.id,
          imgSrc,
          title: item.title,
          price,
          rating: item.avgStar || item.rating || item.star || 0,
          reviewCountText: item.reviewCountText || `(${item.reviewCount || item.review_count || 0})`,
          nickname: item.authorName || item.nickname || item.owner_nickname || item.ownerName || '',
        };
      });
    }
    
    return [];
  }, [proposalSearchData, hasQuery, isProposalSearchLoading, qFromUrl]);

  // 각 탭별 결과 개수 계산
  const marketCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    
    // 필터링된 배열 길이 사용
    return marketItems.length;
  }, [hasQuery, marketItems.length]);

  const requestCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    
    // 필터링된 배열 길이 사용
    return requestItems.length;
  }, [hasQuery, requestItems.length]);

  const proposalCount = useMemo(() => {
    if (!hasQuery) {
      return 0;
    }
    
    // 필터링된 배열 길이 사용
    return proposalItems.length;
  }, [hasQuery, proposalItems.length]);

  // cursor 저장 (다음 페이지를 위해)
  useEffect(() => {
    if (activeTab === 'market' && marketSearchData?.success?.nextCursor) {
      setCursors(prev => ({
        ...prev,
        market: {
          ...prev.market,
          [currentPage]: marketSearchData.success!.nextCursor!,
        },
      }));
    }
     
  }, [marketSearchData, currentPage, activeTab]);

  useEffect(() => {
    if (activeTab === 'request' && requestSearchData?.success?.nextCursor) {
      setCursors(prev => ({
        ...prev,
        request: {
          ...prev.request,
          [currentPage]: requestSearchData.success!.nextCursor!,
        },
      }));
    }
     
  }, [requestSearchData, currentPage, activeTab]);

  useEffect(() => {
    if (activeTab === 'proposal' && proposalSearchData?.success?.nextCursor) {
      setCursors(prev => ({
        ...prev,
        proposal: {
          ...prev.proposal,
          [currentPage]: proposalSearchData.success!.nextCursor!,
        },
      }));
    }
     
  }, [proposalSearchData, currentPage, activeTab]);

  // 현재 탭의 총 페이지 수 계산
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


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const isLoading = getCurrentIsLoading();
  
  // 현재 탭에 따른 결과 확인 (로딩 완료 후에만 확인)
  const hasResults = useMemo(() => {
    // 로딩 중이면 결과가 있다고 가정 (스켈레톤 표시를 위해)
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
  }, [activeTab, marketItems.length, requestItems.length, proposalItems.length, isLoading]);

  return (
    <div className="w-full mx-auto py-10">
      {/* 본문: 쿼리 있으면 검색 결과, 없으면 스켈레톤 */}
      <h2 className="heading-h2-bd text-[var(--color-black)] px-40 mb-22">
        {hasQuery ? (
          <>
            <span className="text-[var(--color-mint-1)]">&lsquo;{searchValue.trim()}&rsquo;</span> 검색 결과
          </>
        ) : (
          '검색 결과'
        )}
      </h2>
      {hasQuery ? (
        <>
          <div className="flex justify-between border-b border-[var(--color-line-gray-40)] mb-6 px-44">
            <button
              type="button"
              onClick={() => handleTabChange('market')}
              className={`px-35 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'market'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              마켓 ({marketCount})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('request')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'request'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 요청 ({requestCount})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('proposal')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'proposal'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 제안 ({proposalCount})
            </button>
          </div>
          {isLoading ? (
            <SearchResultSkeleton count={15} columns={3} />
          ) : hasResults ? (
            <>
              {activeTab === 'market' && marketItems.length > 0 && (
                <div
                  className="px-40 grid gap-x-10 gap-y-20 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {marketItems.map((item) => (
                    <MarketCard
                      key={item.item_id}
                      item={item}
                      onLikeClick={() => {}}
                      hideLikeButton={isReformer}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'request' && requestItems.length > 0 && (
                <div
                  className="px-40 grid gap-x-10 gap-y-34 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {requestItems.map((item: { key: number; id: string; imgSrc: string; title: string; priceRange?: string }) => (
                    <RequestCard
                      key={item.key}
                      id={item.id}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      priceRange={item.priceRange}
                      variant={isReformer ? 'reformer' : 'order'}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'proposal' && proposalItems.length > 0 && (
                <div
                  className="px-40 grid gap-x-10 gap-y-20 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {proposalItems.map((item: { key: number; id: string; imgSrc: string; title: string; price: string; rating: number; reviewCountText: string; nickname: string }) => (
                    <ProposalCard
                      key={item.key}
                      id={item.id}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      price={item.price}
                      rating={item.rating}
                      reviewCountText={item.reviewCountText}
                      nickname={item.nickname}
                      variant={isReformer ? 'reformer' : 'order'}
                    />
                  ))}
                </div>
              )}
              {totalPages >= 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <SearchResultEmpty />
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between border-b border-[var(--color-line-gray-40)] mb-6 px-44">
            <button
              type="button"
              onClick={() => handleTabChange('market')}
              className={`px-35 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'market'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              마켓 ({hasQuery ? marketCount : 0})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('request')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'request'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 요청 ({hasQuery ? requestCount : 0})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('proposal')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'proposal'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 제안 ({hasQuery ? proposalCount : 0})
            </button>
          </div>
          <SearchResultSkeleton count={15} columns={3} />
        </>
      )}
    </div>
  );
}
