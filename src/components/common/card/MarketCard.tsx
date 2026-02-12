import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LikeButton from '../likebutton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';
import useAuthStore from '../../../stores/useAuthStore';
import { useWish } from '../../../hooks/domain/wishlist/useWish';
import { getWishList } from '../../../api/wishlist';

const MARKET_DETAIL_PATH = '/market/product';

export interface MarketCardItem {
  item_id: string;
  thumbnail: string;
  title: string;
  price: number;
  star: number;
  review_count: number;
  owner_nickname: string;
  is_wished: boolean;
}

export interface CustomOrderItem {
  proposal_id: string;
  thumbnail: string;
  title: string;
  min_price: number;
  star?: number;
  review_count?: number;
  owner_nickname: string;
  is_wished: boolean;
}

const isMarketCardItem = (item: MarketCardItem | CustomOrderItem): item is MarketCardItem => {
  return 'item_id' in item;
};

interface MarketCardProps {
  item: MarketCardItem | CustomOrderItem;
  initialLiked?: boolean;
  onLikeClick?: (id: number, isLiked: boolean) => void;
  to?: string;
  hideLikeButton?: boolean;
  ratingDecimals?: 1 | 2;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ko-KR');
};

const MarketCard = ({
  item,
  initialLiked = false,
  onLikeClick,
  to,
  hideLikeButton = false,
  ratingDecimals = 2,
}: MarketCardProps) => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';
  const isMarketItem = isMarketCardItem(item);
  const price = isMarketItem ? item.price : item.min_price;
  const hasRating = item.star !== undefined;
  const isWished = item.is_wished;

  const itemId = isMarketItem ? item.item_id : item.proposal_id;
  const wishType = isMarketItem ? 'ITEM' : 'PROPOSAL';
  
  const { toggleWish } = useWish();
  const { data: wishData, error: wishError } = useQuery({
    queryKey: ['wishlist', wishType, accessToken],
    queryFn: () => getWishList(wishType),
    enabled: !!accessToken && !isReformer && !hideLikeButton,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (wishError && typeof wishError === 'object' && 'response' in wishError) {
      const axiosError = wishError as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        navigate('/login/type');
      }
    }
  }, [wishError, navigate]);

  const isWishedFromServer = useMemo(() => {
    if (isWished) {
      return true;
    }
    if (wishData === undefined || !itemId) {
      return undefined;
    }
    if (wishData?.success?.list) {
      return wishData.success.list.some((wishItem) => wishItem.itemId === itemId);
    }
    return false;
  }, [wishData, itemId, isWished]);

  const [localLiked, setLocalLiked] = useState<boolean | null>(null);

  const isLiked = useMemo(() => {
    if (initialLiked || isWished) {
      return true;
    }
    if (localLiked !== null) {
      return localLiked;
    }
    if (isWishedFromServer === undefined) {
      return false;
    }
    return isWishedFromServer;
  }, [initialLiked, isWished, localLiked, isWishedFromServer]);

  const handleLikeClick = async (liked: boolean) => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (onLikeClick) {
      // 기존 onLikeClick prop이 있으면 그것을 사용
      if (isMarketItem) {
        onLikeClick(Number(item.item_id), liked);
      } else {
        onLikeClick(Number(item.proposal_id), liked);
      }
    } else {
      // 내부 찜 기능 사용
      try {
        await toggleWish(wishType, itemId, liked);
        setLocalLiked(liked);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            navigate('/login/type');
          }
        }
      }
    }
  };

  const linkTo = to ?? (isMarketItem 
    ? `${MARKET_DETAIL_PATH}/${item.item_id}`
    : `/proposal/${item.proposal_id}`);

  const content = (
    <div className="bg-white rounded-[1.25rem] overflow-visible cursor-pointer">
      {/* 상품 이미지 */}
      <div
        className="relative w-full rounded-[1.25rem] overflow-hidden"
        style={{ aspectRatio: '337/307' }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {!hideLikeButton && !isReformer && (
          <div
            className="absolute bottom-[0.75rem] right-[0.75rem]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            role="presentation"
          >
            <LikeButton
              initialLiked={isLiked}
              onClick={handleLikeClick}
            />
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {item.title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.125rem]">
          {isMarketItem ?
             `${formatPrice(price)}원`
            : `${formatPrice(price)}원`}
        </p>
        {hasRating && (
          <div className="flex items-center gap-[0.375rem] mb-[0.525rem]">
            <img
              src={starIcon}
              alt="별점"
              className="w-[0.8125rem] h-[0.75rem]"
            />
            <span className="body-b3-rg">
              <span className="text-[var(--color-black)]">{isMarketItem ? item.star.toFixed(ratingDecimals) : (item.star ?? 0).toFixed(ratingDecimals)}</span>{' '}
              <span className="text-[var(--color-gray-50)]">
                ({isMarketItem ? item.review_count : (item.review_count ?? 0)})
            </span>
          </span>
        </div>
        )}
        <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {item.owner_nickname}
        </span>
      </div>
    </div>
  );

  return <Link to={linkTo} className="block w-full">{content}</Link>;
};

export default MarketCard;
