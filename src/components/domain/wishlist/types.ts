export interface WishlistItem {
  id: number;
  image: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  seller: string;
}

export type WishlistMenuType = 'wishlist' | 'market' | 'custom';
