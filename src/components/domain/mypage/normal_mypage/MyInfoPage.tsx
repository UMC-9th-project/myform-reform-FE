import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import Button from '../../../common/button/Button2';
import NicknameModal from '../NicknameModal';
import DaumPostcode from 'react-daum-postcode';
import { useQuery } from '@tanstack/react-query';
import { getMyUserInfo } from '../../../../api/profile/user';
import { type GetMyUserInfoResponse } from '../../../../types/domain/mypage/reformerUser';
import profile from '../../../../assets/icons/bigProfile.svg';

type AddressData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress?: string;
  address: string;
};

type EditField = null | 'nickname' | 'phone' | 'email' | 'address';

const MyInfoPage = () => {
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [name, setName] = useState('유저 닉네임');
  const [nickname, setNickname] = useState('심심한 리본');
  const [phone, setPhone] = useState('010-1111-0000');
  const [email, setEmail] = useState('example@gmail.com');
  const [editField, setEditField] = useState<EditField>(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const DEFAULT_PROFILE_IMAGE = profile;

  const { data: userInfo, isLoading } = useQuery<GetMyUserInfoResponse, Error>({
    queryKey: ['myUserInfo'],
    queryFn: getMyUserInfo,
  });



  const [address, setAddress] = useState({
    recipient: '',
    phone: '',
    zip: '04310',
    addr1: '서울 용산구 청파로47길 100',
    addr2: '명신관 302호',
  });

  /* 마스킹 함수 */
  const maskName = (name: string) => {
    if (name.length <= 1) return '*';
    if (name.length === 2) return name[0] + '*';
    const middle = '*'.repeat(name.length - 2);
    return name[0] + middle + name[name.length - 1];
  };

  const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) return phone;
    return `${digits.slice(0,3)}-****-${digits.slice(7)}`;
  };

  const handleComplete = (data: AddressData) => {
    setAddress((prev) => ({
      ...prev,
      zip: data.zonecode,
      addr1: data.roadAddress || data.address,
    }));

    setIsPostcodeOpen(false);
  };

  useEffect(() => {
    if (userInfo?.success) {
      const profile = userInfo.success;
      setName(profile.name || '');
      setNickname(profile.nickname || '');
      setPhone(profile.phone || '');
      setEmail(profile.email || '');
      setProfileImage(profile.profileImageUrl || null);
    }
  }, [userInfo]);

  if (isLoading) {
    return <div className="text-center py-20">로딩 중...</div>;
  }



  return (
    <>
      <div className="max-w-6xl mx-auto pb-10 pt-5 bg-white">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* 프로필 이미지 (유지) */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-full">
              <img
                src={profileImage || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />

              {/* label을 클릭하면 input 열림 */}
              <label
                className="absolute bottom-0 right-0 bg-slate-500 p-2 rounded-full text-white cursor-pointer flex items-center justify-center"
                title="사진 추가"
              >
                <Camera size={18} />
                <input
                  title="프로필 이미지 업로드"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setProfileImage(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="flex-grow">
            {/* 성명 (유지) */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">성명</span>
              <span className="body-b0-sb">{maskName(name)}</span>
            </div>

            {/* 닉네임 (유지) */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">닉네임</span>
              <span className="flex-grow body-b0-sb">{nickname}</span>
              <Button className="!px-12 !py-3 mr-20" onClick={() => setShowNicknameModal(true)}>
                변경하기
              </Button>
            </div>

            {/* 연락처 (유지) */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">연락처</span>
              <div className="flex-grow">
                {editField === 'phone' ? (
                  <input
                    title="전화번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full max-w-xs border rounded-md px-3 py-2"
                  />
                ) : (
                  <span className="body-b0-sb">{maskPhone(phone)}</span>
                )}
              </div>
              <Button className="!px-12 !py-3 mr-20" onClick={() => setEditField(editField === 'phone' ? null : 'phone')}>
                변경하기
              </Button>
            </div>

            {/* 이메일 (유지) */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">이메일</span>
              <div className="flex-grow">
                {editField === 'email' ? (
                  <input
                    title="이메일 입력창"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full max-w-xs border rounded-md px-3 py-2"
                  />
                ) : (
                  <span className="body-b0-sb">{email}</span>
                )}
              </div>
              <Button className="!px-12 !py-3 mr-20" onClick={() => setEditField(editField === 'email' ? null : 'email')}>
                변경하기
              </Button>
            </div>

            {/* --- 배송지 등록 --- */}
            <div className="flex py-5 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">
                배송지 등록
              </span>

              <div className="flex-grow max-w-2xl space-y-6">
                {/* 휴대폰 번호 */}
                <div>
                  <label className="block body-b0-sb mb-2">
                    배송지명 <span className="text-[var(--color-red-1)]">*</span>
                  </label>
                  <div className="grid grid-cols-[1fr_160px] gap-3">
                    <input
                      type="text"
                      className="bg-[var(--color-gray-20)] p-4 outline-none"
                      placeholder="배송지명을 입력해주세요."
                    />
                    <div />
                  </div>
                </div>

                {/* 받으시는 분 */}
                <div>
                  <label className="block body-b0-sb mb-2">
                    받으시는 분 <span className="text-[var(--color-red-1)]">*</span>
                  </label>
                  <div className="grid grid-cols-[1fr_160px] gap-3">
                    <input
                      type="text"
                      className="bg-[var(--color-gray-20)] p-4 outline-none"
                      placeholder="이름을 입력해주세요."
                    />
                    <div />
                  </div>
                </div>

                {/* 휴대폰 번호 */}
                <div>
                  <label className="block body-b0-sb mb-2">
                    휴대폰 번호 <span className="text-[var(--color-red-1)]">*</span>
                  </label>
                  <div className="grid grid-cols-[1fr_160px] gap-3">
                    <input
                      type="text"
                      className="bg-[var(--color-gray-20)] p-4 outline-none"
                      placeholder="번호를 입력해주세요."
                    />
                    <div />
                  </div>
                </div>

                {/* 배송 주소 */}
                <div>
                  <label className="block body-b0-sb mb-2">
                    배송 주소 <span className="text-[var(--color-red-1)]">*</span>
                  </label>

                  <div className="space-y-3">
                    {/* 우편번호 */}
                    <div className="grid grid-cols-[1fr_160px] gap-3">
                      <input
                        type="text"
                        value={address.zip}
                        readOnly
                        className="bg-[var(--color-gray-20)] p-4 outline-none"
                        placeholder="우편번호"
                      />
                      <Button 
                        className="!px-8 !py-3 whitespace-nowrap"
                        onClick={() => setIsPostcodeOpen(true)}>
                        우편번호 검색
                      </Button>
                    </div>

                    {/* 기본 주소 */}
                    <div className="grid grid-cols-[1fr_160px] gap-3">
                      <input
                        type="text"
                        value={address.addr1}
                        readOnly
                        className="bg-[var(--color-gray-20)] p-4 outline-none"
                        placeholder="주소"
                      />
                      <div />
                    </div>

                    {/* 상세 주소 */}
                    <div className="grid grid-cols-[1fr_160px] gap-3">
                      <input
                        type="text"
                        className="bg-[var(--color-gray-20)] p-4 outline-none"
                        placeholder="상세주소"
                      />
                      <div />
                    </div>
                  </div>
                </div>

                {/* 기본 배송지 체크 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default-addr"
                    className="w-5 h-5 accent-[var(--color-mint-1)]"
                  />
                  <label
                    htmlFor="default-addr"
                    className="body-b2-rg text-[var(--color-gray-60)] cursor-pointer"
                  >
                    기본 배송지로 설정
                  </label>
                </div>

                {/* 등록 버튼 */}
                <div className="grid grid-cols-[1fr] gap-3">
                  <button
                    className="py-4 border border-[var(--color-mint-1)]
                              text-[var(--color-mint-1)] body-b0-bd rounded-[0.625rem]"
                  >
                    배송지 등록하기
                  </button>
                  <div />
                </div>

              </div>
            </div>


            {/* --- 배송지 관리 섹션 --- */}
            <div className="flex py-10">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)] pt-2">
                배송지 관리
              </span>
              
              <div className="flex-grow max-w-2xl space-y-6">
                <div className="space-y-4">
                  {/* 배송지 카드 1 */}
                  <div className="border border-[var(--color-line-gray-40)] rounded-lg px-6 py-4 relative">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-0.5 bg-[var(--color-mint-6)]
                                      text-[var(--color-mint-1)] body-b4-sb rounded-[0.3rem]">
                        기본 배송지
                      </span>
                      <span className="body-b1-md">홍길동 (집)</span>
                    </div>
                    <p className="body-b1-rg text-[var(--color-gray-60)] mb-1">
                      010-0000-0000
                    </p>
                    <p className="body-b1-rg text-[var(--color-gray-60)]">
                      (04310) 서울 용산구 청파로 47길 100 명신관 301호
                    </p>
                    <button className="absolute top-4 right-6 text-[var(--color-gray-50)] body-b3-sb">
                      삭제
                    </button>
                  </div>

                  {/* 배송지 카드 2 */}
                  <div className="border border-[var(--color-line-gray-40)] rounded-lg px-6 py-4 relative">
                    <span className="body-b1-md mb-3 block">홍길동 (학교)</span>
                    <p className="body-b1-rg text-[var(--color-gray-60)] mb-1">
                      010-0000-0000
                    </p>
                    <p className="body-b1-rg text-[var(--color-gray-60)]">
                      (04310) 서울 용산구 청파로 47길 100 명신관 301호
                    </p>
                    <button className="absolute top-4 right-6 text-[var(--color-gray-50)] body-b3-sb">
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* 닉네임 모달 (유지) */}
      {showNicknameModal && (
        <NicknameModal
          isOpen={showNicknameModal}
          currentNickname={nickname}
          onClose={() => setShowNicknameModal(false)}
          onSave={(newNickname) => setNickname(newNickname)}
        />
      )}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-[720px] max-w-[90vw] h-[520px] flex flex-col">
            <DaumPostcode
              onComplete={handleComplete}
              autoClose
            />
            <button
              className="mt-4 text-sm text-gray-500"
              onClick={() => setIsPostcodeOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyInfoPage;