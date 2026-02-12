import { useMemo } from 'react';
import CartContent from '../../components/domain/cart/CartContent';
import EmptyCart from '../../components/domain/cart/EmptyCart';
import { useCart } from '../../hooks/domain/cart/useCart';
import { useGetCart } from '../../hooks/domain/cart/useGetCart';
import { useDeleteCart } from '../../hooks/domain/cart/useDeleteCart';
import {
  transformCartOwnersToSellers,
  transformCartItemsToProducts,
  extractQuantities,
} from '../../utils/domain/cartTransform';
import type { CartProduct, CartSeller } from '@/types/api/cart/cart';

const Cart = () => {
  const { data: cartResponse, isLoading, error } = useGetCart();
  const { deleteCartItems } = useDeleteCart();

  // API 응답을 기존 타입으로 변환
  const sellers: CartSeller[] = useMemo(() => {
    if (!cartResponse?.success) return [];
    return transformCartOwnersToSellers(cartResponse.success);
  }, [cartResponse]);

  const initialProducts: CartProduct[] = useMemo(() => {
    if (!cartResponse?.success) return [];
    return transformCartItemsToProducts(cartResponse.success);
  }, [cartResponse]);

  const initialQuantities: number[] = useMemo(() => {
    if (!cartResponse?.success) return [];
    return extractQuantities(cartResponse.success);
  }, [cartResponse]);

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

  const deleteProduct = async (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product?.cartId) {
      deleteProductLocal(productId);
      return;
    }

    try {
      await deleteCartItems({ cartIds: [product.cartId] });
      deleteProductLocal(productId);
    } catch (error) {
      console.error('장바구니 삭제 실패:', error);
      alert('장바구니 삭제에 실패했습니다.');
    }
  };

  const deleteSelected = async () => {
    const selectedProducts = products.filter((_, index) => itemChecked[index]);
    const cartIds = selectedProducts
      .map((p) => p.cartId)
      .filter((id): id is string => !!id);

    if (cartIds.length === 0) {
      deleteSelectedLocal();
      return;
    }

    try {
      await deleteCartItems({ cartIds });
      deleteSelectedLocal();
    } catch (error) {
      console.error('장바구니 삭제 실패:', error);
      alert('장바구니 삭제에 실패했습니다.');
    }
  };

  const handleCheckout = () => {
    // 결제 페이지로 이동
    console.log('결제하기');
  };

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

  if (error) {
    return (
      <div className="bg-[var(--color-gray-20)] pb-[7.4375rem]">
        <div className="px-[3.125rem] pt-[1.875rem]">
          <h1 className="pt-[0.625rem] pb-[1.375rem] heading-h4-bd">장바구니</h1>
        </div>
        <div className="flex items-center justify-center py-[10rem]">
          <span className="body-b1-rg text-[var(--color-gray-60)]">
            장바구니를 불러오는 중 오류가 발생했습니다.
          </span>
        </div>
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
