import React from 'react';

// 1. 필요한 데이터들을 정의
interface QuotationCardProps {
  type: 'sent' | 'received'; // 'sent'면 민트색(보낸 것), 'received'면 회색(받은 것)
}

const QuotationCard: React.FC<QuotationCardProps> = ({ type }) => {
  // 2. 타입에 따라 달라지는 디자인/문구 설정
  const isSent = type === 'sent';
  // 배경색 스위치
  const bgColor = isSent ? 'bg-[#C5EFEA]' : 'bg-[#F2F2F2]'; 
  // 타이틀 스위치
  const title = isSent ? '견적서 전송완료' : '견적서 도착!';
  // 설명 문구 스위치
  const description = isSent 
    ? '00님께 견적서가 성공적으로 전송되었습니다.'
    : '대머리 독수리님이 요청글에 따른 견적서를 보내왔습니다.';
  // 버튼 문구 스위치
  const btnText = isSent ? '보낸 견적서 자세히 보기' : '견적서 자세히 보기';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 레이아웃: 보낸 것은 오른쪽(flex-row), 받은 것은 왼쪽(flex-row-reverse) 정렬 */
    <div className={`flex w-full mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-[80%] ${isSent ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* 읽음/시간 표시 */}
      <div className={`flex flex-col text-[10px] text-gray-400 mb-1 min-w-fit ${isSent ? 'items-end' : 'items-start'}`}>
        <span className="font-bold">읽음</span>
        <span>오후 08:30</span>
      </div>

      {/* 카드 본체 */}
      <div className={`${bgColor} ${borderRadiusClass} p-4 w-full max-w-[410px] shadow-sm`}>
        <h2 className="text-2xl font-bold mb-1 text-black">{title}</h2>
        <p className="text-sm text-gray-700 font-semibold mb-5">{description}</p>
        
        {/* 흰색 가격 정보 박스 (공통) */}
        <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-50 shadow-sm text-sm">
          <div className="flex justify-between text-[#28323C] font-semibold">
            <span>견적 금액</span>
            <span className="text-gray-900">46,500원</span>
          </div>
          <div className="flex justify-between text-[#28323C] font-semibold">
            <span>배송비</span>
            <span className="text-gray-900">3,500원</span>
          </div>
          <div className="flex justify-between text-[#28323C] font-semibold">
            <span>예상 작업 소요일</span>
            <span className="text-gray-900">3~5일 소요</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">총 예상 금액</span>
            <span className="font-bold text-lg text-gray-900">50,000원</span>
          </div>
        </div>
        
        <p className="text-center text-[11px] mt-5 text-gray-500 font-medium mb-3">
          견적서에 대해 궁금한 점을 채팅으로 물어보세요
        </p>
        
        <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer">
          {btnText}
        </button>
      </div>
    </div>
    </div>
  );
};

export default QuotationCard;