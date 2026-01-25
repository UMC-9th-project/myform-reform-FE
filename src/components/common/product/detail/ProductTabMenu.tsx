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
}

const ProductTabMenu = ({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
}: ProductTabMenuProps) => {
  return (
    <div className={`flex gap-40 border-b border-[var(--color-gray-40)] mb-20 ${className}`}>
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
