import { api } from '../axios';

export interface CreateOrderFromCartRequest {
  cart_ids: string[];
  delivery_address_id: string;
  merchant_uid: string;
}

export interface CreateOrderFromCartResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    order_id: string;
    payment_required: boolean;
    payment_info: {
      amount: number;
      merchant_uid: string;
    };
  };
  error?: {
    errorCode: string;
    reason: string;
    data?: unknown;
  };
}

export const createOrderFromCart = async (
  data: CreateOrderFromCartRequest
): Promise<CreateOrderFromCartResponse> => {
  const response = await api.post<CreateOrderFromCartResponse>(
    '/orders/from-cart',
    data
  );
  return response.data;
};
