import { api } from '../axios';
import type { AddToCartRequest, AddToCartResponse } from '../../types/api/cart/addCart';
import type { GetCartResponse } from '../../types/api/cart/getCart';
import type { DeleteCartRequest, DeleteCartResponse } from '../../types/api/cart/deleteCart';

export const addToCart = async (
  itemId: string,
  data: AddToCartRequest
): Promise<AddToCartResponse> => {
  const response = await api.post<AddToCartResponse>(`/cart/${itemId}`, data);
  return response.data;
};

export const getCart = async (): Promise<GetCartResponse> => {
  const response = await api.get<GetCartResponse>('/cart');
  return response.data;
};

export const deleteCartItems = async (
  data: DeleteCartRequest
): Promise<DeleteCartResponse> => {
  const response = await api.delete<DeleteCartResponse>('/cart/items', { data });
  return response.data;
};

// 수량 증가/감소 응답 타입
export interface UpdateCartQuantityResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | {
    errorCode: string;
    reason: string;
    data?: unknown;
  };
  success: {
    cartId: string;
    updatedAt: string;
  } | null;
}

// 수량 증가
export const increaseCartQuantity = async (
  cartId: string
): Promise<UpdateCartQuantityResponse> => {
  const response = await api.patch<UpdateCartQuantityResponse>(`/cart/${cartId}/inc`);
  return response.data;
};

// 수량 감소
export const decreaseCartQuantity = async (
  cartId: string
): Promise<UpdateCartQuantityResponse> => {
  const response = await api.patch<UpdateCartQuantityResponse>(`/cart/${cartId}/dec`);
  return response.data;
};
