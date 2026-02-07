import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';

export default function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuthStore();

  const navItems = [
    { label: '홈', path: '/' }, //임시 경로
    { label: '마켓', path: '/market' }, //임시 경로
    { label: '주문제작', path: '/order' }, 
    { label: '리폼러 찾기', path: '/reformer-search' },
    { label: '채팅하기', path: role === 'reformer' ? '/chat/reformer' : '/chat/normal' }, 
  ];

  const handleNavClick = (path: string) => {
    // 리폼러 유저가 "주문제작" 탭 클릭 시 리폼러 주문제작 페이지로 이동
    if (path === '/order' && role === 'reformer') {
      navigate('/reformer/order');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="w-full h-[77px] border-b border-[var(--color-gray-30)]">
      <div className=" flex pl-[3.125rem] pt-[1.0625rem] gap-[2.1875rem] ">
        {navItems.map((item, index) => {
          const isActive =
            item.path === '/reformer-search'
              ? location.pathname.startsWith('/reformer-search')
              : item.path === '/order'
                ? location.pathname.startsWith('/order') || location.pathname.startsWith('/reformer/order')
                : location.pathname === item.path;
          return (
            <button
              type="button"
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
