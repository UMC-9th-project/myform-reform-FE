import React from 'react';

export interface RequireCardProps {
  price: number;
  title: string;
  type: 'sent' | 'received';
}

const RequireCard: React.FC<RequireCardProps> = ({ price, title, type }) => {
  const isSent = type === 'sent';
  
  // 디자인 및 문구 설정
  const bgColor = isSent ? 'bg-[var(--color-mint-5)]' : 'bg-[var(--color-gray-20)]';
  const borderRadiusClass = isSent ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    /* 1. 전체 가로 배치: 보낸 건 우측(end), 받은 건 좌측(start) */
    <div className={`flex w-[22rem] gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>        
        {/* 4. 결제 카드 본체 */}
        <div className={`${bgColor} ${borderRadiusClass} p-5 min-w-[23rem] shadow-sm`}>
          <h2 className="heading-h5-sb mb-2 text-black">요청서 전송완료!</h2>
            {type === 'sent' 
                ? <p className='body-b4-sb mb-3'>심심한 리본님께<br />요청서가 성공적으로 전송되었습니다.</p>
                : <p className='body-b4-sb mb-3'>심심한 리본님이<br />문의 내역에 따른 요청서를 보내왔습니다.</p>}

          {/* 가격 정보 박스 (재사용 가능하게 분리하면 더 좋음) */}
          <div className="bg-white rounded-xl px-3 py-4 space-y-3 shadow-sm text-sm mb-3">
            <div className="flex justify-between body-b4-sb border-b pb-2 border-[var(--color-line-gray-40)]">
              <span className='overflow-hidden text-ellipsis whitespace-nowrap block'>{title.toLocaleString()}</span>
            </div>
            <div className="flex justify-between body-b4-sb">
              <span className='body-b3-sb'>희망 예산</span>
              <span className="body-b3-sb">{price.toLocaleString()}</span>
            </div>
          </div>
          <div className='flex body-b4-sb justify-center mb-3'>추가 설명 및 견적 조율은 채팅으로 대화해보세요.</div>

          {/* 결제 버튼 */}
          <button className="w-full bg-black text-white py-3.5 rounded-xl body-b4-sb cursor-pointer">
            받은 요청서 자세히 보기
          </button>
        </div>
      </div>
    
  );
};

export default RequireCard;