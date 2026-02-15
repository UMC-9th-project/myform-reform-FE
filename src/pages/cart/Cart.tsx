import { useEffect } from 'react';
import CartContent from '../../components/domain/cart/CartContent';
import EmptyCart from '../../components/domain/cart/EmptyCart';
import { useCart } from '../../hooks/domain/cart/useCart';
import { useGetCart } from '../../hooks/domain/cart/useGetCart';
import { useCartSellers } from '../../hooks/domain/cart/useCartSellers';
import { useCartProducts } from '../../hooks/domain/cart/useCartProducts';
import { useCartActions } from '../../hooks/domain/cart/useCartActions';
import useAuthStore from '../../stores/useAuthStore';

const Cart = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: cartResponse, isLoading, error, refetch } = useGetCart();
  
  // 로그인 상태가 변경되면 장바구니 다시 조회
  useEffect(() => {
    if (accessToken && !isLoading && !cartResponse) {
      refetch();
    }
  }, [accessToken, isLoading, cartResponse, refetch]);

  // 판매자 정보 조회
  const sellers = useCartSellers(cartResponse);

  // 상품 정보 및 이미지 로딩
  const { initialProducts, initialQuantities, productImageLoadingMap } = useCartProducts(cartResponse);

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
    deleteProduct: deleteProductLocal,
    deleteSelected: deleteSelectedLocal,
  } = useCart({
    initialProducts,
    sellers,
    initialQuantities,
  });

  // 장바구니 액션 (삭제, 결제, 수량 변경)
  const { deleteProduct, deleteSelected, handleCheckout, handleQuantityChange: handleQuantityChangeAPI } = useCartActions({
    products,
    quantities,
    itemChecked,
    deleteProductLocal,
    deleteSelectedLocal,
    handleQuantityChangeLocal: handleQuantityChange,
  });

  // 비로그인 상태면 빈 장바구니 표시 (토큰만 체크, user는 persist되지 않을 수 있음)
  const isNotLoggedIn = !accessToken;

  if (isLoading) {
    return (
      <div className="bg-[var(--color-gray-20)] pb-[7.4375rem]">
        <div className="px-[3.125rem] pt-[1.875rem]">
          <h1 className="pt-[0.625rem] pb-[1.375rem] heading-h4-bd">장바구니</h1>
        </div>
        <div className="flex items-center justify-center py-[10rem]">
          <span className="body-b1-rg text-[var(--color-gray-60)]">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 비로그인 상태거나 에러 발생 시 빈 장바구니 표시
  if (isNotLoggedIn) {
    return (
      <div className="bg-[var(--color-gray-20)] pb-[7.4375rem]">
        <div className="px-[3.125rem] pt-[1.875rem]">
          <h1 className="pt-[0.625rem] pb-[1.375rem] heading-h4-bd">장바구니</h1>
        </div>
        <EmptyCart />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-gray-20)] pb-[7.4375rem]">
        <div className="px-[3.125rem] pt-[1.875rem]">
          <h1 className="pt-[0.625rem] pb-[1.375rem] heading-h4-bd">장바구니</h1>
        </div>
        <EmptyCart />
      </div>
    );
  }

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
          productImageLoadingMap={productImageLoadingMap}
          onAllCheck={handleAllCheck}
          onSellerCheck={handleSellerCheck}
          onItemCheck={handleItemCheck}
          onQuantityChange={handleQuantityChangeAPI}
          onDeleteProduct={deleteProduct}
          onDeleteSelected={deleteSelected}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default Cart;
