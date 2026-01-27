import DownIcon from '../../../../../assets/icons/down.svg?react';
import UpIcon from '../../../../../assets/icons/up.svg?react';
import { useState } from 'react';
import type { OptionItem } from './OptionItem';
import OptionItemComponent from './OptionItem';

interface OptionDropdownProps {
  options: OptionItem[];
  onSelect?: (optionLabel: string) => void;
  selectedOptionLabel?: string | null;
}

const OptionDropdown = ({ 
  options, 
  onSelect,
  selectedOptionLabel 
}: OptionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedOption, setInternalSelectedOption] = useState<string | null>(null);
  const selectedOption = selectedOptionLabel !== undefined ? selectedOptionLabel : internalSelectedOption;
  
  const getDisplayText = () => {
    if (!selectedOption) return '옵션을 선택해주세요.';
    
    if (selectedOptionLabel !== undefined) {
      const selectedOpt = options.find(opt => opt.label === selectedOption);
      if (selectedOpt) {
        return `${selectedOpt.label}${selectedOpt.price > 0 ? ` (+${selectedOpt.price.toLocaleString()}원)` : ' (+0원)'}`;
      }
      return selectedOption;
    }
  
    return selectedOption;
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionLabel: string, displayText: string) => {
    if (selectedOptionLabel === undefined) {
      setInternalSelectedOption(displayText);
    }

    onSelect?.(optionLabel);
    setIsOpen(false);
  };

  return (
    <div className="border border-[var(--color-gray-black)]">
      <div
        onClick={handleClick}
        className="         
            h-[58px] 
            border-b
            border-[var(--color-line-gray-40)]
            flex items-center justify-between
            pl-6
            pr-6
            body-b1-rg
            cursor-pointer
            transition-colors
        "
      >
        <span>{getDisplayText()}</span>
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
                onClick={() => {
                  const displayText = `${option.label}${option.price > 0 ? ` (+${option.price.toLocaleString()}원)` : ' (+0원)'}`;
                  handleOptionClick(option.label, displayText);
                }}
              />
              {index < options.length - 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionDropdown;
