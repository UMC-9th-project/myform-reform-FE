import React, { useState, type ChangeEvent } from 'react';

interface WorkingDaysInputProps {
  initialValue?: number;
  onChange?: (newValue: number) => void;
}

const WorkingDaysInput: React.FC<WorkingDaysInputProps> = ({ initialValue = 0, onChange }) => {
  const [internalValue, setInternalValue] = useState<number>(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 숫자가 아닌 문자 제거
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // 숫자로 변환
    const numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
    
    setInternalValue(numericValue);
    if (onChange) onChange(numericValue);
  };

  // 콤마 없이 숫자만 그대로 보여주도록 변경
  const displayValue = (internalValue === 0 && isFocused) 
    ? '' 
    : String(internalValue); // .toLocaleString() 제거

  return (
    <div
      className={`
        flex items-center justify-between w-full px-6 py-4 rounded-[1.25rem]
        transition-all duration-200 cursor-text border-2
        ${isFocused 
          ? 'bg-white border-[var(--color--gray-70)]' 
          : 'bg-white border-transparent' // 이미지처럼 기본 상태는 연회색 배경
        }
      `}
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="0"
        className="w-full bg-transparent border-none outline-none text-left mr-2 heading-h3-md"
      />
      <span className="flex-shrink-0 heading-h3-md">일 이내</span>
    </div>
  );
};

export default WorkingDaysInput;