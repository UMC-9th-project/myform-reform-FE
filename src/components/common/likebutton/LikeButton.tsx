import { useState } from 'react';
import redEmptyHeart from './icons/red/empty.svg';
import redFilledHeart from './icons/red/filled.svg';
import blackLineEmptyHeart from './icons/blackLine/empty.svg';
import blackLineFilledHeart from './icons/blackLine/filled.svg';

type LikeButtonVariant = 'red' | 'blackLine';

interface LikeButtonProps {
  /** 초기 좋아요 상태 */
  initialLiked?: boolean;
  /** 클릭 시 실행할 함수 */
  onClick?: (isLiked: boolean) => void;
  /** 추가 클래스명 */
  className?: string;
  /** 하트 아이콘 색상 변형 */
  variant?: LikeButtonVariant;
  /** 읽기 전용 모드 (클릭 불가) */
  readOnly?: boolean;
}

const LikeButton = ({
  initialLiked = false,
  onClick,
  className = '',
  variant = 'red',
  readOnly = false,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onClick?.(newLikedState);
  };

  // readOnly 모드일 때는 initialLiked를 사용, 아니면 내부 상태 사용
  const displayLiked = readOnly ? initialLiked : isLiked;

  const heartIcon =
    variant === 'blackLine'
      ? displayLiked
        ? blackLineFilledHeart
        : blackLineEmptyHeart
      : displayLiked
        ? redFilledHeart
        : redEmptyHeart;

  const content = (
    <img
      src={heartIcon}
      alt={displayLiked ? 'filled heart' : 'empty heart'}
      className="w-10 h-10"
    />
  );

  const baseClassName = `w-12 h-12 flex items-center justify-center ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${className}`;

  // readOnly일 때 span으로 렌더 (버튼 안에 버튼 중첩 방지)
  if (readOnly) {
    return <span className={baseClassName} role="presentation">{content}</span>;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={baseClassName}
      aria-label={displayLiked ? '좋아요 취소' : '좋아요'}
    >
      {content}
    </button>
  );
};

export default LikeButton;
