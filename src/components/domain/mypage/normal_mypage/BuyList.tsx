import { useEffect, useState } from 'react';
import SalesCard, { type ProductOrder } from './SalesCard';
import { useUserTabStore } from '../../../../stores/tabStore';
import { useNavigate } from 'react-router-dom';
import { getUserOrders, type OrderItem } from '@/api/mypage/orderApi';

type BuyType = 'market' | 'reform';

const BuyList = () => {
  const { setSelectedOrderId } = useUserTabStore(); // 상위 store는 선택된 주문만 관리
  const navigate = useNavigate();

  // 🔹 local state로 탭 관리
  const [localTab, setLocalTab] = useState<BuyType>('market');

  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const type = localTab === 'market' ? 'ITEM' : 'REFORM';
        const data = await getUserOrders({ type });

          const mapped: ProductOrder[] = data.orders.map((o: OrderItem) => ({
            id: o.orderId,
            orderNo: o.receiptNumber,
            title: o.title,
            price: o.price,
            buyer: o.ownerNickname,
            date: new Date(o.createdAt).toLocaleString(),
            image: o.thumbnail || '',
            status: o.status === 'PENDING' ? '결제 대기' : o.status === 'PAID' ? '결제 완료' : o.status === 'COMPLETE' ? '거래 완료' : '상태 없음',
            isCustomOrder: o.targetType === 'REFORM',
            reviewAvailable: o.reviewAvailable,
            targetId: o.targetId,
            receiptNumber: o.receiptNumber,
            chat_room_id: o.chat_room_id,
          }));

          setOrders(mapped)
      } catch (err) {
        console.error('구매 목록 API 실패', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [localTab])

  // 상세보기 클릭
  const handleDetailClick = (id: string) => {
    setSelectedOrderId(id);
  };

  // 후기 작성
  const handleWriteReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/mypage/review/write');
  };

  const handleChatClick = (targetId: string) => {
    navigate(`/chat/normal/${targetId}`)
  };

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
      {loading ? (
        <div className="text-center py-20 text-gray-400 body-b1-rg">내역이 없습니다.</div>
      ) : (
        <SalesCard 
          data={orders.map(o => ({
            ...o,
            isCustomOrder: localTab === 'reform' || o.isCustomOrder // 주문 제작이거나 리폼 탭이면 true
          }))}
          tab={localTab} 
          onDetailClick={handleDetailClick}
          onWriteReviewClick={handleWriteReviewClick}
          onChatClick={handleChatClick} 
        />
      )}
    </div>
  );
};

export default BuyList;
