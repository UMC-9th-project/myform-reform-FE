import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedList } from '../../../api/profile/feed';
import type { FeedListResponse } from '../../../types/domain/profile/feed';

export const useFeedList = (ownerId: string) => {
  return useInfiniteQuery<FeedListResponse>({
    queryKey: ['feeds', ownerId],
    queryFn: ({ pageParam }) =>
      getFeedList({ ownerId, cursor: pageParam as string | undefined }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      if (
        lastPage.resultType !== 'SUCCESS' ||
        !lastPage.success ||
        !lastPage.success.hasNext
      ) {
        return undefined;
      }

      return lastPage.success.nextCursor;
    },
  });
};
