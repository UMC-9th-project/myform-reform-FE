import React from 'react';
import { useTabStore, type TabType } from '../../../stores/tabStore';

const MyPageTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const tabs: TabType[] = ['프로필 관리', '판매 관리', '수익 관리'];
  
  return (
    <div className="w-[15rem] flex flex-col items-start">
      
      {/* 1. 상단 프로필 섹션 */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-line-gray-40)] w-full">
        {/* 프로필 이미지 (회색 처리) */}
        <div className="w-12 h-12 rounded-full border border-[var(--color-gray-30)] flex-shrink-0" />
        {/* 유저 닉네임 */}
        <span className="body-b1-sb text-black">침착한 대머리독수리</span>
      </div>

      {/* 2. 탭 리스트 섹션 */}
      <nav className="flex flex-col gap-6 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {setActiveTab(tab)
            }}
            className={`text-left body-b0-mb transition-all duration-200 ${
              activeTab === tab 
                ? 'body-b0-mb text-black' // 활성화 상태: 굵게, 검정색
                : 'body-b0-mb text-[var(--color-gray-50)]' // 비활성 상태: 중간 굵기, 회색
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MyPageTabs;