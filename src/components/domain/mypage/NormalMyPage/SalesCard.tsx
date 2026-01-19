import React from 'react';

// 1. 데이터 타입 정의
export interface ProductOrder {
  id: string;
  orderNo: string;
  title: string;
  price: number;
  buyer: string;
  date: string;
  image: string;
  status?: '결제 완료' | '상품준비 중' | '발송 완료';
}

// 2. props 타입 정의
interface SalesCardProps {
  data: ProductOrder[]; // 외부에서 배열로 받기
  onDetailClick?: (id: string) => void; // 상세보기 클릭 이벤트
  onWriteReviewClick?: (id: string) => void;
}

const SalesCard: React.FC<SalesCardProps> = ({ data, onDetailClick, onWriteReviewClick }) => {
  return (
    <div className="w-full mx-auto bg-[transparent]">
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
            
            {/* 상단: 주문번호 및 상세보기 */}
            <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
              <span>주문번호 {item.orderNo}</span>
              <button
                className="flex items-center gap-3 hover:text-black transition-colors"
                onClick={() => onDetailClick?.(item.id)}
              >
                상세보기<span>❯</span>
              </button>
            </div>

            {/* 내용 */}
            <div className="flex justify-between items-end gap-4">
              <div className="flex gap-4">
                {/* 이미지 영역 */}
                <div className="w-40 h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                </div>

                {/* 텍스트 정보 */}
                <div className="flex flex-col gap-1 overflow-hidden">
                  <h4 className="body-b0-md text-black truncate">{item.title}</h4>

                  {/* Grid로 여러 항목 나열 */}
                  <div className="grid grid-cols-[5rem_1fr] text-[14px] mt-1 gap-y-0.5 gap-x-4">
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                    <span className="body-b0-rg text-black">{item.price.toLocaleString()}원</span>

                    <span className="body-b0-rg text-[var(--color-gray-50)]">구매자</span>
                    <span className="body-b0-rg text-black">{item.buyer}</span>

                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제 일시</span>
                    <span className="body-b0-rg text-[#4B5563]">{item.date}</span>

                    <span className="body-b0-rg text-[var(--color-gray-50)]">진행 상태</span>
                    <span className="body-b0-rg text-[var(--color-mint-1)]">{item.status}</span>
                  </div>
                </div>
              </div>

              {/* 후기 작성 버튼 */}
              <button 
                className="px-5 py-3 bg-[var(--color-mint-6)] border border-[var(--color-mint-3)] text-[var(--color-mint-1)] rounded-xl body-b1-rg hover:bg-[#76D2CC]/5 transition-colors active:scale-95 whitespace-nowrap mb-0.5"
                onClick={() => onWriteReviewClick?.(item.id)}>
                후기 작성하기
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesCard;
