import { useState } from 'react';
import SalesCard, { type ProductOrder } from './SalesCard';
import { useUserTabStore } from '../../../../stores/tabStore';
import { useNavigate } from 'react-router-dom';

type BuyType = 'market' | 'reform';

const BuyList = () => {
  const { setSelectedOrderId } = useUserTabStore(); // 상위 store는 선택된 주문만 관리
  const navigate = useNavigate();

  // 🔹 local state로 탭 관리
  const [localTab, setLocalTab] = useState<BuyType>('market');

  // 더미 데이터
  const marketOrders: ProductOrder[] = [
    { id: '1', orderNo: '0000000001', title: '야구단 유니폼 리폼', price: 75000, buyer: '돈 많은 만수르', date: '2025. 10. 14. 23:45:23', image: '', status:'결제 완료', isCustomOrder:true },
    { id: '2', orderNo: '0000000002', title: '커스텀 자수 서비스', price: 30000, buyer: '김철수', date: '2025. 10. 15. 12:00:00', image: '', status: '발송 완료', isCustomOrder:true },
  ];

  const reformOrders: ProductOrder[] = [
    { id: 'r1', orderNo: 'R-99999', title: '가죽 자켓 리폼', price: 120000, buyer: '패션피플', date: '2025. 11. 01. 10:30:00', image: '', status: '상품준비 중', isCustomOrder:false },
  ];

  // 상세보기 클릭
  const handleDetailClick = (id: string) => {
    setSelectedOrderId(id);
    // store의 activeTab은 그대로 '구매 이력'으로 유지
  };

  // 후기 작성
  const handleWriteReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/mypage/review/write');
  };

  const handleChatClick = (orderId: string) => {
    // 예: 채팅 페이지 URL에 주문 ID 포함
    console.log('채팅 페이지로 이동, 아이디:',orderId);
  };

  // 탭별 데이터
  const displayData = localTab === 'market' ? marketOrders : reformOrders;

  return (
    <div className="w-full min-h-screen pt-0 p-4">
      {/* 탭 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setLocalTab('market')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer
            ${localTab === 'market' ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-black' : 'border-gray-300 text-black'}`}
        >
          마켓 구매
        </button>

        <button
          onClick={() => setLocalTab('reform')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer
            ${localTab === 'reform' ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-black' : 'border-gray-300 text-black'}`}
        >
          주문 제작
        </button>
      </div>

      {/* 카드 리스트 */}
      {displayData.length === 0 ? (
        <div className="text-center py-20 text-gray-400 body-b1-rg">내역이 없습니다.</div>
      ) : (
        <SalesCard 
            data={displayData} 
            onDetailClick={handleDetailClick}
            onWriteReviewClick={handleWriteReviewClick}
            onChatClick={handleChatClick} />
      )}
    </div>
  );
};

export default BuyList;
