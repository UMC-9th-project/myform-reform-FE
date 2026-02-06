import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyReviewGrid, { type ReviewItem } from '../MyReviewGrid';
import MyReviewCard, { type ProductOrder } from './MyReviewCard';
import { useUserTabStore } from '../../../../stores/tabStore';
import alertCircle from '@/assets/mypage/alertCircle.svg';
import { getUserOrders, type OrderItem } from '@/api/mypage/orderApi';
import { getMyReviews, type MyReviewItem } from '@/api/mypage/reviewApi';

type ReviewTab = 'writable' | 'written';

const ReviewList = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('writable');
  const { setSelectedOrderId, setActiveTab: setUserTab } = useUserTabStore();
  const [writableReviews, setWritableReviews] = useState<ProductOrder[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<ReviewItem[]>([]);
  const [loadingWritable, setLoadingWritable] = useState(true);
  const [loadingWritten, setLoadingWritten] = useState(true);

  const navigate = useNavigate();

  const handleDetailClick = (id: string) => {
    setSelectedOrderId(id);
    setUserTab('구매 이력');
  };

  const handleWriteReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/mypage/review/write');
  };

  useEffect(() => {
    // 작성 가능한 후기 조회
    const fetchReviewableOrders = async () => {
      try {
        setLoadingWritable(true);
        const data = await getUserOrders({
          type: 'ALL',
          onlyReviewAvailable: true,
        });

        const mapped: ProductOrder[] = data.orders.map((o: OrderItem) => ({
          id: o.orderId,
          orderNo: o.receiptNumber,
          title: o.title,
          price: o.price,
          buyer: o.ownerNickname,
          date: new Date(o.createdAt).toLocaleString(),
          image: o.thumbnail || '',
          status: '결제 완료',
          reviewAvailable: o.reviewAvailable,
        }));

        setWritableReviews(mapped);
      } catch (err) {
        console.error('작성 가능한 후기 조회 실패', err);
      } finally {
        setLoadingWritable(false);
      }
    };

    // 작성한 후기 조회
    const fetchWrittenReviews = async () => {
      try {
        setLoadingWritten(true);
        const res = await getMyReviews({ limit: 20, order: 'desc' });
        const mapped: ReviewItem[] = res.data.map((r: MyReviewItem) => ({
          id: r.reviewId,
          author: r.userNickname,
          date: new Date(r.createdAt).toLocaleDateString(),
          productImg: r.orderThumbnail,
          productName: r.orderTitle,
          productPrice: parseInt(r.finalPrice),
          rating: r.start,
          content: r.content,
        }));
        setWrittenReviews(mapped);
      } catch (err) {
        console.error('작성한 리뷰 조회 실패', err);
      } finally {
        setLoadingWritten(false);
      }
    };

    if (activeTab === 'writable') fetchReviewableOrders();
    if (activeTab === 'written') fetchWrittenReviews();
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen pt-0 pl-0 p-0">
      {/* ===== 상단 탭 ===== */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('writable')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer ${
            activeTab === 'writable'
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-black'
              : 'border-gray-300 text-black'
          }`}
        >
          작성 가능한 후기
        </button>

        <button
          onClick={() => setActiveTab('written')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all cursor-pointer ${
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
          {loadingWritable ? (
            <div className="text-center py-20 text-gray-400 body-b1-rg">
              로딩중...
            </div>
          ) : writableReviews.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 text-black body-b1-sb py-20">
              <img src={alertCircle} alt="안내 모달" className="w-12 h-12" />
              <span>작성 가능한 후기가 없어요.</span>
            </div>
          ) : (
            <MyReviewCard
              data={writableReviews}
              onDetailClick={handleDetailClick}
              onWriteReviewClick={handleWriteReviewClick}
            />
          )}
        </div>
      )}

      {/* ===== 작성한 후기 ===== */}
      {activeTab === 'written' && (
        <div className="space-y-4">
          {loadingWritten ? (
            <div className="text-center py-20 text-gray-400 body-b1-rg">
              로딩중...
            </div>
          ) : writtenReviews.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 text-black body-b1-sb py-20">
              <img src={alertCircle} alt="안내 모달" className="w-12 h-12" />
              <span>작성한 리뷰가 없어요.</span>
            </div>
          ) : (
            <MyReviewGrid
              isEditable={true}
              maxWidth="6xl"
              reviews={writtenReviews}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
