import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import xIcon from '../../assets/icons/x.svg';
import { ImageCarousel } from '../../components/common/product/Image';
import OptionQuantity from '../../components/common/product/option/option-quantity-button/OptionQuantity';  
import ProductInfoToggle from '../../components/common/product/detail/ProductInfoToggle';
import Review from '../../components/common/product/detail/review/Review';  
import ReviewFilter from '../../components/common/product/detail/review/ReviewFilter';    
import PageNumber from '../../components/common/product/PageNumber';  
import starIcon from '../../assets/icons/star.svg';
import Button from '../../components/common/button/Button1';
import LikeButton from '../../components/common/likebutton/LikeButton';
import cartIcon from '../../assets/icons/shoppingCart.svg';
import chatIcon from '../../assets/icons/chat.svg';
import shareIcon from '../../assets/icons/share.svg';
import { useMarketProductDetail } from '../../hooks/domain/market/useMarketProductList';
import OptionDropdown from '../../components/common/product/option/option-dropdown/OptionDropdown';
import type { OptionItem as OptionItemType } from '../../components/common/product/option/option-dropdown/OptionItem';
import { useWish } from '../../hooks/domain/wishlist/useWish';
import { getWishList } from '../../api/wishlist';
import useAuthStore from '../../stores/useAuthStore';  

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};




const MarketProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productDetailResponse } = useMarketProductDetail(id);
  
  const accessToken = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<'info' | 'reformer' | 'review'>('info');
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  
  const infoRef = useRef<HTMLDivElement>(null);
  const reformerRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const { toggleWish } = useWish();
  const { data: wishData } = useQuery({
    queryKey: ['wishlist', 'ITEM', accessToken],
    queryFn: () => getWishList('ITEM'),
    enabled: !!accessToken && !!id && !isReformer,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('URL이 복사되었습니다.');
    } catch {
      alert('URL 복사에 실패했어요.');
    }
  };

  const isWished = useMemo(() => {
    if (localLiked !== null) {
      return localLiked;
    }
    if (!wishData?.success?.list || !id) {
      return false;
    }
    return wishData.success.list.some((item) => item.itemId === id);
  }, [wishData, id, localLiked]);

  const handleWishClick = async () => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (isReformer) {
      return;
    }

    if (!id) {
      return;
    }

    try {
      await toggleWish('ITEM', id, !isWished);
      setLocalLiked(!isWished);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          navigate('/login/type');
        }
      }
    }
  };

  const scrollToSection = (section: 'info' | 'reformer' | 'review') => {
    setActiveSection(section);
    const refMap = {
      info: infoRef,
      reformer: reformerRef,
      review: reviewRef,
    };
    refMap[section]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // id가 변경될 때마다 상태 리셋
  useEffect(() => {
    if (id) {
      requestAnimationFrame(() => {
        setQuantity(1);
        setActiveSection('info');
        setSelectedOptions({});
        setLocalLiked(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const infoTop = infoRef.current?.offsetTop || 0;
      const reformerTop = reformerRef.current?.offsetTop || 0;
      const reviewTop = reviewRef.current?.offsetTop || 0;

      if (scrollY >= reviewTop - 200) {
        setActiveSection('review');
      } else if (scrollY >= reformerTop - 200) {
        setActiveSection('reformer');
      } else if (scrollY >= infoTop - 200) {
        setActiveSection('info');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!productDetailResponse?.success) {
    return null;
  }

  const product = productDetailResponse.success;
  
  const title = product.title;
  const price = product.price;
  const delivery = product.delivery;
  const deliveryInfo = product.delivery_info;
  const images = product.images || [];
  const thumbnail = images[0] || '';
  const additionalImages = images.slice(1);
  const optionGroups = product.option_groups || [];
  
  const star = 0;
  const review_count = 0;
  const owner_nickname = '';

  // 선택된 옵션들의 추가 가격 계산
  const optionPrice = optionGroups.reduce((total, group) => {
    const selectedOptionId = selectedOptions[group.option_group_id];
    if (selectedOptionId) {
      const selectedItem = group.option_items.find(item => item.option_item_id === selectedOptionId);
      if (selectedItem) {
        return total + selectedItem.extra_price;
      }
    }
    return total;
  }, 0);

  const basePrice = price;
  const totalPrice = (basePrice + optionPrice) * quantity + delivery;

  // 옵션 그룹별로 OptionDropdown에 전달할 옵션 배열 생성
  const getOptionsForGroup = (group: typeof optionGroups[0]): OptionItemType[] => {
    return group.option_items
      .filter(item => !item.is_sold_out) // 품절 제외
      .map(item => ({
        label: item.name, 
        price: item.extra_price,
      }));
  };

  const handleOptionSelect = (groupId: string, optionLabel: string) => {
    const group = optionGroups.find(g => g.option_group_id === groupId);
    if (!group) return;

    const selectedItem = group.option_items.find(item => item.name === optionLabel);
    if (selectedItem) {
      setSelectedOptions(prev => ({
        ...prev,
        [groupId]: selectedItem.option_item_id,
      }));
    }
  };

  return (
    <div className=" min-h-screen  mt-[2.75rem]">
    
      <div className="flex mx-[7.125rem] gap-[2.9375rem] mb-[2.75rem]">
        
        <div className="w-150 h-[630px]">
          <div className="h-[600px]">   
            <ImageCarousel images={images.length > 0 ? images : [thumbnail]} isClosed={false} />
          </div>  
        </div>

       
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.75rem]">
              <div className="w-[2.95725rem] h-[2.95725rem] rounded-full bg-[var(--color-gray-20)] flex items-center justify-center">
                <span className="body-b1-rg text-[var(--color-gray-60)]">
                  <img src={product.reformer.profile_image} alt="profile" className="w-full h-full object-cover rounded-full" />
                </span>
              </div>
              <span className="body-b1-rg text-[var(--color-gray-60)]">
                 {product.reformer.nickname}
              </span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center cursor-pointer" onClick={handleShare}>
              <img src={shareIcon} alt="공유" />
            </button>
          </div>

          <div className="flex flex-col mt-[0.5625rem]">
            <h1 className="heading-h5-md">
              {title}
            </h1>
            <p className="heading-h2-bd mt-[1.125rem]">
              {formatPrice(price)}원
            </p>
          </div>

          <div className="flex items-center gap-[0.3125rem] mt-[1.4375rem] mb-[0.8125rem] border-b border-[var(--color-line-gray-40)] pb-[0.8125rem]">
            <img src={starIcon} alt="star" className="w-[1.75rem] h-[1.75rem]" />
            <span className="body-b1-sb">
              {product.reformer.star}
            </span>
            <span className="body-b5-rg text-[var(--color-gray-50)]">
              (최근 3개월 {product.reformer.star_recent_3m.toFixed(2)})
            </span>
          </div>

          <div className="my-[1.25rem] flex flex-col gap-[0.8125rem] text-[var(--color-gray-60)]">
            <div className="flex gap-[2.8125rem]">
              <span className="body-b1-sb">배송비</span>
              <span className="body-b1-rg">
                {delivery === 0 ? '무료배송' : `${formatPrice(delivery)}원`}
              </span>
            </div>
            <div className="flex gap-[1.5rem]">
              <span className="body-b1-sb">배송 정보</span>
              <span className="body-b1-rg">
                {deliveryInfo || '일반배송'}
              </span>
            </div>
          </div>

          {/* 옵션 그룹 렌더링 */}
          {optionGroups.length > 0 && (
            <div className='mt-[1.875rem] flex flex-col gap-[0.625rem]'>
              {optionGroups.map((group) => (
                <div key={group.option_group_id}>
                  <OptionDropdown
                    options={getOptionsForGroup(group)}
                    onSelect={(optionLabel) => handleOptionSelect(group.option_group_id, optionLabel)}
                    selectedOptionLabel={(() => {
                      const selectedOptionId = selectedOptions[group.option_group_id];
                      if (selectedOptionId) {
                        const selectedItem = group.option_items.find(item => item.option_item_id === selectedOptionId);
                        return selectedItem?.name || null;
                      }
                      return null;
                    })()}
                  />
                </div>
              ))}
            </div>
          )}

         
          {/* 선택된 옵션이 있을 때만 표시 */}
          {Object.keys(selectedOptions).length > 0 && (
            <div className="bg-[var(--color-gray-20)] p-[0.625rem] flex flex-col gap-[1.75rem] mt-[2.25rem]">
              <div className=' flex items-center justify-between gap-[0.5rem]'>
                <span className="body-b1-rg px-[0.625rem] flex items-center justify-between w-full">
                  {product.option_groups
                    .map((group) => {
                      const selectedOptionId = selectedOptions[group.option_group_id];
                      if (selectedOptionId) {
                        const selectedItem = group.option_items.find(
                          (item) => item.option_item_id === selectedOptionId
                        );
                        return selectedItem ? selectedItem.name : '';
                      }
                      return '';
                    })
                    .filter(Boolean)
                    .join(', ')}                  
                      <img src={xIcon} alt="x" className="w-10 h-10 cursor-pointer" onClick={() => setSelectedOptions({})} 
                      />
                 
                </span>
              </div>

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
                <Button
                  variant="white"
                  onClick={handleWishClick}
                  disabled={isReformer}
                  className="flex items-center justify-center gap-2 flex-1 h-[4.625rem]"
                >
                  <LikeButton
                    initialLiked={isWished}
                    variant="blackLine"
                    readOnly={true}
                    className="!w-6 !h-6"
                  />
                  <span className="body-b0-bd text-[1.25rem]">찜하기</span>
                </Button>
                <Button
                  variant="white"
                  onClick={() => {
                    navigate(`/market/product/${id}/cart`);
                  }}
                  className="flex items-center justify-center gap-2 flex-1 h-[4.625rem]"
                >
                  <img src={cartIcon} alt="장바구니" className="w-10 h-10" />
                  <span className="body-b0-bd text-[1.25rem]">장바구니</span>
                </Button>
                 
               <Button
                  variant="white"
                  onClick={() => {
                    navigate(`/market/product/${id}/chat`);
                  }}
                  className="flex items-center justify-center gap-2 flex-1 h-[4.625rem]"
                >
                  <img src={chatIcon} alt="채팅" className="w-10 h-10" />
                  <span className="body-b0-bd text-[1.25rem]">문의하기</span>
                </Button>
                  
               
              </div>

              <button 
                onClick={() => {
                  const allOptionsSelected = optionGroups.every(group => 
                    selectedOptions[group.option_group_id]
                  );

                  if (optionGroups.length > 0 && !allOptionsSelected) {
                    alert('모든 옵션을 선택해주세요.');
                    return;
                  }

                  const selectedOptionsText = optionGroups
                    .map(group => {
                      const selectedOptionId = selectedOptions[group.option_group_id];
                      if (selectedOptionId) {
                        const selectedItem = group.option_items.find(item => item.option_item_id === selectedOptionId);
                        return selectedItem ? `${group.name}: ${selectedItem.name}` : '';
                      }
                      return '';
                    })
                    .filter(Boolean)
                    .join(', ') || '옵션 없음';

                  navigate(`/market/product/${id}/purchase`, {
                    state: {
                      product: {
                        id: product.item_id,
                        title: title,
                        seller: owner_nickname,
                        image: thumbnail,
                        option: selectedOptionsText,
                        shipping: delivery === 0 ? '무료배송' : `${formatPrice(delivery)}원`,
                        quantity: quantity,
                        price: price,
                        optionPrice: optionPrice,
                        delivery: delivery,
                        selectedOptions: selectedOptions,
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
            firstImage={thumbnail}
            additionalImages={additionalImages}
          />
        </div>

        <div ref={reformerRef} id="reformer-info" className="scroll-mt-[100px] mx-[7.125rem] pt-[6.25rem]">
          <div className="flex gap-[3.3125rem] items-start">
            <div className="w-[8.4375rem] h-[8.4375rem] rounded-full bg-[var(--color-gray-20)] flex items-center justify-center">             
                 <img src={product.reformer.profile_image} alt="profile" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-[2.625rem]">
              <div className="flex flex-col gap-[0.75rem]">
                <h2 className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                  {product.reformer.nickname}
                </h2>
                <div className="flex items-center gap-[0.625rem]">
                  <div className="flex gap-[0.375rem]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <img
                        key={s}
                        src={starIcon}
                        alt="star"
                        className="w-[1.4375rem] h-[1.4375rem]"
                      />
                    ))}
                  </div>
                  <span className="body-b1-sb text-[var(--color-black)]">
                    {product.reformer.star}
                  </span>
                </div>
              </div>
              <div className="flex gap-0">
                <div className="flex-1 border-t border-b border-[var(--color-line-gray-40)] py-[1.125rem] flex flex-col items-center gap-[0.5rem]">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">주문 건수</span>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    -건
                  </span>
                </div>
                <div className="flex-1 border-t border-b border-[var(--color-line-gray-40)] py-[1.125rem] flex flex-col items-center gap-[0.5rem]">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">후기</span>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    {review_count}개
                  </span>
                </div>
               
              </div>
              <div className="flex-1 flex flex-col gap-[0.5rem]">
                  <ol className="flex flex-col gap-[0.5rem]">
                    <li className="body-b1-rg text-[var(--color-gray-60)]">
                      - {product.content} 
                    </li>
                  </ol>
                  
                  </div>
              <button                
                className="w-full h-[4.625rem] border border-[var(--color-mint-1)] rounded-[0.625rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/profile/${product.reformer.owner_id}`)}
              >
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
                  상품 후기 ({review_count})
                </h2>
                <div className="flex items-center gap-[1rem]">
                  <div className="flex gap-[0.5625rem]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <img
                        key={s}
                        src={starIcon}
                        alt="star"
                        className="w-[2.0625rem] h-[2.0625rem]"
                      />
                    ))}
                  </div>
                  <span className="heading-h4-bd text-[1.875rem] text-[var(--color-black)]">
                    {star}
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
