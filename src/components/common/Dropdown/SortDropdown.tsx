import { useState, useRef, useEffect } from 'react';
import downIcon from '../../../assets/icons/down.svg';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Select = ({ options, value, onChange, className = '' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value) || options[0];

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-gray-60)] transition-colors"
      >
        <span>{selectedOption.label}</span>
        <img 
          src={downIcon} 
          alt="dropdown" 
          className={`w-8 h-8 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 bg-white rounded-[20px] z-50 w-[184px] overflow-hidden"
          style={{
            boxShadow: '1px 3px 11.7px 0px rgba(0, 0, 0, 0.15)',
            padding: '23px 10px 23px 23px',
          }}
        >
          {/* 라디오 버튼 옵션 */}
          <div className="flex flex-col gap-[17px]">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center  gap-3 cursor-pointer transition-colors"
              >
                <div className="relative flex items-center justify-center w-5 h-5">
                  {/* 외부 원 */}
                  <div 
                    className={`absolute w-5 h-5 rounded-full border-2 ${
                      option.value === value 
                        ? 'border-[var(--color-black)]' 
                        : 'border-[var(--color-gray-40)]'
                    }`}
                  />
                  {/* 내부 원 */}
                  {option.value === value && (
                    <div className="absolute w-2.5 h-2.5 bg-[var(--color-black)] rounded-full"></div>
                  )}
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={option.value === value}
                    onChange={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className={` ${
                  option.value === value 
                    ? 'text-[var(--color-black)] body-b1-sb' 
                    : 'text-[var(--color-gray-50)] body-b1-rg hover:text-[var(--color-gray-60)]'
                }`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
