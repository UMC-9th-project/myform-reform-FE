import { useNavigate, useLocation } from 'react-router-dom';
import rightIcon from '../../assets/icons/right.svg';

const MarketPurchaseCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.order || {
    orderNumber: '00000000000',
    deliveryInfo: {
      name: '학교',
      recipient: '홍길동',
      phone: '010-0000-0000',
      address: '(04310) 서울 용산구 청파구47길 100 명신관 302호',
    },
    product: {
      image: '/Home/images/p1.jpg',
      title: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      option: '옵션 샘플 테스트 1번',
      seller: '침착한 대머리독수리',
      additionalItems: 3,
    },
    payment: {
      totalAmount: 85000,
      productAmount: 85000,
      shippingFee: 0,
      method: '카드 간편결제',
      bank: '신한은행',
      cardNumber: '0000-****-****-0000',
      approvedAt: '2026.01.01 12.12',
    },
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="bg-white min-h-screen pb-[7.4375rem]">
      <div className="flex flex-col items-center gap-[6.25rem] w-full">
       
        <div className="w-[76.25rem] border-b border-black pb-[1.375rem] pt-[0.625rem]">
          <h1 className="heading-h2-bd text-[2.5rem] text-black">주문/결제</h1>
        </div>

      
        <div className="flex gap-[2.5625rem] items-start w-[76.25rem]">
          
          <div className="flex flex-[1_0_0] pl-[3.125rem] flex-col gap-[4.375rem] items-start">
         
            <div className="flex flex-col gap-[4.375rem] items-start">
              <p className="heading-h2-bd text-[2.5rem]">
                <span className="text-[var(--color-mint-1)]">주문이 정상적으로 완료</span>
                <span className="text-black">되었습니다.</span>
              </p>

             
              <div className="flex flex-col gap-[1.75rem] items-start w-[43.75rem]">
                
                <div className="flex items-start ">
                  <div className="w-[12.5rem]">
                    <p className="body-b0-md ">주문번호</p>
                  </div>
                  <p className="body-b0-bd">
                    {orderData.orderNumber}
                  </p>
                </div>

              
                <div className="flex items-start">
                  <div className="w-[12.5rem]">
                    <p className="body-b0-md ">배송지 정보</p>
                  </div>
                  <div className="flex flex-col gap-0  text-[var(--color-gray-60)]">
                    <p className="body-b1-rg">{orderData.deliveryInfo.name}</p>
                    <p className="body-b1-rg">
                      {orderData.deliveryInfo.recipient} / {orderData.deliveryInfo.phone}
                    </p>
                    <p className="body-b1-rg">{orderData.deliveryInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="flex flex-col items-start sticky top-0 w-[26.4375rem]">
            <div className="bg-white border border-[var(--color-line-gray-40)] flex flex-col gap-[1.6875rem] items-start px-[2.375rem] py-[2.3125rem] rounded-[0.625rem] w-full">
          
              <div className="flex flex-col items-end w-full">
                <div className="border-b border-[var(--color-line-gray-40)] flex flex-col gap-[0.625rem] items-end pb-[0.625rem] w-full">
                  <div className="flex gap-[1.1875rem] items-start w-full">
                   
                    <div className="w-[5.875rem] h-[5.875rem] relative shrink-0">
                      <img
                        src={orderData.product.image}
                        alt={orderData.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                
                    <div className="flex flex-[1_0_0] flex-col gap-[0.625rem] items-start">
                      <div className="flex flex-col gap-[0.625rem] items-start justify-center w-full">
                        <p className="body-b0-md text-[1.25rem] text-black line-clamp-2">
                          {orderData.product.title}
                        </p>
                        <p className="body-b1-rg text-[var(--color-gray-50)] text-[1.125rem]">
                          {orderData.product.option}
                        </p>
                      </div>
                      <p className="body-b1-rg text-[var(--color-gray-60)] text-[1.125rem]">
                        {orderData.product.seller}
                      </p>
                    </div>
                  </div>
                  <p className="body-b1-rg text-[var(--color-gray-50)] text-[1.125rem]">
                    외 {orderData.product.additionalItems}건
                  </p>
                </div>

                
                <div className="border-b border-[var(--color-line-gray-40)] flex flex-col gap-[0.5rem] items-start py-[1.25rem] w-full">
                  <div className="flex items-start justify-between w-full">
                    <p className="body-b0-md text-[1.25rem] text-black">결제 금액</p>
                    <p className="body-b0-bd text-[1.25rem] text-[var(--color-mint-1)]">
                      {formatPrice(orderData.payment.totalAmount)}원
                    </p>
                  </div>
                  <div className="flex body-b0-md items-start justify-between text-[var(--color-gray-50)] text-[1.25rem] w-full">
                    <p>상품 금액</p>
                    <p>{formatPrice(orderData.payment.productAmount)}원</p>
                  </div>
                  <div className="flex body-b0-md items-start justify-between text-[var(--color-gray-50)] text-[1.25rem] w-full">
                    <p>배송비</p>
                    <p>{formatPrice(orderData.payment.shippingFee)}원</p>
                  </div>
                </div>

             
                <div className="flex flex-col gap-[0.5rem] items-start py-[1.25rem] w-full">
                  <p className="body-b1-rg text-[var(--color-gray-50)] text-[1.125rem]">
                    {orderData.payment.method}
                  </p>
                  <p className="body-b1-rg text-[var(--color-gray-50)] text-[1.125rem]">
                    {orderData.payment.bank} / {orderData.payment.cardNumber}
                  </p>
                  <p className="body-b1-rg text-[var(--color-gray-50)] text-[1.125rem]">
                    승인일시 : {orderData.payment.approvedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <button
          onClick={() => navigate('/')}
          className="bg-[var(--color-mint-0)] flex gap-[0.625rem] h-[4.625rem] items-center justify-center px-[1.875rem] py-[0.625rem] rounded-[0.625rem] w-[26.4375rem] cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="body-b0-bd text-white">홈으로 돌아가기</span>
          <img
            src={rightIcon}
            alt=""
            className="w-10 h-10 pb-1"
            style={{
              filter: 'brightness(0) saturate(100%) invert(100%)',
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default MarketPurchaseCompletePage;
