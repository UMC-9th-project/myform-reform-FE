import Review from './review/Review';
import ReviewFilter from './review/ReviewFilter';
import Pagination from '../../Pagination/Pagination';
import PhotoReviewGallery from './review/PhotoReviewGallery';
import starIcon from '../../../../assets/icons/star.svg';

interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  date: string;
  reviewText?: string;
  image?: string;
  profileImg?: string;
}

interface ProductReviewSectionProps {
  rating: number;
  photoReviewCount: number;
  reviews: ReviewData[];
  currentPage: number;
  itemsPerPage?: number;
  sortBy?: 'latest' | 'high' | 'low';
  onSortChange?: (sortBy: 'latest' | 'high' | 'low') => void;
  onPageChange?: (page: number) => void;
  onMorePhotoReviewsClick?: () => void;
  photoReviewImages?: string[];
}

const ProductReviewSection = ({
  rating,
  photoReviewCount,
  reviews,
  currentPage,
  itemsPerPage = 5,
  sortBy = 'latest',
  onSortChange,
  onPageChange,
  onMorePhotoReviewsClick,
  photoReviewImages,
}: ProductReviewSectionProps) => {
  // 별점 표시 함수
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: fullStars }).map((_, i) => (
          <img key={`full-${i}`} src={starIcon} alt="star" className="w-8 h-8" />
        ))}
        {hasHalfStar && (
          <img src={starIcon} alt="half star" className="w-8 h-8 opacity-50" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <img key={`empty-${i}`} src={starIcon} alt="empty star" className="w-5 h-5 opacity-20" />
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedReviews = reviews.slice(startIndex, endIndex);

  const filterOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'high', label: '별점 높은 순' },
    { value: 'low', label: '별점 낮은 순' },
  ];

  return (
    <div className="mb-16">
      <div className="heading-h4-bd text-[var(--color-black)] mb-2 ">상품후기({reviews.length})</div>
      {/* 전체 평점 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          {renderStars(rating)}
          <span className="heading-h4-bd text-[var(--color-black)]">{rating}</span>
        </div>
      </div>

      {/* 사진 후기 섹션 */}
      <PhotoReviewGallery
        photoReviewCount={photoReviewCount}
        onMoreClick={onMorePhotoReviewsClick}
        photos={photoReviewImages}
      />

      {/* 정렬 필터 */}
      <div className="mb-6">
        <ReviewFilter
          options={filterOptions}
          selectedValue={sortBy}
          onSelect={(value) => onSortChange?.(value as 'latest' | 'high' | 'low')}
        />
      </div>

      {/* 후기 리스트 */}
      <div className="space-y-8 mb-8">
        {displayedReviews.map((review) => (
          <Review
            key={review.id}
            userName={review.userName}
            rating={review.rating}
            date={review.date}
            reviewText={review.reviewText}
            image={review.image}
            profileImg={review.profileImg}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination totalPages={totalPages} onPageChange={onPageChange || (() => {})} />
      )}
    </div>
  );
};

export default ProductReviewSection;
