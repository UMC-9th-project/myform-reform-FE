import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import RequestCard from '../../components/common/card/RequestCard';
import Pagination from '../../components/common/pagination/Pagination';
import OrderCategoryFilter from '../../components/domain/order/OrderCategoryFilter';
import { useOrderRequestList } from '../../hooks/domain/order/useOrderRequestList';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatBudgetRange(minBudget: number, maxBudget: number) {
  return `${formatWon(minBudget)}~${formatWon(maxBudget)}`;
}

const OrderRequestListPage = () => {
  const {
    requests,
    isLoading,
    isError,
    selectedCategory,
    totalPages,
    handlePageChange,
    handleCategoryChange,
  } = useOrderRequestList();

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/order' },
    { label: '주문제작 요청' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
       

        {/* 메인 콘텐츠 영역 (사이드바 + 메인 콘텐츠) */}
        <div className="flex gap-[3.125rem] ">
          {/* 왼쪽 사이드바 - 카테고리 필터 */}
          <OrderCategoryFilter onCategoryChange={handleCategoryChange} />

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="flex flex-col flex-1 max-w-full">
             {/* 브레드크럼 */}
            <div className="body-b1-rg text-[var(--color-gray-60)] mb-4  ">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {/* 페이지 제목 */}
            <h1 className="heading-h4-bd text-[var(--color-black)] mb-6 ">
              {selectedCategory
                ? `${selectedCategory.categoryTitle} > ${selectedCategory.itemLabel}`
                : '전체'}
            </h1>

            {/* 헤더 */}
            <div className="mb-5 mt-3">
              <div className="flex flex-row items-start sm:items-center justify-between ">
                <p className="body-b1-rg text-[var(--color-gray-60)]">
                  {isLoading
                    ? '불러오는 중...'
                    : `총 ${requests.length}개의 제품`}
                </p>
                <p className="body-b1-rg text-[var(--color-gray-60)]">
                  최신순
                </p>
              </div>
            </div>

            {/* 요청 카드 그리드 */}
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-[1.875rem]">
                {isLoading && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    불러오는 중...
                  </p>
                )}
                {isError && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    요청 목록을 불러오지 못했어요.
                  </p>
                )}
                {!isLoading && !isError && requests.length === 0 && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    등록된 요청이 없어요.
                  </p>
                )}
                {!isLoading &&
                  !isError &&
                  requests.map((request) => (
                    <RequestCard
                      key={request.reformRequestId}
                      id={request.reformRequestId}
                      variant="order"
                      imgSrc={request.thumbnail}
                      title={request.title}
                      priceRange={formatBudgetRange(request.minBudget, request.maxBudget)}
                      className="pb-[5.875rem] w-full"
                    />
                  ))}
              </div>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderRequestListPage;
