import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/breadcrumb/Breadcrumb';
import shareIcon from '../../../assets/icons/share.svg';
import { ImageCarousel } from '../../../components/common/product/Image';
import Button from '../../../components/common/button/Button1';
import LikeButton from '../../../components/common/likebutton/LikeButton';
import { useReformerOrderRequestDetail } from '../../../hooks/domain/order/useReformerOrderRequestDetail';

const ReformerOrderRequestDetailPage = () => {
  const navigate = useNavigate();
  const {
    id,
    requestDetail,
    isLoading,
    isError,
    isLiked,
    setIsLiked,
    imageUrls,
    isClosed,
    formattedDeadline,
    formattedBudget,
    handleShare,
  } = useReformerOrderRequestDetail();

  if (!id) {
    return <div>요청을 찾을 수 없습니다.</div>;
  }

  if (isLoading) {
    return <div className="p-8">불러오는 중...</div>;
  }

  if (isError || !requestDetail) {
    return <div className="p-8">요청서를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>;
  }

  const { title, content, name, profile } = requestDetail;

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/reformer/order' },
    { label: '주문제작 요청', path: '/reformer/order/requests' },
    { label: '상세' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-27 pt-6 ">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 페이지 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-8">리폼 요청</h1>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3.125rem]">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="flex-1">
            <ImageCarousel images={imageUrls} isClosed={isClosed} />
          </div>

          {/* 오른쪽: 요청 상세 정보 */}
          <div className="flex-1 flex flex-col ">
            {/* 요청자 정보 */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-60)]">
                  {profile ? (
                    <img
                      src={profile}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-gray-30)]" />
                  )}
                </div>
                <span className="body-b1-rg text-[var(--color-gray-60)]">{name}</span>
              </div>
              <button
                onClick={handleShare}
                className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="공유하기"
              >
                <img src={shareIcon} alt="공유" className="w-8 h-8" />
              </button>
            </div>

            {/* 요청 제목 */}
            <h2 className="heading-h5-md text-[var(--color-black)] mb-4">{title}</h2>

            {/* 희망 예산 */}
            <div className="mb-1 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)] ">희망 예산</p>
              <p className="heading-h4-bd text-[var(--color-black)]">{formattedBudget}</p>
            </div>

            {/* 마감일 */}
            <div className="mb-6 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)]">마감일</p>
              <p className="body-b1-rg text-[var(--color-gray-60)]">{formattedDeadline}</p>
            </div>

            {/* 상세 요청 내용 */}
            <div className="pt-8 border-b border-[var(--color-gray-40)]">
              <div className="pl-10">
                <p className="body-b1-rg text-[var(--color-gray-60)] mb-4 ">상세 요청 내용</p>
                <div className="body-b1-rg text-[var(--color-black)] whitespace-pre-line pb-12">
                  {content}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-7 mt-7">
              {!isClosed && (
                <Button
                  variant="white"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center justify-center gap-2 flex-1"
                >
                  <LikeButton initialLiked={isLiked} variant="blackLine" readOnly className="!w-6 !h-6" />
                  <span>찜하기</span>
                </Button>
              )}
              {isClosed ? (
                <Button variant="disabled" className="flex-[2]">
                  제안할 수 없어요
                </Button>
              ) : (
                <Button
                  variant="outlined-mint"
                  onClick={() => navigate(`/reformer/order/requests/${id}/estimate`)}
                  className="flex-[2]"
                >
                  견적서 작성하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformerOrderRequestDetailPage;
