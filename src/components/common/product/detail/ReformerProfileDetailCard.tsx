
import profile from '../../../domain/market/images/profile.png';
import Button from '../../Button/button1';
import starIcon from '../../../../assets/icons/star.svg';
import ProfileTextAccordion from '../ProfileTextAccordion';

interface ReformerProfileDetailCardProps {
  name: string;
  rating: number;
  orderCount: number;
  reviewCount: number;
  profileImg?: string;
  onFeedClick?: () => void;
  className?: string;
}

const ReformerProfileDetailCard = ({
  name,
  rating,
  orderCount,
  reviewCount,
  profileImg,
  onFeedClick,
  className = '',
}: ReformerProfileDetailCardProps) => {

  return (
    <div className={`bg-white rounded-[1.25rem] p-6 flex gap-15 ${className}`}>
      {/* 왼쪽: 프로필 이미지 */}
      <div className="flex-shrink-0">
        <img
          src={profileImg || profile}
          alt={name}
          className="w-35 h-35 rounded-full object-cover border border-[rgba(0,0,0,0.15)]"
        />
      </div>

      {/* 오른쪽: 정보 섹션 */}
      <div className="flex-1 flex flex-col gap-5">
        {/* 프로필 헤더 */}
        <div className="mb-4">
          <h3 className="heading-h4-bd text-[var(--color-black)] mb-1">{name}</h3>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <img key={i} src={starIcon} alt="star" className="w-5 h-5" />
              ))}
            </div>
            <span className="body-b1-sb text-[var(--color-black)] ml-1">{rating}</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[var(--color-gray-40)] mb-2" />

        {/* 통계 섹션 */}
        <div className="flex items-center mb-2">
          <div className="flex-1 flex flex-col gap-2 items-center">
            <p className="body-b0-rg text-[var(--color-gray-50)]">주문 건수</p>
            <p className="heading-h4-bd text-[var(--color-black)]">{orderCount}건</p>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center">
            <p className="body-b0-rg text-[var(--color-gray-50)]">후기</p>
            <p className="heading-h4-bd text-[var(--color-black)]">{reviewCount}개</p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[var(--color-gray-40)] mb-4" />

        {/* 설명 섹션 */}
        <div className="mb-4">
          <ProfileTextAccordion />
        </div>

        {/* 피드 보러가기 버튼 */}
        <Button variant="outlined-mint" onClick={onFeedClick} className="w-full">
          피드 보러가기
        </Button>
      </div>
    </div>
  );
};

export default ReformerProfileDetailCard;
