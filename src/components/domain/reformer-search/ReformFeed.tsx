import { useState } from 'react';
import ReformFeedCard from './ReformFeedCard';
import ImageViewerModal from '../mypage/ImageViewModal';
import rightIcon from '../../../assets/icons/right.svg';
import { getReformerFeedPhotos } from '../../../api/reformer';
import type { ReformFeedProps } from './types';

const ReformFeed = ({
  onMoreClick,
  feeds,
  onCardClick,
}: ReformFeedProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFeedClick = async (feed: { feed_id: string; photo_url: string; is_multi_photo: boolean }) => {
    if (!feed.photo_url) return;

    if (feed.is_multi_photo) {
      try {
        const res = await getReformerFeedPhotos({ feed_id: feed.feed_id });
        const photos = (res as { photos?: { photo_order: number; url: string }[] })?.photos
          ?? (res as { success?: { photos?: { photo_order: number; url: string }[] } })?.success?.photos;
        const urls =
          photos
            ?.sort((a, b) => a.photo_order - b.photo_order)
            ?.map((p) => p.url) ?? [];
        if (urls.length > 0) {
          setSelectedImages(urls);
          setCurrentIndex(0);
          setIsViewerOpen(true);
        } else {
          setSelectedImages([feed.photo_url]);
          setCurrentIndex(0);
          setIsViewerOpen(true);
        }
      } catch {
        setSelectedImages([feed.photo_url]);
        setCurrentIndex(0);
        setIsViewerOpen(true);
      }
    } else {
      setSelectedImages([feed.photo_url]);
      setCurrentIndex(0);
      setIsViewerOpen(true);
    }
    onCardClick?.(feed.feed_id);
  };

  return (
    <section className="mb-8 md:mb-[4.375rem] px-4 md:px-[110px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-[1.875rem] gap-4">
        <div className="flex items-center gap-[0.5rem]">
          <h2 className="heading-h4-bd text-[var(--color-black)]">내 리폼 취향 탐색해보기 🔍</h2>
      
        </div>
        <button
          type="button"
          onClick={onMoreClick}
          className="body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors flex items-center gap-[0.5rem] cursor-pointer"
        >
          <span>더보기</span>
          <img src={rightIcon} alt="right" className="w-[2rem] h-[2rem] mb-[0.25rem]" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-[0.875rem]">
        {feeds.map((feed) => (
          <ReformFeedCard
            key={feed.feed_id}
            feed={feed}
            onClick={() => handleFeedClick(feed)}
          />
        ))}
      </div>
      {isViewerOpen && selectedImages.length > 0 && (
        <ImageViewerModal
          images={selectedImages}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </section>
  );
};

export default ReformFeed;
