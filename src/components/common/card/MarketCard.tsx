import { Link } from 'react-router-dom';
import LikeButton from '../likebutton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';

const MARKET_DETAIL_PATH = '/market/product';

export interface MarketCardItem {
  item_id: string;
  thumbnail: string; 
  title: string;
  price: number;
  star: number;
  review_count: number;
  owner_nickname: string;
  is_wished: boolean;
}

export interface CustomOrderItem {
  proposal_id: string;
  thumbnail: string;
  title: string;
  min_price: number;
  star?: number;
  review_count?: number;
  owner_nickname: string;
  is_wished: boolean;
}
// 타입 가드 함수
const isMarketCardItem = (item: MarketCardItem | CustomOrderItem): item is MarketCardItem => {
  return 'item_id' in item;
};

interface MarketCardProps {
  item: MarketCardItem | CustomOrderItem;
  initialLiked?: boolean;
  onLikeClick?: (id: number, isLiked: boolean) => void;
  /** 클릭 시 이동할 상세 페이지 경로 (미지정 시 자동으로 결정) */
  to?: string;
  /** 찜 버튼 숨김 여부 */
  hideLikeButton?: boolean;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const MarketCard = ({
  item,
  initialLiked = false,
  onLikeClick,
  to,
  hideLikeButton = false,
}: MarketCardProps) => {
  const isMarketItem = isMarketCardItem(item);
  const price = isMarketItem ? item.price : item.min_price;
  const hasRating = item.star !== undefined;
  const isWished = item.is_wished;

  const handleLikeClick = (isLiked: boolean) => {
    if (isMarketItem) {
      onLikeClick?.(Number(item.item_id), isLiked);
    } else {
      onLikeClick?.(Number(item.proposal_id), isLiked);
    }
  };

  const linkTo = to ?? (isMarketItem 
    ? `${MARKET_DETAIL_PATH}/${item.item_id}`
    : `/proposal/${item.proposal_id}`);

  const content = (
    <div className="bg-white rounded-[0.625rem] overflow-visible cursor-pointer">
      {/* 상품 이미지 */}
      <div
        className="relative w-full rounded-[0.625rem] overflow-hidden"
        style={{ aspectRatio: '361/307' }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {!hideLikeButton && (
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
              initialLiked={initialLiked || isWished}
              onClick={handleLikeClick}
            />
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {item.title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.125rem]">
          {isMarketItem ?
             `${formatPrice(price)}원`
            : `${formatPrice(price)}원`}
        </p>
        {hasRating && (
          <div className="flex items-center gap-[0.375rem] mb-[0.525rem]">
            <img
              src={starIcon}
              alt="별점"
              className="w-[0.8125rem] h-[0.75rem]"
            />
            <span className="body-b3-rg">
              <span className="text-[var(--color-black)]">{isMarketItem ? item.star.toFixed(2) : (item.star ?? 0).toFixed(2)}</span>{' '}
              <span className="text-[var(--color-gray-50)]">
                ({isMarketItem ? item.review_count : (item.review_count ?? 0)})
              </span>
            </span>
          </div>
        )}
        <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {item.owner_nickname}
        </span>
      </div>
    </div>
  );

  return <Link to={linkTo} className="block w-full">{content}</Link>;
};

export default MarketCard;
