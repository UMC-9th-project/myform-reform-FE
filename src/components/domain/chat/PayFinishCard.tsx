import type { PaymentResult } from '@/types/api/chat/chatMessages';
import React from 'react';

export interface PayFinishCardProps {
  payload: PaymentResult;
  type: 'sent' | 'received';
}

const PayFinishCard: React.FC<PayFinishCardProps> = ({ payload, type }) => {
  const isSent = type === 'sent';
  // UI 수정 예시
  const { receiptNumber, totalAmount } = payload;

  const bgColor = isSent
    ? 'bg-[var(--color-mint-5)]'
    : 'bg-[var(--color-gray-20)]';
  const borderRadiusClass = isSent
    ? 'rounded-[0.625rem] rounded-tr-none'
    : 'rounded-[0.625rem] rounded-tl-none';

  const approvedDate = payload.approvedAt
    ? new Date(payload.approvedAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '결제 미완료';

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>
      {/* 카드 본체 */}
      <div
        className={`${bgColor} ${borderRadiusClass} p-5 min-w-[23rem] shadow-sm`}
      >
        {/* 1. 상단 타이틀 & 주문번호 */}
        <div className="mb-3">
          <h2 className="heading-h5-sb text-black mb-2 leading-tight">
            결제가 완료되었어요.
          </h2>
          <p className="body-b3-sb text-[var(--color-gray-70)]">
            주문번호 {receiptNumber}
          </p>
        </div>

        {/* 2. 상세 정보 화이트 박스 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* 결제 금액 섹션 */}
          <div className="flex justify-between items-start mb-4">
            <span className="body-b3-sb text-[var(--color-gray-70)]">
              결제 금액
            </span>
            <span className="body-b3-sb text-[var(--color-mint-1)]">
              {totalAmount.toLocaleString()}원
            </span>
          </div>

          {/* 결제 수단 & 일시 */}
          <div className="space-y-1 body-b4-sb text-[var(--color-gray-50)] mb-3">
            {/* 결제 수단 타입 */}
            <p>
              {payload.paymentMethod.type === 'CARD_EASY_PAY'
                ? '카드 간편결제'
                : payload.paymentMethod.type || '결제 수단 없음'}
            </p>

            {/* 결제 상세 */}
            <p>
              {payload.paymentMethod.provider
                ? payload.paymentMethod.cardNumber
                  ? `${payload.paymentMethod.provider} / ${payload.paymentMethod.cardNumber}`
                  : payload.paymentMethod.provider // 카드번호 없으면 provider만 보여줌
                : payload.paymentMethod.cardNumber
                  ? payload.paymentMethod.cardNumber
                  : '결제 정보 없음'}
            </p>

            {/* 승인 일시 */}
            <p>승인일시 :{approvedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayFinishCard;
