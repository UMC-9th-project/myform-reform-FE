import React from 'react';

// 1. 데이터 타입 정의
interface ProductOrder {
  id: string;
  orderNo: string;
  title: string;
  price: number;
  buyer: string;
  date: string;
  image: string;
}

const OrderHistory = () => {
  // 2. 샘플 데이터
  const productData: ProductOrder[] = [
    { id: '1', orderNo: '0000000001', title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.', price: 75000, buyer: '돈 많은 만수르', date: '2025. 10. 14. 23:45:23', image: '' },
    { id: '2', orderNo: '0000000002', title: '커스텀 자수 서비스', price: 30000, buyer: '김철수', date: '2025. 10. 15. 12:00:00', image: '' },
  ];

  return (
    <div className="w-100% mx-auto p-10 bg-[transparent] min-h-screen">
      <div className="space-y-4">
        {productData.map((item) => (
          <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
            
            {/* 상단: 주문번호 및 상세보기 */}
            <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
              <span>주문번호 {item.orderNo}</span>
              <button className="flex items-center gap-3 hover:text-black transition-colors">
                상세보기<span>❯</span>
              </button>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex gap-4">
              {/* 사진 영역 (기존 사이즈 유지) */}
              <div className="w-35 h-33 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300">이미지</span>
                )}
              </div>
              
              {/* 정보 및 버튼 영역 (Grid로 구조 변경) */}
              <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-4 items-end">
                
                {/* 왼쪽: 텍스트 정보 영역 */}
                <div className="flex flex-col gap-1 overflow-hidden self-start w-full">
                  <h4 className="body-b0-md text-[#1A1A1A] truncate mb-2" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="grid grid-cols-[70px_1fr] text-[14px] gap-y-0.5 gap-x-4">
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                    <span className="body-b0-rg text-black font-bold">{item.price.toLocaleString()}원</span>
                    
                    <span className="body-b0-rg text-[var(--color-gray-50)]">구매자</span>
                    <span className="body-b0-rg text-black">{item.buyer}</span>
                    
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제일시</span>
                    <span className="body-b0-rg text-[#4B5563]">{item.date}</span>
                  </div>
                </div>

                {/* 오른쪽: 후기 작성하기 버튼 (하단 정렬됨) */}
                <button className="px-5 py-3 bg-[var(--color-mint-6)] border border-[var(--color-mint-3)] text-[var(--color-mint-1)] rounded-xl body-b1-rg hover:bg-[#76D2CC]/5 transition-colors active:scale-95 whitespace-nowrap mb-0.5">
                  후기 작성하기
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;