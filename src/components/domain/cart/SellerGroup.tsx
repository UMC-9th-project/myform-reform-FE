import { useNavigate } from 'react-router-dom';
import Checkbox from '../../common/checkbox/Checkbox';
import type { CartProduct, CartSeller } from '@/types/api/cart/cart';
import CartItem from './CartItem';
import truckIcon from '../../../assets/icons/truck.svg';
import rightIcon from '../../../assets/icons/right.svg';

interface SellerGroupProps {
  seller: CartSeller;
  products: CartProduct[];
  allProducts: CartProduct[];
  quantities: number[];
  itemChecked: boolean[];
  sellerChecked: boolean;
  onSellerCheck: (checked: boolean) => void;
  onItemCheck: (productIndex: number, checked: boolean) => void;
  onQuantityChange: (productIndex: number, newQuantity: number) => void;
  onDeleteProduct: (productId: number) => void;
}

const SellerGroup = ({
  seller,
  products,
  allProducts,
  quantities,
  itemChecked,
  sellerChecked,
  onSellerCheck,
  onItemCheck,
  onQuantityChange,
  onDeleteProduct,
}: SellerGroupProps) => {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  const handleSellerClick = () => {
    if (seller.ownerId) {
      navigate(`/profile/${seller.ownerId}`);
    }
  };

  return (
    <div className="bg-[var(--color-white)] rounded-[10px] border border-[var(--color-line-gray-40)] flex flex-col">
      <div className="px-[1.9375rem] pt-[1.4375rem] pb-[1.125rem] flex items-center justify-between border-b border-[var(--color-line-gray-40)]">
        <div className="flex items-center gap-[0.6875rem]">
          <Checkbox checked={sellerChecked} onChange={onSellerCheck} />
          <button
            onClick={handleSellerClick}
            className="flex items-center gap-[0.6875rem] body-b0-sb cursor-pointer"
          >
            <span>{seller.name || '판매자'}</span>
            <img src={rightIcon} alt="" className="pb-1 w-10 h-10" />
          </button>
        </div>
        <div className="flex items-center gap-[0.375rem]">
          <img src={truckIcon} alt="배송" className="w-10 h-10" />
          <span className="body-b0-md text-[var(--color-gray-50)]">
            {seller.shippingText}
          </span>
        </div>
      </div>
      {/* 상품 아이템들 */}
      {products.map((product, productIndex) => {
        const productIndexInAll = allProducts.findIndex(
          (p) => p.id === product.id
        );
        return (
          <CartItem
            key={product.id}
            product={product}
            quantity={quantities[productIndexInAll] || 1}
            isChecked={itemChecked[productIndexInAll] || false}
            isFirst={productIndex === 0}
            onCheck={(checked) => onItemCheck(productIndexInAll, checked)}
            onQuantityChange={(newQuantity) =>
              onQuantityChange(productIndexInAll, newQuantity)
            }
            onDelete={() => onDeleteProduct(product.id)}
          />
        );
      })}
    </div>
  );
};

export default SellerGroup;
