import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReformerFeed, getReformerList } from '@/api/reformer';
import type { ReformerFeedItem } from '@/types/api/reformer';

export function useReformerSearchHome() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  // 전체 리폼러 한눈에 보기: list 프리뷰 (3개)
  const { data: reformerListData, isLoading: isReformerListLoading } = useQuery({
    queryKey: ['reformer-list-preview'],
    queryFn: () => getReformerList({ sort: 'rating' }),
  });

  const reformerPreviewItems = useMemo(() => {
    if (isReformerListLoading) return [];
    return (reformerListData?.reformers ?? []).slice(0, 3);
  }, [isReformerListLoading, reformerListData?.reformers]);

  // 내 리폼 취향 탐색해보기: 피드 썸네일 프리뷰 (4개)
  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ['reformer-feed-preview'],
    queryFn: () => getReformerFeed(),
  });

  const preferenceFeeds: ReformerFeedItem[] = useMemo(() => {
    if (isFeedLoading) {
      return Array.from({ length: 4 }, (_, i) => ({
        feed_id: `loading-${i + 1}`,
        photo_url: '',
        is_multi_photo: false,
      }));
    }
    return (feedData?.feeds ?? []).slice(0, 4);
  }, [feedData?.feeds, isFeedLoading]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/reformer-search/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
  };

  return {
    searchInput,
    isTyping: !!searchInput.trim(),
    handleSearch,
    handleInputChange,
    reformerPreviewItems,
    isReformerListLoading,
    preferenceFeeds,
    isFeedLoading,
    navigate,
  };
}

