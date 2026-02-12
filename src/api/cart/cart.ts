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
