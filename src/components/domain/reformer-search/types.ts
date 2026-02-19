import type { ReformerFeedItem, ReformerSearchItem } from '@/types/api/reformer';

export type ReformerSearchEngineProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onInputChange?: (query: string) => void;
  className?: string;
  defaultValue?: string;
  showBlur?: boolean;
};

export type ReformerListProps = {
  onMoreClick?: () => void;
  items: ReformerSearchItem[];
};

export type ReformFeedProps = {
  onMoreClick?: () => void;
  feeds: ReformerFeedItem[];
  onCardClick?: (feedId: string) => void;
};

export type ReformFeedCardProps = {
  feed: ReformerFeedItem;
  onClick?: () => void;
};

export type ReformerProfileCardProps = {
  reformer: ReformerSearchItem;
  onClick?: () => void;
};

export type ReformerSearchResultCardProps = {
  reformer: ReformerSearchItem;
  onClick?: () => void;
  isLast?: boolean;
};

export type ReformerSearchResultSkeletonProps = Record<string, never>;


