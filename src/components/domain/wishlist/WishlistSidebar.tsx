import type { WishlistMenuType } from './types';

interface WishlistSidebarProps {
  activeMenu: WishlistMenuType;
  onMenuChange: (menu: WishlistMenuType) => void;
}

const WishlistSidebar = ({
  activeMenu,
  onMenuChange,
}: WishlistSidebarProps) => {
  return (
    <aside className="w-[240px] mt-[1.875rem] bg-white rounded-[0.625rem] p-[1.25rem] h-fit">
      <h2 className="ml-4 body-b0-bd text-[var(--color-black)] mb-[0.625rem]">
        나의 찜 목록
      </h2>
      <hr className="border-[var(--color-gray-30)] mb-[0.625rem]" />
      <nav className="flex flex-col">
        <button
          onClick={() => onMenuChange('market')}
          className={`ml-4 body-b0-md text-left py-[0.875rem] transition-colors ${
            activeMenu === 'market'
              ? 'text-[var(--color-black)]'
              : 'text-[var(--color-gray-50)]'
          }`}
        >
          마켓
        </button>
        <button
          onClick={() => onMenuChange('custom')}
          className={`ml-4 body-b0-md text-left py-[0.875rem] transition-colors ${
            activeMenu === 'custom'
              ? 'text-[var(--color-black)]'
              : 'text-[var(--color-gray-50)]'
          }`}
        >
          주문제작
        </button>
      </nav>
    </aside>
  );
};

export default WishlistSidebar;
