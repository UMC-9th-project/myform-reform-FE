// api/mypage/sale.ts
import { api } from '@/api/axios';

export const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
  const response = await api.patch(`/profile/sales/${orderId}/tracking`, {
    trackingNumber,
  });
  return response.data;
};
