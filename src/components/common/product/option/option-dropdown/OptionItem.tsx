export interface OptionItem {
  label: string;
  price: number;
}

interface OptionItemProps {
  option: OptionItem;
  onClick: () => void;
}

const OptionItem = ({ option, onClick }: OptionItemProps) => {
  return (
    <div
      onClick={onClick}
      className="
         w-[573px] 
          h-[58px] 
          bg-[var(--color-bg-white)] 
          border-b
          border-[var(--color-line-gray-40)]
          flex items-center
          pl-6
          body-b1-rg
          text-[var(--color-gray-50)]
          hover:bg-[var(--color-gray-20)]
          cursor-pointer
      "
    >
      {option.label}
      {option.price > 0 ? ` (+${option.price.toLocaleString()}원)` : ' (+0원)'}
    </div>
  );
};

export default OptionItem;
