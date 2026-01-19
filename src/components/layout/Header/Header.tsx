import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bell from '../../../assets/icons/bell.svg';
import heart from '../../../assets/icons/heart.svg';
import shoppingCart from '../../../assets/icons/shoppingCart.svg';
import profile from '../../../assets/icons/profile.svg';
import search from '../Header/icons/search.svg';
import mintsearch from '../Header/icons/mintsearch.svg';
import bgsearch from '../Header/icons/bg-search.svg';
import grayrepeat from '../Header/icons/grayrepeat.svg';
import repeat from '../../../assets/icons/repeat.svg';
import xIcon from '../../../assets/icons/x.svg';
import logo from '../../../assets/logos/logo.svg';

type UserType = 'customer' | 'seller';

export default function Header() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('seller');
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReformerModeHovered, setIsReformerModeHovered] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '야구 유니폼 리폼',
    '한화 유니폼',
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const recommendedSearches = [
    '야구 유니폼',
    '유니폼 리폼',
    '짐색 리폼',
    '한화 리폼',
    '유니폼',
    '축구 리폼',
    '크롭티',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isSearchOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isProfileOpen]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleDeleteRecent = (index: number) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    setRecentSearches([]);
  };

  const handleRecommendedClick = (term: string) => {
    setSearchValue(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches].slice(0, 5));
    }
  };

  const handleModeSwitch = () => {
    setUserType(userType === 'seller' ? 'customer' : 'seller');
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full flex flex-col">
      <div className="body-b1-sb flex justify-end py-[0.75rem] pr-[2rem] gap-[2.75rem]">
        <div>회원가입</div>
        <div>로그인</div>
      </div>
      <div className="h-25 flex items-center  ml-[3.125rem] mr-[2rem] ">
        <div className="w-[191px] h-[44.6px] mr-[2.19rem] ">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-contain cursor-pointer"
          />
        </div>
        <div className="relative w-[571px]" ref={searchRef}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={handleSearchClick}
            onFocus={handleSearchClick}
            placeholder="어떤 리폼 스타일을 찾으세요?"
            className="body-b1-rg w-full py-[0.875rem] pl-[1.5rem] pr-[3rem] rounded-[6.25rem] border border-[var(--color-mint-1)]   text-[var(--color-black)] placeholder:text-[var(--color-gray-40)] focus:outline-none focus:border-[var(--color-mint-1)] transition-colors"
          />
          <div className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 cursor-pointer ">
            <img src={search} alt="search" className="w-6.5 h-6.5" />
          </div>

          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-[1.0625rem] bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] border border-[var(--color-gray-30)] z-50 max-h-[600px] overflow-y-auto">
              {recentSearches.length > 0 && (
                <div className="py-[1.125rem] px-[1.5625rem]">
                  <div className="flex items-center justify-between mb-[1.0625rem]">
                    <h3 className="body-b4-sb text-[var(--color-gray-60)]">
                      최근 검색어
                    </h3>
                    <button
                      onClick={handleDeleteAll}
                      className="body-b3-rg text-[var(--color-gray-50)]"
                    >
                      전체 삭제
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentSearches.map((term, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 "
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <img src={bgsearch} alt="bgsearch" />
                          <span className="body-b2-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] cursor-pointer">
                            {term}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteRecent(index)}
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
                <h3 className="body-b4-sb text-[var(--color-gray-60)] mb-[1.0625rem]">
                  추천 검색어
                </h3>
                <div className="grid grid-cols-4 gap-[0.4375rem]">
                  {recommendedSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecommendedClick(term)}
                      className="flex items-center gap-2  p-[0.4375rem_0.9375rem_0.4375rem_0.6875rem]  rounded-[6.25rem] border border-[var(--color-gray-30)] bg-[var(--color-gray-20)] hover:bg-[var(--color-gray-30)] transition-colors text-left"
                    >
                      <img
                        src={mintsearch}
                        alt="mintsearch"
                        className="w-4 h-4 text-[var(--color-mint-1)]"
                      />
                      <span className="body-b3-rg text-[var(--color-gray-60)]">
                        {term}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-[1.625rem] ml-auto">
          <button className="cursor-pointer">
            <img src={bell} alt="bell" />
          </button>
          <Link to="/wishlist" className="cursor-pointer">
            <img src={heart} alt="heart" />
          </Link>
          <Link to="/cart" className="cursor-pointer">
            <img src={shoppingCart} alt="shopping cart" />
          </Link>
          <div className="relative" ref={profileRef}>
            <button
              className="cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src={profile} alt="profile" />
            </button>

            {isProfileOpen && userType === 'seller' && (
              <div className="absolute top-full right-0 bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] z-50 w-[270px]">
                <div className="pt-[0.875rem] px-[1rem]">
                  <div className="py-[0.625rem] px-[1.25rem]">
                    <div className="body-b0-bd text-[var(--color-black)]">
                      침착한 대머리독수리 님
                    </div>
                  </div>

                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]"></div>

                  <div className="px-[1.25rem]">
                    <button
                      onClick={() => {
                        navigate('/reformer-mypage');
                        setIsProfileOpen(false);
                      }}
                      className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer"
                    >
                      프로필 관리
                    </button>

                    <button className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer">
                      판매 관리
                    </button>
                  </div>

                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]"></div>

                  <div className="p-[1.25rem]">
                    <button
                      className="w-full text-left gap-[0.625rem] body-b1-md text-[var(--color-gray-50)] hover:text-[var(--color-black)] flex items-center cursor-pointer"
                      onMouseEnter={() => setIsReformerModeHovered(true)}
                      onMouseLeave={() => setIsReformerModeHovered(false)}
                      onClick={handleModeSwitch}
                    >
                      <img
                        src={isReformerModeHovered ? repeat : grayrepeat}
                        alt="repeat"
                      />
                      일반 모드 전환
                    </button>
                  </div>
                </div>
                <button className="w-full py-[0.9375rem] text-center body-b1-sb text-[var(--color-black)] bg-[var(--color-mint-5)] rounded-b-[1.875rem] cursor-pointer">
                  로그아웃
                </button>
              </div>
            )}

            {isProfileOpen && userType === 'customer' && (
              <div className="absolute top-full right-0 bg-white rounded-[1.875rem] shadow-[0_3px_10.7px_0_rgba(0,0,0,0.22)] z-50 w-[270px]">
                <div className="pt-[0.875rem] px-[1rem]">
                  <div className="py-[0.625rem] px-[1.25rem]">
                    <div className="body-b0-bd text-[var(--color-black)]">
                      침착한 대머리독수리 님
                    </div>
                  </div>

                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]"></div>

                  <div className="px-[1.25rem]">
                    <button className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer">
                      내 정보
                    </button>

                    <button className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer">
                      내가 작성한 글
                    </button>

                    <button className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer">
                      구매 이력
                    </button>

                    <button className="body-b1-md w-full text-left px-2 py-[1.125rem] text-[var(--color-gray-50)] hover:text-[var(--color-black)] cursor-pointer">
                      나의 후기
                    </button>
                  </div>

                  <div className="my-[0.625rem] border-b border-[var(--color-gray-40)]"></div>

                  <div className="p-[1.25rem]">
                    <button
                      className="w-full text-left gap-[0.625rem] body-b1-md text-[var(--color-gray-50)] hover:text-[var(--color-black)] flex items-center cursor-pointer"
                      onMouseEnter={() => setIsReformerModeHovered(true)}
                      onMouseLeave={() => setIsReformerModeHovered(false)}
                      onClick={handleModeSwitch}
                    >
                      <img
                        src={isReformerModeHovered ? repeat : grayrepeat}
                        alt="repeat"
                      />
                      리폼러 모드 전환
                    </button>
                  </div>
                </div>
                <button className="w-full py-[0.9375rem] text-center body-b1-sb text-[var(--color-black)] bg-[var(--color-mint-5)] rounded-b-[1.875rem] cursor-pointer">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
