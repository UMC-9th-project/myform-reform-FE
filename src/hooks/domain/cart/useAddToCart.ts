import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../../../api/cart/cart';
import type { AddToCartRequest } from '../../../types/api/cart/addCart';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: AddToCartRequest }) =>
      addToCart(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    error: addToCartMutation.error,
  };
};
