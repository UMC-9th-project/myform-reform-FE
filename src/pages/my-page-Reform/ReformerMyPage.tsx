import MyPageTab from '../../components/domain/mypage/MyPageTab';
import EditProfile from '../../components/domain/mypage/EditProfile';
import BaseProfileTabs from '../../components/domain/mypage/BaseProfileTabs';
import OrderDetail from '../../components/domain/mypage/OrderDetail';
import OrderList from '../../components/domain/mypage/OrderList';
import { useSellerTabStore, type SellerTabType } from '../../stores/tabStore';
import { getMyUserInfo } from '../../api/profile/user';
import { useEffect, useState } from 'react';

const SELLER_TABS: readonly SellerTabType[] = [
  '프로필 관리',
  '판매 관리',
];

const ReformerMyPage = () => {
  const { activeTab, setActiveTab, selectedOrderId, setSelectedOrderId } = useSellerTabStore();

  // EditProfileCard가 표시되는 탭인지 확인
  const showEditProfileCard = activeTab === '프로필 관리';
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getMyUserInfo();

        if (res.resultType === 'SUCCESS' && res.success) {
          setNickname(res.success.nickname);
          setProfileImageUrl(res.success.profileImageUrl);
        }
      } catch (e) {
        console.error('유저 정보 조회 실패', e);
      }
    };

    fetchUserInfo();
  }, []);


  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="max-w-8xl mx-auto px-0 py-0 flex gap-3">
        {/* 왼쪽: 사이드바 */}
        <aside className="w-64 flex-shrink-0 px-5">
          <MyPageTab<SellerTabType>
            tabs={SELLER_TABS}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            nickname={nickname}
            profileImageUrl={profileImageUrl}
          />
        </aside>

        {/* 메인 컨텐츠 영역 */}
        <main className={showEditProfileCard ? 'flex-1' : 'w-5/6 px-5'}>
          {/* 탭별 제목 (EditProfile이 아닐 때만) */}
          {!showEditProfileCard && activeTab && (
            <div className="heading-h4-bd pb-3.5 border-b border-[black] mt-1 mb-8">
              {activeTab}
            </div>
          )}

          {/* 탭별 컨텐츠 */}
          {activeTab === '프로필 관리' && <EditProfile mode={'edit'} />}
          {activeTab === '판매 관리' &&
            (selectedOrderId ? <OrderDetail /> : <OrderList onClickDetail={setSelectedOrderId} />)}
          {/* 다른 탭들 추가 */}
        </main>
      </div>

      {/* EditProfileCard는 showEditProfileCard일 때만 */}
      {showEditProfileCard && <BaseProfileTabs mode="edit" />}
    </div>
  );
};

export default ReformerMyPage;
