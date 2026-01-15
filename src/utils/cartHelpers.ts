import type { CartProduct, CartSeller } from '../types/cart';

/**
 판매자별로 상품을 그룹화
 */
export const groupProductsBySeller = (
  products: CartProduct[],
  sellers: CartSeller[]
): Map<CartSeller, CartProduct[]> => {
  const grouped = new Map<CartSeller, CartProduct[]>();

  sellers.forEach((seller) => {
    const sellerProducts = products.filter((p) => p.sellerId === seller.id);
    if (sellerProducts.length > 0) {
      grouped.set(seller, sellerProducts);
    }
  });

  return grouped;
};

/**
 상품의 전체 인덱스
 */
export const findProductIndex = (
  products: CartProduct[],
  productId: number
): number => {
  return products.findIndex((p) => p.id === productId);
};

/**
 배송비 텍스트
 */
export const formatShippingText = (shippingFee: number): string => {
  return shippingFee === 0 ? '무료 배송' : `${shippingFee.toLocaleString()}원`;
};
