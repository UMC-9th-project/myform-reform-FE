import React, { useState } from 'react';
import lotpictures from '../../../assets/mypage/lotpictures.svg';
import { useNavigate } from 'react-router-dom';
import MyPageUpload from './ReformerFeedUpload';
import MyReviewGrid from './MyReviewGrid';
import star from '../../../assets/icons/star.svg';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../../api/profile/user';
import { getProfileSales } from '../../../api/profile/sale';
import { getProfileProposal } from '../../../api/profile/proposal';
import type { GetProfileResponse } from '../../../types/domain/profile/profile';
import type { GetProfileSalesResponse } from '../../../types/domain/profile/sales';
import type { GetProfileProposalsResponse } from '../../../types/domain/profile/proposal';
import heart from '../../../assets/icons/heart.svg';
import { getProfileReviews } from '../../../api/profile/review';
import type { GetProfileReviewsResponse } from '../../../types/domain/profile/review';
import type { ReviewItem } from '../../../components/domain/mypage/MyReviewGrid';

export type ProfileTabType = '피드' | '판매 상품' | '후기';
export type ProfileMode = 'view' | 'edit';
export type SaleSubTabType = '마켓 판매' | '주문 제작';

interface BaseProfileTabsProps {
  mode?: ProfileMode;
  ownerId: string;
}

const BaseProfileTabs = ({ mode = 'view', ownerId }: BaseProfileTabsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTabType>('피드');
  const [activeSaleSubTab, setActiveSaleSubTab] = useState<SaleSubTabType>('마켓 판매');
  const [showModal, setShowModal] = useState(false);
  const [feedItems, setFeedItems] = useState<{ id: number; files: File[] }[]>([]);
  

  // ───────── 프로필 정보 ─────────
  const profileQuery = useQuery<GetProfileResponse, Error>({
    queryKey: ['profile', ownerId],
    queryFn: () => getProfile(ownerId),
    enabled: !!ownerId,
  });

  // ───────── 판매 상품 목록 ─────────
  const salesQuery = useQuery<GetProfileSalesResponse, Error>({
    queryKey: ['profileSales', ownerId],
    queryFn: () => getProfileSales({ ownerId, limit: 15 }),
    enabled: activeTab === '판매 상품' && !!ownerId,
  });

  const proposalQuery = useQuery<GetProfileProposalsResponse, Error>({
    queryKey: ['profileProposals', ownerId],
    queryFn: () => getProfileProposal({ ownerId, limit: 15 }),
    enabled: activeTab === '판매 상품' && activeSaleSubTab === '주문 제작' && !!ownerId,
  });


  const reviewQuery = useQuery<GetProfileReviewsResponse, Error>({
    queryKey: ['profileReviews', ownerId],
    queryFn: () => getProfileReviews({ ownerId, limit: 15 }),
    enabled: !!ownerId && activeTab === '후기',
  });

  const reviews: ReviewItem[] =
  reviewQuery.data?.success.reviews.map((r) => ({
    id: r.reviewId,                   // API에서 reviewId -> MyReviewGrid id
    author: r.userNickname,           // userNickname -> author
    rating: r.star,                   // star -> rating
    date: r.createdAt,                // createdAt -> date
    content: r.content,
    img: r.photos,                     // photos -> img
    productImg: r.productPhoto,       // productPhoto -> productImg
    productName: r.productTitle,      // productTitle -> productName
    productPrice: r.productPrice,     // productPrice 그대로
  })) ?? [];


  // ───────── 로딩 / 에러 처리 ─────────
  if (profileQuery.isLoading) return <div>Loading...</div>;
  if (profileQuery.isError || !profileQuery.data?.success)
    return <div>Error loading profile.</div>;

  
  const profileData = profileQuery.data.success;
  const saleCount = profileData.totalSaleCount ?? 0;
  const reviewCount = profileData.reviewCount ?? 0;

  const tabs: { name: ProfileTabType; count: number | null }[] = [
    { name: '피드', count: null },
    { name: '판매 상품', count: saleCount },
    { name: '후기', count: reviewCount },
  ];

  const saleItems =
    activeSaleSubTab === '마켓 판매'
      ? salesQuery.data?.success?.items ?? []
      : proposalQuery.data?.success?.proposals ?? [];

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
              {saleItems.map((item) => (
                <div 
                  key={'itemId' in item ? item.itemId : item.proposalId} className="flex flex-col group cursor-pointer">
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-[1.25rem] bg-white">
                    <img
                      src={item.photo ?? '/images/default.png'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* isWished에 따라 다른 하트 표시 */}
                    <div className="absolute bottom-2 right-2 w-10 h-10">
                      {item.isWished ? (
                        // SVG 하트
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M34.4543 22.4866L20.0173 37.332L5.58038 22.4866C4.62813 21.5245 3.87805 20.3682 3.37739 19.0903C2.87673 17.8125 2.63632 16.4408 2.67131 15.0618C2.70629 13.6827 3.01592 12.3261 3.58068 11.0774C4.14544 9.82872 4.95311 8.71494 5.95283 7.80624C6.95254 6.89754 8.12264 6.2136 9.38945 5.79748C10.6563 5.38136 11.9923 5.24208 13.3135 5.38841C14.6347 5.53474 15.9124 5.96351 17.0662 6.64772C18.2199 7.33193 19.2248 8.25676 20.0173 9.36397C20.8134 8.2648 21.8193 7.34805 22.9723 6.6711C24.1253 5.99415 25.4004 5.57157 26.7179 5.42982C28.0354 5.28806 29.3669 5.43017 30.629 5.84726C31.8912 6.26435 33.0569 6.94744 34.0531 7.85378C35.0493 8.76011 35.8546 9.87018 36.4185 11.1145C36.9825 12.3588 37.2931 13.7106 37.3307 15.0853C37.3684 16.46 37.1324 17.8279 36.6374 19.1035C36.1425 20.3791 35.3993 21.5349 34.4543 22.4986"
                            fill="#F66F6F"
                          />
                          <path
                            d="M34.4543 22.4866L20.0173 37.332L5.58038 22.4866C4.62813 21.5245 3.87805 20.3682 3.37739 19.0903C2.87673 17.8125 2.63632 16.4408 2.67131 15.0618C2.70629 13.6827 3.01592 12.3261 3.58068 11.0774C4.14544 9.82872 4.95311 8.71494 5.95283 7.80624C6.95254 6.89754 8.12264 6.2136 9.38945 5.79748C10.6563 5.38136 11.9923 5.24208 13.3135 5.38841C14.6347 5.53474 15.9124 5.96351 17.0662 6.64772C18.2199 7.33193 19.2248 8.25676 20.0173 9.36397C20.8134 8.2648 21.8193 7.34805 22.9723 6.6711C24.1253 5.99415 25.4004 5.57157 26.7179 5.42982C28.0354 5.28806 29.3669 5.43017 30.629 5.84726C31.8912 6.26435 33.0569 6.94744 34.0531 7.85378C35.0493 8.76011 35.8546 9.87018 36.4185 11.1145C36.9825 12.3588 37.2931 13.7106 37.3307 15.0853C37.3684 16.46 37.1324 17.8279 36.6374 19.1035C36.1425 20.3791 35.3993 21.5349 34.4543 22.4986"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        // false면 heart 이미지
                        <img src={heart} alt="heart" className="w-full h-full" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="body-b0-sb text-black line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
                    <div className="heading-h4-bd text-black">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</div>
                    <div className="flex items-center">
                      <span className="text-[#FFCF41] text-[1.125rem] mr-1 relative -translate-y-[0.125rem]"><img src={star} alt="별" /></span>
                      <span className="body-b3-rg text-black">{item.avgStar ?? '별점이 없습니다'}</span>
                      <span className="ml-1 text-[var(--color-gray-50)]">({item.reviewCount ?? 0})</span>
                    </div>
                    <div className="pt-1">
                      <span className="inline-block bg-[var(--color-gray-30)] text-body-b5-sb text-[var(--color-gray-50)] px-2 py-0.5 rounded">
                        {item.sellerName}
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
            <div className="pt-10">
              {reviews.length === 0 ? (
                <div className="flex items-center justify-center h-[18.75rem] pb-24 body-b1-rg">
                  아직 작성된 리뷰가 없습니다.
                </div>
              ) : (
                <MyReviewGrid reviews={reviews} isEditable={mode === 'edit'} />
              )}
            </div>
          )}

    </div>
  );
};

export default BaseProfileTabs;