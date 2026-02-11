import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuotationCardProps {
  type: 'sent' | 'received';
  id?: string;        // messageId 혹은 proposalId
  chatId?: string;
  myRole?: 'REFORMER' | 'USER';
  price: number;      // 견적 금액
  delivery: number;   // 배송비
  expectedWorking: number;
  nickname: string;
}

const QuotationCard: React.FC<QuotationCardProps> = ({ 
  type, 
  id, 
  price, 
  delivery, 
  expectedWorking,
  nickname,

}) => {
  const navigate = useNavigate();
  const isSent = type === 'sent';
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-20)]'; 
  const title = isSent ? '견적서 전송완료!' : '견적서 도착!';
  
  const description = isSent 
    ? <>{nickname}님에게<br /> 견적서가 성공적으로 전송되었습니다.</>
    : <>{nickname}님이<br /> 요청글에 따른 견적서를 보내왔습니다.</>;
    
  const btnText = isSent ? '보낸 견적서 자세히 보기' : '견적서 자세히 보기';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  // 합계 계산
  const totalPrice = price + delivery;
  return (
    <div className={`flex w-full h-full mb-1 gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`${bgColor} ${borderRadiusClass} p-5 w-full min-w-[23rem] shadow-sm`}>
        <h2 className="text-2xl heading-h5-sb">{title}</h2>
        <p className="body-b4-sb mt-1 mb-4">{description}</p>
        
        <div className="bg-white rounded-xl p-5 space-y-3">
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
            <span className="body-b4-sb">{expectedWorking}일 소요</span>
          </div>
          <div className="border-t border-[var(--color-gray-40)] pt-4 flex justify-between items-center">
            <span className="body-b3-sb">총 예상 금액</span>
            <span className="body-b3-sb text-[var(--color-mint-1)]">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
        
        <p className="text-center body-b4-sb mb-5 mt-3">
          추가 설명 및 견적 조율은 채팅으로 물어보세요
        </p>
        
        <button
          className="w-full bg-black text-white py-2.5 rounded-xl body-b4-sb hover:bg-gray-800 transition-colors shadow-md"
          onClick={() =>
            navigate(`/chat/quotation/detail/${id}`, {
              state: {isQuotation: true}
            }
            ) // id = payload.id
          }
        >
          {btnText}
        </button>

      </div>
    </div>
  );
};

export default QuotationCard;