import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import shareIcon from '../../assets/icons/share.svg';
import { ImageCarousel } from '../../components/common/product/Image';
import Button from '../../components/common/button/Button1';
import ReformerSearchCard from '../../components/domain/reformer-search/ReformerProfileCard';
import LeftIcon from '../../assets/icons/left.svg?react';
import RightIcon from '../../assets/icons/right.svg?react';
import { useOrderRequestDetail } from '../../hooks/domain/order/useOrderRequestDetail';
import { getReformerList } from '../../api/reformer';

const OrderRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: reformerListData } = useQuery({
    queryKey: ['reformer-list', 'recommended'],
    queryFn: () => getReformerList({ sort: 'rating' }),
  });
  const recommendedReformers = reformerListData?.reformers ?? [];

  const {
    requestDetail,
    isLoading,
    isError,
    imageUrls,
    isClosed,
    formattedDeadline,
    formattedBudget,
    handleShare,
  } = useOrderRequestDetail();

  useEffect(() => {
    const updateScrollState = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    updateScrollState();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);
      return () => {
        carousel.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, []);

  if (!id) {
    return <div>요청을 찾을 수 없습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="px-27 pt-6">
        <p className="body-b1-rg text-[var(--color-gray-60)]">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !requestDetail) {
    return (
      <div className="px-27 pt-6">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          요청서를 불러오지 못했어요.
        </p>
      </div>
    );
  }

  const isMyRequest = requestDetail.isOwner;

  const handleEdit = () => {
    // 글 수정하기 기능
    navigate(`/order/requests/${id}/edit`);
  };

  const handleCheckProposals = () => {
    // 받은 제안 확인하기 → 채팅 페이지 주문제작 탭으로 이동
    navigate('/chat/normal?tab=order');
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // 카드 하나의 너비 + gap 계산 (23.75rem + 3.5rem = 27.25rem = 436px)
      const cardWidth = 23.75 * 16; // 23.75rem to px
      const gapWidth = 3.5 * 16; // 3.5rem (gap-14) to px
      const scrollAmount = cardWidth + gapWidth; // 한 칸씩 이동
      
      const currentScroll = carouselRef.current.scrollLeft;
      const containerWidth = carouselRef.current.clientWidth;
      
      let newScrollLeft: number;
      if (direction === 'left') {
        // 왼쪽으로 이동: 현재 스크롤 위치에서 한 칸씩 빼기
        newScrollLeft = Math.max(0, currentScroll - scrollAmount);
      } else {
        // 오른쪽으로 이동: 현재 스크롤 위치에서 한 칸씩 더하기
        const maxScroll = carouselRef.current.scrollWidth - containerWidth;
        newScrollLeft = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/order' },
    { label: '주문제작 요청', path: '/order/requests' },
    { label: '상세' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-27 pt-6 ">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 페이지 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-8">리폼 요청</h1>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3.125rem]">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="flex-1">
            <ImageCarousel images={imageUrls} isClosed={isClosed} />
          </div>

          {/* 오른쪽: 요청 상세 정보 */}
          <div className="flex-1 flex flex-col ">
            {/* 요청자 정보 */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-60)]">
                  <img
                    src={requestDetail.profile}
                    alt={requestDetail.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="body-b1-rg text-[var(--color-gray-60)]">{requestDetail.name}</span>
              </div>
              <button
                onClick={handleShare}
                className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="공유하기"
              >
                <img src={shareIcon} alt="공유" className="w-8 h-8" />
              </button>
            </div>

            {/* 요청 제목 */}
            <h2 className="heading-h5-md text-[var(--color-black)] mb-4">{requestDetail.title}</h2>

            {/* 희망 예산 */}
            <div className="mb-1 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)] ">희망 예산</p>
              <p className="heading-h4-bd text-[var(--color-black)]">{formattedBudget}</p>
            </div>

            {/* 마감일 */}
            <div className="mb-6 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)]">마감일</p>
              <p className="body-b1-rg text-[var(--color-gray-60)]">{formattedDeadline}</p>
            </div>

            {/* 상세 요청 내용 */}
            <div className="pt-8 border-b border-[var(--color-gray-40)]">
              <div className="pl-10">
                <p className="body-b1-rg text-[var(--color-gray-60)] mb-4 ">상세 요청 내용</p>
                <div className="body-b1-rg text-[var(--color-black)] whitespace-pre-line pb-12">
                  {requestDetail.content}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            {isMyRequest && (
              <div className="flex gap-7 mt-7">
                <Button variant="white" onClick={handleEdit} className="flex-1">
                  글 수정하기
                </Button>
                <Button variant="outlined-mint" onClick={handleCheckProposals} className="flex-2">
                  받은 제안 확인하기
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 추천 리폼러 섹션 */}
        {isMyRequest && (
          <div className="mt-16">
            <h2 className="heading-h4-bd text-[var(--color-black)] ml-24">추천 리폼러</h2>
          <div className="flex items-center gap-4">
            {/* 왼쪽 화살표 */}
            <button
              onClick={() => canScrollLeft && scrollCarousel('left')}
              disabled={!canScrollLeft}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-opacity ${
                canScrollLeft ? 'hover:opacity-70 cursor-pointer' : 'opacity-20 '
              }`}
              aria-label="이전"
            >
              <LeftIcon className="w-10 h-10 text-[var(--color-black)]" />
            </button>

            {/* 리폼러 카드 캐러셀 */}
            <div 
              className="relative overflow-hidden" 
              style={{ 
                width: 'calc(23.75rem * 3 + 3.5rem * 2 + 2.5rem * 2)',
                maxWidth: 'calc(23.75rem * 3 + 3.5rem * 2 + 2.5rem * 2)'
              }}
            >
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="px-10 py-10 flex gap-14 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {recommendedReformers.map((reformer) => (
                  <div key={reformer.owner_id} className="flex-shrink-0 w-[23.75rem]">
                    <ReformerSearchCard reformer={reformer} />
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 화살표 */}
            <button
              onClick={() => canScrollRight && scrollCarousel('right')}
              disabled={!canScrollRight}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-opacity ${
                canScrollRight ? 'hover:opacity-70 cursor-pointer' : 'opacity-20 '
              }`}
              aria-label="다음"
            >
              <RightIcon className="w-10 h-10 text-[var(--color-black)]" />
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default OrderRequestDetailPage;
