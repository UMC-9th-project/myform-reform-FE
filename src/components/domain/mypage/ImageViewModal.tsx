import React from 'react';

interface ImageViewerModalProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

const ImageViewerModal = ({
  images,
  currentIndex,
  setCurrentIndex,
  onClose,
}: ImageViewerModalProps) => {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      {/* 모달 박스 */}
      <div
        className="
          relative
          w-[90vw]
          max-w-[800px]
          h-[90vh]
          max-h-[600px]
          bg-black
          rounded-xl
          flex
          items-center
          justify-center
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl z-10"
        >
          ✕
        </button>

        {/* 이전 버튼 */}
        {hasPrev && (
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="absolute left-3 text-white text-3xl z-10"
          >
            ‹
          </button>
        )}

        {/* 이미지 */}
        <img
          src={images[currentIndex]}
          alt="원본 이미지"
          className="w-full h-full object-contain"
        />

        {/* 다음 버튼 */}
        {hasNext && (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="absolute right-3 text-white text-3xl z-10"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageViewerModal;
