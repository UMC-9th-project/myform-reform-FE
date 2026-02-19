export type WishType = 'PROPOSAL' | 'ITEM' | 'REQUEST';

export interface WishItem {
  wishType: WishType;
  itemId: string;
  content: string;
  title: string;
  avgStar: number;
  reviewCount: number;
  price: number;
  name: string;
}

export interface GetWishListResponse {
  resultType: string;
  error: null;
  success: {
    list: WishItem[];
  };
}

export interface CreateWishRequest {
  type: WishType;
  itemId: string;
}

export interface CreateWishResponse {
  type: WishType;
  itemId: string;
}

export interface DeleteWishRequest {
  type: WishType;
  itemId: string;
}

export interface DeleteWishResponse {
  type: WishType;
  itemId: string;
}
