import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ImageCarousel } from '../../../components/common/product/Image';
import ProductInfoToggle from '../../../components/common/product/detail/ProductInfoToggle';
import ProductInfoCard from '../../../components/common/product/detail/ProductInfoCard';
import ProductTabMenu from '../../../components/common/product/detail/ProductTabMenu';
import ReformerProfileDetailCard from '../../../components/common/product/detail/ReformerProfileDetailCard';
import ProductReviewSection from '../../../components/common/product/detail/ProductReviewSection';
import Button from '../../../components/common/button_tmp/button1';
import ex4 from '../../../components/common/product/exImage/ex4.jpg';
import ex5 from '../../../components/common/product/exImage/ex5.jpg';
import ex6 from '../../../components/common/product/exImage/ex6.jpg';

interface SuggestionDetail {
  id: string;
  title: string;
  images: string[];
  price: string;
  shippingFee: string;
  estimatedPeriod: string;
  reformer: {
    id: string;
    name: string;
    profileImg?: string;
    rating: number;
    reviewCount: number;
    transactionCount: number;
    description: string;
    tags: string[];
  };
  rating: number;
  reviewCount: number;
  photoReviewCount: number;
  type?: 'mySuggestion' | 'Suggestion';
}

interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  date: string;
  reviewText?: string;
  image?: string;
  profileImg?: string;
}

// 더미 데이터
const getMockSuggestionDetail = (id: string): SuggestionDetail => {
  const mockData: Record<string, SuggestionDetail> = {
    '1': {
      id: '1',
      title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      images: ['/wsh1.jpg', '/wsh1.jpg', '/wsh1.jpg'],
      price: '75,000원',
      shippingFee: '무료 배송',
      estimatedPeriod: '평균 3일 이내 배송 시작',
      reformer: {
        id: '1',
        name: '침착한 대머리독수리',
        rating: 4.97,
        reviewCount: 271,
        transactionCount: 415,
        description:
          '- 2019년부터 리폼 공방 운영 시작\n - 6년차 스포츠 의류 리폼 전문 공방\n\n고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.',
        tags: ['#빠른', '#친절한'],
      },
      rating: 4.94,
      reviewCount: 362,
      photoReviewCount: 182,
      type: 'Suggestion',
    },
    '2': {
      id: '2',
      title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      images: ['/wsh1.jpg', '/wsh1.jpg', '/wsh1.jpg'],
      price: '75,000원',
      shippingFee: '무료 배송',
      estimatedPeriod: '평균 3일 이내 배송 시작',
      reformer: {
        id: '1',
        name: '침착한 대머리독수리',
        rating: 4.97,
        reviewCount: 271,
        transactionCount: 415,
        description:
          '- 2019년부터 리폼 공방 운영 시작\n - 6년차 스포츠 의류 리폼 전문 공방\n\n고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.',
        tags: ['#빠른', '#친절한'],
      },
      rating: 4.94,
      reviewCount: 362,
      photoReviewCount: 182,
      type: 'mySuggestion',
    },
  };

  return mockData[id] || mockData['1'];
};

// 더미 후기 데이터
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
    {
      id: '3',
      userName: '따스한 봄날',
      rating: 5,
      date: '2025년 11월 12일',
      image: '/wsh1.jpg',
    },
    {
      id: '4',
      userName: '달콤한 쓴맛',
      rating: 4,
      date: '2025년 11월 10일',
    },
    {
      id: '5',
      userName: '정장 입은 남자',
      rating: 5,
      date: '2025년 11월 8일',
      reviewText: '퀄리티가 정말 좋아요. 다음에도 또 주문할 예정입니다.',
    },
    {
      id: '6',
      userName: '멋진 여자',
      rating: 5,
      date: '2025년 11월 5일',
      reviewText: '빠른 배송과 친절한 서비스에 감사드립니다.',
      image: '/wsh1.jpg',
    },
    {
      id: '7',
      userName: '행복한 하루',
      rating: 4,
      date: '2025년 11월 3일',
      reviewText: '만족스러운 구매였습니다.',
    },
    {
      id: '8',
      userName: '즐거운 오후',
      rating: 5,
      date: '2025년 11월 1일',
      image: '/wsh1.jpg',
    },
  ];
};

const ReformerOrderSuggestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'reformer' | 'review'>('info');
  const [sortBy, setSortBy] = useState<'latest' | 'high' | 'low'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const suggestionDetail = id ? getMockSuggestionDetail(id) : null;
  const reviews = getMockReviews();
  const ITEMS_PER_PAGE = 5;

  if (!id || !suggestionDetail) {
    return <div>제안을 찾을 수 없습니다.</div>;
  }

  const { title, images, price, shippingFee, estimatedPeriod, reformer, rating, photoReviewCount, type } =
    suggestionDetail;

  const isMySuggestion = type === 'mySuggestion';

  const handleShare = () => {};

  const handleRequest = () => {};

  const handleLike = (liked: boolean) => {
    setIsLiked(liked);
  };

  const handleEdit = () => {
    navigate(`/reformer/order/suggestions/${id}/edit`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMorePhotoReviewsClick = () => {
    // 사진 후기 더보기 로직
  };

  return (
    <div className="bg-white">
      <div className="px-4 md:px-27 pt-15">


        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3.125rem] mb-16">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="flex-1">
            <ImageCarousel images={images} />
          </div>

          {/* 오른쪽: 제안 상세 정보 */}
          <div className="flex-1">
            <ProductInfoCard
              title={title}
              price={price}
              rating={rating}
              recentRating={4.92}
              shippingFee={shippingFee}
              estimatedPeriod={estimatedPeriod}
              reformer={{
                id: reformer.id,
                name: reformer.name,
                profileImg: reformer.profileImg,
                description: '이제는 유니폼도 색다르게! 한화-롯데 등 야구단 유니폼 리폼해 드립니다.',
              }}
              isLiked={isLiked}
              onLikeClick={handleLike}
              onShareClick={handleShare}
              onRequestClick={handleRequest}
              showButtons={false}
            />
            {/* 글 수정하기 버튼 (내 제안글인 경우만) */}
            {isMySuggestion && (
              <div className="mt-7">
                <Button variant="white" onClick={handleEdit} className="w-full">
                  글 수정하기
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <ProductTabMenu
          tabs={[
            { id: 'info', label: '상품 정보' },
            { id: 'reformer', label: '리폼러 정보' },
            { id: 'review', label: '상품 후기' },
          ]}
          activeTabId={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'info' | 'reformer' | 'review')}
        />

        {/* 탭 콘텐츠 */}
        {activeTab === 'info' && (
          <div className="mb-16">
            <ProductInfoToggle
              firstImage={ex4}
              additionalImages={[ex5, ex6]}
            />
          </div>
        )}

        {activeTab === 'reformer' && (
          <div className="mb-16 flex justify-center">
            <div className="max-w-[63.75rem] w-full">
              <ReformerProfileDetailCard
                name={reformer.name}
                rating={reformer.rating}
                orderCount={reformer.transactionCount}
                reviewCount={reformer.reviewCount}
                profileImg={reformer.profileImg}
                onFeedClick={() => navigate('/profile')}
              />
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <ProductReviewSection
            rating={rating}
            photoReviewCount={photoReviewCount}
            reviews={reviews}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onPageChange={handlePageChange}
            onMorePhotoReviewsClick={handleMorePhotoReviewsClick}
          />
        )}
      </div>
    </div>
  );
};

export default ReformerOrderSuggestionDetailPage;
