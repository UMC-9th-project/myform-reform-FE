import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReformProposalList } from '../../../api/order/reformProposal';
import type {
  ReformProposalListItem,
  ReformProposalSortBy,
} from '../../../types/api/order/reformProposal';

const ITEMS_PER_PAGE = 15;

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

function mapSortValueToApiSort(sortValue: string): ReformProposalSortBy {
  if (sortValue === 'popular') return 'POPULAR';
  if (sortValue === 'latest') return 'RECENT';
  return 'POPULAR';
}

export const useReformerOrderProposalList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);
  const [sortValue, setSortValue] = useState<string>('popular');

  const category = selectedCategory?.categoryTitle;
  const subcategory =
    selectedCategory?.itemLabel && selectedCategory.itemLabel !== '전체'
      ? selectedCategory.itemLabel
      : undefined;
  const apiSortBy = mapSortValueToApiSort(sortValue);

  const { data: reformProposalListResponse, isLoading, isError } = useQuery({
    queryKey: [
      'reform-proposal-list',
      'reformer',
      currentPage,
      category,
      subcategory,
      apiSortBy,
    ],
    queryFn: async () => {
      const params = {
        sortBy: apiSortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category,
        subcategory,
      };
      console.log('[제안 목록 API] 요청 params:', params);
      const data = await getReformProposalList(params);

      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '제안서 목록 조회 실패');
      }

      return data;
    },
    staleTime: 1000 * 30,
  });

  const proposals: ReformProposalListItem[] =
    reformProposalListResponse?.success ?? [];
  const hasNextPage = proposals.length >= ITEMS_PER_PAGE;
  const totalPages = currentPage + (hasNextPage ? 1 : 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (
    _categoryIndex: number,
    _itemId: number,
    categoryTitle: string,
    itemLabel: string
  ) => {
    setSelectedCategory({ categoryTitle, itemLabel });
    setCurrentPage(1);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
  };

  return {
    proposals,
    isLoading,
    isError,
    currentPage,
    selectedCategory,
    sortValue,
    totalPages,
    handlePageChange,
    handleCategoryChange,
    handleClearSelection,
    handleSortChange,
  };
};
