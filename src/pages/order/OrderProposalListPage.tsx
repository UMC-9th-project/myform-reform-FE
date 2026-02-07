import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import ProposalCard from '../../components/common/card/ProposalCard';
import Pagination from '../../components/common/pagination/Pagination';
import OrderCategoryFilter from '../../components/domain/order/OrderCategoryFilter';
import Select from '../../components/common/dropdown/SortDropdown';
import { useOrderProposalList } from '../../hooks/domain/order/useOrderProposalList';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

const OrderProposalListPage = () => {
  const {
    proposals,
    isLoading,
    isError,
    selectedCategory,
    sortValue,
    totalPages,
    handlePageChange,
    handleCategoryChange,
    handleSortChange,
  } = useOrderProposalList();

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/order' },
    { label: '주문제작 제안' },
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
                    : `총 ${proposals.length}개의 제품`}
                </p>
                <Select
                  options={[
                    { value: 'popular', label: '인기순' },
                    { value: 'latest', label: '최신순' },
                    { value: 'rating', label: '평점순' },
                  ]}
                  value={sortValue}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            {/* 제안 카드 그리드 */}
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-[1.875rem]">
                {isLoading && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    불러오는 중...
                  </p>
                )}
                {isError && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    제안 목록을 불러오지 못했어요.
                  </p>
                )}
                {!isLoading && !isError && proposals.length === 0 && (
                  <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3 py-8">
                    등록된 제안이 없어요.
                  </p>
                )}
                {!isLoading &&
                  !isError &&
                  proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.reformProposalId}
                      id={proposal.reformProposalId}
                      variant="order"
                      imgSrc={proposal.thumbnail}
                      title={proposal.title}
                      price={formatWon(proposal.price)}
                      rating={proposal.avgStar}
                      reviewCountText={`(${proposal.reviewCount})`}
                      nickname={proposal.ownerName}
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

export default OrderProposalListPage;

