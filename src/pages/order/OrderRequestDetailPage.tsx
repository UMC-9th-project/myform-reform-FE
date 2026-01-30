import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import shareIcon from '../../assets/icons/share.svg';
import { ImageCarousel } from '../../components/common/product/Image';
import Button from '../../components/common/Button/button1';
import ReformerSearchCard from '../../components/domain/reformer-search/ReformerProfileCard';
import LeftIcon from '../../assets/icons/left.svg?react';
import RightIcon from '../../assets/icons/right.svg?react';

interface RequestDetail {
  id: string;
  title: string;
  images: string[];
  nickname: string;
  profileImg: string;
  budget: string;
  deadline: string;
  description: string;
  type: 'myRequest' | 'Request';
}

interface RecommendedReformer {
  id: string;
  name: string;
  profileImg: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
}

// 더미 데이터 (실제로는 API에서 가져올 데이터)
const getMockRequestDetail = (id: string): RequestDetail => {
  const mockData: Record<string, RequestDetail> = {
    '1': {
      id: '1',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2026년 5월 22일',
      description: `2026년 5월 22일 마감일로 설정된 테스트 데이터입니다.
      마감되지 않은 상태로 표시되어야 합니다.`,
      type: 'Request',
    },
    '2': {
      id: '2',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2025년 12월 31일',
      description: `상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.`,
      type: 'myRequest',
    },
    '3': {
      id: '3',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg', '/crt2.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2025년 12월 31일',
      description: `상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.`,
      type: 'Request',
    },
  };

  return mockData[id] || mockData['3'];
};

// 추천 리폼러 더미 데이터
const getRecommendedReformers = (): RecommendedReformer[] => {
  return [
    {
      id: '1',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
    {
      id: '2',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
    {
      id: '3',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
    {
      id: '4',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
    {
      id: '5',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
    {
      id: '6',
      name: '침착한 대머리독수리',
      profileImg: '/crt1.jpg',
      rating: 4.9,
      reviewCount: 271,
      transactionCount: 415,
      description:
        '2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
      tags: ['#빠른', '#친절한'],
    },
  ];
};

const OrderRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const requestDetail = id ? getMockRequestDetail(id) : null;
  const recommendedReformers = getRecommendedReformers();

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

  if (!id || !requestDetail) {
    return <div>요청을 찾을 수 없습니다.</div>;
  }

  const { title, images, nickname, profileImg, budget, deadline, description, type } = requestDetail;
  const isMyRequest = type === 'myRequest';

  // 마감일 확인 (예: "2025년 12월 31일" 형식)
  const isClosed = (() => {
    try {
      // 마감일 문자열 파싱 (예: "2025년 12월 31일")
      const deadlineMatch = deadline.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (!deadlineMatch) return false;

      const [, year, month, day] = deadlineMatch;
      const deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      // 오늘 날짜가 마감일보다 이후면 마감됨
      return today > deadlineDate;
    } catch {
      return false;
    }
  })();

  const handleShare = () => {
    // 공유 기능 구현
    console.log('공유하기');
  };

  const handleEdit = () => {
    // 글 수정하기 기능
    navigate(`/order/requests/${id}/edit`);
  };

  const handleCheckSuggestions = () => {
    // 받은 제안 확인하기 기능
    navigate(`/order/requests/${id}/suggestions`);
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
            <ImageCarousel images={images} isClosed={isClosed} />
          </div>

          {/* 오른쪽: 요청 상세 정보 */}
          <div className="flex-1 flex flex-col ">
            {/* 요청자 정보 */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-60)]">
                  <img
                    src={profileImg}
                    alt={nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="body-b1-rg text-[var(--color-gray-60)]">{nickname}</span>
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
            <h2 className="heading-h5-md text-[var(--color-black)] mb-4">{title}</h2>

            {/* 희망 예산 */}
            <div className="mb-1 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)] ">희망 예산</p>
              <p className="heading-h4-bd text-[var(--color-black)]">{budget}</p>
            </div>

            {/* 마감일 */}
            <div className="mb-6 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)]">마감일</p>
              <p className="body-b1-rg text-[var(--color-gray-60)]">{deadline}</p>
            </div>

            {/* 상세 요청 내용 */}
            <div className="pt-8 border-b border-[var(--color-gray-40)]">
              <div className="pl-10">
                <p className="body-b1-rg text-[var(--color-gray-60)] mb-4 ">상세 요청 내용</p>
                <div className="body-b1-rg text-[var(--color-black)] whitespace-pre-line pb-12">
                  {description}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            {isMyRequest && (
              <div className="flex gap-7 mt-7">
                <Button variant="white" onClick={handleEdit} className="flex-1">
                  글 수정하기
                </Button>
                <Button variant="outlined-mint" onClick={handleCheckSuggestions} className="flex-2">
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
                  <div key={reformer.id} className="flex-shrink-0 w-[23.75rem]">
                    <ReformerSearchCard
                      name={reformer.name}
                      rating={reformer.rating}
                      reviewCount={reformer.reviewCount}
                      transactionCount={reformer.transactionCount}
                      description={reformer.description}
                      tags={reformer.tags}
                    />
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
