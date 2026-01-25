import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import RequestCard from '../../../components/domain/order/Request';
import Pagination from '../../../components/common/Pagination/Pagination';
import OrderCategoryFilter from '../../../components/domain/order/OrderCategoryFilter';

// 더미 데이터 (132개 시뮬레이션)
const generateMockRequests = () => {
  const requests = [];
  for (let i = 1; i <= 132; i++) {
    requests.push({
      id: i,
      img: '/crt1.jpg',
      name: '예쁘게 짐색 리폼해주실분, 리폼 요청합니다.',
      price: '30,000원~50,000원',
    });
  }
  return requests;
};

const MOCK_REQUESTS = generateMockRequests();
const ITEMS_PER_PAGE = 15; // 3열 x 5행
const TOTAL_PAGES = Math.ceil(MOCK_REQUESTS.length / ITEMS_PER_PAGE);

const ReformerOrderRequestListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryTitle: string;
    itemLabel: string;
  } | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (
    categoryIndex: number,
    itemId: number,
    categoryTitle: string,
    itemLabel: string
  ) => {
    setSelectedCategory({ categoryTitle, itemLabel });
    console.log('카테고리 변경:', categoryIndex, itemId, categoryTitle, itemLabel);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRequests = MOCK_REQUESTS.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/reformer/order' },
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
                  총 {MOCK_REQUESTS.length}개의 제품
                </p>
                <p className="body-b1-rg text-[var(--color-gray-60)]">
                  최신순
                </p>
              </div>
            </div>

            {/* 요청 카드 그리드 */}
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-[1.875rem]">
                {displayedRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => navigate(`/reformer/order/requests/${request.id}`)}
                    className="cursor-pointer"
                  >
                    <RequestCard
                      imgSrc={request.img}
                      title={request.name}
                      priceRange={request.price}
                      className="pb-[5.875rem] w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 페이지네이션 */}
            <Pagination totalPages={TOTAL_PAGES} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformerOrderRequestListPage;
