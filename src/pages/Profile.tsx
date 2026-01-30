import { useEffect } from 'react';
import BaseProfileTabs from '../components/domain/mypage/BaseProfileTabs';
import EditProfile from '../components/domain/mypage/EditProfile';
import { useProfileModeStore } from '../stores/profileModeStore_tmp';
//임시 interface 정의
/*
interface ProfileData {
  level: number;
  nickname: string;
  rating: number;
  profileImageUrl: string;
  tags: string[];
  description: string;
}

const mockProfile: ProfileData = {
  level: 3,
  nickname: '침착한 대머리독수리',
  rating: 4.5,
  profileImageUrl: '/api/placeholder/100/100',
  tags: ['빠른', '친절한'],
  description:  `- 2019년부터 리폼 공방 운영 시작\n- 6년차 스포츠 의류 리폼 전문 공방✨\n\n고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.`
}; */

const Profile = () => {
  const setMode = useProfileModeStore((s) => s.setMode);

  useEffect(() => {
    setMode('view');
  }, [setMode]);

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white p-5 rounded-xl font-sans">
        <EditProfile mode={'view'} />
        {/* 전체를 2컬럼 레이아웃으로 변경: [프로필 사진] | [나머지 모든 콘텐츠] */}
      </div>
      <BaseProfileTabs />
    </>
  );
};

export default Profile;
