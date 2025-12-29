import React from 'react';

interface QuotationCardProps {
  type: 'sent' | 'received';
}

const QuotationCard: React.FC<QuotationCardProps> = ({ type }) => {
  const isSent = type === 'sent';
  const bgColor = isSent ? 'bg-[#C5EFEA]' : 'bg-[#F2F2F2]'; 
  const title = isSent ? '견적서 전송완료' : '견적서 도착!';
  const description = isSent 
    ? '00님께 견적서가 성공적으로 전송되었습니다.'
    : '대머리 독수리님이 요청글에 따른 견적서를 보내왔습니다.';
  const btnText = isSent ? '보낸 견적서 자세히 보기' : '견적서 자세히 보기';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 정렬 */
    <div className={`flex w-full mb-6 gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
      
      {/* 2. [추가] 받은 메시지일 때 프로필 사진 자리 */}
      {!isSent && (
        <div className="w-10 h-10 bg-[#D1D5DB] rounded-full flex-shrink-0 self-start mt-1 shadow-sm" />
      )}

      {/* 3. 카드 + 시간 묶음: max-w를 90%로 늘려 더 넓은 공간 허용 */}
      <div className={`flex items-end gap-3 max-w-[90%] ${isSent ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* 읽음/시간 표시 */}
        <div className={`flex flex-col text-[10px] text-gray-400 mb-1 min-w-fit ${isSent ? 'items-end' : 'items-start'}`}>
          <span className="font-bold">읽음</span>
          <span>오후 08:30</span>
        </div>

        {/* 4. 카드 본체: max-w-[410px]를 [550px]로 변경하여 가로 확장 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 w-full max-w-[550px] shadow-sm`}>
          <h2 className="text-2xl font-bold mb-1 text-black">{title}</h2>
          <p className="text-sm text-gray-700 font-semibold mb-5">{description}</p>
          
          <div className="bg-white rounded-xl p-5 space-y-4 border border-gray-50 shadow-sm text-sm">
            <div className="flex justify-between text-[#28323C] font-semibold">
              <span>견적 금액</span>
              <span className="text-gray-900 font-bold">46,500원</span>
            </div>
            <div className="flex justify-between text-[#28323C] font-semibold">
              <span>배송비</span>
              <span className="text-gray-900 font-bold">3,500원</span>
            </div>
            <div className="flex justify-between text-[#28323C] font-semibold">
              <span>예상 작업 소요일</span>
              <span className="text-gray-900 text-sm font-bold">3~5일 소요</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-sm text-gray-900 text-base">총 예상 금액</span>
              <span className="font-bold text-sm text-gray-900">50,000원</span>
            </div>
          </div>
          
          <p className="text-center text-[11px] mt-6 text-gray-500 font-medium mb-3">
            견적서에 대해 궁금한 점을 채팅으로 물어보세요
          </p>
          
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer shadow-md">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationCard;