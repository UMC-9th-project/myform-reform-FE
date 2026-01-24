import { useState } from 'react';
import downArrow from '../../../assets/icons/down.svg';

interface CategoryItem {
  id: number;
  label: string;
}

interface CategoryData {
  title: string;
  items: CategoryItem[];
  defaultOpen?: boolean;
}

const categoriesData: CategoryData[] = [
  {
    title: '의류',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '상의' },
      { id: 3, label: '하의' },
      { id: 4, label: '아우터' },
    ],
    defaultOpen: false,
  },
  {
    title: '잡화',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '가방·짐색' },
      { id: 3, label: '지갑·파우치' },
      { id: 4, label: '모자·캡·비니' },
    ],
    defaultOpen: false,
  },
  {
    title: '악세서리',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '헤어 악세서리' },
      { id: 3, label: '폰케이스' },
      { id: 4, label: '키링' },
    ],
    defaultOpen: false,
  },
  {
    title: '홈·리빙',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '패브릭 소품' },
      { id: 3, label: '쿠션·방석' },
    ],
    defaultOpen: false,
  },
  {
    title: '기타',
    items: [
      { id: 1, label: '전체' },
    ],
    defaultOpen: false,
  },
];

interface OrderCategoryFilterProps {
  onCategoryChange?: (categoryIndex: number, itemId: number, categoryTitle: string, itemLabel: string) => void;
}

const OrderCategoryFilter = ({ onCategoryChange }: OrderCategoryFilterProps) => {
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

  const handleItemClick = (categoryIndex: number, itemId: number) => {
    const itemKey = `${categoryIndex}-${itemId}`;
    setSelectedItem(itemKey);
    const category = categoriesData[categoryIndex];
    const item = category.items.find((i) => i.id === itemId);
    onCategoryChange?.(categoryIndex, itemId, category.title, item?.label || '');
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
