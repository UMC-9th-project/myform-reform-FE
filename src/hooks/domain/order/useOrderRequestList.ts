import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReformRequestList } from '../../../api/order/reformRequest';
import type { ReformRequestListItem } from '../../../types/api/order/reformRequest';

const ITEMS_PER_PAGE = 15;

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

export const useOrderRequestList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);

  // 기타 > 전체: 카테고리 안 넣으면 API에서 전체 반환
  const isOtherAll =
    selectedCategory?.categoryTitle === '기타' &&
    selectedCategory?.itemLabel === '전체';
  const category = isOtherAll ? undefined : selectedCategory?.categoryTitle;
  const subcategory = isOtherAll
    ? undefined
    : selectedCategory?.itemLabel && selectedCategory.itemLabel !== '전체'
      ? selectedCategory.itemLabel
      : undefined;

  const { data: reformRequestListResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-request-list', 'order', currentPage, category, subcategory],
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

  const handleClearSelection = () => {
    setSelectedCategory(null);
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
    handleClearSelection,
  };
};
