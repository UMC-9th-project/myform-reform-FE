import MyPageTab from '../../components/domain/mypage/MyPageTab';
import EditProfile from '../../components/domain/mypage/EditProfile';
import BaseProfileTabs from '../../components/domain/mypage/BaseProfileTabs';
import OrderDetail from '../../components/domain/mypage/OrderDetail';
import OrderList from '../../components/domain/mypage/OrderList';
import { useSellerTabStore, type SellerTabType } from '../../stores/tabStore';
import { useQuery } from '@tanstack/react-query';
import { getMyReformerInfo } from '../../api/profile/user';

const SELLER_TABS: readonly SellerTabType[] = [
  '프로필 관리',
  '판매 관리',
  '수익 관리',
];

const ReformerMyPage = () => {
  const { activeTab, setActiveTab, selectedOrderId, setSelectedOrderId } = useSellerTabStore();

  // EditProfileCard가 표시되는 탭인지 확인
  const showEditProfileCard = activeTab === '프로필 관리';

  const { data: reformerInfo } = useQuery({
    queryKey: ['myUserInfo'],
    queryFn: getMyReformerInfo,
  });



  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="max-w-8xl mx-auto px-0 py-0 flex gap-3">
        {/* 왼쪽: 사이드바 */}
        <aside className="w-64 flex-shrink-0 px-5">
          <MyPageTab<SellerTabType>
            tabs={SELLER_TABS}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            nickname={reformerInfo?.success?.nickname ?? '닉네임'}
            profileImageUrl={reformerInfo?.success?.profileImageUrl ?? null}
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
          {activeTab === '프로필 관리' && reformerInfo?.success && (
            <EditProfile mode="edit" data={reformerInfo.success} />
          )}

          {activeTab === '판매 관리' &&
              (selectedOrderId ? <OrderDetail /> : <OrderList onClickDetail={setSelectedOrderId} />)}
        </main>
      </div>

      {/* EditProfileCard는 showEditProfileCard일 때만 */}
      {showEditProfileCard && reformerInfo?.success && (
        <BaseProfileTabs mode="edit" ownerId={reformerInfo.success.reformerId} showHeart={false}/>
      )}

    </div>
  );
};

export default ReformerMyPage;
