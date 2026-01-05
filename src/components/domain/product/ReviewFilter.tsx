import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
}

const ReviewFilter = () => {
  const [selectedId, setSelectedId] = useState<string>('popular');

  const options: FilterOption[] = [
    { id: 'popular', label: '인기순' },
    { id: 'high-rating', label: '평점 높은 순' },
    { id: 'low-rating', label: '평점 낮은 순' },
  ];

  return (
    <div className="w-[346px] h-[27px] flex items-center">
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center">
          <button
            onClick={() => setSelectedId(option.id)}
            className={`${
              selectedId === option.id ? 'body-b1-sb' : 'body-b1-rg'
            } ${
              selectedId === option.id
                ? 'text-black'
                : 'text-[var(--color-gray-60)]'
            } hover:text-black transition-colors`}
          >
            {option.label}
          </button>
          {index < options.length - 1 && (
            <>
              <div className="w-[25px]" />
              <div className="w-[1px] h-4 bg-[var(--color-line-gray-40)] flex-shrink-0" />
              <div className="w-[25px]" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewFilter;
