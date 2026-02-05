import starIcon from '../../../assets/icons/star.svg';
import { useState } from 'react';
import type { ReformerSearchResultCardProps } from './types';

const ReformerSearchResultCard = ({
  reformer,
  onClick,
  isLast = false,
}: ReformerSearchResultCardProps) => {
  const [isImageError, setIsImageError] = useState(false);
  const shouldShowPlaceholder = !reformer.profile_photo || isImageError;
  const formattedRating = Number.isFinite(reformer.avg_star)
    ? reformer.avg_star.toFixed(1)
    : '-';
  const tags = (reformer.keywords ?? []).map((k) =>
    k.startsWith('#') ? k : `#${k}`
  );

  return (
    <div
      className={`bg-white py-4 flex gap-4 md:gap-[1.5rem] cursor-pointer w-full max-w-[719px] ${isLast ? '' : 'border-b border-[var(--color-gray-40)]'}`}
      onClick={onClick}
    >
      {/* 왼쪽: 텍스트 정보 */}
      <div className="flex-1 flex flex-col gap-[0.475rem]">
        {/* 이름 */}
        <h3 className="body-b0-sb text-[var(--color-black)]">
          {reformer.nickname}
        </h3>

        {/* 별점과 거래 횟수 */}
        <div className="flex items-center gap-[0.375rem]">
          <img
            src={starIcon}
            alt="star"
            className="w-[1.25rem] h-[1.25rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{formattedRating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">
              ({reformer.review_count})
            </span>
          </span>
          <span className="body-b3-rg text-[var(--color-gray-50)]">·</span>
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">
              {reformer.trade_count}회{' '}
            </span>
            <span className="text-[var(--color-gray-50)]">거래</span>
          </span>
        </div>

        {/* 해시태그 */}
        <div className="flex gap-[0.5rem] flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="body-b3-rg text-[var(--color-mint-1)] border border-[var(--color-mint-1)] px-[0.625rem] py-[0.25rem] rounded-[1rem]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className="pt-4 body-b2-rg text-[var(--color-gray-50)] line-clamp-3">
          {reformer.bio}
        </p>
      </div>

      {/* 오른쪽: 프로필 이미지 */}
      <div className="flex-shrink-0">
        {shouldShowPlaceholder ? (
          <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[10px] border border-[var(--color-line-gray-40)] bg-[var(--color-gray-30)]" />
        ) : (
          <img
            src={reformer.profile_photo}
            alt={reformer.nickname}
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[10px] object-cover border border-[rgba(0,0,0,0.15)]"
            onError={() => setIsImageError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default ReformerSearchResultCard;
