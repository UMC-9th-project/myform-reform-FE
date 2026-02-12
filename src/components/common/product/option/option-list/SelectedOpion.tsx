import { useState } from 'react';
import XIcon from '../../../../../assets/icons/x.svg?react';
import OptionQuantity from '../option-quantity-button/OptionQuantity';
import type { SelectedOptionProps } from './SelectedOption.types';

const SelectedOpion = ({
  option,
  optionNumber,
  quantity: initialQuantity = 1,
  onIncrease,
  onDecrease,
  onRemove,
}: SelectedOptionProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const totalPrice = option.price * quantity;

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
    onIncrease?.();
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    onDecrease?.();
  };

  return (
    <div className="w-[573px] bg-[var(--color-bg-white)] border-t border-[var(--color-line-gray-40)] my-[0.9375rem] mx-[1rem]">
      <div></div>
      <div className=" pt-6 pb-7">
        <span className="body-b1-rg text-[var(--color-gray-50)]">
          {optionNumber !== undefined && `[옵션 ${optionNumber}] `}
          {option.label}
          {option.price > 0
            ? ` (+${option.price.toLocaleString()}원)`
            : ' (+0원)'}
        </span>
      </div>

      <div className=" pb-4 flex items-center justify-between">
        <OptionQuantity
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />

        <div className="flex items-center gap-3">
          <span className="body-b1-sb text-[var(--color-black)]">
            {totalPrice.toLocaleString()}원
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="
              w-[3.125rem] h-[3.125rem]
              flex items-center justify-center
              cursor-pointer
              hover:bg-[var(--color-gray-20)]
              transition-colors duration-200
            "
          >
            <XIcon className="w-8 h-8 text-[var(--color-gray-50)]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedOpion;
