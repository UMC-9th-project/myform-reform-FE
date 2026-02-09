import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LikeButton from '../likebutton/LikeButton';
import { useWish } from '../../../hooks/domain/wishlist/useWish';
import { getWishList } from '../../../api/wishlist';
import useAuthStore from '../../../stores/useAuthStore';

export type RequestDetailVariant = 'order' | 'reformer';

interface RequestCardProps {
  imgSrc?: string;
  title?: string;
  priceRange?: string;
  className?: string;
  seller?: string;
  id?: number | string;
  variant?: RequestDetailVariant;
  to?: string;
  isWished?: boolean;
}

const REQUEST_DETAIL_PATH: Record<RequestDetailVariant, string> = {
  order: '/order/requests',
  reformer: '/reformer/order/requests',
};

export default function RequestCard({
  imgSrc,
  title,
  priceRange,
  className = '',
  id,
  variant = 'order',
  to,
  isWished = false,
}: RequestCardProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';
  const { toggleWish } = useWish();
  const { data: wishData, error: wishError } = useQuery({
    queryKey: ['wishlist', 'REQUEST', accessToken],
    queryFn: () => getWishList('REQUEST'),
    enabled: id != null && !!accessToken && variant === 'reformer' && isReformer,
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

  const detailTo =
    id != null ? `${REQUEST_DETAIL_PATH[variant]}/${id}` : undefined;
  const linkTo = to ?? detailTo;

  const handleLikeClick = async (liked: boolean) => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (itemId) {
      try {
        await toggleWish('REQUEST', itemId, liked);
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
    <article className={`w-full ${linkTo ? 'cursor-pointer' : ''} ${className}`}>
      <div
        className="relative w-full rounded-[1.25rem] overflow-hidden"
        style={{ aspectRatio: '337/307' }}
      >
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {variant === 'reformer' && (
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

      <div className="mt-[1.125rem]">
        <p className="body-b0-sb line-clamp-2 text-[var(--color-black)]">
          {title}
        </p>
        {priceRange && (
          <div className="mt-[0.75rem] heading-h4-bd text-[var(--color-black)] break-words">
            {priceRange.includes('~') ? (
              <>
                {priceRange.split('~')[0]}
                {' '}
                ~{priceRange.split('~')[1]}
              </>
            ) : (
              priceRange
            )}
          </div>
        )}
      </div>
    </article>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block w-full">{content}</Link>;
  }
  return content;
}
