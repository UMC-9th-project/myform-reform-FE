import { useNavigate } from 'react-router-dom';
import star from '../../../assets/icons/star.svg';
import EmptyStar from '../../../assets/icons/emptyStar.svg';
import Profile from '../../../assets/icons/profile.svg';

// 데이터 구조 정의
export interface ProfileData {
  nickname: string;
  profileImageUrl?: string | null;
  averageRating: number;
  keywords: string[];
  bio: string;
}

interface EditProfileProps {
  mode: 'edit' | 'view';
  data: ProfileData;
}

const DEFAULT_PROFILE_IMAGE = Profile;

const EditProfile = ({ mode, data }: EditProfileProps) => {
  const navigate = useNavigate();
  if (!data) {
    return <div>프로필 정보를 불러오지 못했습니다.</div>;
  }


  return (
    <div className="w-full bg-white p-10 rounded-xl font-sans">
      <div className="flex gap-10">
        {/* 1. 프로필 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border border-[var(--color-gray-30)]">
            <img
              src={data?.profileImageUrl || DEFAULT_PROFILE_IMAGE}
              alt="Profile"
              className={`w-full h-full object-cover transition-transform duration-200 
                ${!data?.profileImageUrl ? "scale-140" : ""}`}
            />
          </div>
        </div>
        {/* 2. 우측 콘텐츠 */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black mt-1">{data?.nickname ?? '닉네임'}</h1>
              <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => {
                // i는 0부터 시작, rating이 3.7이면 0,1,2번째는 채워진 별, 3,4번째는 빈 별
                const filled = i < Math.round(data?.averageRating ?? 0); 
                return (
                  <img
                    key={i}
                    src={filled ? star : EmptyStar}
                    alt={filled ? '별' : '빈 별'}
                    className="w-5 h-5"
                  />
                );
              })}
              <span className="ml-1 font-bold text-gray-800">{data.averageRating}</span>
            </div>

            </div>

            {/* 아이콘 대신 들어가는 프로필 수정 버튼 */}
            {mode == 'edit' ? (
              <button className="px-7 py-5 bg-[var(--color-mint-0)] text-white font-bold rounded-lg hover:bg-[#71c2c2] transition-all shadow-sm"
                onClick={() => navigate('/reformer-profile-edit')}>
              프로필 수정
            </button>
            ) : (
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
              
            )}
          </div>

          <div className="flex gap-3 mb-8">
            {(data?.keywords || []).map((tag, idx) => (
              <span key={idx} className="px-5 py-2 border border-[var(--color-mint-0)] rounded-full text-black text-sm font-medium flex items-center">
                <span className="body-b1-rg mr-1 color-black">#</span> {tag}
              </span>
            ))}
          </div>

          <hr className="border-gray-100 mb-8" />

          <div className="body-b1-rg whitespace-pre-line text-base md:text-lg">
            {data?.bio}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;