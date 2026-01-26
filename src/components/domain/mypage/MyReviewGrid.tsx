import React from 'react';
import starYellow from '../../../assets/icons/star.svg';
import starGray from '../../../assets/icons/emptyStar.svg';

interface ReviewItem {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
  img?: string[];
  productImg: string;
  productName: string;
  productPrice: number;
}

/* ===== 더미 데이터 ===== */
const REVIEW_ITEMS: ReviewItem[]= [
  {
    id: 1,
    author: "열정적인 직관러",
    rating: 5,
    date: "2024년 03월 20일",
    productName: "이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.",
    productImg: "https://picsum.photos/seed/p1/100/100",
    content: "정말 만족스러워요! 마감 처리도 깔끔하고 배송도 생각보다 빨랐습니다. 다음에 원정 유니폼도 맡길게요.",
    productPrice: 75000,
    img: [
      "https://picsum.photos/seed/r1a/200/200",
      "https://picsum.photos/seed/r1b/200/200",
      "https://picsum.photos/seed/r1c/200/200",
    ],
  },
  {
    id: 2,
    author: "KBO팬123",
    rating: 4,
    date: "2024년 03월 18일",
    productName: "롯데 자이언츠 유니폼 리폼 상품",
    productImg: "https://picsum.photos/seed/p2/100/100",
    productPrice: 68000,
    content: "디자인이 예쁘게 잘 나왔어요. 사이즈 상담이 조금 늦었지만 결과물 만족!",
    
    img: [], // 이미지 없는 리뷰
  },
  {
    id: 3,
    author: "유니폼수집가",
    rating: 5,
    date: "2024년 03월 15일",
    productName: "메시 아르헨티나 국대 리폼",
    productImg: "https://picsum.photos/seed/p3/100/100",
    productPrice: 75000,
    content: "와… 진짜 새 옷 같아요. 리폼 퀄리티 최고!",
    img: ["https://picsum.photos/seed/r3/200/200"], // 이미지 1개
  },
  {
    id: 4,
    author: "야구광팬",
    rating: 3,
    date: "2024년 03월 12일",
    productName: "LG 트윈스 유니폼 리폼",
    productImg: "https://picsum.photos/seed/p4/100/100",
    productPrice: 7000,
    content: "괜찮아요. 배송은 빠르지만 마감이 조금 아쉬워요.",
    img: ["https://picsum.photos/seed/r4a/200/200", "https://picsum.photos/seed/r4b/200/200"], // 이미지 2개
  },
  {
    id: 5,
    author: "소심한팬",
    rating: 4,
    date: "2024년 03월 10일",
    productName: "삼성 라이온즈 유니폼 리폼",
    productImg: "https://picsum.photos/seed/p5/100/100",
    productPrice: 80000,
    content: "", // 글 없는 리뷰
    img: ["https://picsum.photos/seed/r5a/200/200"], // 사진만 있음
  },
  {
    id: 6,
    author: "열혈서포터",
    rating: 5,
    date: "2024년 03월 08일",
    productName: "두산 베어스 유니폼 리폼",
    productImg: "https://picsum.photos/seed/p6/100/100",
    productPrice: 72000,
    content: "역시 최고예요! 리폼 퀄리티가 기대 이상입니다.", // 글만 있는 리뷰
    img: [],
  },
  {
    id: 7,
    author: "야구소년",
    rating: 2,
    date: "2024년 03월 05일",
    productName: "KIA 타이거즈 유니폼 리폼",
    productImg: "https://picsum.photos/seed/p7/100/100",
    productPrice: 68000,
    content: "생각보다 별로였어요. 사진 참고하고 주문했는데 색감이 달라서 아쉬워요.",
    img: ["https://picsum.photos/seed/r7a/200/200", "https://picsum.photos/seed/r7b/200/200", "https://picsum.photos/seed/r7c/200/200"], // 이미지 3개
  },
];


/* ===== 컴포넌트 ===== */
const MyReviewGrid: React.FC = () => {
  return (
    <div className="bg-transparent py-10">
      <div className="max-w-4xl mx-auto">
        {/* 무조건 2열 masonry */}
        <div className="columns-2 gap-4 space-y-4">
          {REVIEW_ITEMS.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white rounded-[0.625rem] p-5
                         border border-[var(--color-line-gray-40)]
                         shadow-sm hover:shadow-md transition-all"
            >
              {/* 유저 정보 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300" />
                <div className="flex-1 min-w-0">
                  <div className="body-b1-sb text-black truncate">
                    {item.author}
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.68rem] text-[var(--color-gray-40)]">
                    <span className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={index}
                          src={index < item.rating ? starYellow : starGray}
                          alt="별"
                          className="w-4 h-4"
                        />
                      ))}
                    </span>
                    <span className='body-b3-rg text-[var(--color-gray-50)]'>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* 리뷰 텍스트 */}
              <p className="body-b1-rg text-black leading-relaxed mb-4">
                {item.content}
              </p>

              {/* 리뷰 이미지 */}
              {item.img && item.img.length > 0 && (
                <div
                  className={`mb-4 grid gap-2 ${
                    item.img.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}
                >
                  {item.img.map((src, index) => (
                    <div key={index} className="overflow-hidden aspect-square">
                      <img
                        src={src}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 하단 상품 정보 */}
              <div className="bg-[var(--color-gray-20)] p-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-white overflow-hidden flex-shrink-0">
                  <img
                    src={item.productImg}
                    alt="상품 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[0.69rem] body-b3-rg line-clamp-2">
                    {item.productName}
                  </div>
                  <div className="body-b1-sb text-black">
                    {item.productPrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReviewGrid;
