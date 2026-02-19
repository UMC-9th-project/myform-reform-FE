import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformRequestDetail } from '../../../api/order/reformRequest';
import { getWishList } from '../../../api/wishlist';
import { useWish } from '../wishlist/useWish';
import useAuthStore from '../../../stores/useAuthStore';
import type { ReformRequestDetail } from '../../../types/api/order/reformRequest';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  } catch {
    return dateString;
  }
}

export const useReformerOrderRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { toggleWish } = useWish();
  
  const { data: wishData, error: wishError } = useQuery({
    queryKey: ['wishlist', 'REQUEST', accessToken],
    queryFn: () => getWishList('REQUEST'),
    enabled: !!id && !!accessToken,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
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

  const itemId = id || null;
  
  const isWishedFromServer = useMemo(() => {
    if (wishData === undefined || !itemId) {
      return undefined;
    }
    if (wishData?.success?.list) {
      return wishData.success.list.some((item) => item.itemId === itemId);
    }
    return false;
  }, [wishData, itemId]);

  const [localLiked, setLocalLiked] = useState<boolean | null>(null);

  const isLiked = useMemo(() => {
    if (localLiked !== null) {
      return localLiked;
    }
    if (isWishedFromServer === undefined) {
      return false;
    }
    return isWishedFromServer;
  }, [localLiked, isWishedFromServer]);

  const handleLikeClick = async () => {
    if (!accessToken) {
      navigate('/login/type');
      return;
    }

    if (!itemId) return;

    const newLikedState = !isLiked;
    try {
      await toggleWish('REQUEST', itemId, newLikedState);
      setLocalLiked(newLikedState);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          navigate('/login/type');
        }
      }
    }
  };

  const { data: reformRequestDetailResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-request-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('요청 ID가 없습니다.');
      const data = await getReformRequestDetail(id);

      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '요청서 상세 조회 실패');
      }

      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  const requestDetail: ReformRequestDetail | null =
    reformRequestDetailResponse?.success ?? null;

  const imageUrls =
    requestDetail != null
      ? [...requestDetail.images]
          .sort((a, b) => a.photo_order - b.photo_order)
          .map((img) => img.photo)
      : [];

  const isClosed =
    requestDetail != null
      ? (() => {
          try {
            const deadlineDate = new Date(requestDetail.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            deadlineDate.setHours(0, 0, 0, 0);
            return today > deadlineDate;
          } catch {
            return false;
          }
        })()
      : false;

  const formattedDeadline =
    requestDetail != null ? formatDate(requestDetail.dueDate) : '';
  const formattedBudget =
    requestDetail != null
      ? `${requestDetail.minBudget.toLocaleString('ko-KR')}원~${requestDetail.maxBudget.toLocaleString('ko-KR')}원`
      : '';

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('URL이 복사되었습니다.');
    } catch {
      alert('URL 복사에 실패했어요.');
    }
  };

  return {
    id,
    requestDetail,
    isLoading,
    isError,
    isLiked,
    handleLikeClick,
    imageUrls,
    isClosed,
    formattedDeadline,
    formattedBudget,
    handleShare,
  };
};
