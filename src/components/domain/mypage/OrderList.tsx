import React, { useState } from 'react';

// 1. 데이터 타입 정의 (두 종류가 다르므로 각각 정의)
interface ProductOrder {
  id: string;
  orderNo: string;
  title: string;
  price: number;
  buyer: string;
  date: string;
  image: string;
}

interface ReformProposal {
  id: string;
  proposalNo: string;
  description: string;
  budget: number;
  requester: string;
  date: string;
  image: string;
}

const OrderHistory = () => {
  // 2. 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'product' | 'reform'>('product');

  // 3. 샘플 데이터 (실제로는 API에서 받아오게 됩니다)
  const productData: ProductOrder[] = [
    { id: '1', orderNo: '0000000001', title: '야구단 유니폼 리폼 상품', price: 75000, buyer: '돈 많은 만수르', date: '2025. 10. 14. 23:45:23', image: '' },
    { id: '2', orderNo: '0000000002', title: '커스텀 자수 서비스', price: 30000, buyer: '김철수', date: '2025. 10. 15. 12:00:00', image: '' },
  ];

  const reformData: ReformProposal[] = [
    { id: 'r1', proposalNo: 'R-99999', description: '오래된 가죽 자켓 리폼 제안합니다.', budget: 120000, requester: '패션피플', date: '2025. 11. 01. 10:30:00', image: '' },
  ];

  return (
    <div className="w-100% mx-auto p-10 pl-70 bg-[transparent] min-h-screen">
      {/* --- 탭 메뉴 영역 --- */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black ${
            activeTab === 'product' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
              : 'border-[var(--color-mint-0)]  bg-transparent'
          }`}
        >
          상품 판매
        </button>
        <button 
          onClick={() => setActiveTab('reform')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black ${
            activeTab === 'reform' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
              : 'border-[var(--color-mint-0)] bg-transparent'
          }`}
        >
          리폼 제안
        </button>
      </div>

      {/* --- 리스트 영역: activeTab에 따라 다른 컴포넌트나 데이터를 렌더링 --- */}
      <div className="space-y-4">
        {activeTab === 'product' ? (
          productData.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>주문번호 {item.orderNo}</span>
                <button className="flex items-center gap-3 hover:text-black">상세보기<span>❯</span></button>
              </div>
              <div className="flex gap-4">
                <div className="w-35 h-33 bg-gray-100 {/*사진 크기 잡는 용도*/} flex-shrink-0">{item.image}</div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <h4 className="body-b0-md text-[#1A1A1A] truncate">{item.title}</h4>
                  <div className="grid grid-cols-[70px_1fr] text-[14px] mt-1 gap-y-0.5 gap-x-4">
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                    <span className="body-b0-rg text-black">{item.price.toLocaleString()}원</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">구매자</span>
                    <span className="body-b0-rg text-black">{item.buyer}</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제일시</span>
                    <span className="body-b0-rg text-[#4B5563]">{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          reformData.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>제안번호 {item.proposalNo}</span>
                <button className="flex items-center gap-3 hover:text-black">제안상세<span>❯</span></button>
              </div>
              <div className="flex gap-4">
                <div className="w-35 h-33 bg-[#F1F3F5] flex-shrink-0" />
                <div className="flex flex-col gap-1 overflow-hidden">
                  <h4 className="body-b0-md text-[#1A1A1A] truncate">{item.description}</h4>
                  <div className="grid grid-cols-[70px_1fr] text-[14px] mt-1 gap-y-0.5 gap-x-4">
                    <span className="body-b0-rg text-[var(--color-gray-50)]">희망예산</span>
                    <span className="body-b0-rg font-bold text-black">{item.budget.toLocaleString()}원</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">요청자</span>
                    <span className="body-b0-rg text-black">{item.requester}</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">요청일시</span>
                    <span className="body-b0-rg text-[#4B5563]">{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* 데이터가 없을 때의 처리 */}
        {((activeTab === 'product' && productData.length === 0) || 
          (activeTab === 'reform' && reformData.length === 0)) && (
          <div className="text-center py-20 text-gray-400">내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;