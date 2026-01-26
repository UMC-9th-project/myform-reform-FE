import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageCarousel } from '../../components/common/product/Image';
import OptionDropdown from '../../components/common/product/option/option-dropdown/OptionDropdown';  
import OptionQuantity from '../../components/common/product/option/option-quantity-button/OptionQuantity';  
import ProductInfoToggle from '../../components/common/product/detail/ProductInfoToggle';
import Review from '../../components/common/product/detail/review/Review';  
import ReviewFilter from '../../components/common/product/detail/review/ReviewFilter';    
import PageNumber from '../../components/common/product/PageNumber';  
import starIcon from '../../assets/icons/star.svg';
import heartIcon from '../../assets/icons/heart.svg';
import cartIcon from '../../assets/icons/shoppingCart.svg';
import chatIcon from '../../assets/icons/chat.svg';
import profileImage from '../../components/domain/market/images/profile.png';
import shareIcon from '../../assets/icons/share.svg';
import type { OptionItem } from '../../components/common/product/option/option-dropdown/OptionItem';  


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

const MarketProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<'info' | 'reformer' | 'review'>('info');
  
  const infoRef = useRef<HTMLDivElement>(null);
  const reformerRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const basePrice = mockProduct.price;
  const optionPrice = selectedOption
    ? mockProduct.options.find((opt) => opt.label === selectedOption)?.price || 0
    : 0;
  const totalPrice = (basePrice + optionPrice) * quantity;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const scrollToSection = (section: 'info' | 'reformer' | 'review') => {
    const refs = {
      info: infoRef,
      reformer: reformerRef,
      review: reviewRef,
    };
    
    const targetRef = refs[section];
    if (targetRef.current) {
      const offset = 100; 
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(section);
    }
  };

 
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; 

      if (reviewRef.current && reformerRef.current && infoRef.current) {
        const reviewTop = reviewRef.current.offsetTop;
        const reformerTop = reformerRef.current.offsetTop;
        const infoTop = infoRef.current.offsetTop;

        if (scrollPosition >= reviewTop - 100) {
          setActiveSection('review');
        } else if (scrollPosition >= reformerTop - 100) {
          setActiveSection('reformer');
        } else if (scrollPosition >= infoTop - 100) {
          setActiveSection('info');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className=" min-h-screen  mt-[2.75rem]">
    
      
      <div className="flex mx-[7.125rem] gap-[2.9375rem] mb-[2.75rem]">
        
        <div className="w-150 h-[630px]">
          <div className="h-[600px] ">   
           <ImageCarousel images={mockProduct.images} isClosed={false} />
          </div>  
        </div>

       
        <div className="flex-1 flex flex-col">
          
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

       
          <div className="flex flex-col mt-[0.5625rem]">
            <h1 className="heading-h5-md">
              {mockProduct.title}
            </h1>
            <p className="heading-h2-bd mt-[1.125rem]">
              {formatPrice(mockProduct.price)}원
            </p>
          </div>

          
          <div className="flex items-center gap-[0.3125rem] mt-[1.4375rem] mb-[0.8125rem] border-b border-[var(--color-line-gray-40)] pb-[0.8125rem]">
            <img src={starIcon} alt="star" className="w-[1.75rem] h-[1.75rem]" />
            <span className="body-b1-sb">
              {mockProduct.rating}
            </span>
            <span className="body-b5-rg text-[var(--color-gray-50)]">
              (최근 3개월 {mockProduct.recentRating})
            </span>
          </div>
          

         
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

       
          <div className='mt-[1.875rem]'>
            <OptionDropdown
              options={mockProduct.options}
              onSelect={(optionLabel) => setSelectedOption(optionLabel)}
              selectedOptionLabel={selectedOption}
            />
          </div>

         
          {selectedOption && (
            <div className="bg-[var(--color-gray-20)] p-[0.625rem] flex flex-col gap-[1.75rem] mt-[2.25rem]">
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
                <p className="body-b0-bd px-[0.625rem]">
                  {formatPrice((basePrice + optionPrice) * quantity)}원
                </p>
              </div>
            </div>
          )}

          
          <div className="flex flex-col gap-[1.125rem] mt-[2.25rem]">
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
              <button 
                onClick={() => {
                  const selectedOptionData = selectedOption
                    ? mockProduct.options.find((opt) => opt.label === selectedOption)
                    : null;
                  
                  navigate(`/market/product/${id}/purchase`, {
                    state: {
                      product: {
                        id: mockProduct.id,
                        title: mockProduct.title,
                        seller: mockProduct.seller.name,
                        image: mockProduct.images[0],
                        option: selectedOptionData
                          ? `${selectedOptionData.label}${selectedOptionData.price > 0 ? ` (+${selectedOptionData.price.toLocaleString()}원)` : ' (+0원)'}`
                          : '옵션 없음',
                        shipping: mockProduct.shipping.fee,
                        quantity: quantity,
                        price: mockProduct.price,
                        optionPrice: selectedOptionData?.price || 0,
                      },
                    },
                  });
                }}
                className="w-full h-[4.625rem] bg-[var(--color-mint-0)] rounded-[0.625rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="body-b1-sb text-[1.5rem] text-white">구매하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

     
      <div className="top-0 z-20 bg-white border-b border-[var(--color-line-gray-40)]">
        <div className="flex px-[7.125rem] gap-[6.4375rem] body-b0-bd">
          <button
            onClick={() => scrollToSection('info')}
            className={`pb-5 pt-[0.625rem] cursor-pointer ${
              activeSection === 'info'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            상품 정보
          </button>

          <button
            onClick={() => scrollToSection('reformer')}
            className={`pb-5 pt-[0.625rem] cursor-pointer ${
              activeSection === 'reformer'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            리폼러 정보
          </button>
          <button
            onClick={() => scrollToSection('review')}
            className={`pb-5 pt-[0.625rem] cursor-pointer ${
              activeSection === 'review'
                ? 'text-[var(--color-mint-1)] border-b-2 border-[var(--color-mint-1)]'
                : 'text-[var(--color-gray-60)]'
            }`}
          >
            상품 후기
          </button>
        </div>
      </div>

     
      <div className=" mx-[7.125rem] pt-[6.25rem]">
     
        <div ref={infoRef} id="product-info" className="scroll-mt-[100px]">
          <ProductInfoToggle
            firstImage={mockProduct.descriptionImages[0]}
            additionalImages={mockProduct.descriptionImages.slice(1)}
          />
        </div>

       
        <div ref={reformerRef} id="reformer-info" className="scroll-mt-[100px] mx-[7.125rem] pt-[6.25rem]">
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
        </div>

       
        <div ref={reviewRef} id="review" className="scroll-mt-[100px] pt-[6.25rem] mb-[7.4375rem]">
          <div className="flex flex-col gap-[2.5rem]">
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

            <ReviewFilter />

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

            <div className="flex justify-center">
              <PageNumber />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketProductDetailPage;
