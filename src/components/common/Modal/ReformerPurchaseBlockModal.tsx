import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';

type MessageType = 'wish' | 'cart' | 'purchase' | 'chat';

interface ReformerPurchaseBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageType?: MessageType;
}

const ReformerPurchaseBlockModal = ({
  isOpen,
  onClose,
  messageType = 'purchase',
}: ReformerPurchaseBlockModalProps) => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (!isOpen) return null;

  const handleGoBack = () => {
    onClose();
  };

  const handleReLogin = () => {
    clearAuth();
    navigate('/login/type');
    onClose();
  };

  const getTitle = () => {
    switch (messageType) {
      case 'wish':
        return '찜이 불가능한 상태입니다.';
      case 'cart':
        return '장바구니 담기가 불가능한 상태입니다.';
      case 'purchase':
        return '결제가 불가능한 상태입니다.';
      case 'chat':
        return '문의가 불가능한 상태입니다.';
      default:
        return '구매가 불가능한 상태입니다.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/20">
      <div className="bg-white rounded-[30px] w-[35rem] p-[1.875rem] flex flex-col items-center gap-[1.25rem]">
        {/* X 아이콘 */}
        <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[var(--color-red-1)] flex items-center justify-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 12L12 20M12 12L20 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 제목 */}
        <h2 className="heading-h5-sb text-[1.5rem] text-black text-center">
          {getTitle()}
        </h2>

        {/* 설명 */}
        <div className="flex flex-col gap-[0.375rem] items-center">
          <p className="body-b1-rg text-[var(--color-gray-60)] text-center">
            현재 리폼러 회원으로 활동중입니다.
          </p>
          <p className="body-b1-rg text-[var(--color-gray-60)] text-center">
            일반 회원으로 재로그인 후 구매해주시기 바랍니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-[0.625rem] w-full">
          <button
            onClick={handleGoBack}
            className="flex-1 h-[3.125rem] bg-white border border-[var(--color-mint-1)] rounded-[0.625rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="body-b1-sb text-[1.125rem] text-[var(--color-mint-1)]">
              돌아가기
            </span>
          </button>
          <button
            onClick={handleReLogin}
            className="flex-1 h-[3.125rem] bg-[var(--color-mint-1)] rounded-[0.625rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="body-b1-sb text-[1.125rem] text-white">
              다시 로그인 하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReformerPurchaseBlockModal;
