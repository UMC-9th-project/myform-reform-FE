export type SearchType = 'ITEM' | 'REQUEST' | 'PROPOSAL';

export interface SearchParams {
  type: SearchType;
  query: string;
  cursor?: string;
}

export interface SearchItem {
  id: string;
  type: 'ITEM' | 'REQUEST' | 'PROPOSAL';
  title: string;
  content?: string;
  imageUrl?: string;
  thumbnail?: string;
  price?: number;
  avgStar?: number;
  star?: number;
  reviewCount?: number;
  review_count?: number;
  authorName?: string;
  owner_nickname?: string;
  ownerName?: string;
  nickname?: string;
  createdAt?: string;
  isLiked?: boolean;
  is_wished?: boolean;
  priceRange?: string;
  rating?: number;
  reviewCountText?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface SearchResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    results: SearchItem[];
    nextCursor?: string | null;
    hasNextPage?: boolean;
    totalCount?: number;
  } | null;
}
