import { useState, useRef, useEffect } from 'react';
import MarketCard, { type MarketCardItem } from '../../components/common/card/MarketCard';
import OrderCategoryFilter from '../../components/domain/order/OrderCategoryFilter';
import MarketSortDropdown from '../../components/domain/market/MarketSortDropdown';
import leftArrowIcon from '../../assets/icons/left.svg';
import rightArrowIcon from '../../assets/icons/right.svg';
import downArrowIcon from '../../assets/icons/down.svg';
import { useMarketProductList } from '../../hooks/domain/market/useMarketProductList';
import type { MarketProductItem } from '../../types/api/market/market';

const Market = () => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const {
    products,
    currentPage,
    totalPages,
    sort,
    handlePageChange,
    handleCategoryChange,
    handleSortChange,
  } = useMarketProductList();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortDropdownOpen]);

  const convertToMarketCardItem = (item: MarketProductItem): MarketCardItem => {
    return {
      item_id: item.item_id,
      thumbnail: item.thumbnail,
      title: item.title,
      price: item.price,
      star: item.star,
      review_count: item.review_count,
      owner_nickname: item.owner_nickname,
      is_wished: item.is_wished,
    };
  };

  const getSortLabel = () => {
    if (sort === 'popular') return '인기순';
    if (sort === 'latest') return '최신순';
    if (sort === 'rating') return '평점순';
    return '인기순';
  };
  
  return (
    <div className=" min-h-screen pb-[7.4375rem]">
      <div className="flex gap-[1.875rem] items-start pt-[0.9375rem]">
        
        <div className="pl-[3.125rem] sticky top-0">
          <div className="w-[237px] rounded-[1.875rem] py-[0.625rem] pr-[1.25rem]">
           <OrderCategoryFilter onCategoryChange={handleCategoryChange} />
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
              <div className='body-b1-rg text-[var(--color-gray-60)]'>총 {products.length}개의 작품</div>
              <div className="relative" ref={sortDropdownRef}>
                <div 
                  className='flex items-center gap-[0.4375rem] cursor-pointer' 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  {getSortLabel()}
                  <img 
                    src={downArrowIcon} 
                    alt="down"
                    className={`transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isSortDropdownOpen && (
                  <div className="absolute w-[330px] right-[-155px] top-full mt-2 z-10">
                    <MarketSortDropdown 
                      selectedSort={sort}
                      onSortChange={(newSort) => {
                        handleSortChange(newSort as 'popular' | 'latest' | 'rating');
                        setIsSortDropdownOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        
            <div className="grid grid-cols-3 gap-[1.875rem] mb-[3.75rem]">
              {products.map((product) => {
                const cardItem = convertToMarketCardItem(product);
                return (
                  <MarketCard
                    key={product.item_id}
                    item={cardItem}
                  />
                );
              })}
            </div>
             
          <div className="flex items-center justify-center gap-[0.875rem]">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >
              <img src={leftArrowIcon} alt="이전"  />
            </button>

            {totalPages > 0 && (
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
            )}

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
