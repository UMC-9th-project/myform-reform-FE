import React, { useState } from 'react';
import { useSellerTabStore } from '../../../stores/tabStore';

// --- 데이터 타입 ---
interface ProductOrder {
  id: string;
  orderNo: string;
  title: string;
  price: number;
  buyer: string;
  date: string;
  image: string;
  status: '결제 완료' | '상품준비 중' | '발송 완료';
}

interface ReformProposal {
  id: string;
  proposalNo: string;
  description: string;
  budget: number;
  requester: string;
  date: string;
  image: string;
  status: '결제 완료' | '상품준비 중' | '발송 완료';
}

const OrderList = () => {

  const { selectedOrderId, setSelectedOrderId } = useSellerTabStore();

  const handleDetailClick = (id:string) => {
    console.log('클릭된 ID:', id);
    setSelectedOrderId(id);
  }

  // --- 상태 ---
  const [activeOrderTab, setActiveOrderTab] = useState<'product' | 'reform'>('product');
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const statusOptions = ['전체', '결제 완료', '상품준비 중', '발송 완료'];

  // --- 샘플 데이터 ---
  const productData: ProductOrder[] = [
    { id: '1', orderNo: '0000000001', title: '야구단 유니폼 리폼 상품', price: 75000, buyer: '돈 많은 만수르', date: '2025. 10. 14. 23:45:23', image: '', status: '결제 완료' },
    { id: '2', orderNo: '0000000002', title: '커스텀 자수 서비스', price: 30000, buyer: '김철수', date: '2025. 10. 15. 12:00:00', image: '', status: '상품준비 중' },
  ];

  const reformData: ReformProposal[] = [
    { id: 'r1', proposalNo: 'R-99999', description: '오래된 가죽 자켓 리폼 제안합니다.', budget: 120000, requester: '패션피플', date: '2025. 11. 01. 10:30:00', image: '', status: '발송 완료' },
  ];

  // --- 필터 적용 ---
  const filteredProductData = filterStatus === '전체' ? productData : productData.filter(item => item.status === filterStatus);
  const filteredReformData = filterStatus === '전체' ? reformData : reformData.filter(item => item.status === filterStatus);

  return (
    <div className="w-100% mx-auto bg-transparent min-h-screen p-4">
      
      {/* --- 상단 탭 + 필터 --- */}
      <div className="flex justify-between items-center mb-6">
        {/* 탭 */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveOrderTab('product')}
            className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black cursor-pointer ${
              activeOrderTab === 'product' 
                ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
                : 'border-[var(--color-mint-0)] bg-transparent'
            }`}
          >
            마켓 판매
          </button>
          <button 
            onClick={() => setActiveOrderTab('reform')}
            className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black cursor-pointer ${
              activeOrderTab === 'reform' 
                ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] shadow-sm' 
                : 'border-[var(--color-mint-0)] bg-transparent'
            }`}
          >
            주문 제작
          </button>
        </div>

        {/* 진행 상태 필터 */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 body-b1-rg text-[var(--color-gray-60)] bg-transparent outline-none"
          >
            {filterStatus}
            <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-[10rem] bg-white rounded-[1.25rem] p-4 z-50 shadow-[1px_3px_11.7px_0px_#00000026]">
              <ul className="flex flex-col gap-4">
                {statusOptions.map((option) => (
                  <li 
                    key={option}
                    onClick={() => {
                      setFilterStatus(option);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                      ${filterStatus === option ? 'border-black' : 'border-gray-300'}`}
                    >
                      {filterStatus === option && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <span className={`body-b1-rg ${filterStatus === option ? 'text-black' : 'text-gray-600'}`}>
                      {option}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 드롭다운 외부 클릭용 레이어 */}
          {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
        </div>
      </div>

      {/* --- 리스트 영역 --- */}
      <div className="space-y-4">
        {activeOrderTab === 'product' ? (
          filteredProductData.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>주문번호 {item.orderNo}</span>
                <button className="flex items-center gap-3 hover:text-black" onClick={() => handleDetailClick(item.id)}>상세보기<span>❯</span></button>
              </div>
              <div className="flex gap-4">
                <div className="w-40 h-40 bg-gray-100 flex-shrink-0">{item.image}</div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <h4 className="body-b0-md text-black truncate">{item.title}</h4>
                  <div className="grid grid-cols-[5rem_1fr] text-[14px] mt-1 gap-y-0.5 gap-x-4">
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                    <span className="body-b0-rg text-black">{item.price.toLocaleString()}원</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">구매자</span>
                    <span className="body-b0-rg text-black">{item.buyer}</span>
                    <span className="body-b0-rg text-[var(--color-gray-50)]">결제 일시</span>
                    <span className="body-b0-rg text-[#4B5563]">{item.date}</span>
                    <span className='body-b0-rg text-[var(--color-gray-50)]'>진행 상태</span>
                    <span className='body-b0-rg text-[var(--color-mint-1)]'>{item.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredReformData.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>주문번호 {item.proposalNo}</span>
                <button className="flex items-center gap-3 hover:text-black">채팅 바로가기<span>❯</span></button>
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

        {/* 데이터가 없을 때 */}
        {((activeOrderTab === 'product' && filteredProductData.length === 0) || 
          (activeOrderTab === 'reform' && filteredReformData.length === 0)) && (
          <div className="text-center py-20 text-gray-400">내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default OrderList;