import { useState } from 'react';
import searchIcon from '../../layout/Header/icons/search.svg';

interface ReformerSearchEngineProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const ReformerSearchEngine = ({
  placeholder = '원하는 리폼러를 검색해보세요.',
  onSearch,
  className = '',
}: ReformerSearchEngineProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative isolate w-[620px] h-[328px] flex items-center justify-center overflow-hidden">
        {/* 블러 배경 */}
        <div
          className="absolute inset-0 bg-[var(--color-mint-6)] rounded-full"
          style={{
            filter: 'blur(300px)',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
          }}
        />

        {/* 검색바 */}
        <div className="relative z-10 w-[619px]">
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="body-b1-rg w-full py-[0.875rem] pl-[1.5rem] pr-[3rem] rounded-[6.25rem] border border-[var(--color-mint-1)] text-[var(--color-black)] placeholder:text-[var(--color-gray-40)] focus:outline-none focus:border-[var(--color-mint-1)] transition-colors bg-white"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 cursor-pointer z-20"
          >
            <img src={searchIcon} alt="search" className="w-6.5 h-6.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReformerSearchEngine;
