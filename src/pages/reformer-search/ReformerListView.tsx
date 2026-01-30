import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import Select from '../../components/common/Dropdown/SortDropdown';
import ReformerProfileCard from '../../components/domain/reformer-search/ReformerProfileCard';
import Pagination from '../../components/common/Pagination/Pagination';

// 더미 데이터 (132명 시뮬레이션)
const generateMockReformers = () => {
  const reformers = [];
  for (let i = 1; i <= 132; i++) {
    reformers.push({
      id: i,
      name: `침착한 대머리독수리 ${i}`,
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
      tags: ['#빠른', '#친절한'],
    });
  }
  return reformers;
};

const MOCK_REFORMERS = generateMockReformers();
const ITEMS_PER_PAGE = 15;
const TOTAL_PAGES = Math.ceil(MOCK_REFORMERS.length / ITEMS_PER_PAGE);

const SORT_OPTIONS = [
  { value: 'alphabetical', label: '가나다순' },
  { value: 'rating', label: '평점순' },
  { value: 'transaction', label: '거래 많은순' },
];

const ReformerListView = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('alphabetical');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedReformers = MOCK_REFORMERS.slice(startIndex, endIndex);

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
              총 {MOCK_REFORMERS.length}명의 리폼러
            </p>

            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>

        {/* 리폼러 그리드 */}
        <div className="px-0 md:px-[110px] mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {displayedReformers.map((reformer) => (
              <ReformerProfileCard
                key={reformer.id}
                name={reformer.name}
                rating={reformer.rating}
                reviewCount={reformer.reviewCount}
                transactionCount={reformer.transactionCount}
                description={reformer.description}
                tags={reformer.tags}
                onClick={() => navigate('/profile')}
              />
            ))}
          </div>
        </div>

        {/* 페이지네이션 */}
        <Pagination totalPages={TOTAL_PAGES} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ReformerListView;
