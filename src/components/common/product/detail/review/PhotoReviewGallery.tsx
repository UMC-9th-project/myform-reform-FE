interface PhotoReviewGalleryProps {
  photoReviewCount: number;
  onMoreClick?: () => void;
  photos?: string[];
  maxVisible?: number;
}

const PhotoReviewGallery = ({
  photoReviewCount,
  onMoreClick,
  photos,
  maxVisible = 7,
}: PhotoReviewGalleryProps) => {
  const visibleCount = Math.min(maxVisible, photoReviewCount);
  const remainingCount = photoReviewCount - maxVisible;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="body-b1-sb text-[var(--color-black)]">
          사진 후기 ({photoReviewCount})
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: visibleCount }).map((_, index) => {
          const isLastItem = index === visibleCount - 1 && remainingCount > 0;
          return (
            <div
              key={index}
              className={`flex-shrink-0 w-50 h-50 overflow-hidden bg-gray-200 relative ${
                isLastItem ? 'cursor-pointer' : ''
              }`}
              onClick={isLastItem ? onMoreClick : undefined}
            >
              {photos && photos[index] ? (
                <img
                  src={photos[index]}
                  alt={`후기 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/wsh1.jpg"
                  alt={`후기 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {isLastItem && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="body-b1-sb text-white">
                    + {remainingCount} 더보기
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="pb-6 border-b border-[var(--color-line-gray-40)]"></div>
    </div>
  );
};

export default PhotoReviewGallery;
