import { useMemo, useState } from 'react';
import downArrow from '../../../assets/icons/down.svg';
import { useMarket } from '../../../hooks/domain/market/useMarket';
import type { MarketItem } from '../../../types/api/market/market';

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
const ALLOWED_CATEGORY_NAMES = ['의류', '잡화', '홈·리빙', '기타'];

interface OrderCategoryFilterProps {
  onCategoryChange?: (categoryIndex: number, itemId: number, categoryTitle: string, itemLabel: string, categoryId?: string) => void;
}

const OrderCategoryFilter = ({ onCategoryChange }: OrderCategoryFilterProps) => {
  const { data: categories } = useMarket();

  // API에서 상위 카테고리와 하위 카테고리를 모두 가져와서 매핑
  const categoriesData = useMemo<CategoryData[]>(() => {
    if (!categories || categories.length === 0) {
      return [];
    }

    const getCategoryName = (category: { market?: MarketItem; name?: string }): string | null => {
      return category.market?.name || category.name || null;
    };

    const getChildren = (category: { children?: Array<{ market?: MarketItem } | MarketItem> }): Array<{ market?: MarketItem } | MarketItem> => {
      return category.children || [];
    };

    const getChildMarket = (child: { market?: MarketItem } | MarketItem): MarketItem | null => {
      if ('market' in child && child.market) {
        return child.market;
      }
      if ('categoryId' in child && 'name' in child) {
        return child as MarketItem;
      }
      return null;
    };

    interface SubcategoryItem {
      id: string;
      label: string;
      sortOrder: number;
    }

    const filtered: CategoryData[] = categories
      .filter((category) => {
        const categoryName = getCategoryName(category);
        return categoryName && ALLOWED_CATEGORY_NAMES.includes(categoryName);
      })
      .map((category): CategoryData | null => {
        const categoryName = getCategoryName(category);
        if (!categoryName) {
          return null;
        }

        const children = getChildren(category);
        
        const subcategories: SubcategoryItem[] = children
          .map((child) => {
            const childMarket = getChildMarket(child);
            if (!childMarket) {
              return null;
            }
            return {
              id: childMarket.categoryId || '',
              label: childMarket.name || '',
              sortOrder: childMarket.sortOrder || 0,
            };
          })
          .filter((item): item is SubcategoryItem => item !== null && item.label !== ''); 

     
        subcategories.sort((a, b) => a.sortOrder - b.sortOrder);

        const items: CategoryItem[] = subcategories.map((sub) => ({
          id: sub.id,
          label: sub.label,
        }));

        return {
          title: categoryName,
          items,
          defaultOpen: false,
        };
      })
      .filter((item): item is CategoryData => item !== null);

    return filtered;
  }, [categories]);

  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
 
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleMenu = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemClick = (categoryIndex: number, itemId: string) => {
    const itemKey = `${categoryIndex}-${itemId}`;
    setSelectedItem(itemKey);
    const category = categoriesData[categoryIndex];
    const item = category.items.find((i) => i.id === itemId);
    const numericId = Number(itemId) || 0;
    const categoryId = itemId;
    onCategoryChange?.(categoryIndex, numericId, category.title, item?.label || '', categoryId);
  };

 

 
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
                  aria-expanded={!!openStates[categoryIndex]}
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
