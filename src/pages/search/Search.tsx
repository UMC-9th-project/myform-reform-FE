import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResultEmpty from '../../components/domain/search-result/SearchResultEmpty';
import SearchResultSkeleton from '../../components/domain/search-result/SearchResultSkeleton';
import MarketCard, { type MarketCardItem } from '../../components/common/card/MarketCard';
import RequestCard from '../../components/common/card/RequestCard';
import SuggestionCard from '../../components/common/card/SuggestionCard';
import Pagination from '../../components/common/pagination/Pagination';

export default function Search() {
  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';

  const [searchValue, setSearchValue] = useState(qFromUrl);

  useEffect(() => {
    setSearchValue(qFromUrl);
  }, [qFromUrl]);

  const hasQuery = searchValue.trim().length > 0;

  // 검색 시 스켈레톤을 잠깐 보여줌 (실제 API 연동 시 로딩 상태로 대체)
  const [isLoading, setIsLoading] = useState(() => qFromUrl.trim().length > 0);
  useEffect(() => {
    if (!hasQuery) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [hasQuery, qFromUrl]);

  type SearchTab = 'market' | 'request' | 'proposal';
  const [activeTab, setActiveTab] = useState<SearchTab>('market');

  // TODO: 실제 API 연동 시 검색 결과 개수로 교체 (0이면 빈 결과)
  const hasResults = true;

  // TODO: 마켓 탭 실제 API 연동 시 교체
  const marketItemBase: Omit<MarketCardItem, 'id'> = {
    image: '/Home/images/p1.jpg',
    title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  };
  const marketItems: MarketCardItem[] = Array.from({ length: 15 }, (_, i) => ({
    ...marketItemBase,
    id: i + 1,
  }));

  // TODO: 주문제작 요청 탭 실제 API 연동 시 교체
  const requestItemBase = {
    imgSrc: '/crt1.jpg',
    title: '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
    priceRange: '30,000원~50,000원',
  };
  const requestItems = Array.from({ length: 12 }, (_, i) => ({
    ...requestItemBase,
    key: i + 1,
  }));

  // TODO: 주문제작 제안 탭 실제 API 연동 시 교체
  const suggestionItemBase = {
    imgSrc: '/wsh1.jpg',
    title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: '75,000원',
    rating: 4.9,
    reviewCountText: '(271)',
    nickname: '침착한 대머리독수리',
  };
  const suggestionItems = Array.from({ length: 15 }, (_, i) => ({
    ...suggestionItemBase,
    key: i + 1,
  }));

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
              onClick={() => setActiveTab('market')}
              className={`px-35 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'market'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              마켓 (34)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'request'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 요청 (12)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proposal')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'proposal'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 제안 (55)
            </button>
          </div>
          {isLoading ? (
            <SearchResultSkeleton count={15} columns={3} />
          ) : hasResults ? (
            <>
              {activeTab === 'market' && (
                <div
                  className="px-40 grid gap-x-10 gap-y-20 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {marketItems.map((item) => (
                    <MarketCard
                      key={item.id}
                      item={item}
                      onLikeClick={() => {}}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'request' && (
                <div
                  className="px-40 grid gap-x-10 gap-y-30 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {requestItems.map((item) => (
                    <RequestCard
                      key={item.key}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      priceRange={item.priceRange}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'proposal' && (
                <div
                  className="px-40 grid gap-x-10 gap-y-30 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {suggestionItems.map((item) => (
                    <SuggestionCard
                      key={item.key}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      price={item.price}
                      rating={item.rating}
                      reviewCountText={item.reviewCountText}
                      nickname={item.nickname}
                    />
                  ))}
                </div>
              )}
              <Pagination
                totalPages={10}
                onPageChange={() => {
                  // TODO: 실제 API 연동 시 페이지 변경 처리 (예: URL ?page= 적용)
                }}
              />
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
              onClick={() => setActiveTab('market')}
              className={`px-35 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'market'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              마켓
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'request'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 요청
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proposal')}
              className={`px-30 pt-1 pb-3 body-b0-bd border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === 'proposal'
                  ? 'border-[var(--color-mint-1)] text-[var(--color-mint-1)]'
                  : 'border-transparent text-[var(--color-gray-60)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              주문제작 제안
            </button>
          </div>
          <SearchResultSkeleton count={15} columns={3} />
        </>
      )}
    </div>
  );
}
