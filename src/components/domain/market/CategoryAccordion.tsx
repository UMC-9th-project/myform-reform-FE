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
    title: '유니폼 리폼',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '상의' },
      { id: 3, label: '하의' },
      { id: 4, label: '원피스' },
    ],
    defaultOpen: false,
  },
  {
    title: '패션잡화 리폼',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '가방·짐색' },
      { id: 3, label: '지갑·파우치' },
      { id: 4, label: '모자·캡·비니' },
    ],
    defaultOpen: false,
  },
  {
    title: '악세사리 리폼',
    items: [
      { id: 1, label: '전체' },
      { id: 2, label: '헤어 악세사리' },
      { id: 3, label: '폰케이스' },
      { id: 4, label: '디지털 악세사리' },
      { id: 5, label: '키링' },
    ],
    defaultOpen: false,
  },
];

export default function CategoryAccordion() {
  const [openStates, setOpenStates] = useState<boolean[]>(
    categoriesData.map((category) => category.defaultOpen || false)
  );
  const [selectedItems, setSelectedItems] = useState<number[]>(
    categoriesData.map((category) => category.items[0].id)
  );

  const toggleMenu = (index: number) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleItemClick = (categoryIndex: number, itemId: number) => {
    setSelectedItems((prev) => {
      const newSelected = [...prev];
      newSelected[categoryIndex] = itemId;
      return newSelected;
    });
  };

  return (
    <nav className="flex w-[217px] flex-col">
      {categoriesData.map((category, categoryIndex) => (
        <div
          key={category.title}
          className="w-full bg-[var(--color-bg-white)] border-b border-[var(--color-gray-40)]"
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-[1.125rem] py-[1.125rem]">
              <h2 className="body-b1-sb text-[var(--color-black)]">
                {category.title}
              </h2>
              <button
                className="w-[27px] h-[27px] flex items-center justify-center cursor-pointer"
                onClick={() => toggleMenu(categoryIndex)}
                aria-label={
                  openStates[categoryIndex] ? '메뉴 열기' : '메뉴 닫기'
                }
                aria-expanded={openStates[categoryIndex]}
              >
                <img className="w-[177px] h-[27px]" src={downArrow} />
              </button>
            </div>

            {openStates[categoryIndex] && (
              <ul className="flex flex-col px-[1.125rem] pb-[1.125rem] gap-[0.625rem]">
                {category.items.map((item) => (
                  <li key={item.id} className="py-[0.125rem]">
                    <button
                      onClick={() => handleItemClick(categoryIndex, item.id)}
                      className="body-b1-rg text-[var(--color-gray-60)] cursor-pointer text-left w-full "
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
