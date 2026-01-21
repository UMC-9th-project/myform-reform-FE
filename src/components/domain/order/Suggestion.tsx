import star from '../market/icons/star.svg';

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
    <article className={`w-full ${className}`}>
      <div className="relative w-full h-[21.375rem] rounded-[1.25rem] overflow-hidden bg-[var(--color-gray-20)]">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-[1.125rem]">
        <p className="body-b0-sb line-clamp-2 text-[var(--color-black)]">
          {title}
        </p>

        <p className="mt-[0.55rem] heading-h4-bd text-[var(--color-black)]">
          {price}
        </p>

        <div className=" flex items-center gap-[0.375rem] body-b5-rg">
          <img src={star} className="w-5 h-5" alt="star" />
          <span className="body-b3-rg text-[var(--color-black)]">{rating}</span>
          <span className="body-b3-rg text-[var(--color-gray-50)]">{reviewCountText}</span>
        </div>

        <div className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {nickname}
        </div>
      </div>
    </article>
  );
}

