export interface CartOption {
  option_item_id: string;
  name: string;
  extra_price: number;
}

export interface CartItem {
  cartId: string;
  itemId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  delivery: number;
  options: CartOption[];
}

export interface CartOwner {
  ownerId: string;
  ownerName: string;
  deliveryFee: number;
  total: number;
  items: CartItem[];
}

export interface GetCartResponse {
  resultType: string;
  error: null;
  success: CartOwner[];
}
