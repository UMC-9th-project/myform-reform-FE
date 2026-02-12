import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import ReformerList from '../../components/domain/reformer-search/ReformerList';
import ReformFeed from '../../components/domain/reformer-search/ReformFeed';
import ReformerSearchResultSkeleton from '../../components/domain/reformer-search/ReformerSearchResultSkeleton';
import { useReformerSearchHome } from '../../hooks/domain/reformer-search/useReformerSearchHome';

const ReformerSearch = () => {
  const {
    isTyping,
    handleSearch,
    handleInputChange,
    reformerPreviewItems,
    isReformerListLoading,
    preferenceFeeds,
    navigate,
  } = useReformerSearchHome();
 
  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-[2.5rem] pl-0 md:pl-[110px]">
          리폼러 찾기
        </h1>

        {/* 검색 바 */}
        <ReformerSearchEngine 
          onSearch={handleSearch} 
          onInputChange={handleInputChange}
          showBlur={!isTyping}
        />

        {/* 검색어 입력 중 스켈레톤 표시 */}
        {isTyping && (
          <div className="mb-[2.5rem]">
            <ReformerSearchResultSkeleton />
          </div>
        )}

        {/* 전체 리폼러 한눈에 보기 */}
        {!isTyping && (
          <>
            {isReformerListLoading ? (
              <section className="pt-8 md:pt-[4.375rem] pb-12 md:pb-[6.25rem] px-4 md:px-[110px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 md:pb-[1.875rem] gap-4">
                  <h2 className="heading-h4-bd text-[var(--color-black)]">
                    전체 리폼러 한눈에 보기 👀
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/reformer-search/all')}
                    className="body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors flex items-center gap-[0.5rem] cursor-pointer"
                  >
                    더보기
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--color-gray-30)] rounded-[1.25rem] animate-pulse"
                      style={{ minHeight: '250px' }}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <ReformerList
                items={reformerPreviewItems}
                onMoreClick={() => navigate('/reformer-search/all')}
              />
            )}

            {/* 내 리폼 취향 탐색해보기 */}
            <ReformFeed 
              feeds={preferenceFeeds}
              onMoreClick={() => navigate('/reformer-search/feed')}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReformerSearch;
