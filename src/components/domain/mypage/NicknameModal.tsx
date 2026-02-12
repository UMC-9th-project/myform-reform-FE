import React, { useState, useEffect } from 'react';
import { checkNicknameDuplicate } from '../../../api/profile/user';

interface NicknameModalProps {
  currentNickname: string;
  onClose: () => void;
  onSave: (newNickname: string) => void; // 변경 저장
  isOpen: boolean; // 모달 열림 상태
}

type Status = 'default' | 'error' | 'success';

const NicknameModal: React.FC<NicknameModalProps> = ({ isOpen, onClose, currentNickname, onSave }) => {
  const [inputValue, setInputValue] = useState(currentNickname); // 초기값 설정
  const [status, setStatus] = useState<Status>('default');
  const [errorMsg, setErrorMsg] = useState('');

  // 모달이 열릴 때마다 부모로부터 받은 currentNickname으로 동기화
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setInputValue(currentNickname);
        setStatus('default');
        setErrorMsg('');
      })
    }
  }, [isOpen, currentNickname]);

  if (!isOpen) return null;

  const handleCheckDuplicate = async () => {
  // 현재 닉네임이면 통과
  if (inputValue === currentNickname) {
    setStatus('success');
    return;
  }

  if (inputValue.length < 2 || inputValue.length > 10) {
    setStatus('error');
    setErrorMsg('닉네임은 2자 이상, 10자 이하로 입력해주세요.');
    return;
  }

  try {
    const res = await checkNicknameDuplicate(inputValue);

    if (res.resultType === 'SUCCESS' && res.success) {
      if (res.success.isAvailable) {
        setStatus('success');
        setErrorMsg('');
      } else {
        setStatus('error');
        setErrorMsg(res.success.message); // "이미 사용 중인 닉네임입니다"
      }
    } else {
      setStatus('error');
      setErrorMsg(res.error ?? '닉네임 확인에 실패했습니다.');
    }
  } catch (e) {
    setStatus('error');
    setErrorMsg('서버와 통신 중 오류가 발생했습니다.' + (e as Error).message);
  }
};


  const handleSubmit = () => {
    if (status === 'success') {
      onSave(inputValue);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[45rem] bg-white rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="relative py-6 border-b border-[var(--color-line-gray-40)] text-center">
          <h2 className="heading-h5-sb">닉네임 변경하기</h2>
          <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black" title="모달창 닫기">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 26L20 20L26 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 26L20 20L14 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex gap-2 mx-10 items-start">
            <div className="flex flex-col min-h-20">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // 값이 바뀌면 다시 중복체크를 하도록 상태 초기화
                  if (e.target.value !== currentNickname) {
                    setStatus('default');
                  }
                }}
                placeholder="닉네임을 입력해주세요."
                className={`w-[26rem] h-20 px-5 border border-[var(--color-line-gray-40)] rounded-2xl outline-none transition-all body-b1-rg ${
                  status === 'error' ? 'border-[var(--color-red-1)]' : 
                  status === 'success' ? 'border-[#82D1D1]' : 'border-gray-200'
                }`}
              />
              {status === 'error' && (
                <p className="text-[var(--color-red-1)] body-b3-rg mt-2 ml-2">{errorMsg}</p>
              )}
            </div>
            <button
              onClick={handleCheckDuplicate}
              className={`w-32 min-h-20 rounded-2xl border body-b1-rg transition-all ${
                inputValue.length > 0 
                ? 'border-[var(--color-mint-3)] text-[var(--color-mint-1)] bg-[var(--color-mint-6)]' 
                : 'text-[var(--color-gray-50)] bg-[var(--color-gray-30)] border-[var(--color-gray-40)]'
              }`}
            >
              중복확인
            </button>
          </div>
        <div className='flex justify-center pt-0'>
          <button
            onClick={handleSubmit}
            disabled={status !== 'success'}
            className={`w-[20rem] py-4 mt-7 rounded-[0.625rem] font-bold text-lg transition-all ${
              status === 'success'
              ? 'bg-[var(--color-mint-0)] text-white cursor-pointer'
              : 'bg-[var(--color-gray-30)] text-[var(--color-gray-50)] cursor-not-allowed'
            }`}
          >
            변경하기
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;