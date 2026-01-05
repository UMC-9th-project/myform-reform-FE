export default function HeaderNav() {
  const navItems = [
    { label: '홈' },
    { label: '마켓' },
    { label: '리폼 요청' },
    { label: '리폼 제안' },
    { label: '채팅하기' },
  ];

  return (
    <nav className="w-full h-[77px] border-b border-[var(--color-gray-40)]">
      <div className=" flex pl-[3.125rem] pt-[1.0625rem] gap-[2.1875rem] ">
        {navItems.map((item, index) => (
          <button
            key={index}
            className="body-b0-bd px-[0.625rem] text-[var(--color-black)] hover:text-[var(--color-mint-1)] transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
