import { api } from '../axios';
import type { CreateSaleRequest } from '../../types/domain/mypage/sale';

export const createSale = async (payload: CreateSaleRequest) => {
  const { data } = await api.post('/profile/add/item', payload);
  return data.success; // string
};
