import { Link } from 'react-router-dom';
import LikeButton from '../likebutton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';

const MARKET_DETAIL_PATH = '/market/product';

export interface MarketCardItem {
  id: number;
  image: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  seller: string;
}

interface MarketCardProps {
  item: MarketCardItem;
  initialLiked?: boolean;
  onLikeClick?: (id: number, isLiked: boolean) => void;
  /** 클릭 시 이동할 상세 페이지 경로 (미지정 시 /market/product/:id 사용) */
  to?: string;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const MarketCard = ({
  item,
  initialLiked = false,
  onLikeClick,
  to,
}: MarketCardProps) => {
  const handleLikeClick = (isLiked: boolean) => {
    onLikeClick?.(item.id, isLiked);
  };

  const linkTo = to ?? `${MARKET_DETAIL_PATH}/${item.id}`;

  const content = (
    <div className="bg-white rounded-[0.625rem] overflow-visible cursor-pointer">
      {/* 상품 이미지 */}
      <div
        className="relative w-full bg-[var(--color-gray-20)] rounded-t-[0.625rem] overflow-hidden"
        style={{ aspectRatio: '361/307' }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-[1.25rem]"
        />
        <div
          className="absolute bottom-[0.75rem] right-[0.75rem]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          role="presentation"
        >
          <LikeButton
            initialLiked={initialLiked}
            onClick={handleLikeClick}
          />
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {item.title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.125rem]">
          {formatPrice(item.price)}원
        </p>
        <div className="flex items-center gap-[0.375rem] mb-[0.525rem]">
          <img
            src={starIcon}
            alt="별점"
            className="w-[0.8125rem] h-[0.75rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{item.rating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">
              ({item.reviewCount})
            </span>
          </span>
        </div>
        <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {item.seller}
        </span>
      </div>
    </div>
  );

  return <Link to={linkTo} className="block w-full">{content}</Link>;
};

export default MarketCard;
