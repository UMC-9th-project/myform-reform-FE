import { api } from '../axios';

// 주문서 조회 요청 타입 (Step 1: 배송지 정보는 보내지 않음, BE가 기본 배송지 사용)
export interface CreateOrderSheetRequest {
  item_id: string;
  option_item_ids: string[];
  quantity: number;
  // delivery_address_id는 Step 1에서 보내지 않음 (문서 참고)
}

// 주문서 조회 응답 타입
export interface CreateOrderSheetResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    receipt_number: string; // 주문 번호 (merchant_uid로 사용)
    delivery_fee: number; // 배송비
    payment: {
      product_amount: number; // 상품 금액
      delivery_fee: number; // 배송비
      total_amount: number; // 총 결제 금액
    };
  };
}

// 배송지 정보 (new_address용)
export interface NewDeliveryAddress {
  postal_code: string;
  address: string;
  address_detail: string;
  recipient_name: string;
  phone: string;
  address_name: string;
}

// 주문 생성 요청 타입 (ITEM 결제)
export interface CreateOrderRequest {
  merchant_uid: string; // receipt_number를 merchant_uid로 사용
  item_id: string;
  option_item_ids: string[]; // 선택된 옵션 아이템 ID 배열
  quantity: number;
  // delivery_address_id 또는 new_address 둘 중 하나만 전달
  delivery_address_id?: string; // 기존 배송지 ID
  new_address?: NewDeliveryAddress; // 새 배송지 정보
}

// 주문 생성 응답 타입
export interface CreateOrderResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    order_id: string;
    payment_required: boolean;
    payment_info: {
      amount: number;
      merchant_uid: string;
    };
  };
}

// 주문서 조회 API (POST /orders/sheet)
export const createOrderSheet = async (
  payload: CreateOrderSheetRequest
): Promise<CreateOrderSheetResponse> => {
  const response = await api.post<CreateOrderSheetResponse>('/orders/sheet', payload);
  return response.data;
};

// 주문 생성 API (POST /orders)
export const createOrder = async (
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>('/orders', payload);
  return response.data;
};
