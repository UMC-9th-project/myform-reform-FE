import { api } from './axios';
import type { CartProduct, CartSeller, CartApiResponse } from '../types/cart';

/**
 * 장바구니 목록 조회
 * TODO: API 엔드포인트 연결 시 사용
 */
export const getCartItems = async (): Promise<CartApiResponse> => {
  // const response = await api.get('/cart');
  // return response.data;

  // 임시 데이터 (API 연결 전까지 사용)
  return {
    products: [],
    sellers: [],
  };
};

/**
 * 장바구니 상품 삭제
 * TODO: API 엔드포인트 연결 시 사용
 */
export const deleteCartItem = async (productId: number): Promise<void> => {
  // await api.delete(`/cart/${productId}`);
};

/**
 * 장바구니 상품 수량 변경
 * TODO: API 엔드포인트 연결 시 사용
 */
export const updateCartItemQuantity = async (
  productId: number,
  quantity: number
): Promise<void> => {
  // await api.patch(`/cart/${productId}`, { quantity });
};

/**
 * 장바구니 상품 선택 삭제
 * TODO: API 엔드포인트 연결 시 사용
 */
export const deleteCartItems = async (productIds: number[]): Promise<void> => {
  // await api.delete('/cart', { data: { productIds } });
};
