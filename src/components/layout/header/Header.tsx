import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bell from '../../../assets/icons/bell.svg';
import heart from '../../../assets/icons/heart.svg';
import shoppingCart from '../../../assets/icons/shoppingCart.svg';
import profile from '../../../assets/icons/profile.svg';
import search from '../header/icons/search.svg';
import mintsearch from '../header/icons/mintsearch.svg';
import bgsearch from '../header/icons/bg-search.svg';
import xIcon from '../../../assets/icons/x.svg';
import logo from '../../../assets/logos/logo.svg';
import { useSellerTabStore, useUserTabStore, type UserTabType } from '../../../stores/tabStore';
import useAuthStore from '../../../stores/useAuthStore';
import { useLogout } from '../../../hooks/domain/auth/useLogout';
import NotificationPanel from '../../common/Modal/NotificationPanel';

export default function Header() {
  const navigate = useNavigate();
  const { setActiveTab: setSellerActiveTab } = useSellerTabStore();
  const { setActiveTab: setUserActiveTab } = useUserTabStore();

  const { accessToken, role } = useAuthStore(); // role 기준으로 드롭다운 분기
  const { logout } = useLogout();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recommendedSearches = [
    '야구 유니폼',
    '유니폼 리폼',
    '짐색 리폼',
    '한화 리폼',
    '유니폼',
    '축구 리폼',
    '크롭티',
  ];

  const handleTabClick = (tab: UserTabType) => {
    setUserActiveTab(tab);          // Zustand로 탭 상태 업데이트
    navigate('/normal-mypage');     // 일반 유저 마이페이지 이동
    setIsProfileOpen(false);        // 드롭다운 닫기
  };

  const handleSearchClick = () => setIsSearchOpen(true);

  const handleDeleteRecent = (index: number) =>
    setRecentSearches(recentSearches.filter((_, i) => i !== index));

  const handleDeleteAll = () => setRecentSearches([]);

  const handleSearchSubmit = (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm.length === 0) return;
    
    // 최근 검색어에 추가
    if (!recentSearches.includes(trimmedTerm)) {
      setRecentSearches([trimmedTerm, ...recentSearches].slice(0, 5));
    }
    
    // 검색 결과 페이지로 이동
    navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    setIsSearchOpen(false);
    setSearchValue('');
  };

  const handleRecommendedClick = (term: string) => {
    handleSearchSubmit(term);
  };

  const handleRecentSearchClick = (term: string) => {
    handleSearchSubmit(term);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      const currentValue = inputRef.current?.value || searchValue;
      handleSearchSubmit(currentValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isSearchOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, isProfileOpen]);

  return (
    <header className="w-full flex flex-col">
      {!accessToken && (
        <div className="body-b1-sb flex justify-end py-[0.75rem] pr-[2rem] gap-[2.75rem]">
          <Link to="/signup" className="cursor-pointer">회원가입</Link>
          <Link to="/login/type" className="cursor-pointer">로그인</Link>
        </div>
      )}

      <div className="h-25 flex items-center ml-[3.125rem] mr-[2rem]">
        <Link to="/" className="w-[191px] h-[44.6px] mr-[2.19rem]">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-contain cursor-pointer"
          />
        </Link>

        {/* 검색 */}
        <div className="relative w-[571px]" ref={searchRef}>
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e: React.CompositionEvent<HTMLInputElement>) => {
              setIsComposing(false);
              const finalValue = e.currentTarget.value;
              setSearchValue(finalValue);
            }}
            onClick={handleSearchClick}
            onFocus={handleSearchClick}
            onKeyPress={handleKeyPress}
            placeholder="어떤 리폼 스타일을 찾으세요?"
            className="body-b1-rg w-full py-[0.875rem] pl-[1.5rem] pr-[3rem] rounded-[6.25rem] border border-[var(--color-mint-1)] text-[var(--color-black)] placeholder:text-[var(--color-gray-40)] focus:outline-none focus:border-[var(--color-mint-1)] transition-colors"
          />
          <div 
            className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              const currentValue = inputRef.current?.value || searchValue;
              handleSearchSubmit(currentValue);
            }}
          >
            <img src={search} alt="search" className="w-6.5 h-6.5" />
          </div>

          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-[1.0625rem] bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] border border-[var(--color-gray-30)] z-50 max-h-[600px] overflow-y-auto">
              {recentSearches.length > 0 && (
                <div className="py-[1.125rem] px-[1.5625rem]">
                  <div className="flex items-center justify-between mb-[1.0625rem]">
                    <h3 className="body-b4-sb text-[var(--color-gray-60)]">최근 검색어</h3>
                    <button
                      onClick={handleDeleteAll}
                      className="body-b3-rg text-[var(--color-gray-50)]"
                    >
                      전체 삭제
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentSearches.map((term, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div 
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => handleRecentSearchClick(term)}
                        >
                          <img src={bgsearch} alt="bgsearch" />
                          <span className="body-b2-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)]">
                            {term}
                          </span>
                        </div>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleDeleteRecent(index);
                          }}
                          className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        >
                          <img src={xIcon} alt="delete" className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div className="py-[1.125rem] px-[1.5625rem]">
                <h3 className="body-b4-sb text-[var(--color-gray-60)] mb-[1.0625rem]">추천 검색어</h3>
                <div className="grid grid-cols-4 gap-[0.4375rem]">
                  {recommendedSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecommendedClick(term)}
                      className="flex items-center gap-2 p-[0.4375rem_0.9375rem_0.4375rem_0.6875rem] rounded-[6.25rem] border border-[var(--color-gray-30)] bg-[var(--color-gray-20)] hover:bg-[var(--color-gray-30)] transition-colors text-left"
                    >
                      <img src={mintsearch} alt="mintsearch" className="w-4 h-4 text-[var(--color-mint-1)]" />
                      <span className="body-b3-rg text-[var(--color-gray-60)]">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 아이콘 및 프로필 */}
        <div className="flex items-center gap-[1.625rem] ml-auto">
          <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <img src={bell} alt="bell" />
            </button>
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>
          <Link to="/wishlist" className="cursor-pointer">
            <img src={heart} alt="heart" />
          </Link>
          <Link to="/cart" className="cursor-pointer">
            <img src={shoppingCart} alt="shopping cart" />
          </Link>
          
          {accessToken && (
          <div className="relative" ref={profileRef}>
            <button
              className="cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src={profile} alt="profile" />
            </button>

            {/* 리폼러 유저 드롭다운 */}
            {isProfileOpen && role === 'reformer' && (
              <div className="absolute top-full right-0 bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] z-50 w-[270px]">
                <div className="pt-[0.875rem] px-[1rem]">
                  <div className="py-[0.625rem] px-[1.25rem]">
                    <div className="body-b0-bd text-[var(--color-black)]">침착한 대머리독수리 님</div>
                  </div>
                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]" />
                  <div className="px-[1.25rem]">
                    <button
                      onClick={() => {
                        setSellerActiveTab('프로필 관리'); 
                        navigate('/reformer-mypage'); setIsProfileOpen(false); }}
                      className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)]"
                    >
                      프로필 관리
                    </button>
                    <button
                      onClick={() => {
                        setSellerActiveTab('판매 관리'); // 탭 상태 업데이트
                        navigate('/reformer-mypage'); // 해당 페이지로 이동
                        setIsProfileOpen(false); // 드롭다운 닫기
                      }}
                      className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)]"
                    >
                      판매 관리
                    </button>
                    
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full py-[0.9375rem] body-b1-sb bg-[var(--color-mint-5)] rounded-b-[1.875rem]"
                >
                  로그아웃
                </button>
              </div>
            )}

            {/* 일반 유저 드롭다운 */}
            {isProfileOpen && role === 'user' && (
              <div className="absolute top-full right-0 bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] z-50 w-[270px]">
                <div className="pt-[0.875rem] px-[1rem]">
                  <div className="py-[0.625rem] px-[1.25rem]">
                    <div className="body-b0-bd text-[var(--color-black)]">침착한 대머리독수리 님</div>
                  </div>
                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]" />
                  <div className="px-[1.25rem]">
                    <button onClick={() => handleTabClick('내 정보')} className="body-b1-md w-full text-left px-2 py-[1.125rem]">내 정보</button>
                    <button onClick={() => handleTabClick('내가 작성한 글')} className="body-b1-md w-full text-left px-2 py-[1.125rem]">내가 작성한 글</button>
                    <button onClick={() => handleTabClick('구매 이력')} className="body-b1-md w-full text-left px-2 py-[1.125rem]">구매 이력</button>
                    <button onClick={() => handleTabClick('나의 후기')} className="body-b1-md w-full text-left px-2 py-[1.125rem]">나의 후기</button>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full py-[0.9375rem] body-b1-sb bg-[var(--color-mint-5)] rounded-b-[1.875rem]"
                >
                  로그아웃
                </button>
              </div>
            )}

          </div>
          )}
        </div>
      </div>
    </header>
  );
}
