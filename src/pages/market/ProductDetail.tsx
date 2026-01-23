import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import OptionDropdown from '../../components/domain/product/option/option-dropdown/OptionDropdown';
import OptionQuantity from '../../components/domain/product/option/option-quantity-button/OptionQuantity';
import ProductInfoToggle from '../../components/domain/product/ProductInfoToggle';
import Review from '../../components/domain/product/Review';
import ReviewFilter from '../../components/domain/product/ReviewFilter';
import PageNumber from '../../components/domain/product/PageNumber';
import starIcon from '../../assets/icons/star.svg';
import heartIcon from '../../assets/icons/heart.svg';
import cartIcon from '../../assets/icons/shoppingCart.svg';
import chatIcon from '../../assets/icons/chat.svg';
import profileImage from '../../components/domain/market/images/profile.png';
import leftIcon from '../../assets/icons/left.svg';
import rightIcon from '../../assets/icons/right.svg';
import shareIcon from '../../assets/icons/share.svg';
import type { OptionItem } from '../../components/domain/product/option/option-dropdown/OptionItem';

import 'swiper/css';
import 'swiper/css/navigation';

// 임시 제품 데이터
const mockProduct = {
  id: 1,
  title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  price: 75000,
  rating: 4.94,
  recentRating: 4.92,
  reviewCount: 271,
  seller: {
    name: '침착한 대머리독수리',
    profileImage: profileImage,
    rating: 4.97,
    orderCount: 415,
    reviewCount: 271,
    description: '- 2019년부터 리폼 공방 운영 시작 ✨\n- 6년차 스포츠 의류 리폼 전문 공방',
  },
  images: [
    '/Home/images/p1.jpg',
    '/Home/images/p1.jpg',
    '/Home/images/p1.jpg',
  ],
  descriptionImages: [
    '/Home/images/p1.jpg',
    '/Home/images/p1.jpg',
    '/Home/images/p1.jpg',
  ],
  shipping: {
    fee: '무료 배송',
    info: '평균 3일 이내 배송 시작',
  },
  options: [
    {
      label: '옵션 샘플 테스트 1번',
      price: 0,
    },
    {
      label: '옵션 2',
      price: 10000,
    },
  ] as OptionItem[],
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'reformer' | 'review'>('info');

  const basePrice = mockProduct.price;
  const optionPrice = selectedOption
    ? mockProduct.options.find((opt) => opt.label === selectedOption)?.price || 0
    : 0;
  const totalPrice = (basePrice + optionPrice) * quantity;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className=" min-h-screen  mt-[2.75rem]">
    
      {/* 메인 제품 섹션 */}
      <div className="flex mx-[7.125rem] gap-[2.9375rem] mb-[2.75rem]">
        {/* 왼쪽: 제품 이미지 캐러셀 */}
        <div className="">
          <div className="relative w-[600px] h-[600px]  overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '.product-image-prev',
                nextEl: '.product-image-next',
              }}
              
              className="w-full h-full"
            >
              {mockProduct.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src='/public/crt1.jpg'
                    alt={`제품 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="product-image-prev absolute left-[1.25rem] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] bg-white rounded-full flex items-center justify-center shadow-md z-10">
              <img src={leftIcon} alt="이전" className="w-6 h-6" />
            </button>
            <button className="product-image-next absolute right-[1.25rem] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] rounded-full flex items-center justify-center shadow-md z-10">
              <img src={rightIcon} alt="다음" className="w-6 h-6" />
            </button>
          </div>


          
          {/* 썸네일 */}
          {/* <div className="flex gap-[0.625rem] justify-center">
            {mockProduct.images.map((image, index) => (
              <div
                key={index}
                className="w-[3.375rem] h-[3.375rem] rounded-[0.625rem] overflow-hidden cursor-pointer border-2 border-transparent hover:border-[var(--color-mint-1)]"
              >
               
              </div>
            ))}
          </div> */}
        </div>

        {/* 오른쪽: 제품 정보 */}
        <div className="flex-1 flex flex-col">
          {/* 판매자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.75rem]">
              <img
                src={mockProduct.seller.profileImage}
                alt={mockProduct.seller.name}
                className="w-[2.95725rem] h-[2.95725rem] rounded-full object-cover"
              />
              <span className="body-b1-rg text-[var(--color-gray-60)]">
                {mockProduct.seller.name}
              </span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center">
              <img src={shareIcon} alt="공유" />
            </button>
          </div>

          {/* 제품 제목 */}
          <div className="flex flex-col mt-[0.5625rem]">
            <h1 className="heading-h5-md">
              {mockProduct.title}
            </h1>
            <p className="heading-h2-bd mt-[1.125rem]">
              {formatPrice(mockProduct.price)}원
            </p>
          </div>

          {/* 평점 */}
          <div className="flex items-center gap-[0.3125rem] mt-[1.4375rem] mb-[0.8125rem]">
            <img src={starIcon} alt="star" className="w-[1.75rem] h-[1.75rem]" />
            <span className="body-b1-sb">
              {mockProduct.rating}
            </span>
            <span className="body-b5-rg text-[var(--color-gray-50)]">
              (최근 3개월 {mockProduct.recentRating})
            </span>
          </div>
          

          {/* 배송 정보 */}
          <div className="my-[1.25rem] flex flex-col gap-[0.8125rem] text-[var(--color-gray-60)]">
            <div className="flex gap-[2.8125rem]">
              <span className="body-b1-sb ">배송비</span>
              <span className="body-b1-rg">
                {mockProduct.shipping.fee}
              </span>
            </div>

            <div className="flex gap-[1.5rem]">
              <span className="body-b1-sb ">배송 정보</span>
              <span className="body-b1-rg">
                {mockProduct.shipping.info}
              </span>
            </div>
          </div>

          {/* 옵션 선택 */}
          <div>
            <OptionDropdown
              options={mockProduct.options}
              onSelect={(optionLabel) => setSelectedOption(optionLabel)}
              selectedOptionLabel={selectedOption}
            />
          </div>

          {/* 옵션 선택창 (선택된 옵션이 있을 때) */}
          {selectedOption && (
            <div className="bg-[var(--color-gray-20)] p-[0.625rem] flex flex-col gap-[1.75rem]">
              <ol className="body-b1-rg text-[var(--color-black)] list-decimal list-inside">
                <li>
                  옵션 1: {selectedOption} / 옵션 2: 선택 안 함
                </li>
              </ol>
              <div className="flex items-center justify-between">
                <OptionQuantity
                  quantity={quantity}
                  onIncrease={() => setQuantity(quantity + 1)}
                  onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                />
                <p className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                  {formatPrice((basePrice + optionPrice) * quantity)}원
                </p>
              </div>
            </div>
          )}

          {/* 총 결제 금액 및 액션 버튼 */}
          <div className="flex flex-col gap-[1.125rem]">
            <div className="flex items-end justify-between h-[3.375rem]">
              <span className="body-b1-rg text-[var(--color-gray-60)]">총 결제 금액</span>
              <p className="heading-h2-bd text-[2.5rem] text-[var(--color-mint-1)]">
                {formatPrice(totalPrice)}원
              </p>
            </div>
            <div className="flex flex-col gap-[0.625rem]">
              <div className="flex gap-[0.625rem]">
                <button className="flex-1 h-[4.625rem] bg-white border border-[var(--color-line-gray-40)] rounded-[0.625rem] flex items-center justify-center gap-[0.625rem]">
                  <img src={heartIcon} alt="찜하기" className="w-10 h-10" />
                  <span className="body-b0-bd text-[1.25rem]">찜하기</span>
                </button>
                <button className="flex-1 h-[4.625rem] bg-white border border-[var(--color-line-gray-40)] rounded-[0.625rem] flex items-center justify-center gap-[0.625rem]">
                  <img src={cartIcon} alt="장바구니" className="w-10 h-10" />
                  <span className="body-b0-bd text-[1.25rem]">장바구니</span>
                </button>
                <button className="flex-1 h-[4.625rem] bg-white border border-[var(--color-line-gray-40)] rounded-[0.625rem] flex items-center justify-center gap-[0.625rem]">
                  <img src={chatIcon} alt="문의하기" className="w-10 h-10" />
                  <span className="body-b0-bd text-[1.25rem]">문의하기</span>
                </button>
              </div>
              <button className="w-full h-[4.625rem] bg-[var(--color-mint-0)] rounded-[0.625rem] flex items-center justify-center">
                <span className="body-b1-sb text-[1.5rem] text-white">구매하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="top-0 z-20 border-b border-[var(--color-line-gray-40)]">
        <div className="flex px-[7.125rem] gap-[6.4375rem] body-b0-bd">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-5 pt-[0.625rem] ${
              activeTab === 'info'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            상품 정보
          </button>

          <button
            onClick={() => setActiveTab('reformer')}
            className={`pb-5 pt-[0.625rem]${
              activeTab === 'reformer'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            리폼러 정보
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-5 pt-[0.625rem] ${
              activeTab === 'review'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            상품 후기
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="px-[3.125rem] pt-[6.25rem]">
        {activeTab === 'info' && (
          <div>
            <ProductInfoToggle
              firstImage={mockProduct.descriptionImages[0]}
              additionalImages={mockProduct.descriptionImages.slice(1)}
            />
          </div>
        )}

        {activeTab === 'reformer' && (
          <div className="flex gap-[3.3125rem] items-start">
            <img
              src={mockProduct.seller.profileImage}
              alt={mockProduct.seller.name}
              className="w-[8.4375rem] h-[8.4375rem] rounded-full object-cover"
            />
            <div className="flex-1 flex flex-col gap-[2.625rem]">
              <div className="flex flex-col gap-[0.75rem]">
                <h2 className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                  {mockProduct.seller.name}
                </h2>
                <div className="flex items-center gap-[0.625rem]">
                  <div className="flex gap-[0.375rem]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={starIcon}
                        alt="star"
                        className="w-[1.4375rem] h-[1.4375rem]"
                      />
                    ))}
                  </div>
                  <span className="body-b1-sb text-[var(--color-black)]">
                    {mockProduct.seller.rating}
                  </span>
                </div>
              </div>
              <div className="flex gap-0">
                <div className="flex-1 border-t border-b border-[var(--color-line-gray-40)] py-[1.125rem] flex flex-col items-center gap-[0.5rem]">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">주문 건수</span>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    {mockProduct.seller.orderCount}건
                  </span>
                </div>
                <div className="flex-1 border-t border-b border-[var(--color-line-gray-40)] py-[1.125rem] flex flex-col items-center gap-[0.5rem]">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">후기</span>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    {mockProduct.seller.reviewCount}개
                  </span>
                </div>
              </div>
              <button className="w-full h-[4.625rem] border border-[var(--color-mint-1)] rounded-[0.625rem] flex items-center justify-center">
                <span className="body-b0-bd text-[1.25rem] text-[var(--color-mint-1)]">
                  피드 보러가기
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="flex flex-col gap-[2.5rem]">
            {/* 후기 헤더 */}
            <div className="flex flex-col gap-[1.4375rem]">
              <div className="flex flex-col gap-[1.4375rem]">
                <h2 className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                  상품 후기 ({mockProduct.reviewCount})
                </h2>
                <div className="flex items-center gap-[1rem]">
                  <div className="flex gap-[0.5625rem]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={starIcon}
                        alt="star"
                        className="w-[2.0625rem] h-[2.0625rem]"
                      />
                    ))}
                  </div>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    {mockProduct.rating}
                  </span>
                </div>
              </div>
              {/* 사진 후기 */}
              <div className="border-b border-[var(--color-line-gray-40)] pb-[2.6875rem]">
                <h3 className="body-b0-bd text-[1.25rem] text-[var(--color-black)] mb-[0.75rem]">
                  사진 후기 (182)
                </h3>
                <div className="flex gap-[0.3125rem]">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className="w-[10.625rem] h-[10.625rem] rounded-[0.625rem] overflow-hidden relative"
                    >
                      {i === 6 ? (
                        <>
                          <img
                            src="/Home/images/p1.jpg"
                            alt={`후기 이미지 ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                            <span className="heading-h4-bd text-[1.875rem]">+ 175</span>
                            <span className="body-b0-bd text-[1.25rem]">더보기</span>
                          </div>
                        </>
                      ) : (
                        <img
                          src="/Home/images/p1.jpg"
                          alt={`후기 이미지 ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 리뷰 필터 */}
            <ReviewFilter />

            {/* 리뷰 목록 */}
            <div className="flex flex-col">
              {[1, 2, 3, 4, 5].map((review) => (
                <div
                  key={review}
                  className="border-b border-[var(--color-gray-30)] py-[2.5rem]"
                >
                  <Review />
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center">
              <PageNumber />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
