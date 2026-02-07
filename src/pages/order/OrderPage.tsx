import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import RequestCard from '../../components/common/card/RequestCard';
import ProposalCard from '../../components/common/card/ProposalCard';
import Button from '../../components/common/button/Button1';
import pencilIcon from '../../assets/icons/pencilLine.svg';
import { useOrderPage } from '../../hooks/domain/order/useOrderPage';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatBudgetRange(minBudget: number, maxBudget: number) {
  return `${formatWon(minBudget)}~${formatWon(maxBudget)}`;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const {
    recentRequests,
    proposals,
    isLoading,
    isError,
  } = useOrderPage();

  const handleRequestReform = () => {
    navigate('/order/requests/create');
  };

  

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-6 md:mb-8 pl-0 md:pl-[110px]">
          <Breadcrumb
            items={[
              { label: '홈', path: '/' },
              { label: '주문제작' },
            ]}
          />
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 md:mb-12 pl-0 md:pl-[110px] md:pr-[110px]">
          <div>
            <h1 className="heading-h2-bd mb-[2.625rem]">주문제작</h1>
            <p className="heading-h5-rg mb-[2.625rem] text-[var(--color-gray-50)]">
            내가 원하는 리폼 방식을 설명하고 나만의 아이템을 제작해보세요.
            </p>

          </div>
          <Button
            variant="primary"
            size="default"
            onClick={handleRequestReform}
            className=" justify-between px-[1.5rem] py-[1.75rem] rounded-[0.75rem]"
          >
            <span>리폼 요청하기</span>
            <img src={pencilIcon} alt="리폼 요청" className="w-8 h-8 invert " />
          </Button>
        </div>

        {/* Section 1: 새로 등록된 요청 */}
        <section className="px-0 md:px-[110px] mb-[5rem]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">지금 새로 등록된 요청 🌟</h2>
            <button 
              onClick={() => navigate('/order/requests')}
              className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors"
            >
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {isLoading && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                불러오는 중...
              </p>
            )}
            {isError && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                목록을 불러오지 못했어요.
              </p>
            )}
            {!isLoading && !isError && recentRequests.length === 0 && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                새로 등록된 요청이 없어요.
              </p>
            )}
            {!isLoading &&
              !isError &&
              recentRequests.map((item) => (
                <RequestCard
                  key={item.reformRequestId}
                  id={item.reformRequestId}
                  imgSrc={item.thumbnail}
                  title={item.title}
                  priceRange={formatBudgetRange(item.minBudget, item.maxBudget)}
                  variant="order"
                />
              ))}
          </div>
        </section>

        {/* Section 2: 리폼러가 주문제작을 받고 있어요 */}
        <section className="pt-[7rem] px-0 md:px-[110px]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">리폼러가 주문제작을 받고 있어요 🔥</h2>
            <button 
              onClick={() => navigate('/order/proposals')}
              className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors"
            >
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {isLoading && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                불러오는 중...
              </p>
            )}
            {isError && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                목록을 불러오지 못했어요.
              </p>
            )}
            {!isLoading && !isError && proposals.length === 0 && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                주문제작 제안이 없어요.
              </p>
            )}
            {!isLoading &&
              !isError &&
              proposals.map((item) => (
                <ProposalCard
                  key={item.reformProposalId}
                  id={item.reformProposalId}
                  imgSrc={item.thumbnail}
                  title={item.title}
                  price={formatWon(item.price)}
                  rating={item.avgStar}
                  ratingDecimals={1}
                  reviewCountText={`(${item.reviewCount})`}
                  nickname={item.ownerName}
                  variant="order"
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderPage;
