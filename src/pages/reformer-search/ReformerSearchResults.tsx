import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import ReformerSearchResultSkeleton from '../../components/domain/reformer-search/ReformerSearchResultSkeleton';
import ReformerSearchResultCard from '../../components/domain/reformer-search/ReformerSearchResultCard';
import ReformerSearchResultEmpty from '../../components/domain/reformer-search/ReformerSearchResultEmpty';
import { useReformerSearchResults } from '../../hooks/domain/reformer-search/useReformerSearchResults';

const ReformerSearchResults = () => {
  const {
    query,
    isTyping,
    handleSearch,
    handleInputChange,
    reformers,
    isLoading,
    isError,
    isFetchingNextPage,
    observerTargetRef,
  } = useReformerSearchResults();

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 제목 */}
        <div className="mb-[2rem] pl-0 md:pl-[110px]">
          <h1 className="heading-h2-bd mb-[0.5rem]">
            <span className="text-[var(--color-mint-1)]">‘</span>
            <span className="text-[var(--color-mint-1)]">{query}</span>
            <span className="text-[var(--color-mint-1)]">’ </span>
            <span className="text-[var(--color-black)]">검색 결과</span>

          </h1>
          {/* 선택된 탭 표시선 */}
        </div>

        {/* 검색 바 */}
        <ReformerSearchEngine
          placeholder={query || '원하는 리폼러를 검색해보세요.'}
          defaultValue={query}
          onSearch={handleSearch}
          onInputChange={handleInputChange}
          showBlur={false}
          className="mb-[2.5rem]"
        />

        {/* 검색어 입력 중 스켈레톤 표시 */}
        {isTyping && (
          <div className="mb-[2.5rem]">
            <ReformerSearchResultSkeleton />
          </div>
        )}

        {/* 검색 결과 리스트 / Empty */}
        {!isTyping && query && (
          <>
            {isError ? (
              <ReformerSearchResultEmpty />
            ) : isLoading ? (
              <div className="mb-[2.5rem]">
                <ReformerSearchResultSkeleton />
              </div>
            ) : reformers.length > 0 ? (
              <>
                <div className="pt-16 flex flex-col items-center gap-4 mb-[2.5rem]">
                  {reformers.map((reformer, index) => (
                    <ReformerSearchResultCard
                      key={reformer.owner_id}
                      reformer={reformer}
                      isLast={index === reformers.length - 1}
                    />
                  ))}
                </div>
                <div
                  ref={observerTargetRef}
                  className="h-20 flex items-center justify-center"
                >
                  {isFetchingNextPage && (
                    <div className="text-[var(--color-gray-50)] body-b2-rg">
                      로딩 중...
                    </div>
                  )}
                </div>
              </>
            ) : (
              <ReformerSearchResultEmpty />
            )}
          </>
        )}
        
      </div>
        
    </div>
  );
};

export default ReformerSearchResults;
