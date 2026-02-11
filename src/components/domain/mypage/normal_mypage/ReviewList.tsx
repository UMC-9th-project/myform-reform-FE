// ReviewList.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MyReviewGrid, { type ReviewItem } from '../MyReviewGrid';
import MyReviewCard, { type ProductOrder } from './MyReviewCard';
import { useUserTabStore } from '../../../../stores/tabStore';
import alertCircle from '@/assets/mypage/alertCircle.svg';
import { getUserOrders, type OrderItem } from '@/api/mypage/orderApi';
import { getMyReviews, deleteReview, type MyReviewItem } from '@/api/mypage/reviewApi';

type ReviewTab = 'writable' | 'written';

const ReviewList = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('writable');
  const { setSelectedOrderId } = useUserTabStore();
  const [writableReviews, setWritableReviews] = useState<ProductOrder[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDetailClick = (id: string) => {
    setSelectedOrderId(id);
  };

  const handleWriteReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/mypage/review/write');
  };

  // 작성 가능한 후기 조회
  React.useEffect(() => {
    const fetchReviewableOrders = async () => {
      try {
        const data = await getUserOrders({ type: 'ALL', onlyReviewAvailable: true });
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

          targetType: o.targetType === 'ITEM' || o.targetType === 'REQUEST' ? o.targetType : undefined,// "ITEM" | "REQUEST"
          targetId: o.targetId,
        }));
        setWritableReviews(mapped);
      } catch (err) {
        console.error('작성 가능한 후기 조회 실패', err);
      }
    };

    if (activeTab === 'writable') fetchReviewableOrders();
  }, [activeTab]);

  // 작성한 후기 조회 (React Query)
  const { data: writtenReviewsData, isLoading: loadingWritten } = useQuery<ReviewItem[]>({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const res = await getMyReviews({ limit: 20, order: 'desc' });
      return res.data.map((r: MyReviewItem) => ({
        id: r.reviewId,
        author: r.userNickname,
        profileImg: r.userProfilePhoto || '',
        date: new Date(r.createdAt).toLocaleDateString(),
        productImg: r.orderThumbnail || '',
        productName: r.orderTitle,
        productPrice: parseInt(r.finalPrice),
        rating: r.star,
        content: r.content,
        img: r.reviewPhotos || [],
      }));
    },
    enabled: activeTab === 'written', // written 탭에서만 fetch
  });

  // 리뷰 삭제
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      alert('리뷰 삭제가 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
    onError: (err: unknown) => {
      if (err instanceof Error && err.message.includes('403')) {
        alert('권한이 없어 리뷰를 삭제할 수 없습니다.');
      } else if (err instanceof Error && err.message.includes('404')) {
        alert('리뷰를 찾을 수 없습니다.');
      } else {
        alert('리뷰 삭제 중 오류가 발생했습니다.');
      }
    },
  });

  return (
    <div className="w-full min-h-screen pt-0 pl-0 p-0">
      {/* 탭 */}
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

      {/* 작성 가능한 후기 */}
      {activeTab === 'writable' && (
        <div className="space-y-4">
          {writableReviews.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 text-black body-b1-sb py-20">
              <img src={alertCircle} alt="안내 모달" className="w-12 h-12" />
              <span>작성 가능한 후기가 없어요.</span>
            </div>
          ) : (
            <MyReviewCard
              data={writableReviews}
              onDetailClick={handleDetailClick}
              onWriteReviewClick={handleWriteReviewClick}
              onChatClick={(targetId: string) => {
                navigate(`/chat/normal/${targetId}`); }}
            />
          )}
        </div>
      )}

      {/* 작성한 후기 */}
      {activeTab === 'written' && (
        <div className="space-y-4">
          {loadingWritten ? (
            <div className="text-center py-20 text-gray-400 body-b1-rg">로딩중...</div>
          ) : !writtenReviewsData || writtenReviewsData.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 text-black body-b1-sb py-20">
              <img src={alertCircle} alt="안내 모달" className="w-12 h-12" />
              <span>작성한 후기가 없어요.</span>
            </div>
          ) : (
            <MyReviewGrid
              isEditable={true}
              maxWidth="6xl"
              reviews={writtenReviewsData}
              onDelete={(reviewId: string) => deleteMutation.mutate(reviewId)}
              
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
