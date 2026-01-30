import { api } from '../axios';
import type { CreateSaleRequest } from '../../types/domain/mypage/sale';
import type { CreateOrderRequest } from '../../types/domain/mypage/order';

export const createSale = async (payload: CreateSaleRequest) => {
  const { data } = await api.post('/profile/add/item', payload);
  return data.success; // string
};

export const createOrder = async (payload: CreateOrderRequest) => {
  const { data } = await api.post('/profile/add/reform', payload);
  return data.success; // string
};