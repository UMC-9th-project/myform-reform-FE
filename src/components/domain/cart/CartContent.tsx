import CartHeader from './CartHeader';
import SellerGroup from './SellerGroup';
import PaymentSummaryCard from './PaymentSummary';
import type {
  CartProduct,
  CartSeller,
  PaymentSummary as PaymentSummaryType,
} from '../../../types/domain/cart/cart';

interface CartContentProps {
  sellers: CartSeller[];
  products: CartProduct[];
  quantities: number[];
  sellerChecked: boolean[];
  itemChecked: boolean[];
  totalItems: number;
  checkedCount: number;
  isAllChecked: boolean;
  payment: PaymentSummaryType;
  onAllCheck: (checked: boolean) => void;
  onSellerCheck: (sellerId: number, checked: boolean) => void;
  onItemCheck: (productIndex: number, checked: boolean) => void;
  onQuantityChange: (productIndex: number, newQuantity: number) => void;
  onDeleteProduct: (productId: number) => void;
  onDeleteSelected: () => void;
  onCheckout: () => void;
}

const CartContent = ({
  sellers,
  products,
  quantities,
  sellerChecked,
  itemChecked,
  totalItems,
  checkedCount,
  isAllChecked,
  payment,
  onAllCheck,
  onSellerCheck,
  onItemCheck,
  onQuantityChange,
  onDeleteProduct,
  onDeleteSelected,
  onCheckout,
}: CartContentProps) => {
  return (
    <div className="px-[3.125rem] flex gap-[1.25rem] flex-row">
      <div className="flex-1 h-[56.875rem] pt-[1.125rem] flex flex-col gap-[0.75rem]">
        {/* 선택 바 영역 */}
        <CartHeader
          isAllChecked={isAllChecked}
          checkedCount={checkedCount}
          totalItems={totalItems}
          onAllCheck={onAllCheck}
          onDeleteSelected={onDeleteSelected}
        />

        {/* 박스 영역 */}
        <div className="flex flex-col gap-[1.3125rem]">
          {sellers.map((seller) => {
            const sellerProducts = products.filter(
              (p) => p.sellerId === seller.id
            );
            const sellerIndex = sellers.findIndex((s) => s.id === seller.id);

            return (
              <SellerGroup
                key={seller.id}
                seller={seller}
                products={sellerProducts}
                allProducts={products}
                quantities={quantities}
                itemChecked={itemChecked}
                sellerChecked={sellerChecked[sellerIndex] || false}
                onSellerCheck={(checked) => onSellerCheck(seller.id, checked)}
                onItemCheck={onItemCheck}
                onQuantityChange={onQuantityChange}
                onDeleteProduct={onDeleteProduct}
              />
            );
          })}
        </div>
      </div>

      {/* 옆에 결제 영역 */}
      <PaymentSummaryCard payment={payment} onCheckout={onCheckout} />
    </div>
  );
};

export default CartContent;
