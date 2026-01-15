import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/PageLayout';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import Button from '../../components/common/Button/button1';
import OptionQuantity from '../../components/domain/product/option/option-quantity-button/OptionQuantity';
import { useCart } from '../../hooks/useCart';
import type { CartProduct, CartSeller } from '../../types/cart';
import xIcon from '../../assets/icons/x.svg';
import truckIcon from '../../assets/icons/truck.svg';
import rightIcon from '../../assets/icons/right.svg';
import productImage from './e3.jpg';

const INITIAL_SELLERS: CartSeller[] = [
  {
    id: 0,
    name: '침착한 대머리독수리',
    shippingFee: 0,
    shippingText: '무료 배송',
  },
  {
    id: 1,
    name: '리폼장인 크크크',
    shippingFee: 3000,
    shippingText: '3,000원',
  },
];

const INITIAL_PRODUCTS: CartProduct[] = [
  {
    id: 0,
    sellerId: 0,
    price: 85000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
  {
    id: 1,
    sellerId: 0,
    price: 35000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
  {
    id: 2,
    sellerId: 1,
    price: 100000,
    name: '[야구 유니폼 리폼] 내가 제일 좋아하는 선수의 유니폼이 짐색으로 재탄생된다 면? 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    option: '옵션 샘플 테스트 1번 (+10,000원)',
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const sellers = INITIAL_SELLERS;
  const initialProducts = INITIAL_PRODUCTS;

  const {
    products,
    sellers: cartSellers,
    quantities,
    sellerChecked,
    itemChecked,
    totalItems,
    checkedCount,
    isAllChecked,
    payment,
    handleAllCheck,
    handleItemCheck,
    handleSellerCheck,
    handleQuantityChange,
    deleteProduct,
    deleteSelected,
  } = useCart({
    initialProducts,
    sellers,
  });

  // 장바구니가 비어있을 때 빈 상태 표시
  if (products.length === 0) {
    return (
      <Layout
        showHeader={true}
        showNavbar={true}
        showFooter={true}
        footerVariant="light"
      >
        <div className="bg-[var(--color-gray-20)] pb-[119px]">
          <div className="px-[50px] pt-[30px]">
            <h1 className="pt-[10px] pb-[22px] heading-h4-bd">장바구니</h1>
          </div>
          <div className="min-h-[600px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-[30px]">
              <div className="flex flex-col items-center gap-[12px]">
                <p className="body-b0-sb text-[var(--color-gray-60)]">
                  장바구니에 담긴 상품이 없습니다.
                </p>
                <p className="body-b1-rg text-[var(--color-gray-50)]">
                  원하는 상품을 담아보세요!
                </p>
              </div>
              <Button
                variant="primary"
                className="!px-[40px] !py-[18px] body-b0-bd flex items-center gap-[8px]"
                onClick={() => navigate('/*추후 라우팅 추가*/')}
              >
                마켓 둘러보기
                <img
                  src={rightIcon}
                  alt=""
                  className="w-10 h-10 pb-1"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(100%)',
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showHeader={true}
      showNavbar={true}
      showFooter={true}
      footerVariant="light"
    >
      <div className="bg-[var(--color-gray-20)] pb-[119px]">
        <div className="px-[50px] pt-[30px]">
          <h1 className="pt-[10px] pb-[22px] heading-h4-bd">장바구니</h1>
        </div>

        <div className="px-[50px] flex gap-[20px] flex-row">
          <div className="flex-1 h-[910px] pt-[18px] flex flex-col gap-[12px]">
            {/* 선택 바 영역 */}
            <div className=" h-[40px] flex items-center justify-between">
              {/* 체크박스쪽 */}
              <div className=" pt-[18px] pb-[12px] h-[40px] flex items-center gap-[11px]">
                <div className="py-[2px]">
                  <Checkbox checked={isAllChecked} onChange={handleAllCheck} />
                </div>
                <h1 className="my-[5px] body-b0-rg">
                  전체 선택 ({checkedCount}/{totalItems})
                </h1>
              </div>

              <div>
                <Button
                  variant="white"
                  className="!w-[113px] !h-[40px] px-0  py-0 body-b0-rg !text-[var(--color-gray-50)] whitespace-nowrap"
                  onClick={deleteSelected}
                >
                  선택 삭제
                </Button>
              </div>
            </div>

            {/* 박스 영역 */}
            <div className=" flex flex-col gap-[21px]">
              {cartSellers.map((seller: CartSeller) => {
                const sellerProducts = products.filter(
                  (p: CartProduct) => p.sellerId === seller.id
                );
                if (sellerProducts.length === 0) return null;

                const sellerIndex = cartSellers.findIndex(
                  (s: CartSeller) => s.id === seller.id
                );

                return (
                  <div
                    key={seller.id}
                    className="bg-[var(--color-white)] rounded-[10px] border border-[var(--color-line-gray-40)] flex flex-col"
                  >
                    {/* 판매자 헤더 */}
                    <div className="px-[31px] pt-[23px] pb-[18px] flex items-center justify-between border-b border-[var(--color-line-gray-40)]">
                      <div className="flex items-center gap-[11px]">
                        <Checkbox
                          checked={sellerChecked[sellerIndex] || false}
                          onChange={(checked) =>
                            handleSellerCheck(seller.id, checked)
                          }
                        />
                        <span className="body-b0-sb">{seller.name}</span>
                        <img
                          src={rightIcon}
                          alt=""
                          className="pb-1 w-10 h-10"
                        />
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <img src={truckIcon} alt="배송" className="w-10 h-10" />
                        <span className="body-b0-md text-[var(--color-gray-50)]">
                          {seller.shippingText}
                        </span>
                      </div>
                    </div>
                    {/* 상품 아이템들 */}
                    {sellerProducts.map(
                      (product: CartProduct, productIndex: number) => {
                        const productIndexInAll = products.findIndex(
                          (p: CartProduct) => p.id === product.id
                        );
                        return (
                          <div
                            key={product.id}
                            className={`px-[31px] pt-[23px] pb-[30px] flex gap-[20px] items-start ${
                              productIndex > 0
                                ? 'border-t border-[var(--color-line-gray-40)]'
                                : ''
                            }`}
                          >
                            <div className="pt-[2px]">
                              <Checkbox
                                checked={
                                  itemChecked[productIndexInAll] || false
                                }
                                onChange={(checked) =>
                                  handleItemCheck(productIndexInAll, checked)
                                }
                              />
                            </div>
                            <img
                              src={product.imageUrl || productImage}
                              alt="상품 이미지"
                              className="w-[150px] h-[150px]  object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex flex-col gap-[12px]">
                              <div className="flex items-start justify-between gap-[12px]">
                                <div className="body-b1-rg flex-1">
                                  {product.name}
                                </div>
                                <button
                                  className="cursor-pointer flex-shrink-0"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <img
                                    src={xIcon}
                                    alt="삭제"
                                    className="w-10 h-10"
                                    style={{
                                      filter:
                                        'brightness(0) saturate(100%) invert(40%) sepia(8%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(85%)',
                                    }}
                                  />
                                </button>
                              </div>
                              <div className="body-b1-rg text-[var(--color-gray-50)]">
                                {product.option}
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <OptionQuantity
                                  quantity={quantities[productIndexInAll] || 1}
                                  onIncrease={() =>
                                    handleQuantityChange(
                                      productIndexInAll,
                                      quantities[productIndexInAll] + 1
                                    )
                                  }
                                  onDecrease={() =>
                                    handleQuantityChange(
                                      productIndexInAll,
                                      quantities[productIndexInAll] - 1
                                    )
                                  }
                                />
                                <div className="body-b0-bd">
                                  {(
                                    product.price *
                                    (quantities[productIndexInAll] || 1)
                                  ).toLocaleString()}
                                  원
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* 옆에 결제 영역 */}
          <div className="gap-[23px] flex-shrink-0 w-[423px] h-[478px]  mt-[70px] flex flex-col">
            <div className="flex flex-col gap-[27px] px-[38px] py-[37px] bg-[var(--color-white)]  rounded-[10px] border border-[var(--color-line-gray-40)]">
              <div className="heading-h5-sb">결제금액</div>
              <div className="flex flex-col gap-[9px] pb-[33px] border-b border-[var(--color-line-gray-40)]">
                <div className="flex justify-between body-b0-sb text-[var(--color-gray-50)]">
                  <div>상품 금액</div>
                  <div>{payment.productTotal.toLocaleString()}원</div>
                </div>
                <div className="flex justify-between body-b0-sb text-[var(--color-gray-50)]">
                  <div>배송비</div>
                  <div>{payment.shippingTotal.toLocaleString()}원</div>
                </div>
              </div>
              <div className="items-center flex justify-between body-b0-sb text-[var(--color-gray-50)]">
                <div>결제 예정 금액</div>
                <div className="heading-h4-bd text-[var(--color-mint-1)]">
                  {payment.total.toLocaleString()}원
                </div>
              </div>
            </div>

            <Button variant="primary" className="!w-full !h-[60px] body-b0-bd">
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
