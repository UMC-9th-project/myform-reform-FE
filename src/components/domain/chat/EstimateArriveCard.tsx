import React from 'react';

export interface ArriveCardProps {
  type: 'sent' | 'received';
  onReject: () => void;
  onAccept: () => void;
}

const EstimateArriveCard: React.FC<ArriveCardProps> = ({ type, onReject, onAccept }) => {
  const isSent = type === 'sent';
  
  // 디자인 및 문구 설정
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-30)]';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 배치: 보낸 건 우측(end), 받은 건 좌측(start) */
    <div className={`flex w-full gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>        
        {/* 4. 결제 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} pb-0 p-5 min-w-[23rem] shadow-sm`}>
          <h2 className="heading-h5-sb mb-3 text-black">새로운 견적서가 도착했어요!</h2>
          <p className="body-b3-sb mb-5 text-[var(--color-gray-70)]">
            견적서를 확인하고, 진행 여부를 선택해주세요.
          </p>
            <div className="flex gap-3 mb-4">
          <button 
            className="flex-1 bg-black text-white py-3 rounded-[0.625rem] body-b3-sb"
            onClick={onAccept}
          >
            추가 문의하기
          </button>
          <button 
            className="flex-1 bg-white text-black py-3 rounded-[0.625rem] body-b3-sb"
            onClick={onReject}
          >
            거절하기
          </button>
        </div>
        <p className='text-[0.8125rem] font-regular text-[#646F7C] pb-4 text-center'>추가 문의하기를 통해 리폼러와 견적 상담을 진행할 수 있습니다.</p>
        </div>
      </div>
    
  );
};

export default EstimateArriveCard;