import { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryAccordion from '../../components/domain/market/CategoryAccordion';
import WishlistItemCard from '../../components/domain/wishlist/WishlistItemCard';
import leftArrowIcon from '../../assets/icons/left.svg';
import rightArrowIcon from '../../assets/icons/right.svg';
import downArrowIcon from '../../assets/icons/down.svg';

// 임시 제품 데이터
const mockProducts = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  image: 'public/crt1.jpg',
  title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  price: 75000,
  rating: 4.9,
  reviewCount: 271,
  seller: '침착한 대머리독수리',
}));

const Market = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = 132;
  const productsPerPage = 15;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className=" min-h-screen pb-[7.4375rem]">
      <div className="flex gap-[1.875rem] items-start pt-[0.9375rem]">
        
        <div className="pl-[3.125rem] sticky top-0">
          <div className="w-[237px] rounded-[1.875rem] py-[0.625rem] pr-[1.25rem]">
            <CategoryAccordion />
          </div>
        </div>

        <div className="flex-1 pr-[3.125rem] pt-[0.9375rem]"> 
          <div className="body-b1-rg text-[var(--color-gray-60)] mb-[0.5rem]">
            홈 &gt; 마켓
          </div>
          <div className="mb-[0.5rem]">
            <h1 className="heading-h2-bd text-[2.5rem] mb-[0.875rem]">
              마켓 홈
            </h1>
            <div className="flex items-center justify-between">
              <p className="body-b1-rg text-[var(--color-gray-60)]">
                총 {totalProducts}개의 제품
              </p>
              <div className='flex items-center gap-[0.4375rem]'>인기순 <img src={downArrowIcon} alt="down"/></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[1.875rem] mb-[3.75rem]">
            {mockProducts.map((product) => (
              <Link
                key={product.id}
                to={`/market/product/${product.id}`}
                className="block"
              >
                <WishlistItemCard item={product} onRemove={() => {}} />
              </Link>
            ))}
          </div>

         
          <div className="flex items-center justify-center gap-[0.875rem]">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >
              <img src={leftArrowIcon} alt="이전"  />
            </button>

            <div className="flex gap-[0.3125rem] items-center">
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isSelected = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-[3.125rem] h-[3.125rem] rounded-full flex items-center justify-center body-b1-rg ${
                      isSelected
                        ? 'bg-[var(--color-gray-30)] text-[var(--color-black)]'
                        : 'bg-white text-[var(--color-gray-60)] hover:bg-[var(--color-gray-20)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >
              <img src={rightArrowIcon} alt="다음"  />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
