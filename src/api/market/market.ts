import { api } from '../axios';
import type { 
    MarketResponse,
    GetMarketProductListParams,
    GetMarketProductListResponse 
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