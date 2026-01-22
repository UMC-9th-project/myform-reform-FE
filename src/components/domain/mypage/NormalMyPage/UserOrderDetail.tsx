import React, { useState } from 'react';
import { useUserTabStore } from '../../../../stores/tabStore';

interface OrderDetailType {
  orderNo: string;
  id: number;
  productTitle: string;
  productImage: string;
  price: number;
  option: string;
  paymentDate: string;
  buyer: string;
  phone: string;
  address: string;
  status: '결제 완료' | '상품준비 중' | '발송 완료';
  trackingNumber: string;
}



const UserOrderDetail = () => {
  const {selectedOrderId, setSelectedOrderId} = useUserTabStore();

  // 가상 데이터
  const initialData: OrderDetailType = {
    id: 1,
    orderNo: '0000000000',
    productTitle: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    productImage: 'https://via.placeholder.com/160x150',
    price: 75000,
    option: '옵션 1',
    paymentDate: '2025. 10. 14. 23:45:23',
    buyer: '홍길동',
    phone: '010-0000-0000',
    address: '서울 용산구 청파로47길 100 명신관 302호 (04310)',
    status: '결제 완료',
    trackingNumber: '',
  };
  const [order, setOrder] = useState<OrderDetailType>(initialData);
  
  // 드롭다운 열림/닫힘 상태 추가
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 드롭다운 옵션 목록
  const statusOptions: OrderDetailType['status'][] = ['결제 완료', '상품준비 중', '발송 완료'];

  return (
    <div className="w-100% mx-auto p-0 bg-transparent">
       <div className="mb-4">
        <button
          onClick={() => setSelectedOrderId(null)} // null로 설정하면 OrderList로 돌아감
          className="px-4 py-2 bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-md body-b1-rg hover:brightness-95 transition-all"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
      <div className="bg-white body-b1-rg border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5 shadow-sm space-y-12">
        <div className="text-[var(--color-gray-50)] body-b1-rg mb-6">
          주문번호 {order.orderNo}
        </div>
        
        {/* --- 섹션 1: 상품 정보 --- */}
        <section>
          <h3 className="body-b0-md text-black mb-2">상품 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />
          
          <div className="flex gap-6">
            {/* 상품 이미지 */}
            <div className="w-35 h-36 bg-gray-100 flex-shrink-0 overflow-hidden">
              <img 
                src={order.productImage}
                alt="상품 이미지" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* 상품 상세 텍스트 */}
            <div className="flex-1 flex flex-col gap-3">
              <h4 className="body-b0-md text-black leading-tight">
                {order.productTitle}
              </h4>
              
              <div className="grid grid-cols-[80px_1fr] text-[15px] gap-y-2 gap-x-4">
                <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                <span className="text-black body-b0-rg">{order.price}</span>

                <span className="body-b0-rg text-[var(--color-gray-50)]">옵션</span>
                <span className="text-black body-b0-rg">{order.option}</span>
                
                <span className="body-b0-rg text-[var(--color-gray-50)]">결제일시</span>
                <span className="body-b0-rg text-[var(--color-gray-50)]">{order.paymentDate}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 섹션 2: 주문자 정보 --- */}
        <section>
          <h3 className="body-b0-md text-black mb-2">주문자 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />

          <div className="grid grid-cols-2 gap-x-20">
            {/* 왼쪽: 기본 인적사항 */}
            <div className="grid grid-cols-[100px_1fr] text-[15px] gap-y-2 gap-x-4">
              <span className="body-b0-rg text-[var(--color-gray-50)]">구매자 성함</span>
              <span className="body-b0-rg text-black">{order.buyer}</span>

              <span className="body-b0-rg text-[var(--color-gray-50)]">연락처</span>
              <span className="text-black body-b0-rg">{order.phone}</span>

              <span className="body-b0-rg text-[var(--color-gray-50)]">배송정보</span>
              <span className="text-black leading-relaxed body-b0-rg">
                {order.address}
              </span>
            </div>

            {/* 오른쪽: 진행 상태 및 운송장 입력 */}
            <div className="flex flex-col gap-4">
              
              {/* 진행 상태 커스텀 드롭다운 (기존 select 대체) */}
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="body-b0-rg text-[var(--color-gray-50)]">진행 상태</span>
                
                <div className="relative">
                  {/* 클릭 버튼 */}
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 body-b0-rg text-[var(--color-mint-1)] bg-transparent outline-none"
                  >
                    {order.status}
                    <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>

                  {/* 드롭다운 메뉴 (라디오 버튼 스타일) */}
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-[8.8rem] bg-white rounded-[1.25rem] p-4 z-50 shadow-[1px_3px_11.7px_0px_#00000026]">
                      <ul className="flex flex-col gap-4">
                        {statusOptions.map((option) => (
                          <li 
                            key={option}
                            onClick={() => {
                              setOrder({ ...order, status:option})
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            {/* 라디오 버튼 UI */}
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                              ${order.status === option ? 'border-black' : 'border-gray-300'}`}
                            >
                              {order.status === option && (
                                <div className="w-2.5 h-2.5 bg-black rounded-full" />
                              )}
                            </div>
                            {/* 텍스트 */}
                            <span className={`body-b1-sb ${order.status === option ? 'text-black' : 'text-gray-600'}`}>
                              {option}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* 드롭다운 닫기용 배경 레이어 */}
              {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}


              {/* 운송장 번호 등록 */}
              <div className="flex justify-between items-center text-[15px]">
                <span className="body-b0-rg text-[var(--color-gray-50)]">운송장 번호 등록</span>
                <input 
                  type="text"
                  value={order.trackingNumber}
                  onChange={(e) => setOrder({ ...order, trackingNumber: e.target.value})}
                  className="w-[20rem] h-[2.5rem] border border-[var(--color-line-gray-40)] px-4 py-2 text-[14px]"
                  title="운송장 번호 입력"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default UserOrderDetail;