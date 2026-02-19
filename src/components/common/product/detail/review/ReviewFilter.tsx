interface FilterOption {
  value: string;
  label: string;
}

interface ReviewFilterProps {
  options?: FilterOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

const ReviewFilter = ({
  options = [
    { value: 'popular', label: '인기순' },
    { value: 'high-rating', label: '평점 높은 순' },
    { value: 'low-rating', label: '평점 낮은 순' },
  ],
  selectedValue = 'popular',
  onSelect,
}: ReviewFilterProps) => {
  return (
    <div className="w-[346px] h-[27px] flex items-center pb-10">
      {options.map((option, index) => (
        <div key={option.value} className="flex items-center">
          <button
            onClick={() => onSelect?.(option.value)}
            className={`${
              selectedValue === option.value ? 'body-b1-sb' : 'body-b1-rg'
            } ${
              selectedValue === option.value
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
