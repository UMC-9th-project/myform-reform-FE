import React from 'react';

interface SendButtonProps {
  isActive: boolean; // 활성화 여부
  onClick?: () => void; // 클릭 이벤트
}

const SendButton: React.FC<SendButtonProps> = ({ isActive, onClick }) => {
  return (
    <button
      onClick={isActive ? onClick : undefined}
      disabled={!isActive}
      className={`
        w-fit px-18 py-4
        rounded-[1.25rem] shadow-sm transition-all duration-200 heading-h4-sb
        ${isActive 
          ? 'bg-black text-white cursor-pointer active:scale-[0.96]' 
          : 'bg-[var(--color-gray-50)] text-white cursor-not-allowed'
        }
      `}
    >
      전송하기
    </button>
  );
};

export default SendButton;