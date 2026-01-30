import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import SuggestionCard from '../../components/domain/order/Suggestion';
import Pagination from '../../components/common/Pagination/Pagination';
import OrderCategoryFilter from '../../components/domain/order/OrderCategoryFilter';
import Select from '../../components/common/dropdown/SortDropdown';

// 더미 데이터 (132개 시뮬레이션)
const generateMockSuggestions = () => {
  const suggestions = [];
  for (let i = 1; i <= 132; i++) {
    suggestions.push({
      id: i,
      img: '/wsh1.jpg',
      name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      price: '75,000원',
      review: 4.9,
      reviewCount: 271,
      nickname: '침착한 대머리독수리',
    });
  }
  return suggestions;
};

const MOCK_SUGGESTIONS = generateMockSuggestions();
const ITEMS_PER_PAGE = 15; // 3열 x 5행
const TOTAL_PAGES = Math.ceil(MOCK_SUGGESTIONS.length / ITEMS_PER_PAGE);

const OrderSuggestionListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryTitle: string;
    itemLabel: string;
  } | null>(null);
  const [sortValue, setSortValue] = useState<string>('popular');

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
  const displayedSuggestions = MOCK_SUGGESTIONS.slice(startIndex, endIndex);

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
                  총 {MOCK_SUGGESTIONS.length}개의 제품
                </p>
                <Select
                  options={[
                    { value: 'popular', label: '인기순' },
                    { value: 'latest', label: '최신순' },
                    { value: 'rating', label: '평점순' },
                  ]}
                  value={sortValue}
                  onChange={(value) => {
                    setSortValue(value);
                    console.log('정렬 변경:', value);
                    // 정렬 로직 추가 가능
                  }}
                />
              </div>
            </div>

            {/* 제안 카드 그리드 */}
            <div className="mb-12">
              <div className="grid grid-cols-3 gap-[1.875rem]">
                {displayedSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => navigate(`/order/suggestions/${suggestion.id}`)}
                    className="cursor-pointer"
                  >
                    <SuggestionCard
                      imgSrc={suggestion.img}
                      title={suggestion.name}
                      price={suggestion.price}
                      rating={suggestion.review}
                      reviewCountText={`(${suggestion.reviewCount})`}
                      nickname={suggestion.nickname}
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

export default OrderSuggestionListPage;
