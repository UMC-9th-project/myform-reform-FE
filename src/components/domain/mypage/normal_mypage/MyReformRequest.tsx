import React, { useEffect, useRef, useState } from 'react';
import moreVertical from '../../../../assets/icons/morevertical.svg';
import Pencil from '../../../../assets/icons/pencil.svg';
import Trash from '../../../../assets/icons/trash.svg';

interface ReformRequestItem {
  id: number;
  title: string;
  price: string;
  nickname: string;
  img: string;
}


const SALE_ITEMS: ReformRequestItem[] = [
  {
    id: 1,
    title: "기아 타이거즈 유니폼 짐색으로 리폼해주실 분을 찾습니다",
    price: "75,000원",
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p1/400/400",
  },
  {
    id: 2,
    title: "기아 타이거즈 유니폼 짐색으로 리폼해주실 분을 찾습니다",
    price: "30,000~50,000원",
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p2/400/400",
  },
  {
    id: 3,
    title: "기아 타이거즈 유니폼 짐색으로 리폼해주실 분을 찾습니다",
    price: "30,000~50,000원",
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p2/400/400",
  },
];

const MyReformRequest: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
  
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="bg-white py-10 relative">

      {/* ───────── 리폼 요청글 리스트 ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {SALE_ITEMS.map((item) => (
          <div key={item.id} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-square mb-3 overflow-hidden rounded-[1.25rem] bg-white">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <h3 className="body-b0-sb text-black line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
              <div className="heading-h4-bd text-black">{item.price}</div>
              <div className="flex justify-end relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === item.id ? null : item.id);
                }}
                className="p-1"
              >
                <img src={moreVertical} alt="더보기 버튼" className="w-7 h-7" />
              </button>

              {/* 드롭다운 */}
              {openMenuId === item.id && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full mt-2 p-1 w-40
                            rounded-[1.385rem]
                            bg-white
                            shadow-[0px_4px_10.7px_0px_#00000038]
                            overflow-hidden z-10 space-y-1"
                >
                  <button
                    className="w-full px-4 py-2 text-left body-b1-rg flex gap-2 items-center"
                    onClick={() => {
                      setOpenMenuId(null);
                      console.log('수정', item.id);
                    }}
                  >
                    <img src={Pencil} alt="수정" className="w-8" />
                    <span>수정하기</span>
                  </button>

                  <button
                    className="w-full px-4 py-2 text-left body-b1-rg flex gap-2 items-center"
                    onClick={() => {
                      setOpenMenuId(null);
                      console.log('삭제', item.id);
                    }}
                  >
                    <img src={Trash} alt="삭제" className="w-8" />
                    <span>삭제하기</span>
                  </button>
                </div>
              )}
            </div>

              <div className="pt-1">
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyReformRequest;
