import React from 'react';
import MyPageTab from '../../components/domain/mypage/MyPageTab';
import EditProfile from '../../components/domain/mypage/EditProfile';
import EditProfileCard from '../../components/domain/mypage/EditProfileCard';
import { useTabStore } from '../../stores/tabStore';
import OrderDetail from '../../components/domain/mypage/OrderDetail';
import OrderList from '../../components/domain/mypage/OrderList';

const ReformerMyPage = () => {
  const { activeTab, selectedOrderId } = useTabStore();
  
  // EditProfileCard가 표시되는 탭인지 확인
  const showEditProfileCard = activeTab === '프로필 관리';

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-0 py-0 flex gap-3">
        
        {/* 왼쪽: 사이드바 */}
        <aside className= "w-64 flex-shrink-0 px-5">
          <MyPageTab />
        </aside>

        {/* 메인 컨텐츠 영역 */}
        <main className={showEditProfileCard ? 'flex-1' : 'w-5/6 px-5'}>
          {/* 탭별 제목 (EditProfile이 아닐 때만) */}
          {!showEditProfileCard && activeTab && (
            <div className='heading-h4-bd pb-3.5 border-b border-[black] mt-1 mb-8'>
              {activeTab}
            </div>
          )}

          {/* 탭별 컨텐츠 */}
          {activeTab === '프로필 관리' && <EditProfile />}
          {activeTab === '판매 관리' && (
            selectedOrderId? <OrderDetail /> : <OrderList />
          )}
          {/* 다른 탭들 추가 */}
        </main>
      </div>

      {/* EditProfileCard는 showEditProfileCard일 때만 */}
      {showEditProfileCard && <EditProfileCard />}
    </div>
  );
};

export default ReformerMyPage;