import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import ReformerSearchResultSkeleton from '../../components/domain/reformer-search/ReformerSearchResultSkeleton';
import ReformerSearchResultCard from '../../components/domain/reformer-search/ReformerSearchResultCard';
import Pagination from '../../components/common/Pagination/Pagination';
import ReformerSearchResultEmpty from '../../components/domain/reformer-search/ReformerSearchResultEmpty';

type MockReformerSearchResult = {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
};

// 검색 결과 더미 데이터
const MOCK_SEARCH_RESULTS: MockReformerSearchResult[] = [
  {
    id: 1,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 2,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 3,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 4,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 5,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 6,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 7,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 8,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어있던 옷에 새로운 가치와...',
    tags: ['#빠른', '#친절한'],
  },
];

const ReformerSearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchInput(''); // 검색 실행 시 입력값 초기화
      navigate(`/reformer-search/results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    // 검색어를 모두 지웠을 때 메인 검색 페이지로 이동
    if (!value.trim() && query) {
      navigate('/reformer-search');
    }
  };

  const handlePageChange = (page: number) => {
    // 페이지 변경 로직
    console.log('페이지 변경:', page);
  };

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
        {searchInput.trim() && (
          <div className="mb-[2.5rem]">
            <ReformerSearchResultSkeleton count={8} />
          </div>
        )}

        {/* 검색 결과 리스트 / Empty */}
        {!searchInput.trim() && query && (
          <>
            {MOCK_SEARCH_RESULTS.length > 0 ? (
              <>
                <div className="pt-16 flex flex-col items-center gap-4 mb-[2.5rem]">
                  {MOCK_SEARCH_RESULTS.map((reformer, index) => (
                    <ReformerSearchResultCard
                      key={reformer.id}
                      name={reformer.name}
                      rating={reformer.rating}
                      reviewCount={reformer.reviewCount}
                      transactionCount={reformer.transactionCount}
                      description={reformer.description}
                      tags={reformer.tags}
                      isLast={index === MOCK_SEARCH_RESULTS.length - 1}
                    />
                  ))}
                </div>
                <Pagination totalPages={10} onPageChange={handlePageChange} />
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
