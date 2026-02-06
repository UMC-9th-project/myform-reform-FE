import feedIcon from '../../../assets/icons/feed.svg';
import { useState } from 'react';
import type { ReformFeedCardProps } from './types';

const ReformFeedCard = ({
  feed,
  onClick,
}: ReformFeedCardProps) => {
  const [isImageError, setIsImageError] = useState(false);
  const shouldShowPlaceholder = !feed.photo_url || isImageError;

  return (
    <div
      key={feed.feed_id}
      className="relative overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '1/1.3' }}
      onClick={onClick}
    >
      {shouldShowPlaceholder ? (
        <div className="w-full h-full bg-[var(--color-gray-30)]" />
      ) : (
        <img
          src={feed.photo_url}
          alt={`feed ${feed.feed_id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setIsImageError(true)}
        />
      )}
      {feed.is_multi_photo && (
        <div className="absolute top-2 right-2 md:top-[0.75rem] md:right-[0.75rem] flex items-center justify-center">
          <img src={feedIcon} alt="feed" className="w-8 h-8 md:w-[3rem] md:h-[3rem]" />
        </div>
      )}
    </div>
  );
};

export default ReformFeedCard;
