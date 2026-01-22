import React from 'react';

export interface PayFinishCardProps {
  price: number;
  orderNumber: string;
  paymentMethod: string;    // 예: '카드 간편결제'
  paymentDetail: string;    // 예: '신한은행 / 0000-****-****-0000'
  date: string;             // 예: '2026.01.01 12.12'
  receiverName: string;
  phone: string;
  address: string;
  type: 'sent' | 'received';
}

const PayFinishCard: React.FC<PayFinishCardProps> = ({ 
  price, 
  orderNumber, 
  paymentMethod, 
  paymentDetail, 
  date, 
  receiverName, 
  phone, 
  address, 
  type 
}) => {
  const isSent = type === 'sent';
  
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-20)]';
  const borderRadiusClass = isSent ? 'rounded-[0.625rem] rounded-tr-none' : 'rounded-[0.625rem] rounded-tl-none';

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>         
        {/* 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 min-w-[22rem] shadow-sm`}>
          
          {/* 1. 상단 타이틀 & 주문번호 */}
          <div className="mb-3">
            <h2 className="heading-h5-sb text-black mb-2 leading-tight">
              결제가 완료되었어요.
            </h2>
            <p className="body-b3-sb text-[var(--color-gray-70)]">
              주문번호 {orderNumber}
            </p>
          </div>

          {/* 2. 상세 정보 화이트 박스 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            
            {/* 결제 금액 섹션 */}
            <div className="flex justify-between items-start mb-4">
              <span className="body-b3-sb text-[var(--color-gray-70)]">결제 금액</span>
              <span className="body-b3-sb text-[var(--color-mint-1)]">
                {price.toLocaleString()}원
              </span>
            </div>

            {/* 결제 수단 & 일시 */}
            <div className="space-y-1 body-b4-sb text-[var(--color-gray-50)] mb-3">
              <p>{paymentMethod}</p>
              <p>{paymentDetail}</p>
              <p>승인일시 : {date}</p>
            </div>

            {/* 구분선 */}
            <div className="border-t border-[var(--color-line-gray-40)] my-2"></div>

            {/* 배송 정보 섹션 */}
            <div className="space-y-1 body-b4-sb text-[var(--color-gray-50)]">
              <p>학교</p>
              <p>{receiverName} / {phone}</p>
              <p className="leading-relaxed">
                {address}
              </p>
            </div>

          </div>
        </div>
      </div>
  );
};

export default PayFinishCard;