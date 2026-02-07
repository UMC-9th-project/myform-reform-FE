import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageCarousel } from '../../components/common/product/Image';
import ProductInfoToggle from '../../components/common/product/detail/ProductInfoToggle';
import ProductInfoCard from '../../components/common/product/detail/ProductInfoCard';
import ProductTabMenu from '../../components/common/product/detail/ProductTabMenu';
import ReformerProfileDetailCard from '../../components/common/product/detail/ReformerProfileDetailCard';
import ProductReviewSection from '../../components/common/product/detail/ProductReviewSection';
import { useOrderProposalDetail } from '../../hooks/domain/order/useOrderProposalDetail';

interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  date: string;
  reviewText?: string;
  image?: string;
  profileImg?: string;
}

const getMockReviews = (): ReviewData[] => {
  return [
    {
      id: '1',
      userName: '뜨거운 아이스 아메리카노',
      rating: 5,
      date: '2025년 11월 20일',
      reviewText: `제가 정말 아끼던 유니폼이 있었는데, 사이즈도 맞지 않고 낡아서 솔직히 옷장 속에만 보관되어 있었습니다. 버리기는 너무 아깝고, 그렇다고 걸어두기엔 먼지만 쌓여서 볼 때마다 마음이 아팠습니다.

그러다가 '리폼'이라는 것을 알게 되었고, 이 유니폼을 짐색으로 만들기로 결정했습니다. 결과는 매우 만족스럽습니다! 등번호와 이름 부분, 그리고 팀 엠블럼이 정확히 가운데 오도록 디자인해 주셨는데, 정말 세상에 하나뿐인 굿즈가 탄생한 느낌입니다.

옛날 유니폼이라 재질이 얇을까 염려했는데, 안에 덧댐 작업을 깔끔하게 해 주셔서 튼튼하고 마감도 완벽합니다. 이제는 경기장에 갈 때마다 여기에 응원봉과 간식 등 여러 가지를 챙겨서 다니는데, 그럴 때마다 유니폼을 입고 뛰던 시절의 추억이 새록새록 떠오릅니다. 정말 돈이 아깝지 않은 리폼이었습니다`,
      image: '/wsh1.jpg',
    },
    {
      id: '2',
      userName: '차가운 핫초코',
      rating: 5,
      date: '2025년 11월 15일',
      reviewText: '정말 만족스러운 리폼이었습니다. 빠른 배송과 깔끔한 마감이 인상적이에요!',
    },
  ];
};

const ITEMS_PER_PAGE = 5;

const OrderProposalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    proposalDetail,
    profile,
    isLoading,
    isError,
    isLiked,
    setIsLiked,
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

  const reviews = getMockReviews();
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

  const handleRequest = () => {};

  const handleLike = (liked: boolean) => {
    setIsLiked(liked);
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
              onLikeClick={handleLike}
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
            rating={profile?.avgStar ?? 0}
            photoReviewCount={0}
            reviews={reviews}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onPageChange={handlePageChange}
            onMorePhotoReviewsClick={handleMorePhotoReviewsClick}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderProposalDetailPage;

