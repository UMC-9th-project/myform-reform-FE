import DownIcon from '../../../../../assets/icons/down.svg?react';
import UpIcon from '../../../../../assets/icons/up.svg?react';
import { useState } from 'react';
import type { OptionItem } from './OptionItem';
import OptionItemComponent from './OptionItem';

interface OptionDropdownProps {
  options: OptionItem[];
}

const OptionDropdown = ({ options }: OptionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative my-[15px] mx-[16px] border border-[var(--color-gray-black)]">
      <div
        onClick={handleClick}
        className="
            w-[573px] 
            h-[58px] 
            bg-[var(--color-bg-white)] 
            border-b
            border-[var(--color-line-gray-40)]
            flex items-center justify-between
            pl-6
            pr-6
            body-b1-rg
            text-[var(--color-black)]
            cursor-pointer
            transition-colors
        "
      >
        <span>{selectedOption || '옵션을 선택해주세요.'}</span>
        {isOpen ? (
          <UpIcon className="w-8 h-8" />
        ) : (
          <DownIcon className="w-8 h-8" />
        )}
      </div>
      {isOpen && (
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <OptionItemComponent
                option={option}
                onClick={() =>
                  handleOptionClick(
                    `${option.label}${option.price > 0 ? ` (+${option.price.toLocaleString()}원)` : ' (+0원)'}`
                  )
                }
              />
              {index < options.length - 1 && (
                <div className="h-[1px] bg-[var(--color-line-gray-30)] ml-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionDropdown;
