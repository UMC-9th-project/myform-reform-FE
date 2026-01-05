import React, { useState, useRef, useEffect } from 'react';
import moreIcon from '../../../assets/icons/morevertical.svg';
import Pencil from '../../../assets/icons/pencil.svg'
import Trash from '../../../assets/icons/trash.svg';

// 1. 데이터 타입 정의
interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  img?: string[];
  productImg: string;
  productName: string;
  productPrice: number;
}

// 2. 이미지와 동일한 테스트용 Mock Data
const MOCK_DATA: ReviewItem = {
  id: 'rev-001',
  author: '뜨거운 아이스 아메리카노',
  rating: 5,
  date: '2025년 11월 20일',
  content: `제가 정말 아끼던 유니폼이 있었는데, 사이즈도 맞지 않고 낡아서 솔직히 옷장 속에만 보관되어 있었습니다. 버리기는 너무 아깝고, 그렇다고 걸어두기엔 먼지만 쌓여서 볼 때마다 마음이 아팠습니다.\n그러다가 '리폼'이라는 것을 알게 되었고, 이 유니폼을 짐색으로 만들기로 결정했습니다. 결과는 매우 만족스럽습니다! 등번호와 이름 부분, 그리고 팀 엠블럼이 정확히 가운데 오도록 디자인해 주셨는데, 정말 세상에 하나뿐인 굿즈가 탄생한 느낌입니다.`,
  img: ['https://picsum.photos/seed/review1/600/800',
  'https://picsum.photos/seed/review2/600/800',
'https://picsum.photos/seed/review3/600/800','https://picsum.photos/seed/review4/600/800'], // 메인 리뷰 이미지
  productImg: 'https://via.placeholder.com/150', // 하단 상품 썸네일
  productName: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  productPrice: 75000
};

// 3. 컴포넌트 구현
const ReviewCard = ({ item }: { item?: ReviewItem }) => {
  // item이 넘어오면 그걸 쓰고, 없으면 MOCK_DATA를 기본으로 사용
  const data = item || MOCK_DATA;

const images = data.img?.slice(0,4) ?? [];
const isSingle = images.length === 1;

const [isMenuOpen, setIsMenuOpen] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div className="max-w-[30rem] bg-white rounded-[0.6rem] p-6 shadow-sm border border-[var(--color-line-gray-40)]">
      
      {/* --- 상단: 프로필 & 별점 & 액션 버튼 --- */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 (이미지의 핑크색 구름 느낌 재현) */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" 
              alt="profile" 
              className="w-full h-full object-cover opacity-80" 
            />
          </div>
          
          <div className="flex flex-col">
            <span className="body-b1-sb text-black mb-0">{data.author}</span>
            <div className="flex items-center gap-2">
              {/* 별점 (이미지처럼 노란색) */}
              <div className="flex text-[#FFCF41] text-[1.2rem] leading-none">
                {"★".repeat(data.rating)}{"☆".repeat(5 - data.rating)}
              </div>
              <span className="body-b3-rg text-[var(--color-gray-50)] leading-none mt-[0.25rem]">{data.date}</span>
            </div>
          </div>
        </div>

        {/* 수정 & 더보기 버튼 */}
        {/* 3. 더보기 버튼 및 드롭다운 메뉴 영역 */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-gray-20 rounded-full transition-colors"
          >
            <img src={moreIcon} alt="더보기" className="w-8 h-8 opacity-40" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-[9rem] bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
              <div className="flex flex-col py-2">
                {/* 수정하기 버튼 */}
                <button className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-gray-20)] transition-colors text-left">
                  <img src={Pencil} alt="수정하기" className="w-6 h-6" />
                  <span className="body-b1-rg text-black">수정하기</span>
                </button>
                
                {/* 삭제하기 버튼 */}
                <button className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-gray-20)] transition-colors text-left">
                  <img src={Trash} alt="삭제하기" className="w-6 h-6" />
                  <span className="body-b1-rg text-black">삭제하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- 본문: 리뷰 텍스트 --- */}
      <p className="body-b1-rg text-black mb-5 whitespace-pre-wrap">
        {data.content}
      </p>

      {/* --- 중간: 리뷰 이미지 (회색 박스 영역) --- */}
      {/* --- 리뷰 이미지 영역 --- */}
        {images.length > 0 && (
        isSingle ? (
            /* ✅ 이미지 1개: 크게 */
            <div className="w-full aspect-[3/4] bg-[#E4E4E4] mb-5 overflow-hidden">
            <img
                src={images[0]}
                alt="Review"
                className="w-full h-full object-cover"
            />
            </div>
        ) : (
            /* ✅ 이미지 2~4개: 2x2 그리드 */
            <div className="grid grid-cols-2 gap-2 mb-5">
            {images.map((src, idx) => (
                <div
                key={idx}
                className="aspect-square bg-[#E4E4E4] overflow-hidden"
                >
                <img
                    src={src}
                    alt={`Review ${idx + 1}`}
                    className="w-full h-full object-cover"
                />
                </div>
            ))}
            </div>
        )
        )}


      {/* --- 하단: 상품 요약 박스 --- */}
      <div className="bg-[var(--color-gray-20)] p-4 flex items-center gap-4">
        <div className="w-20 h-20 bg-white overflow-hidden flex-shrink-0">
          <img src={data.productImg} alt="product" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-1 overflow-hidden">
          <span className="body-b3-rg text-black line-clamp-2 leading-tight">
            {data.productName}
          </span>
          <span className="body-b1-sb text-black">
            {data.productPrice.toLocaleString()}원
          </span>
        </div>
      </div>

    </div>
  );
};

export default ReviewCard;