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


export interface MarketItem {
    categoryId: string;
    name: string;
    sortOrder: number;
}   