import { useState } from 'react';
import searchIcon from '../../layout/header/icons/search.svg';
import type { ReformerSearchEngineProps } from './types';

const ReformerSearchEngine = ({
  placeholder = '원하는 리폼러를 검색해보세요.',
  onSearch,
  onInputChange,
  className = '',
  defaultValue = '',
  showBlur = true,
}: ReformerSearchEngineProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
        <div className={`relative w-full max-w-[720px] flex ${showBlur ? 'h-[328px] items-center justify-center' : 'pt-[68px] items-center justify-center'}`}>
          {/* 타원형 블러 배경 */}
          {showBlur && (
            <div 
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: 'var(--color-mint-6)',
                filter: 'blur(100px)',
                zIndex: 0,
              }}
            />
          )}
          
          {/* 검색 입력 필드 */}
          <form onSubmit={handleSearchSubmit} className={`relative z-10 w-full ${showBlur ? '' : 'px-4 md:px-0'}`}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="body-b1-rg w-full py-[0.875rem] pl-[1.5rem] pr-[3rem] rounded-[6.25rem] border-1 border-[var(--color-mint-1)] text-[var(--color-black)] placeholder:text-[var(--color-gray-50)] focus:outline-none focus:border-[var(--color-mint-1)] transition-colors bg-white"
              />
              <div 
                className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={handleSearchClick}
              >
                <img src={searchIcon} alt="search" className="w-[1.625rem] h-[1.625rem]" />
              </div>
            </div>
          </form>
        </div>
    </div>
  );
};

export default ReformerSearchEngine;
