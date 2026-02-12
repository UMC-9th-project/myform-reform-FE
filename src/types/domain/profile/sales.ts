export interface GetProfileSalesParams {
  ownerId: string;
  cursor?: string;
  limit?: number;
}

export interface ProfileSaleItem {
  itemId: string;
  photo: string;
  isWished: boolean;
  title: string;
  price: number;
  avgStar: number;
  reviewCount: number;
  sellerName: string;
}

export interface GetProfileSalesResponse {
  resultType: string;
  error: null;
  success: {
    items: ProfileSaleItem[];
    nextCursor: string | null;
    hasNext: boolean;
  };
}