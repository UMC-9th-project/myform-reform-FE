import { useState } from 'react';
import UpIcon from '../../../assets/icons/up.svg?react';
import DownIcon from '../../../assets/icons/down.svg?react';
import Button from '../Button/button1';

interface ProductInfoToggleProps {
  defaultExpanded?: boolean;

  onToggle?: (isExpanded: boolean) => void;

  className?: string;
  /** 첫 번째 이미지 (항상 표시) */
  firstImage?: string;
  /** 추가 이미지들 (토글이 열렸을 때 표시) */
  additionalImages?: string[];
}

const ProductInfoToggle = ({
  defaultExpanded = false,
  onToggle,
  className = '',
  firstImage,
  additionalImages = [],
}: ProductInfoToggleProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {firstImage && (
        <div className="flex flex-col">
          <div className="relative">
            <img
              src={firstImage}
              alt="첫 번째 이미지"
              className="w-[76.1875rem] h-auto"
            />
            {!isExpanded && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[3.875rem]"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
                }}
              />
            )}
          </div>
          {isExpanded &&
            additionalImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`추가 이미지 ${index + 1}`}
                className="w-[76.1875rem] h-auto"
              />
            ))}
        </div>
      )}
      <Button
        type="button"
        onClick={handleClick}
        variant="outlined-mint"
        className="w-[76.1875rem] h-[4.625rem] py-[0.625rem] px-[1.875rem]"
      >
        <span>{isExpanded ? '상품 정보 접기' : '상품 정보 더보기'}</span>
        {isExpanded ? (
          <UpIcon className="w-[3.25rem] h-[3rem]" />
        ) : (
          <DownIcon className="w-[3.25rem] h-[3rem]" />
        )}
      </Button>
    </div>
  );
};

export default ProductInfoToggle;
