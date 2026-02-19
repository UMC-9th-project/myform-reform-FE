import { useState } from 'react';
import LeftIcon from '../../../assets/icons/left.svg?react';
import RightIcon from '../../../assets/icons/right.svg?react';

const PageNumber = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 10;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 왼쪽 화살표 */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center justify-center"
      >
        <LeftIcon className="w-9 h-9 text-gray-400" />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`w-[3.125rem] h-[3.125rem] rounded-full flex items-center justify-center ${
              currentPage === page
                ? 'bg-[var(--color-gray-30)] text-black'
                : 'bg-white text-[var(--color-gray-60)]'
            } hover:opacity-80 transition-opacity`}
          >
            <span className="body-b1-rg">{page}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center"
      >
        <RightIcon className="w-9 h-9 text-black" />
      </button>
    </div>
  );
};

export default PageNumber;
