import { useState } from 'react';

const CategorySelect = () => {
  const categories = ['의류', '잡화', '악세서리', '홈·리빙', '기타'];

  const subCategories: Record<string, string[]> = {
    의류: ['상의', '하의', '아우터', '기타'],
    잡화: ['가방·짐색', '지갑·파우치', '모자·캡·비니', '기타'],
    악세서리: ['헤어 악세서리', '폰케이스', '키링', '기타'],
    '홈·리빙': ['패브릭 소품', '쿠션·방석', '기타'],
    기타: [],
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // 대분류 변경 시 소분류 선택 초기화
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <div className="border border-[var(--color-line-gray-40)] w-[780px] min-h-[285px]">
      <div className="flex h-full">
        {/* 대분류 컬럼 */}
        <div className="flex flex-col border-r border-[var(--color-line-gray-40)] w-[390px]">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`text-left pt-[15px] pr-5 pb-[15px] pl-5 h-[57px] ${
                selectedCategory === category
                  ? 'bg-[var(--color-gray-20)] body-b1-md'
                  : 'bg-white body-b1-rg hover:bg-[var(--color-gray-20)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 소분류 컬럼 */}
        <div className="flex-1 flex flex-col">
          {selectedCategory ? (
            subCategories[selectedCategory].length > 0 ? (
              <div className="flex flex-col">
                {subCategories[selectedCategory].map((subCategory) => (
                  <button
                    key={subCategory}
                    type="button"
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={`text-left pt-[15px] pr-5 pb-[15px] pl-5 h-[57px] ${
                      selectedSubCategory === subCategory
                        ? 'bg-[var(--color-gray-20)] body-b1-md'
                        : 'bg-white body-b1-rg hover:bg-[var(--color-gray-20)]'
                    }`}
                  >
                    {subCategory}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[var(--color-gray-50)]">
                  소분류가 없습니다.
                </p>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[var(--color-gray-50)]">소분류 선택</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
