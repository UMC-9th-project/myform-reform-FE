import React from 'react';
import { useNavigate } from 'react-router-dom';

// 데이터 구조 정의
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
  rating: 4.97,
  profileImageUrl: '/api/placeholder/100/100',
  tags: ['빠른', '친절한'],
  description: `- 2019년부터 리폼 공방 운영 시작 ✨\n- 6년차 스포츠 의류 리폼 전문 공방\n\n고객님들의 요청과 아쉬움을 담아, 버리지 못하고 잠들어 있던 옷에 새로운 가치와 트렌디한 디자인을 더하는 리폼을 선보이고 있어요. 1:1 맞춤 리폼 제작부터 완성 제품까지 모두 주문 가능합니다.`
};

const EditProfile = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full bg-white p-10 rounded-xl font-sans">
      <div className="flex gap-10">
        {/* 1. 프로필 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
            <img src={mockProfile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 2. 우측 콘텐츠 */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black mt-1">{mockProfile.nickname}</h1>
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`text-xl ${i <= Math.floor(mockProfile.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
                <span className="ml-1 font-bold text-gray-800">{mockProfile.rating}</span>
              </div>
            </div>

            {/* 아이콘 대신 들어가는 프로필 수정 버튼 */}
            <button className="px-7 py-5 bg-[var(--color-mint-0)] text-white font-bold rounded-lg hover:bg-[#71c2c2] transition-all shadow-sm"
                onClick={() => navigate('경로 작성')}>
              프로필 수정
            </button>
          </div>

          <div className="flex gap-3 mb-8">
            {mockProfile.tags.map((tag, idx) => (
              <span key={idx} className="px-5 py-2 border border-[var(--color-mint-0)] rounded-full text-black text-sm font-medium flex items-center">
                <span className="body-b1-rg mr-1 color-black">#</span> {tag}
              </span>
            ))}
          </div>

          <hr className="border-gray-100 mb-8" />

          <div className="body-b1-rg whitespace-pre-line text-base md:text-lg">
            {mockProfile.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;