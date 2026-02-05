import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import Select from '../../components/common/dropdown/SortDropdown';
import ReformerProfileCard from '../../components/domain/reformer-search/ReformerProfileCard';
import { useReformerListView } from '../../hooks/domain/reformer-search/useReformerListView';

const SORT_OPTIONS = [
  { value: 'alphabetical', label: '가나다순' },
  { value: 'rating', label: '평점순' },
  { value: 'transaction', label: '거래 많은순' },
];

const ReformerListView = () => {
  const navigate = useNavigate();
  const {
    sortBy,
    setSortBy,
    reformers,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    observerTargetRef,
  } = useReformerListView();

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '리폼러 찾기', path: '/reformer-search' },
    { label: '전체 보기' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-6 md:mb-8 pl-0 md:pl-[110px]">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 헤더 */}
        <div className="mb-8 md:mb-12 pl-0 md:pl-[110px]">
          <h1 className="heading-h4-bd text-[var(--color-black)] mb-2">
            리폼러 탐색하기
          </h1>
          <p className="heading-h5-rg text-[var(--color-gray-50)] mb-6">
            모든 리폼러를 한 눈에 확인하세요.
          </p>

          {/* 총 리폼러 수 및 정렬 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="body-b1-rg text-[var(--color-black)]">
              총 {totalCount}명의 리폼러
            </p>

            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(value) => setSortBy(value as typeof sortBy)}
            />
          </div>
        </div>

        {/* 리폼러 그리드 */}
        <div className="px-0 md:px-[110px] mb-12">
          {isError ? (
            <div className="py-16 text-center body-b2-rg text-[var(--color-gray-60)]">
              리폼러 목록을 불러오지 못했습니다.
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--color-gray-30)] rounded-[1.25rem] animate-pulse"
                  style={{ minHeight: '250px' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
              {reformers.map((reformer) => (
                <ReformerProfileCard
                  key={reformer.owner_id}
                  reformer={reformer}
                  onClick={() => navigate('/profile')}
                />
              ))}
            </div>
          )}

          {/* 무한 스크롤 감지 영역 */}
          <div ref={observerTargetRef} className="h-20 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="text-[var(--color-gray-50)] body-b2-rg">
                로딩 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformerListView;
