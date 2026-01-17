import CartContent from '../../components/domain/cart/CartContent';
import EmptyCart from '../../components/domain/cart/EmptyCart';
import { useCart } from '../../hooks/domain/cart/useCart';
import type { CartProduct, CartSeller } from '../../types/domain/cart/cart';

const INITIAL_SELLERS: CartSeller[] = [
  {
    id: 0,
    name: '침착한 대머리독수리',
    shippingFee: 0,
    shippingText: '무료 배송',
  },
  {
    id: 1,
    name: '리폼장인 크크크',
    shippingFee: 3000,
    shippingText: '3,000원',
  },
];

const INITIAL_PRODUCTS: CartProduct[] = [
  {
    id: 0,
    sellerId: 0,
    price: 85000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
  {
    id: 1,
    sellerId: 0,
    price: 35000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
  {
    id: 2,
    sellerId: 1,
    price: 100000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
];

const Cart = () => {
  const sellers = INITIAL_SELLERS;
  const initialProducts = INITIAL_PRODUCTS;

  const {
    products,
    sellers: cartSellers,
    quantities,
    sellerChecked,
    itemChecked,
    totalItems,
    checkedCount,
    isAllChecked,
    payment,
    handleAllCheck,
    handleItemCheck,
    handleSellerCheck,
    handleQuantityChange,
    deleteProduct,
    deleteSelected,
  } = useCart({
    initialProducts,
    sellers,
  });

  const handleCheckout = () => {
    // 결제 페이지로 이동
    console.log('결제하기');
  };

  return (
    <div className="bg-[var(--color-gray-20)] pb-[7.4375rem]">
      <div className="px-[3.125rem] pt-[1.875rem]">
        <h1 className="pt-[0.625rem] pb-[1.375rem] heading-h4-bd">장바구니</h1>
      </div>

      {products.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartContent
          sellers={cartSellers}
          products={products}
          quantities={quantities}
          sellerChecked={sellerChecked}
          itemChecked={itemChecked}
          totalItems={totalItems}
          checkedCount={checkedCount}
          isAllChecked={isAllChecked}
          payment={payment}
          onAllCheck={handleAllCheck}
          onSellerCheck={handleSellerCheck}
          onItemCheck={handleItemCheck}
          onQuantityChange={handleQuantityChange}
          onDeleteProduct={deleteProduct}
          onDeleteSelected={deleteSelected}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default Cart;
