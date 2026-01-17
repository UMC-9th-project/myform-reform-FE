import Checkbox from '../../../components/common/Checkbox/Checkbox';
import OptionQuantity from '../product/option/option-quantity-button/OptionQuantity';
import type { CartProduct } from '../../../types/domain/cart/cart';
import xIcon from '../../../assets/icons/x.svg';

const productImage = '/images/e3.jpg';

interface CartItemProps {
  product: CartProduct;
  quantity: number;
  isChecked: boolean;
  isFirst: boolean;
  onCheck: (checked: boolean) => void;
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void;
}

const CartItem = ({
  product,
  quantity,
  isChecked,
  isFirst,
  onCheck,
  onQuantityChange,
  onDelete,
}: CartItemProps) => {
  return (
    <div
      className={`px-[1.9375rem] pt-[1.4375rem] pb-[1.875rem] flex gap-[1.25rem] items-start ${
        !isFirst ? 'border-t border-[var(--color-line-gray-40)]' : ''
      }`}
    >
      <div className="pt-[0.125rem]">
        <Checkbox checked={isChecked} onChange={onCheck} />
      </div>
      <img
        src={product.imageUrl || productImage}
        alt="상품 이미지"
        className="w-[9.375rem] h-[9.375rem] object-cover flex-shrink-0"
      />
      <div className="flex-1 flex flex-col gap-[0.75rem]">
        <div className="flex items-start justify-between gap-[0.75rem]">
          <div className="body-b1-rg flex-1">{product.name}</div>
          <button className="cursor-pointer flex-shrink-0" onClick={onDelete}>
            <img
              src={xIcon}
              alt="삭제"
              className="w-10 h-10"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(40%) sepia(8%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(85%)',
              }}
            />
          </button>
        </div>
        <div className="body-b1-rg text-[var(--color-gray-50)]">
          {product.option}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <OptionQuantity
            quantity={quantity}
            onIncrease={() => onQuantityChange(quantity + 1)}
            onDecrease={() => onQuantityChange(Math.max(1, quantity - 1))}
          />
          <div className="body-b0-bd">
            {(product.price * quantity).toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
