import { api } from '../axios';
import type { CreateSaleRequest, CreateSaleResponse } from '../../types/domain/mypage/sale';

export const createSale = async (
  payload: CreateSaleRequest
): Promise<CreateSaleResponse> => {
  const { data } = await api.post<CreateSaleResponse>(
    '/profile/add/item',
    payload
  );

  return data;
};
