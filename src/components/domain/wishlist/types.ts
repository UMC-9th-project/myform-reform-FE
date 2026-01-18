export interface WishlistItem {
  id: number;
  image: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  seller: string;
}

export interface WishlistCustomItem {
  id: number;
  image: string;
  title: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  reviewCount: number;
  seller: string;
  soldOutDate: string; // YYYY-MM-DD 형식
}

export type WishlistMenuType = 'wishlist' | 'market' | 'custom';
