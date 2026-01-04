import { useState } from 'react';
import TrashIcon from '../../../assets/icons/trash.svg?react';

interface ClickableImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const ClickableImage = ({
  src,
  alt = '',
  className = '',
}: ClickableImageProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        style={{
          border: isSelected
            ? '0.125rem solid var(--color-mint-0)'
            : '0.125rem solid transparent',
        }}
      />
      {isSelected && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
          style={{
            bottom: '-4.375rem',
            width: '3.75rem',
            height: '3.75rem',
            borderRadius: '100px',
            backgroundColor: 'var(--color-mint-0)',
            boxShadow: '0 0.125rem 0.444rem 0 rgba(0, 0, 0, 0.25)',
            padding: '0.625rem',
          }}
        >
          <TrashIcon className="w-full h-full text-white" />
        </div>
      )}
    </div>
  );
};

export default ClickableImage;
