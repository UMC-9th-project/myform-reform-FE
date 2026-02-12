import SearchResultEmpty from '../../components/domain/search-result/SearchResultEmpty';
import SearchResultSkeleton from '../../components/domain/search-result/SearchResultSkeleton';
import MarketCard from '../../components/common/card/MarketCard';
import RequestCard from '../../components/common/card/RequestCard';
import ProposalCard from '../../components/common/card/ProposalCard';
import Pagination from '../../components/common/pagination/Pagination';
import useAuthStore from '../../stores/useAuthStore';
import { useSearchPage } from '../../hooks/domain/search/useSearchPage';

export default function Search() {
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';

  const {
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
  } = useSearchPage();

  return (
    <div className="w-full mx-auto py-10">
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
                      hideLikeButton={isReformer}
                      ratingDecimals={1}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'request' && requestItems.length > 0 && (
                <div
                  className="px-40 grid gap-x-10 gap-y-34 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {requestItems.map((item) => (
                    <RequestCard
                      key={item.key}
                      id={item.id}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      priceRange={item.priceRange}
                      variant={isReformer ? 'reformer' : 'order'}
                      isWished={item.isWished}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'proposal' && proposalItems.length > 0 && (
                <div
                  className="px-40 grid gap-x-10 gap-y-20 w-full mt-10"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {proposalItems.map((item) => (
                    <ProposalCard
                      key={item.key}
                      id={item.id}
                      imgSrc={item.imgSrc}
                      title={item.title}
                      price={item.price}
                      rating={item.rating}
                      ratingDecimals={1}
                      reviewCountText={item.reviewCountText}
                      nickname={item.nickname}
                      variant={isReformer ? 'reformer' : 'order'}
                      isWished={item.isWished}
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
