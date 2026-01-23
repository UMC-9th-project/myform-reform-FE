import React from 'react';

export interface PaymentCardProps {
  nickname: string;
  price: number;
  delivery: number;
  days: number;
  type: 'sent' | 'received';
}

const PaymentCard: React.FC<PaymentCardProps> = ({ price, delivery, days, type, nickname }) => {
  const isSent = type === 'sent';
  const totalPrice = (Number(price) || 0) + (Number(delivery) || 0);
  const displayNickname = nickname || '심심한 리본'; //임시 닉네임
  
  // 디자인 및 문구 설정
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-20)]';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 배치: 보낸 건 우측(end), 받은 건 좌측(start) */
    <div className={`flex w-full gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>        
        {/* 4. 결제 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 min-w-[23rem] shadow-sm`}>
          <h2 className="heading-h5-sb mb-3 text-black">내폼리폼 안전 결제</h2>
          <p className="body-b4-sb mb-5">
          {type === 'sent' ? (
            <>
              {displayNickname}님께<br />
              확정된 견적서에 따른 결제 요청을 보냈습니다.
            </>
          ) : (
            <>
              {displayNickname}님이<br />
              확정된 견적서에 따른 결제 요청을 보내왔습니다.
            </>
          )}
        </p>


          {/* 가격 정보 박스 (재사용 가능하게 분리하면 더 좋음) */}
          <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm text-sm">
            <div className="flex justify-between body-b4-sb">
              <span>견적 금액</span>
              <span className="body-b4-sb">{price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between body-b4-sb">
              <span>배송비</span>
              <span className="body-b4-sb">{delivery.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between body-b4-sb">
              <span>예상 작업 소요일</span>
              <span className="body-b4-sb">{days}일 이내</span>
            </div>
            <div className="border-t border-[var(--color-gray-40)] pt-3 flex justify-between items-center">
              <span className="body-b4-sb">총 예상 금액</span>
              <span className="body-b4-sb">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 수수료 안내 섹션 */}
          <div className="flex items-center gap-1.5 mt-4 mb-4 body-b4-sb">
            <span>수수료 별도안내</span>
            <div className="w-3.5 h-3.5 text-white bg-[var(--color-gray-50)] rounded-full etc-c2-bd flex items-center justify-center cursor-pointer">
              ?
            </div>
          </div>

          {/* 결제 버튼 */}
          <button className="w-full bg-black text-white py-3 rounded-xl body-b4-sb transition-colors cursor-pointer">
            결제창으로 이동하기
          </button>
        </div>
      </div>
    
  );
};

export default PaymentCard;