import React from 'react';
import ProfileCard from '../components/domain/mypage/ProfileCard';

//임시 interface 정의
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
};

const Profile = () => {
  
  return (
    <>
    <div className="max-w-6xl mx-auto bg-white p-5 rounded-xl font-sans">
      
      {/* 전체를 2컬럼 레이아웃으로 변경: [프로필 사진] | [나머지 모든 콘텐츠] */}
      <div className="flex gap-8">
        
        {/* 1. 프로필 이미지 (왼쪽 고정) */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
            <img 
              src="/api/placeholder/100/100"
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 2. 우측 콘텐츠 영역 (이름, 별점, 버튼, 태그, 본문) */}
        <div className="flex-1">
          
          {/* 상단: 이름/별점 영역과 버튼 영역 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="body-b0-bd text-[var(--color-mint-1)]">Lv. {mockProfile.level}</span>
              <h1 className="heading-h4-bd text-black mt-0.5">
                {mockProfile.nickname}
              </h1>
              
              {/* 별점 영역 */}
              <div className="flex items-baseline gap-1 mt-2 flex ">
                {[1, 2, 3, 4, 5].map((i) => (
                    <span
                    key={i}
                    className={`text-xl ${
                        i <= Math.floor(mockProfile.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    >
                    ★
                    </span>
                ))}
                <span className="ml-1 body-b1-sb">{mockProfile.rating}</span>
                </div>
            </div>

            <div className="flex gap-4">
              <button className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-teal-500 rounded-full hover:bg-teal-50 transition-colors" title="채팅 아이콘">
                <svg
                    width="32"
                    height="28"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M31 10H11C8.23858 10 6 12.2386 6 15V25.9206C6 28.5243 8.11066 30.6349 10.7143 30.6349V36L17.5714 30.6349H31C33.7614 30.6349 36 28.3964 36 25.6349V15C36 12.2386 33.7614 10 31 10Z"
                    stroke="var(--color-mint-1)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    />
                    <circle cx="14.5" cy="20.5" r="1.5" fill="var(--color-mint-1)" />
                    <circle cx="21.5" cy="20.5" r="1.5" fill="var(--color-mint-1)" />
                    <circle cx="28.5" cy="20.5" r="1.5" fill="var(--color-mint-1)" />
                </svg>
              </button>

              <button className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-teal-500 rounded-full hover:bg-teal-50 transition-colors" title="공유 아이콘">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.75 16H28.375C29.0712 16 29.7389 16.2634 30.2312 16.7322C30.7234 17.2011 31 17.837 31 18.5V30.5C31 31.163 30.7234 31.7989 30.2312 32.2678C29.7389 32.7366 29.0712 33 28.375 33H12.625C11.9288 33 11.2611 32.7366 10.7688 32.2678C10.2766 31.7989 10 31.163 10 30.5V18.5C10 17.837 10.2766 17.2011 10.7688 16.7322C11.2611 16.2634 11.9288 16 12.625 16H15.25M25.75 12L20.5 7M20.5 7L15.25 12M20.5 7V24.0625" stroke="#07BEB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </button>
            </div>
          </div>

          {/* 태그 섹션 */}
          <div className="flex gap-2 mb-6">
            {mockProfile.tags.map((tag,idx) => (
                <span
                  key = {idx}
                  className='px-5 py-2 border border-teal-500 rounded-full text-black body-b1-rg flex items-center'
                >
                    <span className='body-b1-rg'>#</span> {tag}
                </span>
            ))}
          </div>

          {/* 구분선 (우측 영역 너비에 맞춤) */}
          <hr className="border-[var(--color-line-gray-40)] mb-6" />

          {/* 설명 섹션 */}
          <div className="body-b1-rg space-y-4 whitespace-pre-line">
            <div className="flex flex-col gap-1 body-b1-rg">
            {mockProfile.description}
            </div>
          </div>
        </div> {/* 우측 영역 끝 */}
      </div>
    </div>
    <ProfileCard />
    </>
  );
};

export default Profile;