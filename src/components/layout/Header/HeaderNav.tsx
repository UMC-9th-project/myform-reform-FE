export default function HeaderNav() {
  const navItems = [
    { label: '홈' },
    { label: '마켓' },
    { label: '주문제작' },
    { label: '리폼러 찾기' },
    { label: '채팅하기' },
  ];

  return (
    <nav className="w-full h-[77px] border-b border-[var(--color-gray-30)]">
      <div className=" flex pl-[3.125rem] pt-[1.0625rem] gap-[2.1875rem] ">
        {navItems.map((item, index) => (
          <button
            key={index}
            className="body-b0-bd pb-7 px-[0.625rem] text-[var(--color-black)] focus:text-[var(--color-mint-1)] focus:border-b-[2px] focus:border-[var(--color-mint-1)] transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
