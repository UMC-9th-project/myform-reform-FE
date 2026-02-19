import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getProfile } from '../../../api/profile/user';
import { transformCartOwnersToSellers } from '../../../utils/domain/cartTransform';
import type { GetCartResponse } from '../../../types/api/cart/getCart';
import type { CartSeller } from '../../../types/api/cart/cart';

export const useCartSellers = (cartResponse: GetCartResponse | undefined) => {
  const baseSellers: CartSeller[] = useMemo(() => {
    if (!cartResponse || cartResponse.resultType !== 'SUCCESS' || !cartResponse.success || !Array.isArray(cartResponse.success)) {
      return [];
    }
    return transformCartOwnersToSellers(cartResponse.success);
  }, [cartResponse]);

  const profileQueries = useQueries({
    queries: baseSellers
      .filter((seller) => seller.ownerId)
      .map((seller) => ({
        queryKey: ['reformerProfileView', seller.ownerId],
        queryFn: async () => {
          const res = await getProfile(seller.ownerId!);
          if (res.resultType !== 'SUCCESS' || !res.success) {
            return null;
          }
          return { ownerId: seller.ownerId, nickname: res.success.nickname };
        },
        enabled: !!seller.ownerId,
      })),
  });

  const sellers: CartSeller[] = useMemo(() => {
    const profileMap = new Map<string, string>();
    profileQueries.forEach((query) => {
      if (query.data?.ownerId && query.data.nickname) {
        profileMap.set(query.data.ownerId, query.data.nickname);
      }
    });

    return baseSellers.map((seller) => {
      const nickname = seller.ownerId ? profileMap.get(seller.ownerId) : null;
      return nickname ? { ...seller, name: nickname } : seller;
    });
  }, [baseSellers, profileQueries]);

  return sellers;
};
