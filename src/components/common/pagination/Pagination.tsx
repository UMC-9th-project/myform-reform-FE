import React, { useState } from 'react';

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages = 13, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_GROUP_SIZE = 10; // 한 번에 보여줄 페이지 수

  // 1. 현재 페이지가 속한 그룹 계산 (0부터 시작)
  const currentGroupIndex = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);

  // 2. 현재 그룹의 시작 페이지와 끝 페이지 계산
  const startPage = currentGroupIndex * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  // 3. 현재 그룹에 해당하는 숫자 배열 생성
  const pagesToShow = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className="flex items-center justify-center gap-3 py-10 bg-transparent">
      {/* 이전 페이지 버튼: 1페이지가 아니면 항상 활성화 */}
      <button 
        onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
        className={`p-2 transition-colors ${currentPage === 1 ? 'text-[var(--color-gray-40)]' : 'text-black hover:bg-gray-100 rounded-full'}`}
        disabled={currentPage === 1}
        title="이전 페이지"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 페이지 번호 목록: 계산된 pagesToShow만 렌더링 */}
      <div className="flex items-center gap-1">
        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full body-b1-rg transition-all
              ${currentPage === page 
                ? 'bg-[var(--color-gray-30)] text-black' 
                : 'bg-white text-[var(--color-gray-60)] hover:bg-[var(--color-gray-30)]'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 다음 페이지 버튼: 마지막 페이지가 아니면 활성화 */}
      <button 
        onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
        className={`p-2 transition-colors ${currentPage === totalPages ? 'text-[var(--color-gray-40)]' : 'text-black hover:bg-gray-100 rounded-full'}`}
        disabled={currentPage === totalPages}
        title="다음 페이지"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;