import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/breadcrumb/Breadcrumb';
import RequestCard, { type RequestDetailVariant } from '../../../components/common/card/RequestCard';
import ProposalCard, { type ProposalDetailVariant } from '../../../components/common/card/ProposalCard';
import { useReformerOrderPage } from '../../../hooks/domain/order/useReformerOrderPage';

const REQUEST_CARD_VARIANT: RequestDetailVariant = 'reformer';
const PROPOSAL_CARD_VARIANT: ProposalDetailVariant = 'reformer';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatBudgetRange(minBudget: number, maxBudget: number) {
  return `${formatWon(minBudget)}~${formatWon(maxBudget)}`;
}

const ReformerOrderPage = () => {
  const navigate = useNavigate();

  const {
    newRequests,
    proposals,
    isNewRequestsLoading,
    isNewRequestsError,
    isProposalsLoading,
    isProposalsError,
  } = useReformerOrderPage();

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
              고객의 리폼을 제안하거나, 마이페이지에서 나만의 주문제작을 등록할 수 있어요.
            </p>
          </div>
        </div>

        {/* Section 1: 새로 등록된 요청 */}
        <section className="px-0 md:px-[110px] mb-[5rem]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">지금 새로 등록된 요청 🌟</h2>
            <button
              onClick={() => navigate('/reformer/order/requests')}
              className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors"
            >
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {isNewRequestsLoading && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                불러오는 중...
              </p>
            )}
            {isNewRequestsError && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                요청서 목록을 불러오지 못했어요.
              </p>
            )}
            {!isNewRequestsLoading && !isNewRequestsError && newRequests.length === 0 && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                새로 등록된 요청이 없어요.
              </p>
            )}
            {!isNewRequestsLoading &&
              !isNewRequestsError &&
              newRequests.map((item) => (
                <RequestCard
                  key={item.reformRequestId}
                  id={item.reformRequestId}
                  variant={REQUEST_CARD_VARIANT}
                  imgSrc={item.thumbnail}
                  title={item.title}
                  priceRange={formatBudgetRange(item.minBudget, item.maxBudget)}
                />
              ))}
          </div>
        </section>

        {/* Section 2: 리폼러가 주문제작을 받고 있어요 */}
        <section className="pt-[7rem] px-0 md:px-[110px]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">리폼러가 주문제작을 받고 있어요 🔥</h2>
            <button
              onClick={() => navigate('/reformer/order/suggestions')}
              className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors"
            >
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {isProposalsLoading && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                불러오는 중...
              </p>
            )}
            {isProposalsError && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                제안서 목록을 불러오지 못했어요.
              </p>
            )}
            {!isProposalsLoading && !isProposalsError && proposals.length === 0 && (
              <p className="body-b1-rg text-[var(--color-gray-60)] col-span-3">
                제안서가 없어요.
              </p>
            )}
            {!isProposalsLoading &&
              !isProposalsError &&
              proposals.map((item) => (
                <ProposalCard
                  key={item.reformProposalId}
                  id={item.reformProposalId}
                  variant={PROPOSAL_CARD_VARIANT}
                  imgSrc={item.thumbnail}
                  title={item.title}
                  price={formatWon(item.price)}
                  rating={item.avgStar}
                  reviewCountText={`(${item.reviewCount})`}
                  nickname={item.ownerName}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReformerOrderPage;
