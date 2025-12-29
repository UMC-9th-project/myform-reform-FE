import React from 'react';

interface PaymentCardProps {
  type: 'sent' | 'received';
}

const PaymentCard: React.FC<PaymentCardProps> = ({ type }) => {
  const isSent = type === 'sent';
  
  // 디자인 및 문구 설정
  const bgColor = isSent ? 'bg-[#C5EFEA]' : 'bg-[#F2F2F2]';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 배치: 보낸 건 우측(end), 받은 건 좌측(start) */
    <div className={`flex w-full mb-6 gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
      
      {/* 2. [받은 메시지 전용] 프로필 이미지: 왼쪽 상단 배치 */}
      {!isSent && (
        <div className="w-9 h-9 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden self-start mt-1">
          {/* 실제 이미지 사용 시 <img src="..." /> 사용 */}
          <div className="w-full h-full bg-[#D1D5DB]" /> 
        </div>
      )}

      {/* 3. 카드와 시간의 묶음: 바닥 정렬(items-end) */}
      <div className={`flex items-end gap-2 max-w-[95%] ${isSent ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* 읽음/시간 표시: 보낸 건 카드 왼쪽, 받은 건 카드 오른쪽 */}
        <div className={`flex flex-col text-[10px] text-gray-400 mb-1 min-w-fit ${isSent ? 'items-end' : 'items-start'}`}>
          <span className="font-bold">읽음</span>
          <span>오후 08:30</span>
        </div>

        {/* 4. 결제 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 w-full min-w-[450px] shadow-sm`}>
          <h2 className="text-xl font-semibold mb-3 text-black">내폼리폼 안전 결제</h2>
          <p className="text-[13px] text-gray-700 font-semibold mb-5">
            확정된 견적서에 따른 결제 요청을 보내왔습니다.
          </p>

          {/* 가격 정보 박스 (재사용 가능하게 분리하면 더 좋음) */}
          <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-50 shadow-sm text-sm">
            <div className="flex justify-between font-semibold text-[#28323C]">
              <span>견적 금액</span>
              <span className="text-gray-900 font-bold">46,500원</span>
            </div>
            <div className="flex justify-between font-semibold text-[#28323C]">
              <span>배송비</span>
              <span className="text-gray-900 font-bold">3,500원</span>
            </div>
            <div className="flex justify-between font-semibold text-[#28323C]">
              <span>예상 작업 소요일</span>
              <span className="text-gray-900 font-bold">3~5일 소요</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">총 예상 금액</span>
              <span className="font-bold text-xl text-gray-900">50,000원</span>
            </div>
          </div>

          {/* 수수료 안내 섹션 */}
          <div className="flex items-center gap-1.5 mt-4 mb-4 text-[11px] text-gray-500 font-medium">
            <span>수수료 별도안내</span>
            <div className="w-3.5 h-3.5 border border-gray-400 rounded-full text-[9px] flex items-center justify-center cursor-pointer">
              ?
            </div>
          </div>

          {/* 결제 버튼 */}
          <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer">
            결제창으로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;