import starIcon from '../../../assets/icons/star.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../../../assets/icons/profile.svg';
import type { ReformerProfileCardProps } from './types';

const ReformerSearchCard = ({
  reformer,
  onClick,
}: ReformerProfileCardProps) => {
  const navigate = useNavigate();
  const [isImageError, setIsImageError] = useState(false);
  const shouldShowPlaceholder = !reformer.profile_photo || isImageError;
  const formattedRating = Number.isFinite(reformer.avg_star)
    ? reformer.avg_star.toFixed(2)
    : '-';
  const tags = (reformer.keywords ?? []).map((k) =>
    k.startsWith('#') ? k : `#${k}`
  );

  const handleClick = () => {
    if (onClick) return onClick();
    navigate(`/profile/${reformer.owner_id}`);
  };

  return (
    <div
      className="bg-white rounded-[1.25rem] p-4 md:p-[1.5rem] flex flex-col gap-2 md:gap-[0.875rem] cursor-pointer w-full"
      style={{
        boxShadow: '0px 3px 11px 0px rgba(0, 0, 0, 0.22)',
        minHeight: '250px',
      }}
      onClick={handleClick}
    >
      {/* 프로필 이미지와 이름 */}
      <div className="flex items-center gap-2 md:gap-[0.75rem]">
        {shouldShowPlaceholder ? (
          <div className="w-12 h-12 md:w-[5.75rem] md:h-[5.75rem] flex-shrink-0 overflow-hidden">
            <img
              src={profileIcon}
              alt="default profile"
              className="w-full h-full object-cover scale-[1.2]"
            />
          </div>
        ) : (
          <img
            src={reformer.profile_photo}
            alt={reformer.nickname}
            className="w-12 h-12 md:w-[5.75rem] md:h-[5.75rem] rounded-full object-cover border border-[rgba(0,0,0,0.15)] flex-shrink-0"
            onError={() => setIsImageError(true)}
          />
        )}
        <div className="flex flex-col gap-[0.25rem]">
          <h3 className="body-b0-sb text-[var(--color-black)]">
            {reformer.nickname}
          </h3>
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
                {reformer.trade_count}
              </span>
              <span className="text-[var(--color-gray-50)]">회 거래</span>
            </span>
          </div>
        </div>
      </div>

      {/* 설명 */}
      <p className="body-b2-rg text-[var(--color-gray-50)] line-clamp-2">
        {reformer.bio}
      </p>

      {/* 해시태그 */}
      <div className="flex gap-[0.5rem] flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="body-b3-rg text-[var(--color-mint-1)]  border border-[var(--color-mint-1)] px-[0.625rem] py-[0.25rem] rounded-[1rem]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReformerSearchCard;
