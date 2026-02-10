import { api } from '../axios';
import type { SaleItemResponse } from '@/types/domain/mypage/sale';
export const getOrderById = async (orderId: string) => {
    const response = await api.get(`/profile/sales/${orderId}`);
    return response.data;
}

export const getSaleItem = async (itemId: string): Promise<SaleItemResponse> => {
  const res = await api.get(`/sales/${itemId}`);
  return res.data.success; // success 안에 실제 데이터가 있음
};