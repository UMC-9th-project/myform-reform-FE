import React, { useState } from 'react';
import lotpictures from '../../../assets/mypage/lotpictures.svg';
import { useNavigate } from 'react-router-dom';
import MyPageUpload from './ReformerFeedUpload';
import MyReviewGrid from './MyReviewGrid';
import star from '../../../assets/icons/star.svg';
import { useQuery } from '@tanstack/react-query';
import { getMyReformerInfo } from '../../../api/profile/user';
import type { GetMyReformerInfoResponse } from '../../../types/domain/mypage/reformerUser';

export type ProfileTabType = '피드' | '판매 상품' | '후기';
export type ProfileMode = 'view' | 'edit';
export type SaleSubTabType = '마켓 판매' | '주문 제작';

interface BaseProfileTabsProps {
  mode?: ProfileMode;
}

const SALE_ITEMS = [
  {
    id: 1,
    subType: '마켓 판매',
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p1/400/400",
  },
  {
    id: 2,
    subType: '마켓 판매',
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p2/400/400",
  },
  {
    id: 3,
    subType: '주문 제작',
    title: "이제는 유니폼도 색다르게!\n한화·롯데 등 야구단 유니폼 리폼해드립니...",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p3/400/400",
  },
  {
    id: 4,
    subType:'마켓 판매',
    title: "메시(MESSI) 아르헨티나 국대 유니폼 리폼 상품",
    price: "75,000원",
    rating: 4.9,
    reviews: 271,
    nickname: "침착한 대머리독수리",
    img: "https://picsum.photos/seed/p4/400/400",
  },
];

const BaseProfileTabs = ({ mode = 'view' } : BaseProfileTabsProps) => {
  const [activeSaleSubTab, setActiveSaleSubTab] = useState<SaleSubTabType>('마켓 판매');
  const [activeTab, setActiveTab] = useState<'피드' | '판매 상품' | '후기'>('피드');
  const [showModal, setShowModal] = useState(false);
  const [feedItems, setFeedItems] = useState<{ id: number; files: File[] }[]>([]);
  const navigate = useNavigate();

  const { data: reformerInfo, isLoading, isError } = useQuery<GetMyReformerInfoResponse, Error>({
  queryKey: ['myReformerInfo'],
  queryFn: getMyReformerInfo,
});

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reformer info.</div>;

  const profileData = reformerInfo?.success;
  const saleCount = profileData?.totalSales ?? 0;
  const reviewCount = profileData?.reviewCount ?? 0;
  const tabs: { name: ProfileTabType; count: number | null }[] = [
    { name: '피드', count: null },
    { name: '판매 상품', count: saleCount },
    { name: '후기', count: reviewCount },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* ───────── 상단 탭 ───────── */}
      <nav className="flex border-b border-[var(--color-line-gray-40)] body-b0-bd bg-white px-20 md:px-40">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 py-4 body-b0-bd text-center relative
              ${activeTab === tab.name ? 'text-[var(--color-mint-1)]' : 'text-black'}`}
          >
            {tab.name}
            {tab.count !== null && (
              <span className="ml-1 body-b0-bd">({tab.count})</span>
            )}

            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 w-full h-[0.125rem] bg-[var(--color-mint-1)]" />
            )}
          </button>
        ))}
      </nav>

      {/* ───────── 컨텐츠 영역 ───────── */}
        {/* ===== 피드 ===== */}
      {activeTab === '피드' && (
        <>
        <div className="w-full bg-transparent py-10 relative">
          <div className="max-w-[68.75rem] mx-auto px-10">
            {feedItems.length === 0 ? (
              <div className="flex items-center justify-center h-[18.75rem] pb-24 body-b1-rg">
                아직 등록된 게시글이 없습니다.
              </div>
              ) : (
              <div className="grid grid-cols-4 gap-[0.125rem]">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-[3/4] bg-white overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(item.files[0])}
                      alt="feed"
                      className="w-full h-full object-cover"
                    />

                    <div>
                      {item.files.length > 1 && (
                        <div className='absolute top-2 right-2 dropw-shadow-md'>
                          <img src={lotpictures} alt="multi" className='w-8 h-8' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            { mode === 'edit' && (
              <button 
                className="absolute top-10 right-2 md:right-4 w-14 h-14 bg-white border border-[var(--color-mint-1)] rounded-full flex items-center justify-center shadow-lg hover:bg-teal-50 transition-all z-10"
                title="피드 글쓰기"
                onClick={() => setShowModal(true)}
                >
                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 27H6.57124L27 6.57124L21.4281 1L1 21.4288V27Z" stroke="#07BEB8" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M15.8555 6.57031L21.4267 12.1416" stroke="#07BEB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 27.5H27.5" stroke="#07BEB8" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            )}
            </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                ✕
              </button>

              {/* 업로드 컴포넌트 */}
              <MyPageUpload 
                onClose={() => setShowModal(false)}
                onFileSelected={(files) => {
                  const newItem = {id: Date.now(), files};
                  setFeedItems(prev => [newItem, ...prev]);
                }} />
           </div>
          </div>
        )}
        </>
      )}
        {/* 판매 상품 */}
        {activeTab === '판매 상품' && (
          <div className="bg-white py-10 px-28 relative">
            
            {/* ───────── 서브 탭 ───────── */}
           <div className="flex mb-3 gap-4">
            {(['마켓 판매', '주문 제작'] as SaleSubTabType[]).map((tab, index, arr) => (
              <React.Fragment key={tab}>
                <span
                  onClick={() => setActiveSaleSubTab(tab)}
                  className={`cursor-pointer transition-colors ${
                    activeSaleSubTab === tab ? 'body-b1-sb text-black' : 'body-b1-rg text-[var(--color-gray-60)] hover:text-black'
                  }`}
                >
                  {tab}
                </span>
                {index < arr.length - 1 && <span className="text-gray-400">|</span>}
              </React.Fragment>
            ))}
          </div>


            {/* ───────── 상품 리스트 ───────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {SALE_ITEMS.filter(item => item.subType === activeSaleSubTab).map((item) => (
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
                    <div className="flex items-center">
                      <span className="text-[#FFCF41] text-[1.125rem] mr-1 relative -translate-y-[0.125rem]"><img src={star} alt="별" /></span>
                      <span className="body-b3-rg text-black">{item.rating}</span>
                      <span className="ml-1 text-[var(--color-gray-50)]">({item.reviews})</span>
                    </div>
                    <div className="pt-1">
                      <span className="inline-block bg-[var(--color-gray-30)] text-body-b5-sb text-[var(--color-gray-50)] px-2 py-0.5 rounded">
                        {item.nickname}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 글쓰기 버튼 */}
            {mode === 'edit' && (
              <button 
                className="absolute top-10 right-2 md:right-4 w-14 h-14 bg-white border border-[var(--color-mint-1)] rounded-full flex items-center justify-center shadow-lg hover:bg-teal-50 transition-all z-10"
                title={
                  activeSaleSubTab === '마켓 판매'
                  ? '마켓 판매 글쓰기'
                  : '주문 제작 글쓰기'
                }
                onClick={() => {
                  if (activeSaleSubTab === '마켓 판매') {
                    navigate('/sales/create');
                  } else {
                    navigate('/custom/create');
                  }
                }}
              >
                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 27H6.57124L27 6.57124L21.4281 1L1 21.4288V27Z" stroke="#07BEB8" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M15.8555 6.57031L21.4267 12.1416" stroke="#07BEB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 27.5H27.5" stroke="#07BEB8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        )}


          {/* ===== 후기 ===== */}
          {activeTab === '후기' && (
            <MyReviewGrid />
          )}
    </div>
  );
};

export default BaseProfileTabs;