import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import Button from '../../../common/button/Button2';
import NicknameModal from '../NicknameModal';
import DaumPostcode from 'react-daum-postcode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyUserInfo } from '../../../../api/profile/user';
import { type GetMyUserInfoResponse } from '../../../../types/domain/mypage/reformerUser';
import profile from '../../../../assets/icons/bigProfile.svg';
import { updateMyUserInfo, type UpdateMyUserInfoRequest, type UpdateMyUserInfoResponse } from '../../../../api/mypage/normuser';
import { uploadImage } from '../../../../api/upload';
import { createAddress, getAddresses } from '../../../../api/mypage/address';
import type { CreateAddressRequest, GetAddressesResponse } from '../../../../types/domain/mypage/address';

type AddressData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress?: string;
  address: string;
};

type EditField = null | 'nickname' | 'phone' | 'email' | 'address';

const MyInfoPage = () => {
  const queryClient = useQueryClient();

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

  const { data: addressData, isLoading: isAddressLoading, } = useQuery({
    queryKey: ['addresses', 1, 15], // 배열 그대로 가능
    queryFn: () => getAddresses(1, 15, 'asc'), // 꼭 함수로!
  });


  const [newAddress, setNewAddress] = useState({
    addressName: '',
    recipient: '',
    phone: '',
    postalCode: '',
    address: '',
    addressDetail: '',
    isDefault: false,
  });

  const addressMutation = useMutation<GetAddressesResponse, Error, CreateAddressRequest>({
    mutationFn: (payload: CreateAddressRequest) => createAddress(payload),
    onSuccess: () => {
      alert('배송지 등록 성공!');
      queryClient.invalidateQueries({ queryKey: ['addresses', 1, 15] });
      setNewAddress({
        addressName: '',
        recipient: '',
        phone: '',
        postalCode: '',
        address: '',
        addressDetail: '',
        isDefault: false,
      });
    },
    onError: (err: Error) => {
      alert('배송지 등록 실패: ' + err.message);
    },
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
    console.log('DaumPostcode data:', data);
    setNewAddress((prev) => ({
      ...prev,
      postalCode: data.zonecode,
      address: data.roadAddress || data.address,
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

  // =======================
  // 사용자 정보 수정 mutation
  // =======================
  const mutation = useMutation<UpdateMyUserInfoResponse, Error, UpdateMyUserInfoRequest>({
    mutationFn: (data) => updateMyUserInfo(data),
    onSuccess: (res) => {
      alert('프로필 업데이트 성공!' + res);
      queryClient.invalidateQueries({ queryKey: ['myUserInfo']}); // 최신 정보 갱신
      setEditField(null);
    },
    onError: (err) => {
      alert('프로필 업데이트 실패: ' + err.message);
    }
  });



  const handleSaveField = (field: EditField | 'profileImageUrl', value?: string) => {
    const payload: UpdateMyUserInfoRequest = {};
    if (field === 'nickname') payload.nickname = nickname;
    if (field === 'phone') payload.phone = phone;
    if (field === 'email') payload.email = email;
    if (field === 'profileImageUrl' && value) payload.profileImageUrl = value;

    mutation.mutate(payload);
  };

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
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const previewUrl = URL.createObjectURL(file);
                    setProfileImage(previewUrl);

                    try {
                      const res = await uploadImage(file);
                      const uploadedUrl = res.success?.url;
                      if (!uploadedUrl) throw new Error('이미지 URL을 가져올 수 없습니다.');

                      handleSaveField('profileImageUrl', uploadedUrl);
                    } catch (err) {
                      alert('이미지 업로드 실패: ' + (err as Error).message);
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
              <Button
                className="!px-12 !py-3 mr-20"
                onClick={() => {
                  if (editField === 'phone') {
                    handleSaveField('phone');
                  }
                  setEditField(editField === 'phone' ? null : 'phone');
                }}
              >
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
              <Button
                className="!px-12 !py-3 mr-20"
                onClick={() => {
                  if (editField === 'email') {
                    handleSaveField('email');
                  }
                  setEditField(editField === 'email' ? null : 'email');
                }}
              >
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
                      value = {newAddress.addressName}
                      onChange={(e) => setNewAddress((prev) => ({...prev, addressName: e.target.value}))}
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
                      value={newAddress.recipient}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, recipient: e.target.value}))}
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
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, phone: e.target.value}))}
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
                        value={newAddress.postalCode}
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
                        value={newAddress.address}
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
                        value={newAddress.addressDetail}
                        onChange={(e) => setNewAddress((prev) => ({ ...prev, addressDetail: e.target.value }))}
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
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
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
                    onClick={() => {
                      // 필수 입력값 체크
                      if (!newAddress.addressName || !newAddress.recipient || !newAddress.phone || !newAddress.postalCode || !newAddress.address) {
                        alert('모든 필수 항목을 입력해주세요.');
                        return;
                      }

                      addressMutation.mutate({
                        addressName: newAddress.addressName,
                        recipient: newAddress.recipient,
                        phone: newAddress.phone,
                        postalCode: newAddress.postalCode,
                        address: newAddress.address,
                        addressDetail: newAddress.addressDetail,
                        isDefault: newAddress.isDefault,
                      });

                    }}
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
                  {isAddressLoading ? (
                    <p>로딩 중...</p>
                  ) : addressData?.success && addressData.success.length > 0 ? (
                    addressData.success.map((addr) => (
                      <div key={addr.addressId} className="border border-[var(--color-line-gray-40)] rounded-lg px-6 py-4 relative">
                        <div className="flex items-center gap-2 mb-3">
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-[var(--color-mint-6)] text-[var(--color-mint-1)] body-b4-sb rounded-[0.3rem]">
                              기본 배송지
                            </span>
                          )}
                          <span className="body-b1-md">
                            {addr.recipient} ({addr.addressName})
                          </span>
                        </div>

                        <p className="body-b1-rg text-[var(--color-gray-60)] mb-1">
                          {addr.phone}
                        </p>
                        <p className="body-b1-rg text-[var(--color-gray-60)]">
                          ({addr.postalCode}) {addr.address} {addr.addressDetail}
                        </p>
                        <button
                          className="absolute top-4 right-6 text-[var(--color-gray-50)] body-b3-sb"
                          onClick={() => alert(`삭제: ${addr.addressId}`)}
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>등록된 배송지가 없습니다.</p>
                  )}
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
          onSave={async (newNickname) => {
            try {
              await mutation.mutateAsync({ nickname: newNickname });
              setNickname(newNickname);
              setShowNicknameModal(false);
            } catch (err) {
              alert('닉네임 저장 실패: ' + (err as Error).message);
            }
          }}
        />
      )}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-[720px] max-w-[90vw] h-[520px] flex flex-col">
            <DaumPostcode
              onComplete={(data) => {
                console.log('DaumPostcode 선택됨:', data); // 여기 찍히는지 확인
                handleComplete(data);
              }}
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