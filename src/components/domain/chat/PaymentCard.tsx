import React from 'react';

interface PaymentCardProps {
  type: 'sent' | 'received';
}

const PaymentCard: React.FC<PaymentCardProps> = ({ type }) => {
  const isSent = type === 'sent';
  
  // 디자인 및 문구 설정
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-30)]';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 배치: 보낸 건 우측(end), 받은 건 좌측(start) */
    <div className={`flex w-full mb-6 gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
      
      {/* 2. [받은 메시지 전용] 프로필 이미지: 왼쪽 상단 배치 */}
      {!isSent && (
        <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden self-start mt-1">
          {/* 실제 이미지 사용 시 <img src="..." /> 사용 */}
          <div className="w-full h-full bg-black" /> 
        </div>
      )}

      {/* 3. 카드와 시간의 묶음: 바닥 정렬(items-end) */}
      <div className={`flex items-end gap-2 max-w-[95%] ${isSent ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* 읽음/시간 표시: 보낸 건 카드 왼쪽, 받은 건 카드 오른쪽 */}
        <div className={`flex flex-col text-[0.625rem] etc-cr-rg text-[var(--color-gray-50)] mb-1 min-w-fit ${isSent ? 'items-end' : 'items-start'}`}>
          <span>읽음</span>
          <span>오후 08:30</span>
        </div>

        {/* 4. 결제 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 w-full min-w-[22rem] shadow-sm`}>
          <h2 className="heading-h5-sb mb-3 text-black">내폼리폼 안전 결제</h2>
          <p className="body-b4-sb mb-5">
            확정된 견적서에 따른 결제 요청을 보내왔습니다.
          </p>

          {/* 가격 정보 박스 (재사용 가능하게 분리하면 더 좋음) */}
          <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm text-sm">
            <div className="flex justify-between body-b4-sb">
              <span>견적 금액</span>
              <span className="body-b4-sb">46,500원</span>
            </div>
            <div className="flex justify-between body-b4-sb">
              <span>배송비</span>
              <span className="body-b4-sb">3,500원</span>
            </div>
            <div className="flex justify-between body-b4-sb">
              <span>예상 작업 소요일</span>
              <span className="body-b4-sb">3~5일 소요</span>
            </div>
            <div className="border-t border-[var(--color-gray-40)] pt-3 flex justify-between items-center">
              <span className="body-b4-sb">총 예상 금액</span>
              <span className="body-b4-sb">50,000원</span>
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
          <button className="w-full bg-black text-white py-3.5 rounded-xl body-b4-sb hover:bg-gray-800 transition-colors cursor-pointer">
            결제창으로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;