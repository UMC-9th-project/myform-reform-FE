import React from 'react';

interface QuotationCardProps {
  type: 'sent' | 'received';
}

const QuotationCard: React.FC<QuotationCardProps> = ({ type }) => {
  const isSent = type === 'sent';
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-30)]'; 
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
        <div className="w-10 h-10 bg-black rounded-full flex-shrink-0 self-start mt-1 shadow-sm" />
      )}

      {/* 3. 카드 + 시간 묶음: max-w를 90%로 늘려 더 넓은 공간 허용 */}
      <div className={`flex items-end gap-3 max-w-[90%] ${isSent ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* 읽음/시간 표시 */}
        <div className={`flex flex-col text-[11px] text-[var(--color-gray-50)] etc-cr-rg mb-1 min-w-fit ${isSent ? 'items-end' : 'items-start'}`}>
          <span>읽음</span>
          <span>오후 08:30</span>
        </div>

        {/* 4. 카드 본체: max-w-[410px]를 [550px]로 변경하여 가로 확장 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 w-full min-w-[22rem] shadow-sm`}>
          <h2 className="text-2xl heading-h5-sb">{title}</h2>
          <p className="body-b4-sb mt-4 mb-4">{description}</p>
          
          <div className="bg-white rounded-xl p-5 space-y-3">
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
            <div className="border-t border-[var(--color-gray-40)] pt-4 flex justify-between items-center">
              <span className="body-b4-sb">총 예상 금액</span>
              <span className="body-b4-sb">50,000원</span>
            </div>
          </div>
          
          <p className="text-center body-b4-sb mb-3 mt-3">
            견적서에 대해 궁금한 점을 채팅으로 물어보세요
          </p>
          
          <button className="w-full bg-black text-white py-2.5 rounded-xl body-b4-sb hover:bg-gray-800 transition-colors cursor-pointer shadow-md">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationCard;