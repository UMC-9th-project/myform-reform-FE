import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getMarketProductDetail } from '../../../api/market/market';
import { transformCartItemsToProducts, extractQuantities } from '../../../utils/domain/cartTransform';
import type { GetCartResponse } from '../../../types/api/cart/getCart';
import type { CartProduct } from '../../../types/api/cart/cart';

export const useCartProducts = (cartResponse: GetCartResponse | undefined) => {
  const productsWithoutImages = useMemo(() => {
    if (!cartResponse || cartResponse.resultType !== 'SUCCESS' || !cartResponse.success) return [];
    
    const itemsWithoutImages: Array<{ itemId: string; ownerIndex: number; itemIndex: number }> = [];
    cartResponse.success.forEach((owner, ownerIndex) => {
      owner.items.forEach((item, itemIndex) => {
        const hasImage = 
          item.imageUrl ||
          (item.images && Array.isArray(item.images) && item.images.length > 0) ||
          item.image_url ||
          item.thumbnail;
        
        if (!hasImage && item.itemId) {
          itemsWithoutImages.push({ itemId: item.itemId, ownerIndex, itemIndex });
        }
      });
    });
    return itemsWithoutImages;
  }, [cartResponse]);

  const productDetailQueries = useQueries({
    queries: productsWithoutImages.map(({ itemId }) => ({
      queryKey: ['market-product-detail', itemId],
      queryFn: () => getMarketProductDetail({ item_id: itemId }),
      enabled: !!itemId && productsWithoutImages.length > 0,
     
    })),
  });

  const productImageMap = useMemo(() => {
    const map = new Map<string, string>();
    
    productDetailQueries.forEach((query, index) => {
      const { itemId } = productsWithoutImages[index];
      
      if (query.data?.resultType === 'SUCCESS' && query.data.success?.images) {
        const images = query.data.success.images;
        if (Array.isArray(images) && images.length > 0) {
          map.set(itemId, images[0]);
        }
      }
    });
    
    return map;
  }, [productDetailQueries, productsWithoutImages]);

  // 각 상품의 이미지 로딩 상태 추적
  const productImageLoadingMap = useMemo(() => {
    const map = new Map<string, boolean>();
    productDetailQueries.forEach((query, index) => {
      const { itemId } = productsWithoutImages[index];
      map.set(itemId, query.isLoading);
    });
    return map;
  }, [productDetailQueries, productsWithoutImages]);

  const initialProducts: CartProduct[] = useMemo(() => {
    if (!cartResponse || cartResponse.resultType !== 'SUCCESS' || !cartResponse.success) return [];
    
    const products = transformCartItemsToProducts(cartResponse.success);
    
    // 상품 상세에서 가져온 이미지로 업데이트
    const updatedProducts = products.map((product) => {
      if (!product.imageUrl && product.itemId) {
        const imageFromDetail = productImageMap.get(product.itemId);
        if (imageFromDetail) {
          return { ...product, imageUrl: imageFromDetail };
        }
      }
      return product;
    });
    
    return updatedProducts;
  }, [cartResponse, productImageMap]);

  const initialQuantities: number[] = useMemo(() => {
    if (!cartResponse || cartResponse.resultType !== 'SUCCESS' || !cartResponse.success) return [];
    return extractQuantities(cartResponse.success);
  }, [cartResponse]);

  return {
    initialProducts,
    initialQuantities,
    productImageLoadingMap,
  };
};
