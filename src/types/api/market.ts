export type MarketSort = 'popular' | 'latest';

export interface GetMarketListParams {
  categoryId?: string;
  sort?: MarketSort;
  page?: number;
  limit?: number;
}

export interface MarketItem {
  item_id: string;
  thumbnail: string;
  title: string;
  price: number;
  star: number;
  review_count: number;
  owner_nickname: string;
  is_wished: boolean;
}

export interface GetMarketListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: null | {
    errorCode: string;
    reason: string;
    data?: unknown;
  };
  success: {
    items: MarketItem[];
    total_count: number;
    page: number;
    limit: number;
  } | null;
}
