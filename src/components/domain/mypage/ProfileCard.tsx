import React, { useState } from 'react';
import pin from '../../../assets/mypage/pin.svg';
import lotpictures from '../../../assets/mypage/lotpictures.svg';

const FEED_ITEMS = [
  { id: 1, type: 'pin', img: 'https://picsum.photos/seed/1/300/400' },
  { id: 2, type: 'pin', img: 'https://picsum.photos/seed/2/300/400' },
  { id: 3, type: 'multi', img: 'https://picsum.photos/seed/3/300/400' },
  { id: 4, type: 'multi', img: 'https://picsum.photos/seed/4/300/400' },
  { id: 5, type: 'normal', img: 'https://picsum.photos/seed/5/300/400' },
  { id: 6, type: 'multi', img: 'https://picsum.photos/seed/6/300/400' },
  { id: 7, type: 'normal', img: 'https://picsum.photos/seed/7/300/400' },
  { id: 8, type: 'normal', img: 'https://picsum.photos/seed/8/300/400' },
];

const SALE_ITEMS = [
  {
    id: 1,
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p1/400/400",
  },
  {
    id: 2,
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p2/400/400",
  },
  {
    id: 3,
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p3/400/400",
  },
  {
    id: 4,
    title: "메시(MESSI) 아르헨티나 국대 유니폼 리폼 상품",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p4/400/400",
  },
];

const REVIEW_ITEMS = [
  {
    id: 1,
    author: "열정적인 직관러",
    rating: 5,
    date: "2024.03.20",
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
    date: "2024.03.18",
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
    date: "2024.03.15",
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
    date: "2024.03.12",
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
    date: "2024.03.10",
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
    date: "2024.03.08",
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
    date: "2024.03.05",
    productName: "KIA 타이거즈 유니폼 리폼",
    productImg: "https://picsum.photos/seed/p7/100/100",
    productPrice: 68000,
    content: "생각보다 별로였어요. 사진 참고하고 주문했는데 색감이 달라서 아쉬워요.",
    img: ["https://picsum.photos/seed/r7a/200/200", "https://picsum.photos/seed/r7b/200/200", "https://picsum.photos/seed/r7c/200/200"], // 이미지 3개
  },
];



const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState('피드');

  const tabs = [
    { name: '피드', count: null },
    { name: '판매 상품', count: 4 },
    { name: '후기', count: 271 },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* ───────── 상단 탭 ───────── */}
      <nav className="flex border-b border-gray-200 bg-white px-20 md:px-40">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 py-4 text-[14px] font-semibold text-center relative
              ${activeTab === tab.name ? 'text-[#4db6ac]' : 'text-gray-500'}`}
          >
            {tab.name}
            {tab.count !== null && (
              <span className="ml-1 text-[12px]">({tab.count})</span>
            )}

            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4db6ac]" />
            )}
          </button>
        ))}
      </nav>

      {/* ───────── 컨텐츠 영역 ───────── */}
        {/* ===== 피드 ===== */}
      {activeTab === '피드' && (
        <div className="w-full bg-[#f5f5f5] py-10">
          <div className="max-w-[1100px] mx-auto px-10">
            {FEED_ITEMS.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] pb-24 text-black text-sm">
                아직 등록된 게시글이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-[2px] bg-gray-200">
                {FEED_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-[3/4] bg-white overflow-hidden"
                  >
                    <img
                      src={item.img}
                      alt="feed"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2 right-2 drop-shadow-md">
                      {item.type === 'pin' && <img src={pin} alt="pin" className="w-8 h-8" />}
                      {item.type === 'multi' && <img src={lotpictures} alt="lotpictures" className="w-8 h-8" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
        </div>
      )}

        {/* 판매 상품 */}
        {activeTab === '판매 상품' && (
          <div className='bg-white py-10 px-28'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {SALE_ITEMS.map((item) => (
                <div key={item.id} className="flex flex-col group cursor-pointer">
                    {/* 상품 이미지 프레임 */}
                    <div className="relative aspect-square mb-3 overflow-hidden rounded-[20px] bg-white border border-gray-100">
                    <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* 하트 아이콘 (찜) */}
                    <div className="absolute bottom-3 right-3">
                        <svg className="w-6 h-6 text-white drop-shadow-md fill-none stroke-current stroke-2 hover:fill-red-500 hover:text-red-500 transition-colors" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                    </div>
                    </div>

                    {/* 상품 정보 영역 */}
                    <div className="space-y-1">
                    <h3 className="text-[18px] leading-snug text-black line-clamp-2 min-h-[40px] font-semibold">
                        {item.title}
                    </h3>
                    <div className="text-[28px] font-bold text-black">
                        {item.price}
                    </div>
                    <div className="flex items-center text-[16px] text-gray-500">
                        <span className="text-yellow-400 text-[18px] mr-1 relative -translate-y-[2px]">★</span>
                        <span className="font-regular text-gray-700">{item.rating}</span>
                        <span className="ml-1">({item.reviews})</span>
                    </div>
                    <div className="pt-1">
                        <span className="inline-block bg-[#E9EBEE] text-[#646F7C] font-semibold text-[12px] px-2 py-0.5 rounded">
                        {item.nickname}
                        </span>
                    </div>
                    </div>
                </div>
                ))}
                </div>
            </div>
        )}

          {/* ===== 후기 ===== */}
          {activeTab === '후기' && (
            <div className="bg-gray-100 py-10">
              <div className="bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* 무조건 2열로 배치되는 그리드 */}
                    <div className="columns-2 gap-4 space-y-4">
                        {REVIEW_ITEMS.map((item) => (
                        <div 
                          key={item.id} 
                          className="break-inside-avoid bg-white rounded-[10px] p-5 shadow-sm border border-[#C5C8CE] transition-all hover:shadow-md"
                        >
                        {/* 유저 정보 섹션 */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-gray-900 truncate">{item.author}</div>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                <span className="text-yellow-400 font-bold">
                                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                                </span>
                                <span>{item.date}</span>
                              </div>
                            </div>
                        </div>

                        {/* 리뷰 텍스트 */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {item.content}
                        </p>

                        {/* 이미지 조건부 렌더링: img 배열이 있을 때만 렌더링 */}
                        {item.img && item.img.length > 0 && (
                          <div className={`mb-4 grid gap-2 ${item.img.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {item.img.map((src, index) => (
                              <div key={index} className="overflow-hidden border border-gray-50 aspect-square">
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
                        <div className={'bg-gray-100 p-3 flex items-center gap-3 border border-gray-100 '}>
                          <div className="w-12 h-12 bg-white overflow-hidden flex-shrink-0">
                            <img src={item.productImg} alt="상품 이미지" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] text-black-700 line-clamp-2">
                                {item.productName}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{item.productPrice}원</div>
                          </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          )}
    </div>
  );
};

export default ProfileCard;
