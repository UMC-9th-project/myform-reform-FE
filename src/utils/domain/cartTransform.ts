import type { CartOwner } from '../../types/api/cart/getCart';
import type { CartProduct, CartSeller } from '../../types/api/cart/cart';

export const transformCartOwnersToSellers = (
  owners: CartOwner[]
): CartSeller[] => {
  return owners.map((owner, index) => ({
    id: index,
    name: owner.ownerName || '판매자',
    shippingFee: owner.deliveryFee || 0,
    shippingText: owner.deliveryFee === 0 ? '무료 배송' : `${owner.deliveryFee.toLocaleString()}원`,
    ownerId: owner.ownerId,
  }));
};

export const transformCartItemsToProducts = (
  owners: CartOwner[]
): CartProduct[] => {
  const products: CartProduct[] = [];

  owners.forEach((owner, ownerIndex) => {
    owner.items.forEach((item) => {
      const optionText = item.options.length > 0
        ? item.options
            .map((opt) => `${opt.name}${opt.extra_price > 0 ? ` (+${opt.extra_price.toLocaleString()}원)` : ''}`)
            .join(', ')
        : '옵션 없음';

      const cartIdHash = item.cartId
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000000;
      
      // 이미지 우선순위: imageUrl > images 배열의 첫 번째 > image_url > thumbnail
      const imageUrl = 
        item.imageUrl ||
        (item.images && Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined) ||
        item.image_url ||
        item.thumbnail ||
        undefined;
      
      products.push({
        id: cartIdHash,
        sellerId: ownerIndex,
        price: item.price,
        name: item.title,
        option: optionText,
        imageUrl: imageUrl,
        cartId: item.cartId,
        itemId: item.itemId,
      });
    });
  });

  return products;
};

export const extractQuantities = (owners: CartOwner[]): number[] => {
  const quantities: number[] = [];
  owners.forEach((owner) => {
    owner.items.forEach((item) => {
      quantities.push(item.quantity);
    });
  });
  return quantities;
};
