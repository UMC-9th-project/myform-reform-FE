import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWish, deleteWish } from '../../../api/wishlist';
import type { WishType } from '../../../types/api/wishlist/wish';

export const useWish = () => {
  const queryClient = useQueryClient();

  const createWishMutation = useMutation({
    mutationFn: createWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const deleteWishMutation = useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const toggleWish = async (
    type: WishType,
    itemId: string,
    isLiked: boolean
  ) => {
    if (isLiked) {
      // 하트가 채워진 상태 = 찜 추가
      await createWishMutation.mutateAsync({ type, itemId });
    } else {
      // 하트가 비어있는 상태 = 찜 삭제
      await deleteWishMutation.mutateAsync({ type, itemId });
    }
  };

  return {
    toggleWish,
    isCreating: createWishMutation.isPending,
    isDeleting: deleteWishMutation.isPending,
  };
};
