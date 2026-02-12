export interface CartProduct {
  id: number;
  sellerId: number;
  price: number;
  name: string;
  option: string;
  imageUrl?: string;
  cartId?: string; 
  itemId?: string; 
}

export interface CartSeller {
  id: number;
  name: string;
  shippingFee: number;
  shippingText: string;
  ownerId?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  checked: boolean;
}

export interface PaymentSummary {
  productTotal: number;
  shippingTotal: number;
  total: number;
}

// API 응답 타입 (예시)
export interface CartApiResponse {
  products: CartProduct[];
  sellers: CartSeller[];
}
