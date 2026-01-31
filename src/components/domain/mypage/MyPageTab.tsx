import Profile from '../../../assets/icons/profile.svg';

interface MyPageTabsProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onChangeTab: (tab: T) => void;
  nickname: string;
  profileImageUrl: string | null;
}

const MyPageTabs = <T extends string>({
  tabs,
  activeTab,
  onChangeTab,
  profileImageUrl,
  nickname,
}: MyPageTabsProps<T>) => {
  const DEFAULT_PROFILE_IMAGE = Profile;
  const displayNickname = nickname || '닉네임 없음';
  
  return (
    <div className="w-[15rem] flex flex-col items-start">
      
      {/* 1. 상단 프로필 섹션 */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-line-gray-40)] w-full">
        {/* 프로필 이미지 (회색 처리) */}
        <div className="w-12 h-12 rounded-full border border-[var(--color-gray-30)] flex-shrink-0 overflow-hidden">
          <img
            src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
                className={`object-cover w-full h-full ${
              !profileImageUrl ? "scale-145" : ""
            }`}
          />
        </div>
        {/* 유저 닉네임 */}
        <span className="body-b1-sb text-black">{displayNickname}</span>
      </div>

      {/* 2. 탭 리스트 섹션 */}
      <nav className="flex flex-col gap-10 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={`text-left body-b0-md transition-all duration-200 ${
              activeTab === tab 
                ? 'body-b0-md text-black' // 활성화 상태: 굵게, 검정색
                : 'body-b0-md text-[var(--color-gray-50)]' // 비활성 상태: 중간 굵기, 회색
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