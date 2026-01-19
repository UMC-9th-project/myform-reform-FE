import { useNavigate, useLocation } from 'react-router-dom';

export default function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: '홈', path: '/home' }, //임시 경로
    { label: '마켓', path: '/market' }, //임시 경로
    { label: '주문제작', path: '/create' }, //임시 경로
    { label: '리폼러 찾기', path: '/reformer-search' },
    { label: '채팅하기', path: '/chat' }, //임시 경로
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="w-full h-[77px] border-b border-[var(--color-gray-30)]">
      <div className=" flex pl-[3.125rem] pt-[1.0625rem] gap-[2.1875rem] ">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavClick(item.path)}
              className={`body-b0-bd pb-7 px-[0.625rem] transition-colors cursor-pointer ${
                isActive
                  ? 'text-[var(--color-mint-1)] border-b-[2px] border-[var(--color-mint-1)]'
                  : 'text-[var(--color-black)] hover:text-[var(--color-mint-1)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
