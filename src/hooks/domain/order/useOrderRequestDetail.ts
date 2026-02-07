import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformRequestDetail } from '../../../api/order/reformRequest';
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

export const useOrderRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);

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
    setIsLiked,
    imageUrls,
    isClosed,
    formattedDeadline,
    formattedBudget,
    handleShare,
  };
};
