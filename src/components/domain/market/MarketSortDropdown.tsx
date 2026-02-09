interface SortOption {
  id: string;
  label: string;
}

interface MarketSortDropdownProps {
  selectedSort: 'popular' | 'latest' | 'rating';
  onSortChange: (sort: string) => void;
}

export default function MarketSortDropdown({ selectedSort, onSortChange }: MarketSortDropdownProps) {
  const sortOptions: SortOption[] = [
    { id: 'popular', label: '인기순' },
    { id: 'latest', label: '최신순' },
    { id: 'rating', label: '평점순' },
  ];

  const handleOptionChange = (optionId: string) => {
    onSortChange(optionId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, optionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionChange(optionId);
    }
  };

  return (
    <div
      className="bg-white inline-flex flex-col items-start gap-[0.4375rem] pl-[1.0625rem] py-[0.9375rem] relative rounded-[1.25rem] shadow-[1px_3px_11.7px_0_rgba(0,0,0,0.15)]"
      role="radiogroup"
      aria-label="정렬 옵션"
    >
      {sortOptions.map((option) => {
        const isSelected = selectedSort === option.id;

        return (
          <div
            key={option.id}
            className="flex items-center gap-[0.375rem]  pr-[77px] py-[0.3125rem] "
          >
            <div
              className="relative w-[27px] h-[27px] cursor-pointer flex items-center justify-center"
              onClick={() => handleOptionChange(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
            >
              {isSelected ? (
                <>
                  <div className="absolute w-[17px] h-[17px] rounded-full bg-white border-2 border-[var(--color-black)]" />
                  <div className="absolute w-[11px] h-[11px] rounded-full bg-[var(--color-black)]" />
                </>
              ) : (
                <div className="absolute w-[17px] h-[17px] rounded-full border border-[var(--color-gray-40)]" />
              )}
            </div>

            <label
              htmlFor={option.id}
              className={` cursor-pointer ${
                isSelected
                  ? 'body-b1-sb text-[var(--color-black)]'
                  : 'body-b1-rg text-[var(--color-gray-40)]'
              }`}
              onClick={() => handleOptionChange(option.id)}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
