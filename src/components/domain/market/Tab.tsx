export default function Tab() {
  const tabItems = [
    { id: 1, label: '상품 정보' },
    { id: 2, label: '리폼러 정보' },
    { id: 3, label: '상품 후기' },
  ];

  return (
    <nav className="flex w-full items-center gap-[6.4375rem] pl-[7rem]  pt-[0.625rem]  border-b border-[var(--color-line-gray-40)]">
      {tabItems.map((item) => (
        <div
          key={item.id}
          className="body-b0-bd inline-flex items-center justify-center p-[0.625rem] pb-0"
        >
          <button className="border-b-2 border-transparent hover:border-[var(--color-mint-1)] hover:text-[var(--color-mint-1)] transition-colors pb-[1.25rem] -mb-[0.125rem]">
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
}
