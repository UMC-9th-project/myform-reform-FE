import { useState, useEffect, useMemo } from 'react';
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
  /** 상세 페이지로 이동 시 사용할 id (variant와 함께 사용) */
  id?: number | string;
  /** 상세 경로 구분: order → /order/requests/:id, reformer → /reformer/order/requests/:id */
  variant?: RequestDetailVariant;
  /** 클릭 시 이동할 상세 페이지 경로 (직접 지정 시 id/variant 대신 사용) */
  to?: string;
  /** 초기 위시 상태 */
  isWished?: boolean;
}

const REQUEST_DETAIL_PATH: Record<RequestDetailVariant, string> = {
  order: '/order/requests',
  reformer: '/reformer/order/requests',
};

export default function RequestCard({
  imgSrc = '/crt1.jpg',
  title = '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
  priceRange = '30,000원~50,000원',
  className = '',
  id,
  variant = 'order',
  to,
  isWished = false,
}: RequestCardProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { toggleWish } = useWish();
  const { data: wishData } = useQuery({
    queryKey: ['wishlist', 'REQUEST'],
    queryFn: () => getWishList('REQUEST'),
    enabled: id != null && !!accessToken,
    placeholderData: (previousData) => previousData,
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

  const initialLiked = useMemo(() => {
    if (isWished) {
      return true;
    }
    if (isWishedFromServer === undefined) {
      return false;
    }
    return isWishedFromServer;
  }, [isWished, isWishedFromServer]);

  const [isLiked, setIsLiked] = useState(initialLiked);

  useEffect(() => {
    if (!isWished && isWishedFromServer !== undefined) {
      setIsLiked(isWishedFromServer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWishedFromServer]);

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
        setIsLiked(liked);
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
        className="relative w-full rounded-[0.625rem] overflow-hidden"
        style={{ aspectRatio: '361/307' }}
      >
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {(variant === 'reformer' || variant === 'order') && (
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
        <p className="mt-[0.75rem] heading-h4-bd text-[var(--color-black)]">
          {priceRange}
        </p>
      </div>
    </article>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block w-full">{content}</Link>;
  }
  return content;
}
