import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/domain/purchase/Input';
import Button2 from '../../components/common/Button/button2';

const mockProduct = {
  id: 1,
  title: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  seller: '침착한 대머리독수리',
  image: '/Home/images/p1.jpg',
  option: '옵션 샘플 테스트 1번 (+10,000원)',
  shipping: '무료 배송',
  quantity: 1,
  price: 75000,
  optionPrice: 10000,
};

const MarketPurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const product = location.state?.product || mockProduct;
  
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  
  const productPrice = product.price;
  const optionPrice = product.optionPrice || 0;
  const shippingFee = 0; 
  const totalPrice = (productPrice + optionPrice) * product.quantity;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const handlePayment = () => {
    // 주문번호 생성 (실제로는 서버에서 받아와야 함)
    const orderNumber = Date.now().toString().padStart(11, '0');
    
    // 주문 정보 구성
    const orderData = {
      orderNumber,
      deliveryInfo: {
        name: '학교',
        recipient: '홍길동',
        phone: '010-0000-0000',
        address: '(04310) 서울 용산구 청파구47길 100 명신관 302호',
      },
      product: {
        image: product.image,
        title: product.title,
        option: product.option || '옵션 없음',
        seller: product.seller,
        additionalItems: 3, // 임시 값
      },
      payment: {
        totalAmount: totalPrice,
        productAmount: productPrice + optionPrice,
        shippingFee: shippingFee,
        method: '카드 간편결제',
        bank: '신한은행',
        cardNumber: '0000-****-****-0000',
        approvedAt: (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hour = String(now.getHours()).padStart(2, '0');
          const minute = String(now.getMinutes()).padStart(2, '0');
          return `${year}.${month}.${day} ${hour}.${minute}`;
        })(),
      },
    };

    // 결제 완료 페이지로 이동
    navigate(`/market/product/${id}/purchase/complete`, {
      state: { order: orderData },
    });
  };

  return (
    <div className="bg-white min-h-screen pb-[7.4375rem]">
      <div className="flex flex-col items-center gap-[2.1875rem] w-full">
       
        <div className="w-[76.25rem] border-b border-black pb-[1.375rem] pt-[0.625rem]">
          <h1 className="heading-h2-bd text-[2.5rem] text-black">구매하기</h1>
        </div>

       
        <div className="flex gap-[2.5625rem] items-start w-[76.25rem]">
          
          <div className="flex flex-col gap-[1.75rem] w-[47.25rem]">
            <h2 className="heading-h4-bd text-[1.875rem] text-black">배송 정보</h2>
            
           
            <div className="border-b border-[var(--color-line-gray-40)] pb-[4.125rem] relative">
             
              <div className="flex border-b border-[var(--color-line-gray-40)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('existing')}
                  className={`px-[5rem] py-3 body-b0-sb w-[16.0625rem] cursor-pointer ${
                    activeTab === 'existing'
                      ? 'bg-[var(--color-black)] text-[var(--color-white)]'
                      : 'bg-[var(--color-white)] text-[var(--color-gray-50)] border border-[var(--color-line-gray-40)] border-b-0'
                  }`}
                >
                  기존 배송지
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className={`px-[5rem] py-3 body-b0-sb w-[16.0625rem] cursor-pointer ${
                    activeTab === 'new'
                      ? 'bg-[var(--color-black)] text-[var(--color-white)]'
                      : 'bg-[var(--color-white)] text-[var(--color-gray-50)] border border-[var(--color-line-gray-40)] border-b-0'
                  }`}
                >
                  신규 배송지
                </button>
              </div>

             
              <div className="flex flex-col gap-[1.875rem] mt-[2.875rem]">
                
                <div className="flex gap-[2rem] items-center">
                  <label className="body-b1-sb text-[var(--color-gray-60)] w-[4.1875rem]">
                    배송지명
                  </label>
                  <div className="w-[29.625rem]">
                    <Input value="학교" readOnly />
                  </div>
                </div>

                {/* 수령인 */}
                <div className="flex gap-[2rem] items-center">
                  <label className="body-b1-sb text-[var(--color-gray-60)] w-[4.1875rem]">
                    <span>수령인</span>
                    <span className="text-[var(--color-red-1)]"> *</span>
                  </label>
                  <div className="w-[29.625rem]">
                    <Input value="홍길동" readOnly />
                  </div>
                </div>

              
                <div className="flex gap-[2rem] items-start">
                  <label className="body-b1-sb text-[var(--color-gray-60)] w-[4.1875rem] pt-[0.8125rem]">
                    <span>배송지</span>
                    <span className="text-[var(--color-red-1)]"> *</span>
                  </label>
                  <div className="flex flex-col gap-[0.9375rem] w-[41.0625rem]">
                   
                    <div className="flex gap-[0.9375rem] items-start">
                      <div className="w-[29.625rem]">
                        <Input value="04310" readOnly />
                      </div>
                      <Button2 className="w-[10.5rem] h-[3.375rem]">
                        우편번호 검색
                      </Button2>
                    </div>
                   
                    <div className="w-[29.625rem]">
                    <Input value="서울 용산구 청파로47길 100" readOnly />
                    </div>
                   
                    <div className="w-[29.625rem]">
                    <Input value="명신관 302호" readOnly />
                    </div>
                  </div>
                </div>

                
                <div className="flex gap-[2rem] items-center">
                  <label className="body-b1-sb text-[var(--color-gray-60)] w-[4.1875rem]">
                    <span>연락처</span>
                    <span className="text-[var(--color-red-1)]"> *</span>
                  </label>
                  <div className="flex items-center gap-[1.3125rem]">
                    <div className="w-[7.8125rem]">
                      <Input value="010" readOnly />
                    </div>
                    <span className="body-b0-rg text-black">-</span>
                    <div className="w-[7.8125rem]">
                      <Input value="0000" readOnly />
                    </div>
                    <span className="body-b0-rg text-black">-</span>
                    <div className="w-[7.8125rem]">
                      <Input value="0000" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주문 정보 */}
            <div className="border-b border-[var(--color-line-gray-40)] pb-[4.125rem]">
              <h2 className="heading-h4-bd text-[1.875rem] text-black mb-[1.125rem]">
                주문 정보
              </h2>
              
              <div className="bg-white flex flex-col gap-[0.625rem] px-[1.375rem] py-4">
                <p className="body-b1-rg text-[var(--color-gray-60)]">
                  {product.seller}
                </p>
                
                <div className="flex flex-col items-end">
                  <div className="flex gap-[1.1875rem] items-start w-full">
                   
                    <div className="w-[11.5625rem] h-[11.5625rem] relative shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    
                    <div className="flex flex-[1_0_0] flex-col gap-[1.1875rem] items-start">
                      <div className="flex flex-col gap-[0.625rem] items-center justify-center w-full">
                        <p className="body-b0-md text-[1.25rem] text-black w-full">
                          {product.title}
                        </p>
                        <p className="body-b1-rg text-[var(--color-gray-50)] w-full">
                          {product.option}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between w-full">
                        <div className="flex gap-[1.25rem] items-center body-b1-rg text-[var(--color-gray-60)]">
                          <span className="body-b1-sb">배송비</span>
                          <span className="body-b1-rg">{product.shipping}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="body-b0-bd text-[1.25rem] text-black mt-[1.1875rem]">
                    {product.quantity}개 / {formatPrice(totalPrice)}원
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex flex-col gap-[1.4375rem] items-start pt-[4.375rem] sticky top-0 w-[26.4375rem]">
            <div className="bg-white border border-[var(--color-line-gray-40)] flex flex-col gap-[1.6875rem] items-start px-[2.375rem] py-[2.3125rem] rounded-[0.625rem] w-full">
              <h3 className="heading-h5-sb text-[1.5rem] text-black w-full">
                결제 금액
              </h3>
              
              <div className="border-b border-[var(--color-line-gray-40)] flex flex-col gap-[0.5625rem] items-start pb-[2.0625rem] body-b0-sb text-[var(--color-gray-50)] text-[1.25rem] w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="body-b0-sb">상품 금액</p>
                  <p className="body-b0-sb text-right">
                    {formatPrice(productPrice + optionPrice)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="body-b0-sb">배송비</p>
                  <p className="body-b0-sb text-right">
                    {formatPrice(shippingFee)}원
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full">
                <p className="body-b0-sb text-[var(--color-gray-50)] text-[1.25rem]">
                  결제 예정 금액
                </p>
                <p className="heading-h4-bd text-[var(--color-mint-1)] text-[1.875rem] text-right">
                  {formatPrice(totalPrice)}원
                </p>
              </div>
            </div>
            
            <button 
              onClick={handlePayment}
              className="bg-[var(--color-mint-0)] flex gap-[0.625rem] h-[4.625rem] items-center justify-center px-[1.875rem] py-[0.625rem] rounded-[0.625rem] w-full cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="body-b0-sb text-[1.5rem] text-white">
                결제하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPurchasePage;
