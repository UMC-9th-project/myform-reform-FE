import { Star } from 'lucide-react';

const Review = () => {
  const reviewData = {
    userName: '뜨거운 아이스 아메리카노',
    rating: 4,
    date: '2025년 11월 20일',
    reviewText: `제가 정말 아끼던 유니폼이 있었는데, 사이즈도 맞지 않고 낡아서 솔직히 옷장 속에만 보관되어 있었습니다. 버리기는 너무 아깝고, 그렇다고 걸어두기엔 먼지만 쌓여서 볼 때마다 마음이 아팠습니다.

그러다가 '리폼'이라는 것을 알게 되었고, 이 유니폼을 짐색으로 만들기로 결정했습니다. 결과는 매우 만족스럽습니다! 등번호와 이름 부분, 그리고 팀 엠블럼이 정확히 가운데 오도록 디자인해 주셨는데, 정말 세상에 하나뿐인 굿즈가 탄생한 느낌입니다.

옛날 유니폼이라 재질이 얇을까 염려했는데, 안에 덧댐 작업을 깔끔하게 해 주셔서 튼튼하고 마감도 완벽합니다. 이제는 경기장에 갈 때마다 여기에 응원봉과 간식 등 여러 가지를 챙겨서 다니는데, 그럴 때마다 유니폼을 입고 뛰던 시절의 추억이 새록새록 떠오릅니다. 정말 돈이 아깝지 않은 리폼이었습니다`,
  };

  return (
    <div className="w-full">
      {/* 상단: 프로필 정보 */}
      <div className="w-[341px] flex items-start gap-4 mb-4">
        {/* 프로필 사진 */}
        <div className="w-[58px] h-[58px] rounded-full bg-pink-200 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-300">
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300" />
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          {/* 사용자 이름 - 첫 줄 */}
          <h4 className="body-b1-sb">{reviewData.userName}</h4>

          {/* 별점과 날짜 - 같은 줄 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= reviewData.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-yellow-400'
                  }`}
                />
              ))}
            </div>
            <span className="pt-1 body-b3-rg text-[var(--color-gray-40)]">
              {reviewData.date}
            </span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠: 이미지 + 리뷰 텍스트 */}
      <div className="flex gap-4">
        {/* 이미지 플레이스홀더 */}
        <div className="w-[185px] h-[185px] bg-gray-200 flex-shrink-0" />

        {/* 리뷰 텍스트 */}
        <div className="w-[1005px]">
          <p className="body-b1-rg whitespace-pre-line leading-relaxed">
            {reviewData.reviewText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Review;
