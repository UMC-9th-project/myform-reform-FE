import React, { useState, type ChangeEvent } from 'react';

interface ShippingCostInputProps {
  initialValue?: number;
  onChange?: (newValue: number) => void;
}

const ShippingCostInput: React.FC<ShippingCostInputProps> = ({ initialValue = 0, onChange }) => {
  const [internalValue, setInternalValue] = useState<number>(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 숫자가 아닌 문자(콤마 등) 제거
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // 숫자로 변환 (비어있으면 0)
    const numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
    
    // 내부 상태 업데이트 (이게 있어야 화면이 변함)
    setInternalValue(numericValue);
    
    // 부모에게도 알려줌 (선택사항)
    if (onChange) onChange(numericValue);
  };

  // 포커스 상태일 때 '0'이면 빈칸으로 보여줘서 입력을 편하게 함
  const displayValue = (internalValue === 0 && isFocused) 
    ? '' 
    : internalValue.toLocaleString();

  return (
    <div
      className={`
        flex items-center justify-between w-full px-6 py-4 rounded-[1.25rem]
        transition-all duration-200 cursor-text border-2
        ${isFocused ? 'bg-white border border-[var(--color--gray-70)]' : 'bg-white border-transparent'}
        bg-white /* 배경색 명시 */
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
      <span className="flex-shrink-0 heading-h3-md">원</span>
    </div>
  );
};

export default ShippingCostInput;