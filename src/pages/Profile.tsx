import { useEffect } from 'react';
import BaseProfileTabs from '../components/domain/mypage/BaseProfileTabs';
import EditProfile, {type ProfileData } from '../components/domain/mypage/EditProfile';
import { useProfileModeStore } from '../stores/profileModeStore';
import { useParams } from 'react-router-dom';
import  useProfileView  from '../hooks/domain/profile/useProfileView';


const Profile = () => {
  const setMode = useProfileModeStore((s) => s.setMode);
  const { ownerId } = useParams<{ ownerId: string }>();
  

  useEffect(() => {
    setMode('view');
  }, [setMode]);
  

  const { data, isLoading, isError } = useProfileView(ownerId || '');
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>프로필 정보를 불러오지 못했습니다.</div>;

  if (!ownerId) {
    return <div>잘못된 접근입니다.</div>
  }

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white p-5 rounded-xl font-sans">
        <EditProfile mode='view' data={data as ProfileData} />
        {/* 전체를 2컬럼 레이아웃으로 변경: [프로필 사진] | [나머지 모든 콘텐츠] */}
      </div>
      <BaseProfileTabs ownerId={ownerId}/>
    </>
  );
};

export default Profile;
