import React from 'react';
import MyPageTab from '../../components/domain/mypage/MyPageTab';
import { useUserTabStore, type UserTabType } from '../../stores/tabStore';

const USER_TABS: readonly UserTabType[] = [
  '내 정보',
  '내가 작성한 글',
  '구매 이력',
  '나의 후기',
];

const NormalMyPage = () => {
  const { activeTab, setActiveTab } = useUserTabStore();

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-0 py-0 flex gap-3 items-stretch">
        
        {/* 왼쪽: 사이드바 */}
        <aside className="w-64 flex-shrink-0 px-5">
          <MyPageTab
            tabs={USER_TABS}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            displayName="침착한 대머리독수리"
          />
        </aside>

        {/* 오른쪽: 메인 영역 */}
        <main className="flex-1 px-5">
          {activeTab && (
            <div className="heading-h4-bd pb-3.5 border-b border-black mt-1 mb-8">
              {activeTab}
            </div>
          )}

          {activeTab === '내 정보' && <div>내 정보</div>}
          {activeTab === '내가 작성한 글' && <div>내가 작성한 글</div>}
          {activeTab === '구매 이력' && <div>구매 이력</div>}
          {activeTab === '나의 후기' && <div>나의 후기</div>} 
        </main>
      </div>
    </div>
  );
};

export default NormalMyPage;