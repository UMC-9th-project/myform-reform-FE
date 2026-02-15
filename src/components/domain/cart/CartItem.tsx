import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '../../common/checkbox/Checkbox';
import OptionQuantity from '../../common/product/option/option-quantity-button/OptionQuantity';
import type { CartProduct } from '@/types/api/cart/cart';
import xIcon from '../../../assets/icons/x.svg';

interface CartItemProps {
  product: CartProduct;
  quantity: number;
  isChecked: boolean;
  isFirst: boolean;
  isImageLoading?: boolean;
  onCheck: (checked: boolean) => void;
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void;
}

const CartItem = ({
  product,
  quantity,
  isChecked,
  isFirst,
  isImageLoading = false,
  onCheck,
  onQuantityChange,
  onDelete,
}: CartItemProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleProductClick = () => {
    if (product.itemId) {
      navigate(`/market/product/${product.itemId}`);
    }
  };

  return (
    <div
      className={`px-[1.9375rem] pt-[1.4375rem] pb-[1.875rem] flex gap-[1.25rem] items-start ${
        !isFirst ? 'border-t border-[var(--color-line-gray-40)]' : ''
      }`}
    >
      <div className="pt-[0.125rem]" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isChecked} onChange={onCheck} />
      </div>
      {isImageLoading ? (
        <div 
          className="w-[9.375rem] h-[9.375rem] bg-[var(--color-gray-30)] flex items-center justify-center cursor-pointer animate-pulse"
          onClick={handleProductClick}
        >
          <span className="text-[var(--color-gray-50)] text-sm">로딩 중...</span>
        </div>
      ) : product.imageUrl && !imageError ? (
        <img
          src={product.imageUrl}
          alt="상품 이미지"
          className="w-[9.375rem] h-[9.375rem] object-cover flex-shrink-0 cursor-pointer bg-[var(--color-gray-30)]"
          onClick={handleProductClick}
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <div 
          className="w-[9.375rem] h-[9.375rem] bg-[var(--color-gray-30)] flex items-center justify-center cursor-pointer"
          onClick={handleProductClick}
        >
          <span className="text-[var(--color-gray-50)] text-sm">이미지 없음</span>
        </div>
      )}
      <div 
        className="flex-1 flex flex-col h-full cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex items-start justify-between gap-[0.75rem] h-full">
          <div className="flex-1 flex flex-col gap-[0.75rem] h-full justify-between">
            <div className="flex flex-col gap-[0.75rem]">
              <div className="body-b1-rg">{product.name}</div>
              <div className="body-b1-rg text-[var(--color-gray-50)]">
                {product.option}
              </div>
            </div>
            <div 
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
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
          <button 
            className="cursor-pointer flex-shrink-0" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
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
      </div>
    </div>
  );
};

export default CartItem;
