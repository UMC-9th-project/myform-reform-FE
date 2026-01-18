import { useState } from 'react';
import emptyHeart from './icons/red/empty.svg';
import filledHeart from './icons/red/filled.svg';

interface LikeButtonProps {
  /** 초기 좋아요 상태 */
  initialLiked?: boolean;
  /** 클릭 시 실행할 함수 */
  onClick?: (isLiked: boolean) => void;
  /** 추가 클래스명 */
  className?: string;
}

const LikeButton = ({
  initialLiked = false,
  onClick,
  className = '',
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onClick?.(newLikedState);
  };

  const heartIcon = isLiked ? filledHeart : emptyHeart;

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform ${className}`}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <img
        src={heartIcon}
        alt={isLiked ? 'filled heart' : 'empty heart'}
        className="w-10 h-10"
      />
    </button>
  );
};

export default LikeButton;
