import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWish, deleteWish } from '../../../api/wishlist';
import type { WishType } from '../../../types/api/wishlist/wish';

export const useWish = () => {
  const queryClient = useQueryClient();

  const createWishMutation = useMutation({
    mutationFn: createWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['marketList'] });
      queryClient.invalidateQueries({ queryKey: ['requestList'] });
      queryClient.invalidateQueries({ queryKey: ['proposalList'] });
    },
  });

  const deleteWishMutation = useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['marketList'] });
      queryClient.invalidateQueries({ queryKey: ['requestList'] });
      queryClient.invalidateQueries({ queryKey: ['proposalList'] });
    },
  });

  const toggleWish = async (
    type: WishType,
    itemId: string,
    isLiked: boolean
  ) => {
    if (isLiked) {
      await createWishMutation.mutateAsync({ type, itemId });
    } else {
      await deleteWishMutation.mutateAsync({ type, itemId });
    }
  };

  return {
    toggleWish,
    isCreating: createWishMutation.isPending,
    isDeleting: deleteWishMutation.isPending,
  };
};
