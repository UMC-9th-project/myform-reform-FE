import { api } from '../axios';
import type { CreateSaleRequest } from '../../types/domain/mypage/sale';
import type { CreateOrderRequest } from '../../types/domain/mypage/order';
import type { orderListItem } from '../../types/domain/mypage/orderList';
import type { GetProfileSalesParams, GetProfileSalesResponse } from '../../types/domain/profile/sales';

export const createSale = async (payload: CreateSaleRequest) => {
  const { data } = await api.post('/profile/add/item', payload);
  return data.success; // string
};

export const createOrder = async (payload: CreateOrderRequest) => {
  const { data } = await api.post('/profile/add/reform', payload);
  return data.success; // string
};

export const getOrders = async ({ type }: { type: 'ITEM' | 'REFORM' }): Promise<orderListItem[]> => {
  const { data } = await api.get('/profile/sales', { params: { type } });

  if (data.resultType === 'SUCCESS' && data.success) {
    return data.success as orderListItem[];
  } else {
    return [];
  }
};

export const getProfileSales = async ({
  ownerId,

  cursor,
  limit = 20,
}: GetProfileSalesParams): Promise<GetProfileSalesResponse> => {
  const response = await api.get(`/profile/${ownerId}/item`, {
    params: {
      cursor,
      limit,
    },
  });

  return response.data;
};
