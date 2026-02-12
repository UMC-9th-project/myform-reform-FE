import { api } from '../axios';

export interface CreateOrderFromCartRequest {
  cart_ids: string[];
  delivery_address_id: string;
  merchant_uid: string;
}

export interface CreateOrderFromCartResponse {
  resultType: 'SUCCESS' | 'ERROR';
  success?: {
    orderId: string;
    merchant_uid: string;
  };
  error?: {
    code: string;
    message: string;
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
