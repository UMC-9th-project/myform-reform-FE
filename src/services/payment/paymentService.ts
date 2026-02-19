// 결제 서비스 레이어
import { createOrder, createOrderSheet } from '../../api/order/orderApi';
import { verifyPayment } from '../../api/chat/orderApi';
import type { PaymentResponse, WindowWithIMP } from '../../types/payment/payment';

/**
 * Portone SDK 로드
 */
export const loadPortOneSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const windowWithIMP = window as WindowWithIMP;
    
    // 이미 로드되어 있는 경우
    if (windowWithIMP.IMP) {
      const IMP = windowWithIMP.IMP;
      if (!IMP.agency) {
        IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
      }
      return resolve();
    }

    // SDK 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => {
      const IMP = windowWithIMP.IMP;
      if (!IMP) {
        return reject(new Error('포트원 SDK 로드 실패'));
      }
      IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
      resolve();
    };
    script.onerror = () => reject(new Error('포트원 SDK 스크립트 로드 실패'));
    document.body.appendChild(script);
  });
};

/**
 * Portone 결제창 호출
 */
export const requestPortonePayment = (
  params: {
    merchant_uid: string;
    name: string;
    amount: number;
    buyer_name: string;
  },
  callback: (rsp: PaymentResponse) => void
): void => {
  const windowWithIMP = window as WindowWithIMP;
  const IMP = windowWithIMP.IMP;
  
  if (!IMP) {
    throw new Error('포트원 SDK가 로드되지 않았습니다.');
  }

  IMP.request_pay(
    {
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: params.merchant_uid,
      name: params.name,
      amount: params.amount,
      buyer_name: params.buyer_name,
    },
    callback
  );
};

/**
 * 주문서 조회
 */
export const fetchOrderSheet = async (payload: {
  item_id: string;
  option_item_ids: string[];
  quantity: number;
}) => {
  const response = await createOrderSheet(payload);
  
  if (response.resultType !== 'SUCCESS' || !response.success) {
    throw new Error(response.error?.message || '주문서 생성에 실패했습니다.');
  }
  
  return response.success;
};

/**
 * 주문 생성
 */
export const createOrderRequest = async (payload: {
  merchant_uid: string;
  item_id: string;
  option_item_ids: string[];
  quantity: number;
  new_address?: {
    postal_code: string;
    address: string;
    address_detail: string;
    recipient_name: string;
    phone: string;
    address_name: string;
  };
  delivery_address_id?: string;
}) => {
  const response = await createOrder(payload);
  
  if (response.resultType !== 'SUCCESS' || !response.success) {
    throw new Error(response.error?.message || '주문 생성에 실패했습니다.');
  }
  
  return response.success;
};

/**
 * 결제 검증
 */
export const verifyPaymentRequest = async (payload: {
  order_id: string;
  imp_uid: string;
}) => {
  return await verifyPayment(payload);
};
