import LikeButton from '../../common/likebutton/LikeButton';
import type { WishlistCustomItem } from '@/types/api/wishlist/wishlist';
interface WishlistCustomItemCardProps {
  item: WishlistCustomItem;
  onRemove: (id: number) => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const WishlistCustomItemCard = ({
  item,
  onRemove,
}: WishlistCustomItemCardProps) => {
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
          {formatPrice(item.minPrice)}원~{formatPrice(item.maxPrice)}원
        </p>

        <span className="inline-block mt-2 bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.625rem] py-[0.25rem] body-b5-sb text-[rgba(100, 111, 124, 1)]">
          {item.seller}
        </span>
      </div>
    </div>
  );
};

export default WishlistCustomItemCard;
