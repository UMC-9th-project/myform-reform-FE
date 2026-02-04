import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { createFeed } from '../../../api/profile/feed';
import type { FeedListResponse } from '../../../types/domain/profile/feed';
//import type { CreateFeedRequest } from '../../../types/domain/profile/feed';

export const useCreateFeed = (ownerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeed,

    onSuccess: (res, variables) => {
      if (!res.success) return;

      queryClient.setQueryData<InfiniteData<FeedListResponse>>(['feeds', ownerId], (old) => {
        if (!old) return old;

        if (
            old.pages[0].resultType !== 'SUCCESS' ||
            !old.pages[0].success
        ) {
            return old;
        }

        const newFeed = {
            feedId: res.success.feedId,
            images: variables.imageUrls,
            isPinned: variables.isPinned ?? false,
        };

        return {
            ...old,
            pages: [
            {
                ...old.pages[0],
                success: {
                ...old.pages[0].success,
                feeds: [
                    newFeed,
                    ...old.pages[0].success.feeds,
                ],
                },
            },
            ...old.pages.slice(1),
            ],
        };
        });
    },
  });
};


