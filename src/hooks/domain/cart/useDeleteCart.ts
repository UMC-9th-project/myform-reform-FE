import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCartItems } from '../../../api/cart/cart';
import type { DeleteCartRequest } from '../../../types/api/cart/deleteCart';

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  const deleteCartMutation = useMutation({
    mutationFn: (data: DeleteCartRequest) => deleteCartItems(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    deleteCartItems: deleteCartMutation.mutateAsync,
    isDeleting: deleteCartMutation.isPending,
    error: deleteCartMutation.error,
  };
};
