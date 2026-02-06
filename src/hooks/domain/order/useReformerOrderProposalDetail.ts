import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformProposalDetail } from '../../../api/order/reformProposal';
import type { ReformProposalDetail } from '../../../types/api/order/reformProposal';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatShippingFee(delivery: number): string {
  if (delivery === 0) return '무료 배송';
  return formatWon(delivery);
}

function formatExpectedWorking(expectedWorking: number): string {
  return `평균 ${expectedWorking}일 이내 배송 시작`;
}

export const useReformerOrderProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'reformer' | 'review'>(
    'info'
  );
  const [sortBy, setSortBy] = useState<'latest' | 'high' | 'low'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { data: reformProposalDetailResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-proposal-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('제안 ID가 없습니다.');
      const data = await getReformProposalDetail(id);

      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '제안서 상세 조회 실패');
      }

      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  const proposalDetail: ReformProposalDetail | null =
    reformProposalDetailResponse?.success ?? null;

  const imageUrls =
    proposalDetail != null
      ? [...proposalDetail.images]
          .sort((a, b) => a.photo_order - b.photo_order)
          .map((img) => img.photo)
      : [];

  const formattedPrice =
    proposalDetail != null ? formatWon(proposalDetail.price) : '';
  const formattedShippingFee =
    proposalDetail != null ? formatShippingFee(proposalDetail.delivery) : '';
  const formattedEstimatedPeriod =
    proposalDetail != null
      ? formatExpectedWorking(proposalDetail.expectedWorking)
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

  const handleEdit = () => {
    if (id) navigate(`/reformer/order/suggestions/${id}/edit`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    id,
    proposalDetail,
    isLoading,
    isError,
    isLiked,
    setIsLiked,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    currentPage,
    imageUrls,
    formattedPrice,
    formattedShippingFee,
    formattedEstimatedPeriod,
    handleShare,
    handleEdit,
    handlePageChange,
    navigate,
  };
};
