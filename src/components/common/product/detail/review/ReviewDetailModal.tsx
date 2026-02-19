import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTargetReviewDetail } from '../../../../../api/order/reviews';
import type { TargetType } from '../../../../../types/api/reviews';
import bigProfile from '../../../../../assets/icons/bigProfile.svg';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: TargetType;
  targetId: string;
  reviewId: string;
  initialPhotoIndex?: number;
}

const ReviewDetailModal = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  reviewId,
  initialPhotoIndex,
}: ReviewDetailModalProps) => {
  // initialPhotoIndex가 변경될 때만 초기화
  const initialIndex = useMemo(() => initialPhotoIndex ?? 0, [initialPhotoIndex]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialIndex);

  const { data: reviewDetailResponse, isLoading } = useQuery({
    queryKey: ['review-detail', targetType, targetId, reviewId, currentPhotoIndex],
    queryFn: () =>
      getTargetReviewDetail(targetType, targetId, reviewId, {
        photoIndex: currentPhotoIndex,
      }),
    enabled: isOpen && !!targetId && !!reviewId,
    staleTime: 1000 * 60,
  });

  const reviewDetail =
    reviewDetailResponse?.resultType === 'SUCCESS' && reviewDetailResponse?.success
      ? reviewDetailResponse.success
      : null;

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentPhotoIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // API 응답의 current_photo_index를 동기화 (단, 사용자가 수동으로 변경하지 않은 경우만)
  useEffect(() => {
    if (reviewDetail && reviewDetail.current_photo_index !== undefined) {
      // 현재 인덱스와 API 응답의 인덱스가 다를 때만 업데이트
      if (currentPhotoIndex !== reviewDetail.current_photo_index) {
        setCurrentPhotoIndex(reviewDetail.current_photo_index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewDetail?.current_photo_index]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrevPhoto = () => {
    if (reviewDetail?.has_prev && reviewDetail.prev_photo_index !== undefined) {
      setCurrentPhotoIndex(reviewDetail.prev_photo_index);
    } else if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (reviewDetail?.has_next && reviewDetail.next_photo_index !== undefined) {
      setCurrentPhotoIndex(reviewDetail.next_photo_index);
    } else if (reviewDetail && currentPhotoIndex < reviewDetail.photo_urls.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch {
      return dateString;
    }
  };

  const activePhotoIndex = reviewDetail?.current_photo_index ?? currentPhotoIndex ?? 0;
  const totalPhotos = reviewDetail?.total_photo_count ?? reviewDetail?.photo_urls?.length ?? 0;
  const currentPhotoNumber = totalPhotos > 0 ? activePhotoIndex + 1 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[20px] max-w-6xl w-[90%] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-gray-30)] px-8 py-6 flex items-center justify-center relative rounded-t-[20px]">
          <h2 className="heading-h5-md text-[var(--color-gray-60)]">
            사진 후기 ({totalPhotos > 0 ? `${currentPhotoNumber}/${totalPhotos}` : '0/0'})
          </h2>
          <button
            onClick={onClose}
            className="absolute right-8 w-8 h-8 flex items-center justify-center hover:bg-[var(--color-gray-20)] rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-[var(--color-gray-60)]" />
          </button>
        </div>

        {/* 내용 */}
        {isLoading && (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <p className="body-b1-rg text-[var(--color-gray-60)]">불러오는 중...</p>
          </div>
        )}

        {!isLoading && reviewDetail && (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* 왼쪽: 사진 갤러리 */}
              {reviewDetail.photo_urls && reviewDetail.photo_urls.length > 0 && (
                <div className="flex flex-col">
                  <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden mb-4 border border-[var(--color-gray-30)]">
                    <img
                      src={
                        reviewDetail.photo_urls[activePhotoIndex] ||
                        reviewDetail.photo_urls[0]
                      }
                      alt={`후기 사진 ${currentPhotoNumber}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 이전/다음 버튼 */}
                    {totalPhotos > 1 && (
                      <>
                        {(reviewDetail.has_prev || activePhotoIndex > 0) && (
                          <button
                            onClick={handlePrevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                            aria-label="이전 사진"
                          >
                            <ChevronLeft className="w-6 h-6 text-[var(--color-gray-60)]" />
                          </button>
                        )}
                        {(reviewDetail.has_next || activePhotoIndex < totalPhotos - 1) && (
                          <button
                            onClick={handleNextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                            aria-label="다음 사진"
                          >
                            <ChevronRight className="w-6 h-6 text-[var(--color-gray-60)]" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* 사진 인디케이터 */}
                  {totalPhotos > 1 && (
                    <div className="flex justify-center gap-2">
                      {reviewDetail.photo_urls.map((_, index) => {
                        const isActive = index === activePhotoIndex;
                        return (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              isActive ? 'bg-[var(--color-mint-0)]' : 'bg-[var(--color-gray-30)]'
                            }`}
                            aria-label={`사진 ${index + 1}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 오른쪽: 리뷰 상세 정보 */}
              <div className="flex flex-col">
                {/* 프로필 정보 */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-gray-30)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {reviewDetail.user_profile_image && reviewDetail.user_profile_image.trim() !== '' ? (
                      <img
                        src={reviewDetail.user_profile_image}
                        alt={reviewDetail.user_nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={bigProfile} alt={reviewDetail.user_nickname} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="body-b1-sb mb-2">{reviewDetail.user_nickname}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= reviewDetail.star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-yellow-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="body-b3-rg text-[var(--color-gray-40)]">
                        {formatDate(reviewDetail.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 텍스트 */}
                {reviewDetail.content && (
                  <div className="rounded-lg p-4 min-h-[200px]">
                    <p className="body-b1-rg whitespace-pre-line leading-relaxed text-[var(--color-black)]">
                      {reviewDetail.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !reviewDetail && (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <p className="body-b1-rg text-[var(--color-gray-60)]">리뷰를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailModal;
