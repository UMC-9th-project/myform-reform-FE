import React from 'react';
import right from '../../../assets/icons/right.svg';

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
  const lastIndex = images.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      {/* 모달 박스 */}
      <div
        className="
          relative
          w-[62rem]
          h-[44rem]
          bg-transparent
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
          className="absolute top-4 right-40 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white text-[0.9rem]"
        >
          ✕
        </button>

        {/* 이전 버튼 - 여러 장일 때만 표시 */}
        {images.length > 1 && (
          <button
            type="button"
            title="왼쪽 버튼"
            onClick={(e) => {
              e.stopPropagation();
              if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
            }}
            className="absolute left-3 bg-white rounded-full flex items-center justify-center text-3xl z-10 p-2 hover:opacity-90"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 26L17 20L23 14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* 이미지 */}
        <img
          src={images[currentIndex]}
          alt="원본 이미지"
          className="w-full h-full object-contain"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />

        {/* 다음 버튼 - 여러 장일 때만 표시 */}
        {images.length > 1 && (
          <button
            type="button"
            title="오른쪽으로 이동"
            onClick={(e) => {
              e.stopPropagation();
              if (currentIndex < lastIndex) setCurrentIndex((prev) => prev + 1);
            }}
            className="absolute right-3 bg-white rounded-full flex items-center justify-center text-3xl z-10 p-2 hover:opacity-90"
          >
            <img src={right} alt="오른쪽으로 넘기기" />
          </button>
        )}

      </div>
    </div>
  );
};

export default ImageViewerModal;
