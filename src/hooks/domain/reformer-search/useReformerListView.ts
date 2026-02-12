import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getReformerList } from '@/api/reformer';
import { useInfiniteScrollObserver } from '../../useInfiniteScrollObserver';

type SortByUi = 'alphabetical' | 'rating' | 'transaction';
type ApiSort = 'name' | 'rating' | 'trades';

function mapUiSortToApiSort(sortBy: SortByUi): ApiSort {
  if (sortBy === 'alphabetical') return 'name';
  if (sortBy === 'rating') return 'rating';
  return 'trades';
}

export function useReformerListView() {
  const [sortBy, setSortBy] = useState<SortByUi>('alphabetical');
  const apiSort = useMemo(() => mapUiSortToApiSort(sortBy), [sortBy]);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['reformer-list', apiSort],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getReformerList(pageParam ? { sort: apiSort, cursor: pageParam } : { sort: apiSort }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });

  const reformers = data?.pages.flatMap((p) => p.reformers) ?? [];
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  const observerTargetRef = useInfiniteScrollObserver({
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    onLoadMore: fetchNextPage,
    threshold: 0.1,
  });

  return {
    sortBy,
    setSortBy,
    apiSort,
    reformers,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    observerTargetRef,
  };
}

