import { useState, useEffect } from 'react';
import redEmptyHeart from './icons/red/empty.svg';
import redFilledHeart from './icons/red/filled.svg';
import blackLineEmptyHeart from './icons/blackLine/empty.svg';
import blackLineFilledHeart from './icons/blackLine/filled.svg';

type LikeButtonVariant = 'red' | 'blackLine';

interface LikeButtonProps {
  initialLiked?: boolean;
  onClick?: (isLiked: boolean) => void;
  className?: string;
  variant?: LikeButtonVariant;
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

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onClick?.(newLikedState);
  };

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
