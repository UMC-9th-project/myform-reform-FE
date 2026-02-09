import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformProposalDetail } from '../../../api/order/reformProposal';
import { getProfile } from '../../../api/profile/user';
import { getReformerReviews } from '../../../api/order/reviews';
import type { ReformProposalDetail } from '../../../types/api/order/reformProposal';
import type { ReformerReviewsSortBy } from '../../../types/api/reviews';

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

export const useOrderProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
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

  const profileId = proposalDetail?.ownerId ?? proposalDetail?.ownerName ?? '';
  const { data: profileResponse } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => getProfile(profileId),
    enabled: !!profileId,
    staleTime: 1000 * 60,
  });

  const profile =
    profileResponse?.resultType === 'SUCCESS' && profileResponse?.success
      ? profileResponse.success
      : null;

  const reformerId = profile?.ownerId ?? proposalDetail?.ownerId ?? '';
  const apiSortBy: ReformerReviewsSortBy =
    sortBy === 'latest' ? 'recent' : sortBy === 'high' ? 'high_rating' : 'low_rating';

  const { data: reviewsResponse } = useQuery({
    queryKey: ['reformer-reviews', reformerId, apiSortBy],
    queryFn: () =>
      getReformerReviews(reformerId, { limit: 50, sortBy: apiSortBy }),
    enabled: !!reformerId,
    staleTime: 1000 * 60,
  });

  const reviewsData = useMemo(() => {
    const raw = reviewsResponse?.resultType === 'SUCCESS' && reviewsResponse?.success
      ? reviewsResponse.success
      : null;
    if (!raw) {
      return {
        reviews: [],
        photoReviewCount: 0,
        reviewPhotos: [] as string[],
        avgStar: profile?.avgStar ?? 0,
      };
    }
    const reviews = raw.reviews.map((r) => {
      const createdAt = (() => {
        try {
          const d = new Date(r.createdAt);
          return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
        } catch {
          return r.createdAt;
        }
      })();
      return {
        id: r.reviewId,
        userName: r.userNickname,
        rating: r.star,
        date: createdAt,
        reviewText: r.content,
        image: r.reviewPhotos?.[0],
        profileImg: r.userProfilePhoto,
      };
    });
    return {
      reviews,
      photoReviewCount: raw.photoReviewCount,
      reviewPhotos: raw.reviewPhotos ?? [],
      avgStar: raw.avgStar,
    };
  }, [reviewsResponse, profile?.avgStar]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    id,
    proposalDetail,
    profile,
    reviews: reviewsData.reviews,
    photoReviewCount: reviewsData.photoReviewCount,
    reviewPhotos: reviewsData.reviewPhotos,
    reviewsAvgStar: reviewsData.avgStar,
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
    handlePageChange,
  };
};
