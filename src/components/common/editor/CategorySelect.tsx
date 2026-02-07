import { useState } from 'react';

interface CategorySelectProps {
  onCategoryChange?: (category: string | null) => void;
  onSubCategoryChange?: (subCategory: string | null) => void;
  initialCategory?: string | null;
  initialSubCategory?: string | null;
}

const CategorySelect = ({
  onCategoryChange,
  onSubCategoryChange,
  initialCategory = null,
  initialSubCategory = null,
}: CategorySelectProps) => {
  const categories = ['의류', '잡화', '악세서리', '홈·리빙', '기타'];

  const subCategories: Record<string, string[]> = {
    의류: ['상의', '하의', '아우터', '기타'],
    잡화: ['가방·짐색', '지갑·파우치', '모자·캡·비니', '기타'],
    악세서리: ['헤어 악세서리', '폰케이스', '키링', '기타'],
    '홈·리빙': ['패브릭 소품', '쿠션·방석', '기타'],
    기타: [],
  };

  const [internalCategory, setInternalCategory] = useState<string | null>(
    initialCategory ?? null
  );
  const [internalSubCategory, setInternalSubCategory] = useState<string | null>(
    initialSubCategory ?? null
  );

  // 부모가 넘긴 값이 있으면 그걸 표시(수정 페이지 등), 없으면 내부 state(작성 페이지). 빈 문자열은 미선택으로 처리
  const hasInitialMajor = initialCategory != null && initialCategory !== '';
  const hasInitialSub = initialSubCategory != null && initialSubCategory !== '';
  const displayCategory = hasInitialMajor ? initialCategory : internalCategory;
  const displaySubCategory = hasInitialSub ? initialSubCategory : internalSubCategory;

  const handleCategoryClick = (category: string) => {
    setInternalCategory(category);
    setInternalSubCategory(null);
    onCategoryChange?.(category);
    onSubCategoryChange?.(null);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setInternalSubCategory(subCategory);
    onSubCategoryChange?.(subCategory);
  };

  return (
    <div className="border border-[var(--color-line-gray-40)] w-full min-h-[285px]">
      <div className="flex h-full">
        {/* 대분류 컬럼 */}
        <div className="flex flex-col border-r border-[var(--color-line-gray-40)] w-1/2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`text-left pt-[15px] pr-5 pb-[15px] pl-5 h-[57px] ${
                displayCategory === category
                  ? 'bg-[var(--color-gray-20)] body-b1-md'
                  : 'bg-white body-b1-rg hover:bg-[var(--color-gray-20)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 소분류 컬럼 */}
        <div className="w-1/2 flex flex-col">
          {displayCategory ? (
            subCategories[displayCategory].length > 0 ? (
              <div className="flex flex-col">
                {subCategories[displayCategory].map((subCategory) => (
                  <button
                    key={subCategory}
                    type="button"
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={`text-left pt-[15px] pr-5 pb-[15px] pl-5 h-[57px] ${
                      displaySubCategory === subCategory
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
