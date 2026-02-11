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


// 마켓 상품 상세 조회
export interface GetMarketProductDetailParams {
    item_id: string;
}

export interface GetMarketProductDetailResponse {
    resultType: 'SUCCESS' | 'ERROR';
    error: null | {
        code: string;
        message: string;
    };  
    success: {
        category: {
            major: string;
            sub: string;
        };
        
        title: string;
        content: string;
        delivery: number;
        delivery_info: string;
        images: string[];
        item_id: string;
        price: number;
        is_wished: boolean;
        option_groups: {
            option_group_id: string;
            name: string;
            option_items: {
                option_item_id: string;
                name: string;
                extra_price: number;
                quantity: number;
                is_sold_out: boolean;
            }[];
        }[];
        reformer: {
            nickname: string;
            order_count: number;
            owner_id: string;
            profile_image: string;
            star: number;
            star_recent_3m: number;
        };     
    };
}
// 상품 리뷰 목록 조회 
export interface MarketProductReviewListRequest {
    itemId: string;
    page: number;
    limit: number;
    sort: 'latest' | 'star_high' | 'star_low';
}
export interface MarketProductReviewListResponse {

    success: {
        reviews: {
            review_id: string;
            user_profile_image: string;
            user_nickname: string;
            star: number;
            created_at: string;
            content: string;
            product_thumbnail: string;
            photos: string[];
        }[];
        total_count: number;
        avg_star: number;
        page: number;
        limit: number;
        total_pages: number;
        has_next_page: boolean;
        has_prev_page: boolean;
    };
}
   




//마켓 상품 사진 후기 조회
export interface MarketProductPhotoReviewRequest {
    itemId: string;
    offset: number;
    limit: number;
}

export interface MarketProductPhotoReviewResponse {  
    success: {
        photos: {
            photo_index: number;
            review_id: string;
            photo_url: string;
            photo_order: number;
        }[];
        has_more: boolean;
        offset: number;
        limit: number;
        total_count: number;     
    };
}





