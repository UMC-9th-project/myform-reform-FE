import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDeleteCart } from './useDeleteCart';
import { getOrderSheetFromCart } from '../../../api/order/cartOrder';
import { increaseCartQuantity, decreaseCartQuantity } from '../../../api/cart/cart';
import type { CartProduct } from '../../../types/api/cart/cart';

interface UseCartActionsProps {
  products: CartProduct[];
  quantities: number[];
  itemChecked: boolean[];
  deleteProductLocal: (productId: number) => void;
  deleteSelectedLocal: () => void;
  handleQuantityChangeLocal: (index: number, newQuantity: number) => void;
}

export const useCartActions = ({
  products,
  quantities,
  itemChecked,
  deleteProductLocal,
  deleteSelectedLocal,
  handleQuantityChangeLocal,
}: UseCartActionsProps) => {
  const navigate = useNavigate();
  const { deleteCartItems } = useDeleteCart();

  const increaseQuantityMutation = useMutation({
    mutationFn: increaseCartQuantity,
  });

  const decreaseQuantityMutation = useMutation({
    mutationFn: decreaseCartQuantity,
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
    } catch {
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
    } catch {
      alert('장바구니 삭제에 실패했습니다.');
    }
  };

  const handleCheckout = async () => {
    const selectedProducts = products.filter((_, index) => itemChecked[index]);
    if (selectedProducts.length === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }

    const cartIds = selectedProducts
      .map((p) => p.cartId)
      .filter((id): id is string => !!id && typeof id === 'string');

    if (cartIds.length === 0) {
      alert('장바구니 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      const orderSheetResponse = await getOrderSheetFromCart({ cart_ids: cartIds });
      
      if (orderSheetResponse.resultType !== 'SUCCESS' || !orderSheetResponse.success) {
        const errorMessage = orderSheetResponse.error?.reason || '주문서 조회에 실패했습니다.';
        const errorData = orderSheetResponse.error?.data;
        alert(`${errorMessage}${errorData ? `\n${JSON.stringify(errorData)}` : ''}`);
        return;
      }

      const orderSheet = orderSheetResponse.success;

      navigate('/market/purchase', {
        state: {
          fromCart: true,
          cartIds: cartIds,
          orderSheet: orderSheet,
          selectedProducts: selectedProducts,
        },
      });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { reason?: string; data?: unknown }; message?: string }; status?: number } };
      const errorResponse = axiosError?.response?.data;
      const errorMessage = 
        errorResponse?.error?.reason || 
        errorResponse?.message || 
        (error instanceof Error ? error.message : '주문서 조회 중 오류가 발생했습니다.');
      
      const errorDetails = errorResponse?.error?.data 
        ? `\n상세: ${JSON.stringify(errorResponse.error.data)}`
        : '';
      
      alert(`${errorMessage}${errorDetails}`);
    }
  };

  const handleQuantityChange = async (index: number, newQuantity: number) => {
    const product = products[index];
    if (!product?.cartId) {
      handleQuantityChangeLocal(index, newQuantity);
      return;
    }

    const currentQuantity = quantities[index] || 1;
    
    try {
      if (newQuantity > currentQuantity) {
        await increaseQuantityMutation.mutateAsync(product.cartId);
      } else if (newQuantity < currentQuantity && newQuantity >= 1) {
        await decreaseQuantityMutation.mutateAsync(product.cartId);
      }
      handleQuantityChangeLocal(index, newQuantity);
    } catch {
      alert('수량 변경에 실패했습니다.');
    }
  };

  return {
    deleteProduct,
    deleteSelected,
    handleCheckout,
    handleQuantityChange,
  };
};
