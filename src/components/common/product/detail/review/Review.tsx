import { Star } from 'lucide-react';

interface ReviewProps {
  userName?: string;
  rating?: number;
  date?: string;
  reviewText?: string;
  image?: string;
  profileImg?: string;
}

const Review = ({
  userName = '뜨거운 아이스 아메리카노',
  rating = 4,
  date = '2025년 11월 20일',
  reviewText,
  image,
  profileImg,
}: ReviewProps) => {
  return (
    <div className="w-full">
      {/* 상단: 프로필 정보 */}
      <div className="w-[341px] flex items-start gap-4 mb-4">
        {/* 프로필 사진 */}
        <div className="w-[58px] h-[58px] rounded-full bg-pink-200 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-300">
          {profileImg ? (
            <img src={profileImg} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300" />
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          {/* 사용자 이름 - 첫 줄 */}
          <h4 className="body-b1-sb">{userName}</h4>

          {/* 별점과 날짜 - 같은 줄 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-yellow-400'
                  }`}
                />
              ))}
            </div>
            <span className="pt-1 body-b3-rg text-[var(--color-gray-40)]">
              {date}
            </span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠: 이미지 + 리뷰 텍스트 */}
      {(reviewText || image) && (
        <>
          {image && reviewText ? (
            <div className="flex gap-4">
              {/* 이미지 */}
              <img
                src={image}
                alt="후기 사진"
                className="w-[185px] h-[185px] object-cover flex-shrink-0 "
              />

              {/* 리뷰 텍스트 */}
              <div className="flex-1">
                <p className="body-b1-rg whitespace-pre-line leading-relaxed">
                  {reviewText}
                </p>
              </div>
            </div>
          ) : image ? (
            <div>
              <img
                src={image}
                alt="후기 사진"
                className="w-[185px] h-[185px] object-cover flex-shrink-0 "
              />
            </div>
          ) : (
            <div>
              <p className="body-b1-rg whitespace-pre-line leading-relaxed">
                {reviewText}
              </p>
            </div>
          )}
        </>
      )}
      <div className="pb-7 border-b border-[var(--color-line-gray-40)]"></div>

    </div>
  );
};

export default Review;
