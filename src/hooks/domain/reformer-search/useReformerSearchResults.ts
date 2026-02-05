import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getReformerSearch } from '@/api/reformer.ts';
import { useInfiniteScrollObserver } from '../../useInfiniteScrollObserver';

export function useReformerSearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchInput(''); // 검색 실행 시 입력값 초기화
      navigate(`/reformer-search/results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    // 검색어를 모두 지웠을 때 메인 검색 페이지로 이동
    if (!value.trim() && query) {
      navigate('/reformer-search');
    }
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['reformer-search', query],
    enabled: !!query && !searchInput.trim(),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getReformerSearch({
        keyword: query,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });

  const reformers = data?.pages.flatMap((p) => p.reformers) ?? [];

  const observerTargetRef = useInfiniteScrollObserver({
    enabled: !!query && !searchInput.trim(),
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    onLoadMore: fetchNextPage,
    threshold: 0.1,
  });

  return {
    query,
    searchInput,
    isTyping: !!searchInput.trim(),
    handleSearch,
    handleInputChange,
    reformers,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    observerTargetRef,
  };
}

