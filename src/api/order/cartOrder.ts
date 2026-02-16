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

// 장바구니에서 주문서 조회 요청 타입
export interface GetOrderSheetFromCartRequest {
  cart_ids: string[];
}

// 장바구니에서 주문서 조회 응답 타입
export interface GetOrderSheetFromCartResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | {
    errorCode: string;
    reason: string;
    data?: unknown;
  };
  success: {
    receipt_number: string;
    delivery_fee: number;
    delivery_address: {
      address_name: string;
      phone: string;
      recipient_name: string;
      address_detail: string;
      address: string;
      postal_code: string;
      delivery_address_id: string;
    };
    payment: {
      total_amount: number;
      delivery_fee: number;
      product_amount: number;
    };
    seller_groups: Array<{
      owner_id: string;
      reformer_nickname: string;
      items: Array<{
        reformer_nickname: string;
        thumbnail: string;
        title: string;
        selected_options: string[];
        quantity: number;
        price: number;
      }>;
      delivery_fee: number;
    }>;
  };
}

// 장바구니에서 주문서 조회 API (POST /orders/sheet/from-cart)
export const getOrderSheetFromCart = async (
  data: GetOrderSheetFromCartRequest
): Promise<GetOrderSheetFromCartResponse> => {
  const response = await api.post<GetOrderSheetFromCartResponse>(
    '/orders/sheet/from-cart',
    data
  );
  return response.data;
};
