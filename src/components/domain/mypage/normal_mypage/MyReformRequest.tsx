import React from 'react';


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
