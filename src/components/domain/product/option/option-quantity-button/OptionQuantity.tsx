import type { OptionQuantityProps } from './OptionQuantity.types';
import { getOptionQuantityProps } from './OptionQuantity.utils';

const OptionQuantity = (props: OptionQuantityProps) => {
  const { quantity, onIncrease, onDecrease, disabled } =
    getOptionQuantityProps(props);

  return (
    <div className="flex gap-0 w-[10.875rem] h-[3.125rem]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="
          w-[3.125rem] h-[3.125rem]
          bg-[var(--color-bg-white)]
          border border-[var(--color-line-gray-40)]
          flex items-center justify-center
          cursor-pointer
          hover:bg-[var(--color-gray-20)]
          disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[3.125rem] h-[3.125rem]"
        >
          <path
            d="M14 20H26"
            stroke={
              disabled || quantity <= 1
                ? 'var(--color-gray-40)'
                : 'var(--color-black)'
            }
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className="
          w-[4.625rem] h-[3.125rem]
          bg-[var(--color-bg-white)]
          border-l-0
          border-r-0
          border border-[var(--color-line-gray-40)]
          flex items-center justify-center
        "
      >
        <span className="body-b1-rg text-[var(--color-black)]">{quantity}</span>
      </div>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="
          w-[3.125rem] h-[3.125rem]
          bg-[var(--color-bg-white)]
          border border-[var(--color-line-gray-40)]
          flex items-center justify-center
          cursor-pointer
          hover:bg-[var(--color-gray-20)]
          disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[3.125rem] h-[3.125rem]"
        >
          <path
            d="M25.9998 20H19.9998V14"
            stroke={disabled ? 'var(--color-gray-40)' : 'var(--color-black)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.9998 26V20H13.9998"
            stroke={disabled ? 'var(--color-gray-40)' : 'var(--color-black)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default OptionQuantity;
