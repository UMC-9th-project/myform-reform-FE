import React from 'react';
import MyPageTab from '../../components/domain/mypage/MyPageTab';
import EditProfile from '../../components/domain/mypage/EditProfile';
import EditProfileCard from '../../components/domain/mypage/EditProfileCard';
const ReformerMyPage = () => {
  return (
    <>
    <div className="w-full min-h-[65vh] bg-white">
      <div className="max-w-8xl mx-auto px-0 py-0 flex gap-10">
        
        {/* 왼쪽: 사이드바 컴포넌트 */}
        <aside className="w-45 flex-shrink-0">
          <MyPageTab />
        </aside>
        <EditProfile />
      </div>
    </div>
    <EditProfileCard/>
    </>
  );
};

export default ReformerMyPage;