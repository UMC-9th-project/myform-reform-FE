import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReformRequestList } from '../../../api/order/reformRequest';
import type { ReformRequestListItem } from '../../../types/api/order/reformRequest';

const ITEMS_PER_PAGE = 15;

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

export const useReformerOrderRequestList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);

  const category =
    selectedCategory &&
    selectedCategory.categoryTitle === '기타' &&
    selectedCategory.itemLabel === '전체'
      ? undefined
      : selectedCategory?.categoryTitle;
  const subcategory =
    selectedCategory &&
    selectedCategory.categoryTitle === '기타' &&
    selectedCategory.itemLabel === '전체'
      ? undefined
      : selectedCategory?.itemLabel;

  const { data: reformRequestListResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-request-list', 'reformer', currentPage, category, subcategory],
    queryFn: async () => {
      const data = await getReformRequestList({
        sortBy: 'RECENT',
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category,
        subcategory,
      });

      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '요청서 목록 조회 실패');
      }

      return data;
    },
    staleTime: 1000 * 30,
  });

  const requests: ReformRequestListItem[] =
    reformRequestListResponse?.success ?? [];
  const hasNextPage = requests.length >= ITEMS_PER_PAGE;
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

  return {
    requests,
    isLoading,
    isError,
    currentPage,
    selectedCategory,
    totalPages,
    handlePageChange,
    handleCategoryChange,
  };
};
