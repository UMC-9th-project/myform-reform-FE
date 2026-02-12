import { api } from '../axios';
import type { 
    MarketResponse,
    GetMarketProductListParams,
    GetMarketProductListResponse,
    GetMarketProductDetailParams,
    GetMarketProductDetailResponse,
    MarketProductPhotoReviewRequest,
    MarketProductPhotoReviewResponse,
    MarketProductReviewListRequest,
    MarketProductReviewListResponse
} from '../../types/api/market/market';


/** 마켓 카테고리 조회 */
export const getMarket = async (): Promise<MarketResponse> => {
    const response = await api.get<MarketResponse>('/market/categories');
    return response.data;
};

/** 마켓 상품 목록 조회 */
export const getMarketProductList = async (
    params: GetMarketProductListParams = {}
): Promise<GetMarketProductListResponse> => {
    const response = await api.get<GetMarketProductListResponse>('/market', {
        params: {
            ...params,
            sort: params.sort ?? 'popular',
            page: params.page ?? 1,
            limit: params.limit ?? 15,
        },
    });
    return response.data;
};
// 마켓 상품 상세 조회
export const getMarketProductDetail = async (
    params: GetMarketProductDetailParams
): Promise<GetMarketProductDetailResponse> => {
    const response = await api.get<GetMarketProductDetailResponse>(`/market/${params.item_id}`);
    return response.data;
};

// 마켓 상품 리뷰 목록 조회
export const getMarketProductReviewList = async (
    params: MarketProductReviewListRequest
): Promise<MarketProductReviewListResponse> => {
    const response = await api.get<MarketProductReviewListResponse>(`/market/${params.itemId}/reviews`, {
        params: {
            page: params.page,
            limit: params.limit,
            sort: params.sort,
        },
    });
    return response.data;
};


// 마켓 상품 사진 후기 조회
export const getMarketProductPhotoReview = async (
    params: MarketProductPhotoReviewRequest
): Promise<MarketProductPhotoReviewResponse> => {
    const response = await api.get<MarketProductPhotoReviewResponse>(`/market/${params.itemId}/reviews/photos`, {
        params: {
            offset: params.offset,
            limit: params.limit,
        },
    });
    return response.data;
};