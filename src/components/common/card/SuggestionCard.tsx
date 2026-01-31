import LikeButton from '../likebutton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';

interface SuggestionCardProps {
  imgSrc?: string;
  title?: string;
  price?: string;
  rating?: number;
  reviewCountText?: string;
  nickname?: string;
  className?: string;
}

export default function SuggestionCard({
  imgSrc = '/wsh1.jpg',
  title = '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  price = '75,000원',
  rating = 4.9,
  reviewCountText = '(271)',
  nickname = '침착한 대머리독수리',
  className = '',
}: SuggestionCardProps) {
  return (
    <div className={`bg-white rounded-[0.625rem] overflow-visible cursor-pointer ${className}`}>
      {/* 상품 이미지 - MarketCard와 동일 */}
      <div
        className="relative w-full bg-[var(--color-gray-20)] rounded-t-[0.625rem] overflow-hidden"
        style={{ aspectRatio: '361/307' }}
      >
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover rounded-[1.25rem]"
        />
        <div className="absolute bottom-[0.75rem] right-[0.75rem]">
          <LikeButton />
        </div>
      </div>

      {/* 상품 정보 - MarketCard와 동일 간격 */}
      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.125rem]">
          {price}
        </p>
        <div className="flex items-center gap-[0.375rem] mb-[0.525rem]">
          <img
            src={starIcon}
            alt="별점"
            className="w-[0.8125rem] h-[0.75rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{rating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">{reviewCountText}</span>
          </span>
        </div>
        <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {nickname}
        </span>
      </div>
    </div>
  );
}
