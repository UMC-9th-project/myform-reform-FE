import { useState } from 'react';
import MyReviewGrid from '../MyReviewGrid';
import { useUserTabStore } from '../../../../stores/tabStore';
import { useNavigate } from 'react-router-dom';
import MyReviewCard, {type ProductOrder} from './MyReviewCard';
type ReviewTab = 'writable' | 'written';

const ReviewList = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('writable');
  const { setSelectedOrderId, setActiveTab: setUserTab } = useUserTabStore();
  const navigate = useNavigate();
  const handleDetailClick = (id: string) => {
    setSelectedOrderId(id);
    setUserTab('구매 이력');
  };

  const handleWriteReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId); // 어떤 주문에 대한 리뷰인지 저장
    navigate('/mypage/review/write'); // 별도의 페이지로 이동
};


  const writableReviews: ProductOrder[] = [
    {
      id: '1',
      orderNo: '000000123',
      title: '한화 이글스 유니폼 리폼',
      price: 120000,
      buyer: '침착한 대머리독수리',
      date: '2025.10.14',
      image: '',
      status: '결제 완료',
    },
  ];

  return (
    <div className="w-full min-h-screen pt-0 p-4">
      {/* ===== 상단 탭 ===== */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('writable')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer
            ${
              activeTab === 'writable'
                ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-black'
                : 'border-gray-300 text-black'
            }`}
        >
          작성 가능한 후기
        </button>

        <button
          onClick={() => setActiveTab('written')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer
            ${
              activeTab === 'written'
                ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-black'
                : 'border-gray-300 text-black'
            }`}
        >
          내 후기
        </button>
      </div>

      {/* ===== 작성 가능한 후기 ===== */}
      {activeTab === 'writable' && (
        <div className="space-y-4">
          {writableReviews.length === 0 ? (
            <div className="text-center py-20 text-gray-400 body-b1-rg">
              내역이 없습니다.
            </div>
          ) : (
            <MyReviewCard
              data={writableReviews} 
              onDetailClick={handleDetailClick}
              onWriteReviewClick={handleWriteReviewClick} />
          )}
        </div>
      )}

      {/* ===== 내 후기 ===== */}
      {activeTab === 'written' && <MyReviewGrid />}
    </div>
  );
};

export default ReviewList;
