import { api } from '../axios';
import type {
  GetReformerReviewsParams,
  GetReformerReviewsResponse,
  GetTargetReviewsParams,
  GetTargetReviewsResponse,
  GetTargetReviewPhotosParams,
  GetTargetReviewPhotosResponse,
  GetTargetReviewDetailParams,
  GetTargetReviewDetailResponse,
  TargetType,
} from '../../types/api/reviews';

/** 리폼러 전체 리뷰 목록 조회 - GET /reviews/reformer/{reformerId} */
export const getReformerReviews = async (
  reformerId: string,
  params?: GetReformerReviewsParams
): Promise<GetReformerReviewsResponse> => {
  const { data } = await api.get<GetReformerReviewsResponse>(
    `/reviews/reformer/${encodeURIComponent(reformerId)}`,
    {
      params: {
        limit: params?.limit ?? 10,
        ...(params?.cursor && { cursor: params.cursor }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
      },
    }
  );
  return data;
};

/** 타겟별 리뷰 목록 조회 - GET /reviews/target/{targetType}/{targetId}/reviews */
export const getTargetReviews = async (
  targetType: TargetType,
  targetId: string,
  params?: GetTargetReviewsParams
): Promise<GetTargetReviewsResponse> => {
  const { data } = await api.get<GetTargetReviewsResponse>(
    `/reviews/target/${targetType}/${encodeURIComponent(targetId)}/reviews`,
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 4,
        sort: params?.sort ?? 'latest',
      },
    }
  );
  return data;
};

/** 타겟별 사진 후기 조회 - GET /reviews/target/{targetType}/{targetId}/reviews/photos */
export const getTargetReviewPhotos = async (
  targetType: TargetType,
  targetId: string,
  params?: GetTargetReviewPhotosParams
): Promise<GetTargetReviewPhotosResponse> => {
  const { data } = await api.get<GetTargetReviewPhotosResponse>(
    `/reviews/target/${targetType}/${encodeURIComponent(targetId)}/reviews/photos`,
    {
      params: {
        offset: params?.offset ?? 0,
        limit: params?.limit ?? 15,
      },
    }
  );
  return data;
};

/** 타겟별 리뷰 상세 조회 - GET /reviews/target/{targetType}/{targetId}/reviews/{reviewId} */
export const getTargetReviewDetail = async (
  targetType: TargetType,
  targetId: string,
  reviewId: string,
  params?: GetTargetReviewDetailParams
): Promise<GetTargetReviewDetailResponse> => {
  const { data } = await api.get<GetTargetReviewDetailResponse>(
    `/reviews/target/${targetType}/${encodeURIComponent(targetId)}/reviews/${encodeURIComponent(reviewId)}`,
    {
      params: {
        ...(params?.photoIndex !== undefined && { photoIndex: params.photoIndex }),
      },
    }
  );
  return data;
};
