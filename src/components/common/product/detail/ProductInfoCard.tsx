import shareIcon from '../../../../assets/icons/share.svg';
import starIcon from '../../../../assets/icons/star.svg';
import Button from '../../button/button1_tmp';
import LikeButton from '../../likebutton/LikeButton';
import profile from '../../../domain/market/images/profile.png';

interface ReformerInfo {
  id: string;
  name: string;
  profileImg?: string;
  description?: string;
}

interface ProductInfoCardProps {
  title: string;
  price: string;
  rating: number;
  recentRating?: number;
  shippingFee: string;
  estimatedPeriod: string;
  reformer: ReformerInfo;
  isLiked?: boolean;
  onLikeClick?: (isLiked: boolean) => void;
  onShareClick?: () => void;
  onRequestClick?: () => void;
  className?: string;
  showButtons?: boolean;
}

const ProductInfoCard = ({
  title,
  price,
  rating,
  recentRating,
  shippingFee,
  estimatedPeriod,
  reformer,
  isLiked = false,
  onLikeClick,
  onShareClick,
  onRequestClick,
  className = '',
  showButtons = true,
}: ProductInfoCardProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 리폼러 정보 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-60)]">
            <img 
              src={reformer.profileImg && reformer.profileImg.trim() !== '' ? reformer.profileImg : profile} 
              alt={reformer.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="body-b1-rg text-[var(--color-gray-60)]">{reformer.name}</p>
           
          </div>
        </div>
        <button
          onClick={onShareClick}
          className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="공유하기"
        >
          <img src={shareIcon} alt="공유" className="w-8 h-8" />
        </button>
      </div>

      {/* 제목 */}
      <h2 className="heading-h5-md text-[var(--color-black)] mb-4">{title}</h2>

      {/* 가격 */}
      <div className="mb-1">
        <p className="heading-h2-bd text-[var(--color-black)]">{price}</p>
      </div>

      {/* 평점 */}
      <div className="flex items-center gap-2 mt-5">
        <div className="flex items-center gap-1">
          <img src={starIcon} alt="star" className="w-5 h-5" />
          <span className="body-b1-sb text-[var(--color-black)]">{rating}</span>
        </div>
        {recentRating && (
          <span className="body-b5-rg text-[var(--color-gray-50)]">(최근 3개월 {recentRating})</span>
        )}
      </div>

      {/* 구분선 */}
      <div className="border-t border-[var(--color-gray-40)] my-4" />

      {/* 배송비 */}
      <div className="mb-1 flex flex-row items-center gap-4 text-[var(--color-gray-60)]">
        <p className="body-b1-sb pr-15 ">배송비</p>
        <p className="body-b1-rg ">{shippingFee}</p>
      </div>

      {/* 예상 작업기간 */}
      <div className="mt-2 mb-6 flex flex-row items-center gap-4 text-[var(--color-gray-60)]">
        <p className="body-b1-sb pr-2 ">예상 작업기간</p>
        <p className="body-b1-rg ">{estimatedPeriod}</p>
      </div>

      {/* 액션 버튼들 */}
      {showButtons && (
        <div className="flex gap-7 mt-7">
          <Button
            variant="white"
            onClick={() => onLikeClick?.(!isLiked)}
            className="flex items-center justify-center gap-2 flex-1"
          >
            <LikeButton initialLiked={isLiked} variant="blackLine" readOnly className="!w-6 !h-6" />
            <span>찜하기</span>
          </Button>
          <Button variant="outlined-mint" onClick={onRequestClick} className="flex-[2]">
            이대로 요청하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductInfoCard;
