import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LikeButton from '../likebutton/LikeButton';
import starIcon from '../../../assets/icons/star.svg';
import { useWish } from '../../../hooks/domain/wishlist/useWish';
import { getWishList } from '../../../api/wishlist';
import useAuthStore from '../../../stores/useAuthStore';

export type ProposalDetailVariant = 'order' | 'reformer';

interface ProposalCardProps {
  imgSrc?: string;
  title?: string;
  price?: string;
  rating?: number;
  ratingDecimals?: 1 | 2;
  reviewCountText?: string;
  nickname?: string;
  className?: string;
  id?: number | string;
  variant?: ProposalDetailVariant;
  to?: string;
  isWished?: boolean;
}

const PROPOSAL_DETAIL_PATH: Record<ProposalDetailVariant, string> = {
  order: '/order/proposals',
  reformer: '/reformer/order/proposals',
};

export default function ProposalCard({
  imgSrc,
  title,
  price,
  rating,
  ratingDecimals = 2,
  reviewCountText,
  nickname,
  className = '',
  id,
  variant = 'order',
  to,
  isWished = false,
}: ProposalCardProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';
  const { toggleWish } = useWish();
  const { data: wishData } = useQuery({
    queryKey: ['wishlist', 'PROPOSAL', accessToken],
    queryFn: () => getWishList('PROPOSAL'),
    enabled: id != null && !!accessToken && variant === 'order' && !isReformer,
    staleTime: 5 * 60 * 1000,
  });

  const itemId = id ? (typeof id === 'string' ? id : id.toString()) : null;
  
  const isWishedFromServer = useMemo(() => {
    if (isWished) {
      return true;
    }
    if (wishData === undefined || !itemId) {
      return undefined;
    }
    if (wishData?.success?.list) {
      return wishData.success.list.some((item) => item.itemId === itemId);
    }
    return false;
  }, [wishData, itemId, isWished]);

  const [localLiked, setLocalLiked] = useState<boolean | null>(null);

  const isLiked = useMemo(() => {
    if (isWished) {
      return true;
    }
    if (localLiked !== null) {
      return localLiked;
    }
    if (isWishedFromServer === undefined) {
      return false;
    }
    return isWishedFromServer;
  }, [isWished, localLiked, isWishedFromServer]);

  const formattedRating = useMemo(() => {
    if (rating === undefined || rating === null) {
      return '0.00';
    }
    if (typeof rating === 'number' && Number.isFinite(rating)) {
      return rating.toFixed(ratingDecimals);
    }
    return String(rating);
  }, [rating, ratingDecimals]);
  const detailTo =
    id != null ? `${PROPOSAL_DETAIL_PATH[variant]}/${id}` : undefined;
  const linkTo = to ?? detailTo;

  const handleLikeClick = async (liked: boolean) => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (itemId) {
      try {
        await toggleWish('PROPOSAL', itemId, liked);
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

  const content = (
    <div
      className={`bg-white rounded-[1.25rem] overflow-visible ${linkTo ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className="relative w-full rounded-[1.25rem] overflow-hidden"
        style={{ aspectRatio: '337/307' }}
      >
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {variant === 'order' && (
          <div
            className="absolute bottom-[0.75rem] right-[0.75rem] z-10"
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

      <div className="pt-[1.25rem] pb-[1.5rem]">
        <h3 className="body-b0-sb text-[var(--color-black)] mb-[0.625rem] line-clamp-2 break-words leading-normal">
          {title}
        </h3>
        <p className="heading-h4-bd text-[var(--color-black)] mb-[0.125rem]">
          {price}
        </p>
        <div className="flex items-center gap-[0.375rem] mb-[0.525rem]">
          <img
            src={starIcon}
            alt="별점"
            className="w-[0.8125rem] h-[0.75rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{formattedRating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">{reviewCountText}</span>
          </span>
        </div>
        <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
          {nickname}
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block w-full">
        {content}
      </Link>
    );
  }
  return content;
}

