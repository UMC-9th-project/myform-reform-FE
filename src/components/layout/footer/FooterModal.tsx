import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import xIcon from '../../../assets/icons/x.svg';
import kakaoIcon from '../../../assets/icons/kakao.svg';
import gmailIcon from '../../../assets/icons/gmail.svg';
import useAuthStore from '../../../stores/useAuthStore';

export default function FooterModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  const [isWithdrawalConfirmModalOpen, setIsWithdrawalConfirmModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'Escape' && isLoginRequiredModalOpen) {
        setIsLoginRequiredModalOpen(false);
      }
      if (e.key === 'Escape' && isWithdrawalConfirmModalOpen) {
        setIsWithdrawalConfirmModalOpen(false);
      }
    };

    if (isOpen || isLoginRequiredModalOpen || isWithdrawalConfirmModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoginRequiredModalOpen, isWithdrawalConfirmModalOpen, onClose]);

  if (!isOpen) return null;

  const handleKakaoClick = () => {
    window.open('https://open.kakao.com/o/gr8OVI0h', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:cheepark926@gmail.com';
  };

  const handleWithdrawalClick = () => {
    if (!accessToken) {
      setIsLoginRequiredModalOpen(true);
    } else {
      setIsWithdrawalConfirmModalOpen(true);
    }
  };

  const handleConfirmWithdrawal = () => {
    // 회원 탈퇴 API 호출
    setIsWithdrawalConfirmModalOpen(false);
    onClose();
  };

  const handleCancelWithdrawal = () => {
    setIsWithdrawalConfirmModalOpen(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-[635px] bg-white rounded-[30px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        
        <div className="flex items-center justify-between px-[21px] py-[18px] border-b border-[var(--color-line-gray-40)] relative">
          <div className="w-[40px]" />
          <h1 className="heading-h5-sb absolute left-1/2 -translate-x-1/2">문의하기</h1>
          <button onClick={onClose} className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer">
            <img src={xIcon} alt="닫기" className="w-10 h-10" />
          </button>
        </div>

      
        <div className="flex flex-col items-center pt-[25px] pb-[25px] px-[46px] gap-[24px]">
          
          <div className="flex flex-col gap-2 items-center text-center">
            <p className="body-b0-sb text-black">오픈채팅 또는 메일로 문의해주세요!</p>
            <p className="body-b1-rg text-[var(--color-gray-60)]">
               보내주시는 소중한 의견은 서비스 개선에 도움이 됩니다 😊
            </p>
          </div>

          <div className="flex flex-col gap-[20px] items-center justify-center w-full">       
            <div
              className="bg-[#fff8bd] flex gap-[30px] h-[130px] items-center pl-[20px] py-[18px] rounded-[15px] w-[543px] cursor-pointer"
              onClick={handleKakaoClick}
            >
              <div className="bg-[#fde500] flex items-center justify-center rounded-[15px] w-[90px] h-[90px] shrink-0">
                <img src={kakaoIcon} alt="kakao" className="w-[68px] h-[68px]" />
              </div>
              
              <div className="flex flex-col gap-[5px] items-start">
                <p className="body-b0-sb text-black">카카오톡</p>
                <p className="body-b1-rg text-[var(--color-gray-60)]">https://open.kakao.com/o/gr8OVI0h</p>
              </div>
            </div>

            <div
              className="bg-[var(--color-gray-20)] flex gap-[30px] h-[130px] items-center pl-[20px] py-[18px] rounded-[15px] w-[543px] cursor-pointer "
              onClick={handleEmailClick}
            >
              <div className="bg-white flex items-center justify-center rounded-[15px] w-[90px] h-[90px] shrink-0 shadow-[0px_0px_10.3px_0px_rgba(0,0,0,0.13)]">
                <img src={gmailIcon} alt="gmail" className="w-[68px] h-[68px]" />
              </div>
              <div className="flex flex-col gap-[5px] items-start">
                <p className="body-b0-sb text-black">이메일</p>
                <p className="body-b1-rg text-[var(--color-gray-60)]">cheepark926@gmail.com</p>
              </div>
            </div>
          </div>

         
          <button 
            onClick={handleWithdrawalClick}
            className="body-b1-rg text-[var(--color-gray-60)] underline cursor-pointer hover:opacity-70 transition-opacity"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

    </div>
  );

  const loginRequiredModalContent = isLoginRequiredModalOpen ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setIsLoginRequiredModalOpen(false)}>
      <div 
        className="bg-white flex flex-col gap-[35px] h-[135px] items-center justify-center pt-[6px] relative rounded-[20px] w-[426px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="body-b1-sb text-black text-center whitespace-pre-wrap">
          로그인이 필요한 기능입니다.
        </p>
        <button 
          onClick={() => setIsLoginRequiredModalOpen(false)}
          className="absolute flex cursor-pointer left-[372px] overflow-clip size-[40px] top-[14px] items-center justify-center"
        >
          <img src={xIcon} alt="닫기" className="w-10 h-10" />
        </button>
      </div>
    </div>
  ) : null;

  const withdrawalConfirmModalContent = isWithdrawalConfirmModalOpen ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={handleCancelWithdrawal}>
      <div 
        className="bg-white flex flex-col gap-[35px] items-center pb-[22px] pt-[37px] px-[21px] relative rounded-[20px] w-[426px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="body-b1-sb text-black text-center whitespace-pre-wrap w-full">
          정말 탈퇴하시겠습니까?
        </p>
        <div className="flex gap-[8px] items-center justify-center w-full">
          <button 
            onClick={handleConfirmWithdrawal}
            className="bg-[var(--color-mint-0)] flex flex-1 gap-[10px] h-[52px] items-center justify-center px-[30px] rounded-[10px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="body-b1-sb text-white">탈퇴하기</p>
          </button>
          <button 
            onClick={handleCancelWithdrawal}
            className="bg-[var(--color-gray-30)] flex flex-1 gap-[10px] h-[52px] items-center justify-center px-[30px] rounded-[10px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="body-b1-sb text-[var(--color-gray-50)]">취소하기</p>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {createPortal(modalContent, document.body)}
      {isLoginRequiredModalOpen && createPortal(loginRequiredModalContent, document.body)}
      {isWithdrawalConfirmModalOpen && createPortal(withdrawalConfirmModalContent, document.body)}
    </>
  );
}