export interface MarketItem {
    categoryId: string;
    name: string;
    sortOrder: number;
}   
export interface MarketResponse {
    resultType: 'SUCCESS' | 'ERROR';
    error: null | {
        code: string;
        message: string;
    };
    success: {
       categories: Array<{
        market: MarketItem;
        children: Array<{
        market: MarketItem;
        }>;
       }>;
    } 
}

/** 마켓 상품 목록 조회 요청 파라미터 */
export interface GetMarketProductListParams {
    /** 카테고리 ID (선택) */
    categoryId?: string;
    /** 정렬 기준 (popular/latest/rating, 기본: popular) */
    sort?: 'popular' | 'latest' | 'rating';
    /** 페이지 번호 (기본: 1) */
    page?: number;
    /** 페이지당 개수 (기본: 15) */
    limit?: number;
}

/** 마켓 상품 아이템 */
export interface MarketProductItem {
    item_id: string;
    thumbnail: string;
    title: string;
    price: number;
    star: number;
    review_count: number;
    owner_nickname: string;
    is_wished: boolean;
}

/** 마켓 상품 목록 조회 응답 */
export interface GetMarketProductListResponse {
    resultType: 'SUCCESS' | 'ERROR';
    error: null | {
        code: string;
        message: string;
    };
    success: {
        items: MarketProductItem[];
    };
}



