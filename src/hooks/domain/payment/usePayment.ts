// 결제 커스텀 훅
import { useState, useCallback } from 'react';
import {
  loadPortOneSDK,
  requestPortonePayment,
  fetchOrderSheet,
  createOrderRequest,
  verifyPaymentRequest,
} from '../../../services/payment/paymentService';
import type { DeliveryAddress, PaymentError, PaymentErrorType, PaymentResponse } from '../../../types/payment/payment';
import { PaymentStatus, PaymentErrorType as ErrorType } from '../../../types/payment/payment';
import { formatApprovedAt } from '../../../utils/payment/formatPaymentDate';

interface UsePaymentParams {
  product: {
    id: string;
    title: string;
    price: number;
    optionPrice?: number;
    quantity: number;
    selectedOptions?: Record<string, string>;
    image: string;
    seller: string;
    option?: string;
  };
  deliveryAddress: DeliveryAddress;
  deliveryAddressId?: string | null; // 기존 배송지 ID (선택 시)
  onSuccess?: (orderData: unknown) => void;
  onError?: (error: PaymentError) => void;
}

interface UsePaymentReturn {
  processPayment: () => Promise<void>;
  status: PaymentStatus;
  error: PaymentError | null;
  isProcessing: boolean;
}

/**
 * 결제 처리 커스텀 훅
 */
export const usePayment = ({
  product,
  deliveryAddress,
  deliveryAddressId,
  onSuccess,
  onError,
}: UsePaymentParams): UsePaymentReturn => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [error, setError] = useState<PaymentError | null>(null);

  const createError = useCallback((
    type: PaymentErrorType,
    message: string,
    originalError?: Error
  ): PaymentError => {
    return { type, message, originalError };
  }, []);

  const handleError = useCallback((
    type: PaymentErrorType,
    message: string,
    originalError?: Error
  ) => {
    const paymentError = createError(type, message, originalError);
    setError(paymentError);
    setStatus(PaymentStatus.FAILED);
    onError?.(paymentError);
  }, [createError, onError]);

  const processPayment = useCallback(async () => {
    if (status === PaymentStatus.PROCESSING) return;

    setStatus(PaymentStatus.PROCESSING);
    setError(null);

    try {
      // 1. 배송지 정보 검증
      if (!deliveryAddress.zipcode || !deliveryAddress.address || 
          !deliveryAddress.recipient || !deliveryAddress.phone) {
        throw createError(
          ErrorType.VALIDATION_ERROR,
          '배송지 정보를 모두 입력해주세요.'
        );
      }

      // 2. option_item_ids 배열 생성
      const optionItemIds: string[] = [];
      if (product.selectedOptions && typeof product.selectedOptions === 'object') {
        Object.values(product.selectedOptions).forEach((optionItemId) => {
          if (optionItemId && typeof optionItemId === 'string') {
            optionItemIds.push(optionItemId);
          }
        });
      }

      // 3. 주문서 조회 (POST /orders/sheet)
      const orderSheet = await fetchOrderSheet({
        item_id: product.id,
        option_item_ids: optionItemIds,
        quantity: product.quantity,
      });

      const receiptNumber = orderSheet.receipt_number;
      const deliveryFee = orderSheet.delivery_fee || orderSheet.payment?.delivery_fee || 0;

      // 4. 주문 생성 (POST /orders)
      // delivery_address_id 또는 new_address 둘 중 하나만 전달
      const orderPayload: {
        merchant_uid: string;
        item_id: string;
        option_item_ids: string[];
        quantity: number;
        delivery_address_id?: string;
        new_address?: {
          postal_code: string;
          address: string;
          address_detail: string;
          recipient_name: string;
          phone: string;
          address_name: string;
        };
      } = {
        merchant_uid: receiptNumber,
        item_id: product.id,
        option_item_ids: optionItemIds,
        quantity: product.quantity,
      };

      if (deliveryAddressId) {
        // 기존 배송지 사용
        orderPayload.delivery_address_id = deliveryAddressId;
      } else {
        // 신규 배송지 사용
        orderPayload.new_address = {
          postal_code: deliveryAddress.zipcode,
          address: deliveryAddress.address,
          address_detail: deliveryAddress.detailAddress || '',
          recipient_name: deliveryAddress.recipient,
          phone: deliveryAddress.phone,
          address_name: deliveryAddress.name || '배송지',
        };
      }

      const order = await createOrderRequest(orderPayload);

      const { order_id, payment_info } = order;

      // 5. Portone SDK 로드
      await loadPortOneSDK();

      // 6. Portone 결제창 호출
      requestPortonePayment(
        {
          merchant_uid: payment_info.merchant_uid,
          name: product.title,
          amount: payment_info.amount,
          buyer_name: deliveryAddress.recipient,
        },
        async (rsp: PaymentResponse) => {
          if (rsp.success) {
            try {
              // 7. 결제 검증 (POST /orders/verify)
              if (!rsp.imp_uid) {
                throw createError(
                  ErrorType.VERIFICATION_ERROR,
                  '결제 고유번호를 가져올 수 없습니다.'
                );
              }

              await verifyPaymentRequest({
                order_id,
                imp_uid: rsp.imp_uid,
              });

              // 8. 결제 완료 데이터 생성
              const orderData = {
                orderNumber: payment_info.merchant_uid,
                orderId: order_id,
                deliveryInfo: {
                  name: deliveryAddress.name,
                  recipient: deliveryAddress.recipient,
                  phone: deliveryAddress.phone,
                  address: `(${deliveryAddress.zipcode}) ${deliveryAddress.address} ${deliveryAddress.detailAddress}`,
                },
                product: {
                  image: product.image,
                  title: product.title,
                  option: product.option || '옵션 없음',
                  seller: product.seller,
                },
                payment: {
                  totalAmount: payment_info.amount,
                  productAmount: product.price + (product.optionPrice || 0),
                  shippingFee: deliveryFee,
                  method: '카드 간편결제',
                  paidAmount: rsp.paid_amount,
                  approvedAt: formatApprovedAt(new Date()),
                },
              };

              setStatus(PaymentStatus.SUCCESS);
              onSuccess?.(orderData);
            } catch (verifyError) {
              handleError(
                ErrorType.VERIFICATION_ERROR,
                '결제 검증에 실패했습니다. 고객센터로 문의해주세요.',
                verifyError as Error
              );
            }
          } else {
            handleError(
              ErrorType.PORTONE_PAYMENT_ERROR,
              rsp.error_msg || '결제에 실패했습니다.'
            );
          }
        }
      );
    } catch (err) {
      const error = err as Error | PaymentError;
      
      // 에러 타입별 처리
      if ('type' in error && error.type) {
        // 이미 PaymentError인 경우
        handleError(error.type, error.message, error.originalError);
      } else if (error.message.includes('주문서')) {
        handleError(ErrorType.ORDER_SHEET_ERROR, error.message, error as Error);
      } else if (error.message.includes('주문 생성')) {
        handleError(ErrorType.ORDER_CREATE_ERROR, error.message, error as Error);
      } else if (error.message.includes('포트원')) {
        handleError(ErrorType.PORTONE_LOAD_ERROR, error.message, error as Error);
      } else {
        handleError(ErrorType.VALIDATION_ERROR, error.message || '결제 처리에 실패했습니다.', error as Error);
      }
    }
  }, [product, deliveryAddress, deliveryAddressId, status, createError, handleError, onSuccess]);

  return {
    processPayment,
    status,
    error,
    isProcessing: status === PaymentStatus.PROCESSING,
  };
};
