import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformProposalDetail } from '../../../api/order/reformProposal';
import { getProfile } from '../../../api/profile/user';
import { getTargetReviews, getTargetReviewPhotos } from '../../../api/order/reviews';
import useAuthStore from '../../../stores/useAuthStore';
import type { ReformProposalDetail } from '../../../types/api/order/reformProposal';
import type { TargetReviewsSort } from '../../../types/api/reviews';
import type { GetProfileResponse } from '../../../types/domain/profile/profile';

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
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'info' | 'reformer' | 'review'>(
    'info'
  );
  const [sortBy, setSortBy] = useState<'latest' | 'high' | 'low'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const ITEMS_PER_PAGE = 5;

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

  const rawProposalDetail = reformProposalDetailResponse?.success ?? null;

  // API의 isOwner 또는 로그인 유저와 ownerId 비교로 본인 글 여부 판단
  const proposalDetail: ReformProposalDetail | null = rawProposalDetail
    ? {
        ...rawProposalDetail,
        isOwner:
          rawProposalDetail.isOwner ||
          !!(user?.id && rawProposalDetail.ownerId && user.id === rawProposalDetail.ownerId),
      }
    : null;

  // 제안서 상세 API의 profile(별점, 후기수 등) 우선 사용, 없으면 GET /profile 호출
  const profileId = proposalDetail?.ownerId ?? proposalDetail?.ownerName ?? '';
  const { data: profileResponse } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => getProfile(profileId),
    enabled: !!profileId && !proposalDetail?.profile,
    staleTime: 1000 * 60,
  });

  const profileFromApi =
    profileResponse?.resultType === 'SUCCESS' && profileResponse?.success
      ? profileResponse.success
      : null;

  const profile: GetProfileResponse['success'] = useMemo(() => {
    const p = proposalDetail?.profile;
    if (p) {
      const totalSaleCount = p.totalSaleCount ?? p.toatalSaleCount ?? 0;
      return {
        ownerId: proposalDetail?.ownerId,
        profilePhoto: p.ownerProfile,
        nickname: p.ownerName,
        avgStar: p.avgStar,
        avgStarRecent3m: p.avgStarRecent3m,
        reviewCount: p.reviewCount,
        totalSaleCount,
        keywords: p.keywords ?? [],
        bio: p.bio ?? '',
      };
    }
    return profileFromApi;
  }, [proposalDetail?.profile, proposalDetail?.ownerId, profileFromApi]);

  const proposalId = proposalDetail?.reformProposalId ?? id ?? '';
  const apiSortBy: TargetReviewsSort =
    sortBy === 'latest' ? 'latest' : sortBy === 'high' ? 'star_high' : 'star_low';

  const { data: reviewsResponse } = useQuery({
    queryKey: ['target-reviews', 'PROPOSAL', proposalId, currentPage, apiSortBy],
    queryFn: () =>
      getTargetReviews('PROPOSAL', proposalId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: apiSortBy,
      }),
    enabled: !!proposalId,
    staleTime: 1000 * 60,
  });

  // 사진 후기 조회
  const { data: reviewPhotosResponse } = useQuery({
    queryKey: ['target-review-photos', 'PROPOSAL', proposalId],
    queryFn: () =>
      getTargetReviewPhotos('PROPOSAL', proposalId, {
        offset: 0,
        limit: 15,
      }),
    enabled: !!proposalId,
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
        totalPages: 0,
      };
    }
    
    // 사진이 있는 리뷰 개수 계산
    const photoReviewCount = raw.reviews.filter((r) => r.photos && r.photos.length > 0).length;
    
    // 사진 후기 API에서 받은 사진들 사용
    const photosData = reviewPhotosResponse?.resultType === 'SUCCESS' && reviewPhotosResponse?.success
      ? reviewPhotosResponse.success
      : null;
    
    const reviewPhotos: string[] = photosData
      ? photosData.photos.map((p) => p.photo_url)
      : (() => {
          // API에서 사진을 받지 못한 경우 리뷰에서 추출
          const photos: string[] = [];
          raw.reviews.forEach((r) => {
            if (r.photos && r.photos.length > 0) {
              photos.push(...r.photos);
            }
          });
          return photos;
        })();

    const reviews = raw.reviews.map((r) => {
      const createdAt = (() => {
        try {
          const d = new Date(r.created_at);
          return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
        } catch {
          return r.created_at;
        }
      })();
      return {
        id: r.review_id,
        userName: r.user_nickname,
        rating: r.star,
        date: createdAt,
        reviewText: r.content,
        image: r.photos?.[0],
        profileImg: r.user_profile_image,
      };
    });
    return {
      reviews,
      photoReviewCount,
      reviewPhotos,
      avgStar: raw.avg_star,
      totalPages: raw.total_pages,
    };
  }, [reviewsResponse, reviewPhotosResponse, profile?.avgStar]);

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
    totalPages: reviewsData.totalPages,
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
