import React, { useState } from 'react';

// 1. 데이터 타입 정의
interface OrderItem {
  id: string;
  orderNo: string;
  title: string;
  price: number;
  seller: string;
  date: string;
  image: string;
}

const OrderHistory = () => {
  // 2. 현재 어떤 탭이 선택되었는지 관리
  const [activeTab, setActiveTab] = useState<'product' | 'reform'>('product');

  // 3. Mock Data (실제로는 서버에서 가져올 데이터 배열)
  const productMockData: OrderItem[] = [
    {
      id: 'p1',
      orderNo: '0000000000',
      title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      price: 75000,
      seller: '침착한 대머리독수리',
      date: '2025. 10. 14. 23:45:23',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 'p2',
      orderNo: '0000000001',
      title: '메시 월드컵 우승 기념 유니폼 커스텀 서비스',
      price: 120000,
      seller: '축구왕 김태술',
      date: '2025. 11. 20. 14:20:10',
      image: 'https://via.placeholder.com/150'
    }
  ];

  const reformMockData: OrderItem[] = [
    {
      id: 'r1',
      orderNo: 'R-123456',
      title: '오래된 야구 점퍼를 힙한 조끼로 리폼하기',
      price: 55000,
      seller: '리폼 마스터',
      date: '2025. 12. 01. 09:00:00',
      image: 'https://via.placeholder.com/150'
    }
  ];

  // 4. 현재 탭에 따라 보여줄 데이터 결정
  const currentData = activeTab === 'product' ? productMockData : reformMockData;

  return (
    <div className="w-100% mx-auto p-10 pl-70 bg-transparent min-h-screen">
      
      {/* --- 탭 메뉴 영역 --- */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black ${
            activeTab === 'product' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
              : 'border-[var(--color-mint-0)] bg-transparent'
          }`}
        >
          상품 구매
        </button>
        <button 
          onClick={() => setActiveTab('reform')}
          className={`px-6 py-2 rounded-full border body-b1-rg transition-all text-black ${
            activeTab === 'reform' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
              : 'border-[var(--color-mint-0)] bg-transparent'
          }`}
        >
          리폼 요청
        </button>
      </div>

      {/* --- 리스트 영역 (map 함수 사용) --- */}
      <div className="space-y-4">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-6 shadow-sm">
              
              {/* 카드 상단: 주문번호 및 상세보기 */}
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>주문번호 {item.orderNo}</span>
                <button className="flex items-center gap-2 hover:text-black">
                  상세보기 <span className="text-[12px]">❯</span>
                </button>
              </div>

              {/* 카드 메인 영역 */}
              <div className="flex gap-4">
                {/* 사진 영역 */}
                <div className="w-35 h-35 bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt="이미지" className="w-full h-full object-cover" />
                </div>

                {/* 텍스트 정보 + 버튼 영역 (Grid) */}
                <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] items-end gap-4">
                  
                  {/* 왼쪽: 상세 텍스트 정보 */}
                  <div className="flex flex-col self-start w-full">
                    <h4 className="body-b0-md text-black mb-3 leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                    
                    <div className="grid grid-cols-[80px_1fr] text-[15px] gap-y-1.5 gap-x-2">
                      <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                      <span className="body-b0-rg text-black">{item.price.toLocaleString()}원</span>
                      
                      <span className="body-b0-rg text-[var(--color-gray-50)]">판매자</span>
                      <span className="body-b0-rg text-black">{item.seller}</span>
                      
                      <span className="body-b0-rg text-[var(--color-gray-50)]">주문일시</span>
                      <span className="body-b0-rg text-[var(--color-gray-50)]">{item.date}</span>
                    </div>
                  </div>

                  {/* 오른쪽: 후기 작성하기 (주문일시 라인에 맞춤) */}
                  <button className="px-5 py-3 border border-[var(--color-mint-3)] bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-xl body-b1-rg hover:bg-[#76D2CC]/5 transition-all mb-0.5">
                    후기 작성하기
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* 데이터가 없을 때 표시 */
          <div className="text-center py-24 text-gray-400">내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;