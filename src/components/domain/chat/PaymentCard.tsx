import { verifyPayment } from '@/api/chat/orderApi';
import type { PaymentPayload } from '@/types/api/chat/chatMessages';
import React from 'react';

declare global {
  interface Window {
    IMP?: IMP;
  }
}

interface IMP {
  init: (storeId: string) => void;
  agency?: string;
  request_pay: (data: IMPRequest, callback: (rsp: IMPResponse) => void) => void;
}

interface IMPRequest {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
  buyer_name: string;
}

interface IMPResponse {
  success: boolean;
  imp_uid?: string;
  paid_amount?: number;
  error_msg?: string;
}

export interface PaymentCardProps {
  nickname: string;
  type: 'sent' | 'received';
  payload: PaymentPayload;
  role: 'USER' | 'REFORMER';
  onFinish?: (payload: PaymentPayload) => void;
  chatRoomId: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  type,
  nickname,
  payload,
  onFinish,
  role,
}) => {
  const isSent = type === 'sent';
  const isReformer = role === 'REFORMER';
  const displayNickname = nickname || '심심한 리본';

  const {
    price,
    delivery,
    expectedWorking: days,
    receiptNumber,
    orderId,
    chatRoomId,
  } = payload;
  const totalPrice = (Number(price) || 0) + (Number(delivery) || 0);

  const loadPortOne = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.IMP) {
        const IMP = window.IMP;
        if (!IMP.agency) {
          IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
        }
        return resolve();
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/v1/iamport.js';
      script.async = true;
      script.onload = () => {
        const IMP = window.IMP;
        if (!IMP) return reject(new Error('포트원 SDK 로드 실패'));
        IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
        resolve();
      };
      script.onerror = () => reject(new Error('포트원 SDK 로드 실패'));
      document.body.appendChild(script);
    });
  };

  const handlePaymentClick = async () => {
    if (isReformer) {
      return alert('리폼러는 결제를 진행할 수 없습니다.');
    }

    try {
      await loadPortOne();
      const IMP = window.IMP!;
      IMP.request_pay(
        {
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid: receiptNumber,
          name: '내폼리폼 결제',
          amount: totalPrice,
          buyer_name: displayNickname,
        },
        (rsp: IMPResponse) => {
          if (rsp.success) {
            alert(
              `결제가 완료되었습니다.\n결제 금액: ${rsp.paid_amount?.toLocaleString() ?? 0}원`
            );

            onFinish?.({
              ...payload,
              expectedWorking: days,
            });

            if (orderId && rsp.imp_uid) {
              verifyPayment({
                order_id: orderId,
                imp_uid: rsp.imp_uid,
              }).then(() => {
                window.dispatchEvent(
                  new CustomEvent('payment-completed', {
                    detail: { chatRoomId: chatRoomId },
                  })
                );
              });
            }
          } else {
            alert(`결제 실패: ${rsp.error_msg ?? '알 수 없는 오류'}`);
          }
        }
      );
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <div
      className={`flex w-full gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`${
          isSent
            ? 'bg-[var(--color-mint-5)] rounded-2xl rounded-tr-none'
            : 'bg-[var(--color-gray-20)] rounded-2xl rounded-tl-none'
        } p-5 min-w-[23rem] shadow-sm`}
      >
        <h2 className="heading-h5-sb mb-3 text-black">내폼리폼 안전 결제</h2>
        <p className="body-b4-sb mb-5 text-[var(--color-gray-70)]">
          {isSent ? (
            <>
              {displayNickname}님께 <br />
              확정된 견적서에 따른 결제 요청을 보냈습니다.
            </>
          ) : (
            <>
              {displayNickname}님이 <br />
              확정된 견적서에 따른 결제 요청을 보내왔습니다.
            </>
          )}
        </p>
        <div className="bg-white rounded-xl p-4 space-y-2 shadow-sm text-sm">
          <div className="flex justify-between body-b4-sb text-[var(--color-gray-70)]">
            <span>견적 금액</span>
            <span className="body-b4-sb">{price.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between body-b4-sb text-[var(--color-gray-70)]">
            <span>배송비</span>
            <span className="body-b4-sb">{delivery.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between body-b4-sb text-[var(--color-gray-70)]">
            <span>예상 작업 이내</span>
            <span className="body-b4-sb">{days}일 이내</span>
          </div>
          <div className="border-t border-[var(--color-gray-40)] pt-3 flex justify-between items-center">
            <span className="body-b4-sb">총 예상 금액</span>
            <span className="body-b4-sb text-[var(--color-mint-1)]">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          onClick={handlePaymentClick}
          className="w-full bg-black text-white py-3 rounded-xl body-b4-sb transition-colors cursor-pointer mt-2"
        >
          {isReformer ? '리폼러는 결제할 수 없습니다' : '결제창으로 이동하기'}
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;
