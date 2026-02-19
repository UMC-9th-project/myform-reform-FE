import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ImageCarousel } from '../../components/common/product/Image';
import ProductInfoToggle from '../../components/common/product/detail/ProductInfoToggle';
import ProductInfoCard from '../../components/common/product/detail/ProductInfoCard';
import ProductTabMenu from '../../components/common/product/detail/ProductTabMenu';
import ReformerProfileDetailCard from '../../components/common/product/detail/ReformerProfileDetailCard';
import ProductReviewSection from '../../components/common/product/detail/ProductReviewSection';
import ReviewDetailModal from '../../components/common/product/detail/review/ReviewDetailModal';
import { useOrderProposalDetail } from '../../hooks/domain/order/useOrderProposalDetail';
import { createChatRoom } from '../../api/chat/chatApi';
import useAuthStore from '../../stores/useAuthStore';
import type { ReviewPhoto } from '../../types/api/reviews';
import xIcon from '../../assets/icons/x.svg';

const ITEMS_PER_PAGE = 5;

const OrderProposalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    proposalDetail,
    profile,
    reviews,
    photoReviewCount,
    reviewPhotos,
    reviewPhotoUrls,
    reviewsAvgStar,
    totalPages,
    isLoading,
    isError,
    isLiked,
    handleLikeClick,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    currentPage,
    imageUrls,
    formattedPrice,
    formattedShippingFee,
    formattedEstimatedPeriod,
    handleShare,
    handlePageChange,
  } = useOrderProposalDetail();
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const reformerSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const [showPhotoReviewModal, setShowPhotoReviewModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | undefined>(undefined);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'info' | 'reformer' | 'review');
    const refMap = {
      info: infoSectionRef,
      reformer: reformerSectionRef,
      review: reviewSectionRef,
    };
    refMap[tabId as keyof typeof refMap]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (!id) {
    return <div>제안을 찾을 수 없습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="px-4 md:px-27 pt-15">
        <p className="body-b1-rg text-[var(--color-gray-60)]">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !proposalDetail) {
    return (
      <div className="px-4 md:px-27 pt-15">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          제안서를 불러오지 못했어요.
        </p>
      </div>
    );
  }

  const handleRequest = async () => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (!proposalDetail || !id) return;
    
    // 제안글 ID를 사용 (PROPOSAL 타입일 때는 제안글 ID를 사용)
    const proposalId = proposalDetail.reformProposalId || id;
    const targetId = proposalId;
    
    if (!targetId) {
      alert('제안글 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      // 채팅방 생성 - PROPOSAL 타입일 때는 제안글 ID 사용
      const requestPayload = {
        dto: {
          id: targetId,
          type: 'PROPOSAL' as const,
        },
      };
      
      const roomRes = await createChatRoom(requestPayload);

      if (roomRes.resultType !== 'SUCCESS' || !roomRes.success) {
        const errorMessage = roomRes.error?.reason || '채팅방 생성 실패';
        
        // 토큰 관련 에러면 alert 없이 바로 로그인 페이지로 이동
        const tokenErrorKeywords = ['토큰', 'Access Token', '유효하지 않은', '존재하지 않거나', '인증'];
        const isTokenError = tokenErrorKeywords.some(keyword => errorMessage.includes(keyword));
        
        if (isTokenError) {
          navigate('/login/type');
          return;
        }
        
        alert(`채팅방 생성에 실패했습니다: ${errorMessage}`);
        return;
      }

      const chatRoomId = roomRes.success.id;
      
      // 채팅 페이지로 이동
      navigate(`/chat/normal/${chatRoomId}`);
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { error?: { reason?: string } } }; message?: string })?.response?.data?.error?.reason || 
                           (error as { message?: string })?.message || 
                           '알 수 없는 오류가 발생했습니다.';
      
      // 토큰 관련 에러면 alert 없이 바로 로그인 페이지로 이동
      const tokenErrorKeywords = ['토큰', 'Access Token', '유효하지 않은', '존재하지 않거나', '인증'];
      const isTokenError = tokenErrorKeywords.some(keyword => errorMessage.includes(keyword));
      
      if (isTokenError) {
        navigate('/login/type');
        return;
      }
      
      alert(`채팅방 생성에 실패했습니다: ${errorMessage}`);
    }
  };


  const handleMorePhotoReviewsClick = () => {
    setShowPhotoReviewModal(true);
  };

  const firstImage = imageUrls[0];
  const additionalImages = imageUrls.length > 1 ? imageUrls.slice(1) : [];

  return (
    <div className="bg-white">
      <div className="px-4 md:px-27 pt-15">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3.125rem] mb-16">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="flex-1">
            <ImageCarousel images={imageUrls} />
          </div>

          {/* 오른쪽: 제안 상세 정보 */}
          <div className="flex-1">
            <ProductInfoCard
              title={proposalDetail.title}
              price={formattedPrice}
              rating={proposalDetail.avgStar ?? profile?.avgStar ?? 0}
              recentRating={proposalDetail.avgStar3m ?? profile?.avgStarRecent3m}
              shippingFee={formattedShippingFee}
              estimatedPeriod={formattedEstimatedPeriod}
              reformer={{
                id: profile?.ownerId ?? proposalDetail.ownerId ?? proposalDetail.reformProposalId,
                name: profile?.nickname ?? proposalDetail.ownerName,
                profileImg: profile?.profilePhoto ?? proposalDetail.ownerProfile,
                description: proposalDetail.content,
              }}
              isLiked={isLiked}
              onLikeClick={handleLikeClick}
              onShareClick={handleShare}
              onRequestClick={handleRequest}
            />
          </div>
        </div>

        {/* 탭 메뉴 - 스티키 고정, 좌우 여백 없이 밑줄 전체 */}
        <div className="sticky top-0 z-10 bg-white -mx-4 md:-mx-27 pt-4 border-b border-[var(--color-gray-40)]">
          <div className="px-4 md:px-27">
            <ProductTabMenu
              tabs={[
                { id: 'info', label: '상품 정보' },
                { id: 'reformer', label: '리폼러 정보' },
                { id: 'review', label: '상품 후기' },
              ]}
              activeTabId={activeTab}
              onTabChange={handleTabChange}
              hideBorder
            />
          </div>
        </div>

        {/* 상품 정보 */}
        <div ref={infoSectionRef} data-tab="info" className="mb-16 scroll-mt-24">
          <ProductInfoToggle
            firstImage={firstImage}
            additionalImages={additionalImages}
          />
        </div>

        {/* 리폼러 정보 */}
        <div ref={reformerSectionRef} className="mb-16 flex justify-center scroll-mt-24">
          <div className="max-w-[63.75rem] w-full">
            <ReformerProfileDetailCard
              name={profile?.nickname ?? proposalDetail.ownerName}
              rating={profile?.avgStar ?? 0}
              orderCount={profile?.totalSaleCount ?? 0}
              reviewCount={profile?.reviewCount ?? 0}
              profileImg={profile?.profilePhoto ?? proposalDetail.ownerProfile}
              bio={profile?.bio}
              onFeedClick={() => {
                const ownerId = profile?.ownerId ?? proposalDetail.ownerId;
                if (ownerId) navigate(`/profile/${ownerId}`);
                else navigate('/profile');
              }}
            />
          </div>
        </div>

        {/* 상품 후기 */}
        <div ref={reviewSectionRef} className="scroll-mt-24">
          <ProductReviewSection
            rating={reviewsAvgStar ?? profile?.avgStar ?? 0}
            photoReviewCount={photoReviewCount}
            reviews={reviews}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalPages={totalPages}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onPageChange={handlePageChange}
            onMorePhotoReviewsClick={handleMorePhotoReviewsClick}
            photoReviewImages={reviewPhotoUrls}
            targetType="PROPOSAL"
            targetId={proposalDetail?.reformProposalId ?? id}
          />
        </div>
      </div>

      {/* 사진 후기 갤러리 모달 */}
      {showPhotoReviewModal && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPhotoReviewModal(false)}
        >
          <div
            className="relative bg-white rounded-[1.875rem] max-w-[1125px] w-[90%] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center p-6 border-b border-[var(--color-gray-30)]">
              <h2 className="heading-h5-md">
                사진 후기 ({photoReviewCount})
              </h2>
              <button
                onClick={() => setShowPhotoReviewModal(false)}
                className="absolute right-6 cursor-pointer"
              >
                <img src={xIcon} alt="닫기" className="w-10 h-10" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 pb-6">
              {reviewPhotos && reviewPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[0.375rem] mt-6">
                  {(reviewPhotos as ReviewPhoto[]).map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setSelectedReviewId(photo.review_id);
                        setSelectedPhotoIndex(photo.photo_order);
                        setShowPhotoReviewModal(false);
                      }}
                    >
                      <img
                        src={photo.photo_url}
                        alt={`후기 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="body-b1-rg text-[var(--color-gray-60)]">사진 후기가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 리뷰 상세 모달 */}
      {selectedReviewId && proposalDetail?.reformProposalId && (
        <ReviewDetailModal
          isOpen={!!selectedReviewId}
          onClose={() => {
            setSelectedReviewId(null);
            setSelectedPhotoIndex(undefined);
          }}
          targetType="PROPOSAL"
          targetId={proposalDetail.reformProposalId}
          reviewId={selectedReviewId}
          initialPhotoIndex={selectedPhotoIndex}
        />
      )}
    </div>
  );
};

export default OrderProposalDetailPage;

