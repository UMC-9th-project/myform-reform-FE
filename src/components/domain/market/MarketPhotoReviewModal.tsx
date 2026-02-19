import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import xIcon from '../../../assets/icons/x.svg';
import leftIcon from '../../../assets/icons/left.svg';
import rightIcon from '../../../assets/icons/right.svg';
import starIcon from '../../../assets/icons/star.svg';

interface PhotoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  totalCount: number;
  imageUrl: string;
  photoUrls?: string[];
  currentPhotoIndex?: number;
  review: {
    userProfileImage: string;
    userNickname: string;
    star: number;
    createdAt: string;
    content: string;
  };
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function MarketPhotoReviewModal({
  isOpen,
  onClose,
  currentIndex,
  totalCount,
  imageUrl,
  photoUrls = [],
  currentPhotoIndex,
  review,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: PhotoReviewModalProps) {
  // 현재 리뷰 내 사진 인덱스 계산
  const getInitialPhotoIndex = () => {
    if (currentPhotoIndex !== undefined) {
      return currentPhotoIndex;
    }
    if (photoUrls.length > 0) {
      const index = photoUrls.indexOf(imageUrl);
      return index !== -1 ? index : 0;
    }
    return 0;
  };

  // 현재 리뷰 내 사진 인덱스 관리
  const [localPhotoIndex, setLocalPhotoIndex] = useState(getInitialPhotoIndex);

  // currentPhotoIndex나 imageUrl이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    const newIndex = getInitialPhotoIndex();
    if (newIndex !== localPhotoIndex) {
      setLocalPhotoIndex(newIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhotoIndex, imageUrl]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 같은 리뷰 내에서 이전/다음 사진으로 이동하는 핸들러
  const handlePreviousPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 같은 리뷰 내에 이전 사진이 있으면 같은 리뷰 내에서 이동
    if (photoUrls.length > 0 && localPhotoIndex > 0) {
      setLocalPhotoIndex(localPhotoIndex - 1);
      return;
    }
    
    // 같은 리뷰의 첫 번째 사진이면 다른 리뷰로 이동
    // hasPrevious가 true이거나, photoUrls가 없거나 1개일 때도 이전 리뷰로 이동 시도
    if (hasPrevious || photoUrls.length <= 1) {
      onPrevious();
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 같은 리뷰 내에 다음 사진이 있으면 같은 리뷰 내에서 이동
    if (photoUrls.length > 0 && localPhotoIndex < photoUrls.length - 1) {
      setLocalPhotoIndex(localPhotoIndex + 1);
      return;
    }
    
    // 같은 리뷰의 마지막 사진이면 다른 리뷰로 이동
    // hasNext가 true이거나, photoUrls가 없거나 1개일 때도 다음 리뷰로 이동 시도
    if (hasNext || photoUrls.length <= 1) {
      onNext();
    }
  };

  // 현재 표시할 이미지 URL
  const currentImageUrl = photoUrls.length > 0 && localPhotoIndex < photoUrls.length
    ? photoUrls[localPhotoIndex]
    : imageUrl;

  // 화살표 버튼 표시 여부
  const canGoPrevious = photoUrls.length > 0 
    ? localPhotoIndex > 0 || hasPrevious
    : hasPrevious;
  const canGoNext = photoUrls.length > 0
    ? localPhotoIndex < photoUrls.length - 1 || hasNext
    : hasNext;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-[1125px] h-[700px] overflow-hidden relative rounded-[30px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="absolute top-[33px] left-0 right-0 flex items-center justify-between px-[41px]">
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          >
            <img src={leftIcon} alt="이전" className="w-[40px] h-[40px]" />
          </button>
          <h2 className="heading-h5-md text-black text-center w-[260px] whitespace-pre-wrap">
            사진 후기 ({currentIndex + 1}/{totalCount})
          </h2>
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          >
            <img src={xIcon} alt="닫기" className="w-[40px] h-[40px]" />
          </button>
        </div>

        {/* 본문 */}
        <div className="absolute left-[40px] top-[113px] w-[1045px] flex gap-[40px] items-start">
          {/* 이미지 섹션 */}
          <div className="flex flex-col gap-[20px] items-center shrink-0 w-[523px]">
            <div className="relative w-full h-[519px] overflow-hidden">
              <img
                src={currentImageUrl}
                alt="리뷰 사진"
                className="w-full h-full object-cover"
              />
              
              {/* 화살표 버튼 오버레이 */}
              {(canGoPrevious || canGoNext) && (
                <div className="absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center justify-between w-[503px]">
                  {/* 왼쪽 화살표 */}
                  {canGoPrevious ? (
                    <button
                      onClick={handlePreviousPhoto}
                      className="w-[50px] h-[50px] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80"
                    >
                      <img src={leftIcon} alt="이전" className="w-full h-full" />
                    </button>
                  ) : (
                    <div className="w-[50px]" />
                  )}

                  {/* 오른쪽 화살표 */}
                  {canGoNext ? (
                    <button
                      onClick={handleNextPhoto}
                      className="w-[50px] h-[50px] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80"
                    >
                      <img src={rightIcon} alt="다음" className="w-full h-full" />
                    </button>
                  ) : (
                    <div className="w-[50px]" />
                  )}
                </div>
              )}
            </div>

            {/* 인디케이터 */}
            {photoUrls.length > 1 && (
              <div className="flex justify-center gap-[3px] h-[10px]">
                {photoUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`h-[10px] rounded-full transition-all ${
                      index === localPhotoIndex
                        ? 'w-[10px] bg-[var(--color-mint-1)]'
                        : 'w-[10px] bg-[var(--color-gray-40)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 리뷰 정보 섹션 */}
          <div className="flex flex-col gap-[31px] h-[272px] items-start overflow-y-auto flex-1">
            {/* 리뷰어 정보 */}
            <div className="flex gap-[119px] items-center w-[500px]">
              <div className="flex gap-[14px] items-center">
                {/* 프로필 이미지 */}
                <div className="w-[58px] h-[58px] rounded-full overflow-hidden shrink-0">
                  <img
                    src={review.userProfileImage || '/default-profile.png'}
                    alt={review.userNickname}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 리뷰어 정보 */}
                <div className="flex flex-col gap-[3px] items-start w-[269px]">
                  <p className="body-b1-sb text-black whitespace-pre-wrap">
                    {review.userNickname}
                  </p>
                  <div className="flex gap-[6px] items-center justify-center">
                    {/* 별점 */}
                    <div className="flex gap-[3px] items-center">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={index}
                          src={starIcon}
                          alt="별"
                          className={`w-[23px] h-[23px] ${
                            index < review.star ? 'opacity-100' : 'opacity-20'
                          }`}
                        />
                      ))}
                    </div>
                    {/* 날짜 */}
                    <p className="body-b3-rg text-[var(--color-gray-50)]">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="flex-1 body-b1-rg text-black w-full whitespace-pre-wrap">
              {review.content.split('\n').map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-0' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
