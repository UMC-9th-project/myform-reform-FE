import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import ReformerSearchResultSkeleton from '../../components/domain/reformer-search/ReformerSearchResultSkeleton';
import Pagination from '../../components/common/Pagination/Pagination';

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
      <div className="px-[3.125rem] pt-[3.125rem]">
        {/* 제목 */}
        <div className="mb-[2rem] pl-[110px]">
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

        {/* 스켈레톤 로딩 - 검색어 입력 중에만 표시 */}
        {searchInput.trim() && <ReformerSearchResultSkeleton count={8} />}

        {/* 페이지네이션 */}
        <Pagination totalPages={10} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ReformerSearchResults;
