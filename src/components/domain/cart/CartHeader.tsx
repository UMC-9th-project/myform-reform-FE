import Checkbox from '../../common/checkbox_tmp/Checkbox';
import Button from '../../common/button/button1';

interface CartHeaderProps {
  isAllChecked: boolean;
  checkedCount: number;
  totalItems: number;
  onAllCheck: (checked: boolean) => void;
  onDeleteSelected: () => void;
}

const CartHeader = ({
  isAllChecked,
  checkedCount,
  totalItems,
  onAllCheck,
  onDeleteSelected,
}: CartHeaderProps) => {
  return (
    <div className="h-[2.5rem] flex items-center justify-between">
      {/* 체크박스쪽 */}
      <div className="pt-[1.125rem] pb-[0.75rem] h-[2.5rem] flex items-center gap-[0.6875rem]">
        <div className="py-[0.125rem]">
          <Checkbox checked={isAllChecked} onChange={onAllCheck} />
        </div>
        <h1 className="my-[0.3125rem] body-b0-rg">
          전체 선택 ({checkedCount}/{totalItems})
        </h1>
      </div>

      <div>
        <Button
          variant="white"
          className="!w-[7.0625rem] !h-[2.5rem] px-0 py-0 body-b0-rg !text-[var(--color-gray-50)] whitespace-nowrap"
          onClick={onDeleteSelected}
        >
          선택 삭제
        </Button>
      </div>
    </div>
  );
};

export default CartHeader;
