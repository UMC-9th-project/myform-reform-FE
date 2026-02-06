interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface ProductTabMenuProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  /** true일 때 border-b 제거 (부모에서 전체 너비 밑줄 사용 시) */
  hideBorder?: boolean;
}

const ProductTabMenu = ({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
  hideBorder = false,
}: ProductTabMenuProps) => {
  return (
    <div className={`flex gap-40  ${!hideBorder ? 'border-b border-[var(--color-line-gray-40)]' : ''} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-4 body-b0-bd transition-colors ${
            activeTabId === tab.id
              ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
              : 'text-[var(--color-gray-50)]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProductTabMenu;
