// 결제 관련 타입 정의

// Portone SDK 타입 정의
export interface IMP {
  init: (storeId: string) => void;
  request_pay: (
    params: PaymentRequestParams,
    callback: (rsp: PaymentResponse) => void
  ) => void;
  agency?: string;
}

export interface PaymentRequestParams {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
  buyer_name: string;
}

export interface PaymentResponse {
  success: boolean;
  error_msg?: string;
  imp_uid?: string;
  paid_amount?: number;
}

export interface WindowWithIMP extends Window {
  IMP?: IMP;
}

// 배송지 정보
export interface DeliveryAddress {
  zipcode: string;
  address: string;
  detailAddress: string;
  name: string;
  recipient: string;
  phone: string;
}

// 결제 상태
export const PaymentStatus = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

// 결제 에러 타입
export const PaymentErrorType = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  ORDER_SHEET_ERROR: 'ORDER_SHEET_ERROR',
  ORDER_CREATE_ERROR: 'ORDER_CREATE_ERROR',
  PORTONE_LOAD_ERROR: 'PORTONE_LOAD_ERROR',
  PORTONE_PAYMENT_ERROR: 'PORTONE_PAYMENT_ERROR',
  VERIFICATION_ERROR: 'VERIFICATION_ERROR',
} as const;

export type PaymentErrorType = typeof PaymentErrorType[keyof typeof PaymentErrorType];

export interface PaymentError {
  type: PaymentErrorType;
  message: string;
  originalError?: Error;
}
