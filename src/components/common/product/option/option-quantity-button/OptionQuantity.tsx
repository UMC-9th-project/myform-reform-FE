import MinusIcon from '../../../../../assets/icons/minus.svg?react';
import PlusIcon from '../../../../../assets/icons/plus.svg?react';
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
          disabled:hover:bg-[var(--color-bg-white)]
          transition-colors duration-200
        "
      >
        <MinusIcon
          className={`w-[3.125rem] h-[3.125rem] ${
            disabled || quantity === 1
              ? 'text-[var(--color-gray-40)]'
              : 'text-[var(--color-black)]'
          }`}
        />
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
        <PlusIcon
          className={`w-[3.125rem] h-[3.125rem] ${
            disabled
              ? 'text-[var(--color-gray-40)]'
              : 'text-[var(--color-black)]'
          }`}
        />
      </button>
    </div>
  );
};

export default OptionQuantity;
