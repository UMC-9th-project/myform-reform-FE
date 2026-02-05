import { useEffect, useRef } from 'react';

type UseInfiniteScrollObserverParams = {
  enabled?: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
};

/**
 * IntersectionObserver 기반 무한스크롤 트리거 훅.
 */
export function useInfiniteScrollObserver({
  enabled = true,
  hasMore,
  isLoadingMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin,
}: UseInfiniteScrollObserverParams) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const target = targetRef.current;
    if (!target) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (isLoadingMore) return;
        if (!hasMore) return;
        onLoadMore();
      },
      { threshold, rootMargin }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [enabled, hasMore, isLoadingMore, onLoadMore, rootMargin, threshold]);

  return targetRef;
}

