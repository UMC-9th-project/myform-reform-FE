import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CartContent from '../../components/domain/cart/CartContent';
import EmptyCart from '../../components/domain/cart/EmptyCart';
import { useCart } from '../../hooks/domain/cart/useCart';
import { useGetCart } from '../../hooks/domain/cart/useGetCart';
import { useDeleteCart } from '../../hooks/domain/cart/useDeleteCart';
import { getProfile } from '../../api/profile/user';
import {
  transformCartOwnersToSellers,
  transformCartItemsToProducts,
  extractQuantities,
} from '../../utils/domain/cartTransform';
import type { CartProduct, CartSeller } from '@/types/api/cart/cart';

const Cart = () => {
  const navigate = useNavigate();
  const { data: cartResponse, isLoading, error } = useGetCart();
  const { deleteCartItems } = useDeleteCart();

  const baseSellers: CartSeller[] = useMemo(() => {
    if (!cartResponse?.success) return [];
    return transformCartOwnersToSellers(cartResponse.success);
  }, [cartResponse]);

  const profileQueries = useQueries({
    queries: baseSellers
      .filter((seller) => seller.ownerId)
      .map((seller) => ({
        queryKey: ['reformerProfileView', seller.ownerId],
        queryFn: async () => {
          const res = await getProfile(seller.ownerId!);
          if (res.resultType !== 'SUCCESS' || !res.success) {
            return null;
          }
          return { ownerId: seller.ownerId, nickname: res.success.nickname };
        },
        enabled: !!seller.ownerId,
      })),
  });

  const sellers: CartSeller[] = useMemo(() => {
    const profileMap = new Map<string, string>();
    profileQueries.forEach((query) => {
      if (query.data?.ownerId && query.data.nickname) {
        profileMap.set(query.data.ownerId, query.data.nickname);
      }
    });

    return baseSellers.map((seller) => {
      const nickname = seller.ownerId ? profileMap.get(seller.ownerId) : null;
      return nickname ? { ...seller, name: nickname } : seller;
    });
  }, [baseSellers, profileQueries]);

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
    // 선택된 상품이 없으면 알림
    const selectedProducts = products.filter((_, index) => itemChecked[index]);
    if (selectedProducts.length === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }

    // 선택된 상품들의 cartId 추출
    const cartIds = selectedProducts
      .map((p) => p.cartId)
      .filter((id): id is string => !!id);

    if (cartIds.length === 0) {
      alert('장바구니 정보를 불러올 수 없습니다.');
      return;
    }

    // 첫 번째 선택된 상품의 itemId를 사용하여 결제 페이지로 이동
    const firstSelectedProduct = selectedProducts[0];
    if (firstSelectedProduct.itemId) {
      navigate(`/market/product/${firstSelectedProduct.itemId}/purchase`, {
        state: {
          fromCart: true,
          cartIds: cartIds,
          selectedProducts: selectedProducts.map((product) => ({
            ...product,
            quantity: quantities[products.findIndex((p) => p.id === product.id)],
          })),
        },
      });
    } else {
      alert('상품 정보를 불러올 수 없습니다.');
    }
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
