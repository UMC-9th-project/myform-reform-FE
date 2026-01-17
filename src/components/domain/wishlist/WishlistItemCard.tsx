import LikeButton from '../../../components/common/LikeButton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';
import type { WishlistItem } from './types';

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (id: number) => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const WishlistItemCard = ({ item, onRemove }: WishlistItemCardProps) => {
  const handleLikeClick = (isLiked: boolean) => {
    if (!isLiked) {
      onRemove(item.id);
    }
  };

  return (
    <div className="bg-white rounded-[0.625rem] overflow-visible cursor-pointer">
      {/* 상품 이미지 */}
      <div
        className="relative w-full bg-[var(--color-gray-20)] rounded-t-[0.625rem] overflow-hidden"
        style={{ aspectRatio: '337/307' }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-[1.25rem]"
        />
        {/* 하트 아이콘 (우측 하단) */}
        <div className="absolute bottom-[0.75rem] right-[0.75rem]">
          <LikeButton initialLiked={true} onClick={handleLikeClick} />
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {item.title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.625rem]">
          {formatPrice(item.price)}원
        </p>
        <div className="flex items-center gap-[0.375rem] mb-[0.625rem]">
          <img
            src={starIcon}
            alt="star"
            className="w-[0.8125rem] h-[0.75rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{item.rating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">
              ({item.reviewCount})
            </span>
          </span>
        </div>
        <span className="inline-block mt-2 bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.625rem] py-[0.25rem] body-b5-sb text-[rgba(100, 111, 124, 1)]">
          {item.seller}
        </span>
      </div>
    </div>
  );
};

export default WishlistItemCard;
