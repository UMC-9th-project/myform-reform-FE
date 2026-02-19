// src/api/orderApi.ts
import { api } from '@/api/axios';

export interface VerifyPaymentRequest {
  order_id: string;
  imp_uid: string;
}

export interface VerifyPaymentResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: { reason: string } | null;
  success?: {
    success: boolean;
  };
}

export const verifyPayment = async (body: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
  const { data } = await api.post<VerifyPaymentResponse>('/orders/verify', body);
  return data;
};
