import { useState } from 'react';
import search from '../Header/icons/search.svg';
import chat from '../../../assets/icons/chat.svg';
import heart from '../../../assets/icons/heart.svg';
import shoppingCart from '../../../assets/icons/shoppingCart.svg';
import logo from '../../../assets/logos/logo.svg';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');

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
        <div className="relative w-[571px] ">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="어떤 리폼 스타일을 찾으세요?"
            className="body-b1-rg w-full py-[0.875rem] pl-[1.5rem] pr-[3rem] rounded-[6.25rem] border border-[var(--color-mint-1)]   text-[var(--color-black)] placeholder:text-[var(--color-gray-40)] focus:outline-none focus:border-[var(--color-mint-1)] transition-colors"
          />
          <div className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 pointer-events-none">
            <img src={search} alt="search" className="w-6.5 h-6.5" />
          </div>
        </div>
        <div className="flex items-center gap-[1.625rem] ml-auto">
          <button className="">
            <img src={chat} alt="chat" />
          </button>
          <button className="">
            <img src={heart} alt="heart" />
          </button>
          <button className="">
            <img src={shoppingCart} alt="shopping cart" />
          </button>
        </div>
      </div>
    </header>
  );
}
