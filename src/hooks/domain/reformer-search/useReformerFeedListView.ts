import { useInfiniteQuery } from '@tanstack/react-query';
import { getReformerFeed } from '@/api/reformer';
import { useInfiniteScrollObserver } from '../../useInfiniteScrollObserver';

export function useReformerFeedListView() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['reformer-feed'],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getReformerFeed(pageParam ? { cursor: pageParam } : undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  const observerTargetRef = useInfiniteScrollObserver({
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    onLoadMore: fetchNextPage,
    threshold: 0.1,
  });

  return {
    feeds,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    observerTargetRef,
  };
}

