import { useState } from 'react';
import LeftIcon from '../../../assets/icons/left.svg?react';
import RightIcon from '../../../assets/icons/right.svg?react';
import e1 from './eximage_tmp/e1.jpg';
import e2 from './eximage_tmp/e2.jpg';
import e3 from './eximage_tmp/e3.jpg';

interface ImageSlot {
  id: string;
  images: string[];
}

interface ImageColumnProps {
  title: string;
  slots: ImageSlot[];
  isClosed?: boolean;
}

export const ImageCarousel = ({
  images,
  isClosed = false,
}: {
  images: string[];
  isClosed?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      {/* 이미지 */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {isClosed && (
          <div className="absolute inset-0 heading-h5-sb flex items-center justify-center bg-white/75">
            <p>마감된 요청이에요</p>
          </div>
        )}
      </div>

      {/* 좌우 화살표 */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-[0.625rem] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] rounded-full flex items-center justify-center bg-black/50 shadow-[0_0.125rem_0.4rem_0_rgba(0,0,0,0.1)]"
            >
              <LeftIcon className="w-[2.5rem] h-[2.5rem] text-white" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-[0.625rem] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] rounded-full flex items-center justify-center bg-black/50 shadow-[0_0.125rem_0.4rem_0_rgba(0,0,0,0.1)]"
            >
              <RightIcon className="w-[2.5rem] h-[2.5rem] text-white" />
            </button>
          )}
        </>
      )}

      {/* 네비게이션 도트 */}
      {images.length > 1 && (
        <div className="flex justify-center gap-[0.25rem] mt-[0.5rem]">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`w-[0.5rem] h-[0.5rem] rounded-full ${
                index === currentIndex
                  ? 'bg-[var(--color-mint-1)]'
                  : 'bg-[var(--color-gray-40)]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ImageColumn = ({ title, slots, isClosed = false }: ImageColumnProps) => {
  return (
    <div className="flex-1">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {title}
      </h2>
      <div className="flex flex-col gap-[1.5rem]">
        {slots.map((slot) => (
          <ImageCarousel
            key={slot.id}
            images={slot.images}
            isClosed={isClosed}
          />
        ))}
      </div>
    </div>
  );
};

const Image = () => {
  // 예시 데이터 - 이미지 개수가 다른 케이스
  const activeSlots: ImageSlot[] = [
    { id: '1', images: [e1] }, // 단일 이미지
    { id: '2', images: [e1, e2] }, // 2개 이미지
    { id: '3', images: [e1, e2, e3] }, // 3개 이미지
  ];

  const closedSlots: ImageSlot[] = [
    { id: '4', images: [e1] }, // 단일 이미지 (마감)
    { id: '5', images: [e1, e2] }, // 2개 이미지 (마감)
    { id: '6', images: [e1, e2, e3] }, // 3개 이미지 (마감)
  ];

  return (
    <div className="flex gap-[2rem]">
      <ImageColumn title="" slots={activeSlots} />
      <ImageColumn title="" slots={closedSlots} isClosed />
    </div>
  );
};

export default Image;
