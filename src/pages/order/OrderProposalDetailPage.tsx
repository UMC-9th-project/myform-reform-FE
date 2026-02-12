import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageCarousel } from '../../components/common/product/Image';
import ProductInfoToggle from '../../components/common/product/detail/ProductInfoToggle';
import ProductInfoCard from '../../components/common/product/detail/ProductInfoCard';
import ProductTabMenu from '../../components/common/product/detail/ProductTabMenu';
import ReformerProfileDetailCard from '../../components/common/product/detail/ReformerProfileDetailCard';
import ProductReviewSection from '../../components/common/product/detail/ProductReviewSection';
import { useOrderProposalDetail } from '../../hooks/domain/order/useOrderProposalDetail';
import { api } from '../../api/axios';
import useAuthStore from '../../stores/useAuthStore';

const ITEMS_PER_PAGE = 5;

const OrderProposalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userRole = useAuthStore((state) => state.role);
  const {
    proposalDetail,
    profile,
    reviews,
    photoReviewCount,
    reviewPhotos,
    reviewsAvgStar,
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
    if (!id) {
      alert('제안 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      const response = await api.post('/chat/rooms', {
        dto: { id, type: 'PROPOSAL' },
      });

      const chatRoomId = response.data.success?.id;
      if (chatRoomId) {
        // 사용자 역할에 따라 채팅 페이지로 이동
        const chatPath = userRole === 'reformer' 
          ? `/chat/reformer/${chatRoomId}`
          : `/chat/normal/${chatRoomId}`;
        navigate(chatPath);
      } else {
        alert('채팅방 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다.');
    }
  };


  const handleMorePhotoReviewsClick = () => {
    // 사진 후기 더보기 로직
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
              rating={profile?.avgStar ?? 0}
              recentRating={profile?.avgStarRecent3m}
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
            sortBy={sortBy}
            onSortChange={setSortBy}
            onPageChange={handlePageChange}
            onMorePhotoReviewsClick={handleMorePhotoReviewsClick}
            photoReviewImages={reviewPhotos}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderProposalDetailPage;

