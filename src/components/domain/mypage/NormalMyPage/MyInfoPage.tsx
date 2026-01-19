import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Button from '../../../common/Button/button2';
import NicknameModal from '../NicknameModal';

type EditField = null | 'nickname' | 'phone' | 'email' | 'address';

const MyInfoPage = () => {
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [nickname, setNickname] = useState('심심한 리본');
  /* 마스킹 함수 추가 */
  const maskName = (name: string) => {
    if (name.length <= 1) return '*';
    if (name.length === 2) return name[0] + '*';
    const middle = '*'.repeat(name.length - 2);
    return name[0] + middle + name[name.length - 1];
  };

  const maskPhone = (phone: string) => {
    // 전화번호 010-1234-5678 -> 010-****-5678
    return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
  };

  const [phone, setPhone] = useState('010-1111-0000');
  const [email, setEmail] = useState('example@gmail.com');

  const [address, setAddress] = useState({
    zip: '04310',
    addr1: '서울 용산구 청파로47길 100',
    addr2: '명신관 302호',
  });

  const [editField, setEditField] = useState<EditField>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto pb-10 pt-5 bg-white">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              
              <button className="absolute bottom-0 right-0 bg-slate-500 p-2 rounded-full text-white" title="사진 추가">
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="flex-grow">

            {/* 성명 */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">성명</span>
              <span className="body-b0-sb">{maskName('홍길동')}</span>
              <span className="body-b0-sb">홍*동</span>
            </div>

            {/* 닉네임 */}
            <div className="flex items-center py-6 border-b border-[var(--color-line-gray-40)]">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)]">닉네임</span>
              <span className="flex-grow body-b0-sb">{nickname}</span>
              <Button className="!px-12 !py-3 mr-20" onClick={() => setShowNicknameModal(true)}>
                변경하기
              </Button>
            </div>

            {/* 연락처 */}
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
                onClick={() =>
                  setEditField(editField === 'phone' ? null : 'phone')
                }
              >
                변경하기
              </Button>
            </div>

            {/* 이메일 */}
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
                onClick={() =>
                  setEditField(editField === 'email' ? null : 'email')
                }
              >
                변경하기
              </Button>
            </div>

            {/* 배송지 */}
            <div className="flex items-start py-6">
              <span className="w-32 body-b0-sb text-[var(--color-gray-60)] pt-2">
                배송지
              </span>

              <div className="flex-grow flex flex-col gap-2">
                {editField === 'address' ? (
                  <>
                    <input
                      title="우편 번호"
                      value={address.zip}
                      onChange={(e) =>
                        setAddress({ ...address, zip: e.target.value })
                      }
                      className="w-full max-w-md border rounded-md px-3 py-3"
                    />
                    <input
                      title="도로명 주소"
                      value={address.addr1}
                      onChange={(e) =>
                        setAddress({ ...address, addr1: e.target.value })
                      }
                      className="w-full max-w-md border rounded-md px-3 py-3"
                    />
                    <input
                      title="상세 주소"
                      value={address.addr2}
                      onChange={(e) =>
                        setAddress({ ...address, addr2: e.target.value })
                      }
                      className="w-full max-w-md border rounded-md px-3 py-3"
                    />
                  </>
                ) : (
                  <>
                    <div className="bg-[var(--color-gray-20)] body-b0-rg p-3 max-w-md mr-3">
                      {address.zip}
                    </div>
                    <div className="bg-[var(--color-gray-20)] p-3 body-b0-rg max-w-md">
                      {address.addr1}
                    </div>
                    <div className="bg-[var(--color-gray-20)] p-3 body-b0-rg max-w-md">
                      {address.addr2}
                    </div>
                  </>
                )}
              </div>

              <Button
                className="!px-12 !py-3 mr-20"
                onClick={() =>
                  setEditField(editField === 'address' ? null : 'address')
                }
              >
                변경하기
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* 닉네임 모달 */}
      {showNicknameModal && (
        <NicknameModal
          isOpen={showNicknameModal}
          currentNickname={nickname}
          onClose={() => setShowNicknameModal(false)}
          onSave={(newNickname) => setNickname(newNickname)}
        />
      )}
    </>
  );
};

export default MyInfoPage;
