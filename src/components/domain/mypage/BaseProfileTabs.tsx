import React, { useState, useEffect } from 'react';
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

  // ───────── 디버깅: ownerId 확인 ─────────
  useEffect(() => {
    console.log('OwnerId:', ownerId);
    // UUID 형식 체크 (간단)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ownerId)) {
      console.warn('⚠️ ownerId가 올바른 UUID 형식이 아닙니다!');
    }
  }, [ownerId]);

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
                  </div>

                  <div className="space-y-1">
                    <h3 className="body-b0-sb text-black line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
                    <div className="heading-h4-bd text-black">{item.price}</div>
                    <div className="flex items-center">
                      <span className="text-[#FFCF41] text-[1.125rem] mr-1 relative -translate-y-[0.125rem]"><img src={star} alt="별" /></span>
                      <span className="body-b3-rg text-black">{item.avgStar}</span>
                      <span className="ml-1 text-[var(--color-gray-50)]">({item.reviewCount})</span>
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
              <MyReviewGrid />
            </div>
          )}
    </div>
  );
};

export default BaseProfileTabs;