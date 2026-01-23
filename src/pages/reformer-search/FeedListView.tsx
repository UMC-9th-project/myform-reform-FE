import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb/Breadcrumb';
import ReformFeedCard from '../../components/domain/reformer-search/ReformFeedCard';

// 더미 데이터 생성 함수
const generateMockFeedImage = (id: number) => ({
  id,
  image: `/wsh${((id - 1) % 4) + 1}.jpg`,
});

const ITEMS_PER_PAGE = 20; // 한 번에 로드할 아이템 수

const FeedListView = () => {
  const [displayedItems, setDisplayedItems] = useState<number>(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '리폼러 찾기', path: '/reformer-search' },
    { label: '피드 보기' },
  ];

  // 무한 스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          // 다음 데이터 로드 시뮬레이션 (API 호출 시뮬레이션)
          setTimeout(() => {
            setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [isLoading]);

  // 표시할 아이템들 생성
  const feedImages = Array.from({ length: displayedItems }, (_, i) =>
    generateMockFeedImage(i + 1)
  );

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-6 md:mb-8 pl-0 md:pl-[110px]">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 헤더 */}
        <div className="mb-8 md:mb-12 pl-0 md:pl-[110px]">
          <h1 className="heading-h4-bd text-[var(--color-black)] mb-2">
            피드 탐색하기
          </h1>
          <p className="heading-h5-rg text-[var(--color-gray-50)]">
            다양한 리폼 스타일을 탐색해보세요.
            <br />
            내 취향에 맞는 리폼러를 만날 수 있어요.
          </p>
        </div>

        {/* 피드 그리드 */}
        <div className="px-0 md:px-[110px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-[0.875rem]">
            {feedImages.map((item) => (
              <ReformFeedCard
                key={item.id}
                id={item.id}
                image={item.image}
                onClick={() => {
                  // 피드 상세 페이지로 이동 (추후 구현)
                  console.log('피드 클릭:', item.id);
                }}
              />
            ))}
          </div>

          {/* 무한 스크롤 감지 영역 */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {isLoading && (
              <div className="text-[var(--color-gray-50)] body-b2-rg">
                로딩 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedListView;
