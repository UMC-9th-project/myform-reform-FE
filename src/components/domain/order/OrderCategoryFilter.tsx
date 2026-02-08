import { useMemo, useState } from 'react';
import downArrow from '../../../assets/icons/down.svg';
import { useMarket } from '../../../hooks/domain/market/useMarket';

interface CategoryItem {
  id: string;
  label: string;
}

interface CategoryData {
  title: string;
  items: CategoryItem[];
  defaultOpen?: boolean;
}

// 허용된 카테고리 이름 목록
const ALLOWED_CATEGORY_NAMES = ['의류', '잡화', '홈·리빙', '기타', ];

// 하위 카테고리 하드코드 데이터
const HARDCODED_SUBCATEGORIES: Record<string, CategoryItem[]> = {
  '의류': [
    { id: '1', label: '전체' },
    { id: '2', label: '상의' },
    { id: '3', label: '하의' },
    { id: '4', label: '아우터' },
  ],
  '잡화': [
    { id: '1', label: '전체' },
    { id: '2', label: '가방·짐색' },
    { id: '3', label: '지갑·파우치' },
    { id: '4', label: '모자·캡·비니' },
  ],
  '홈·리빙': [
    { id: '1', label: '전체' },
    { id: '2', label: '패브릭 소품' },
    { id: '3', label: '쿠션·방석' },
  ],
  '기타': [
    { id: '1', label: '전체' },
  ],
};

interface OrderCategoryFilterProps {
  onCategoryChange?: (categoryIndex: number, itemId: number, categoryTitle: string, itemLabel: string) => void;
}

const OrderCategoryFilter = ({ onCategoryChange }: OrderCategoryFilterProps) => {
  const { data: categories, isLoading, isError } = useMarket();

  // API에서 상위 카테고리 이름만 가져와서 하드코드된 하위 항목과 매핑
  const categoriesData = useMemo<CategoryData[]>(() => {
    // API 데이터가 없으면 하드코드된 카테고리 사용
    if (!categories || categories.length === 0) {
      return ALLOWED_CATEGORY_NAMES.map((name) => ({
        title: name,
        items: HARDCODED_SUBCATEGORIES[name] || [{ id: '1', label: '전체' }],
        defaultOpen: false,
      }));
    }

    const filtered = categories
      .filter((category) => 
        category?.market?.name && ALLOWED_CATEGORY_NAMES.includes(category.market.name)
      )
      .map((category) => {
        const categoryName = category.market.name;
        const items = HARDCODED_SUBCATEGORIES[categoryName] || [{ id: '1', label: '전체' }];

        return {
          title: categoryName,
          items,
          defaultOpen: false,
        };
      });

    // 필터링된 결과가 없으면 하드코드된 카테고리 사용
    if (filtered.length === 0) {
      return ALLOWED_CATEGORY_NAMES.map((name) => ({
        title: name,
        items: HARDCODED_SUBCATEGORIES[name] || [{ id: '1', label: '전체' }],
        defaultOpen: false,
      }));
    }

    return filtered;
  }, [categories]);

  const [openStates, setOpenStates] = useState<boolean[]>(
    categoriesData.map(() => false)
  );
 
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleMenu = (index: number) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleItemClick = (categoryIndex: number, itemId: string) => {
    const itemKey = `${categoryIndex}-${itemId}`;
    setSelectedItem(itemKey);
    const category = categoriesData[categoryIndex];
    const item = category.items.find((i) => i.id === itemId);
    onCategoryChange?.(categoryIndex, Number(itemId) || 0, category.title, item?.label || '');
  };

  if (isLoading) {
    return (
      <aside className="hidden md:block w-[217px] flex-shrink-0">
        <div className="p-4">로딩 중...</div>
      </aside>
    );
  }

  if (isError) {
    // 에러 발생 시 하드코드된 카테고리 표시
    const fallbackCategories = ALLOWED_CATEGORY_NAMES.map((name) => ({
      title: name,
      items: HARDCODED_SUBCATEGORIES[name] || [{ id: '1', label: '전체' }],
      defaultOpen: false,
    }));
    
    return (
      <aside className="hidden md:block w-[217px] flex-shrink-0">
        <nav className="flex flex-col">
          {fallbackCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className={`w-full bg-[var(--color-bg-white)] ${
                categoryIndex < fallbackCategories.length - 1 
                  ? 'border-b border-[var(--color-gray-40)]' 
                  : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-[1.125rem] py-[1.125rem]">
                  <h2 className="body-b1-sb text-[var(--color-black)]">
                    {category.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block w-[217px] flex-shrink-0">
      <nav className="flex flex-col">
        {categoriesData.map((category, categoryIndex) => (
          <div
            key={category.title}
            className={`w-full bg-[var(--color-bg-white)] ${
              categoryIndex < categoriesData.length - 1 
                ? 'border-b border-[var(--color-gray-40)]' 
                : ''
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-[1.125rem] py-[1.125rem]">
                <h2 className="body-b1-sb text-[var(--color-black)]">
                  {category.title}
                </h2>
                <button
                  className="w-[34px] h-[34px] flex items-center justify-center cursor-pointer"
                  onClick={() => toggleMenu(categoryIndex)}
                  aria-label={
                    openStates[categoryIndex] ? '메뉴 닫기' : '메뉴 열기'
                  }
                  aria-expanded={openStates[categoryIndex]}
                >
                  <img 
                    src={downArrow} 
                    alt="toggle"
                    className={`w-[34px] h-[34px] transition-transform ${
                      openStates[categoryIndex] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {openStates[categoryIndex] && (
                <ul className="flex flex-col px-[1.125rem] pb-[1.125rem] gap-[0.625rem]">
                  {category.items.map((item) => {
                    const itemKey = `${categoryIndex}-${item.id}`;
                    const isSelected = selectedItem === itemKey;
                    return (
                      <li key={item.id} className="py-[0.125rem]">
                        <button
                          onClick={() => handleItemClick(categoryIndex, item.id)}
                          className={`cursor-pointer text-left w-full transition-colors ${
                            isSelected
                              ? 'text-[var(--color-mint-1)] body-b1-sb'
                              : 'text-[var(--color-gray-60)] body-b1-rg hover:text-[var(--color-mint-2)]'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default OrderCategoryFilter;
