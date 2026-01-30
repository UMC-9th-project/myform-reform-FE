import { useState, useRef, useEffect } from 'react';
import UpIcon from '../../../../assets/icons/up.svg?react';
import DownIcon from '../../../../assets/icons/down.svg?react';
import Button from '../../button_tmp/button1';

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
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && !isExpanded) {
      const img = imageRef.current;
      if (img.complete) {
        setImageHeight(img.offsetHeight);
      } else {
        img.onload = () => {
          setImageHeight(img.offsetHeight);
        };
      }
    } else {
      setImageHeight(null);
    }
  }, [firstImage, isExpanded]);

  const handleClick = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`w-full pt-10 space-y-4 ${className}`}>
      {firstImage && (
        <div className="flex flex-col">
          <div
            className={`relative ${!isExpanded ? 'overflow-hidden' : ''}`}
            style={
              !isExpanded && imageHeight
                ? { height: `${(imageHeight * 2) / 3}px` }
                : {}
            }
          >
            <img
              ref={imageRef}
              src={firstImage}
              alt="첫 번째 이미지"
              className={`w-full ${!isExpanded ? 'object-cover object-top' : 'h-auto'}`}
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
                className="w-full h-auto"
              />
            ))}
        </div>
      )}
      <Button
        type="button"
        onClick={handleClick}
        variant="outlined-mint"
        className="w-full h-[4.625rem] py-[0.625rem] px-[1.875rem]"
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
